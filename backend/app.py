from flask import Flask, redirect, request, session, url_for, jsonify
import os
import tempfile
import whisper
import torch
from transformers import pipeline
from dotenv import load_dotenv
import requests
import json

from firebase_admin import firestore
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from flask_cors import CORS

from calendar_test import format_events_for_prompt
from wellness_score import generate_wellness_from_data
from analysis import analyze_sentiment_with_distilbert, analyze_with_gpt4, analyze_with_mistral

from calendar_clients.google_calendar import *
from calendar_clients.microsoft_calendar import *
from chatbot import *

load_dotenv(dotenv_path=r"NeuroBridge\backend\credentials\.env")

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-default-secret")
app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",  # Helps cookies be accepted during OAuth redirects
    SESSION_COOKIE_SECURE=False     # Only set True if you're using HTTPS
)

device = 0 if torch.cuda.is_available() else -1
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    device=device
)

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
CLIENT_SECRETS_FILE = r"NeuroBridge\backend\credentials\client_secret.json"


@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({"error": "Missing audio file"}), 400

    audio_file = request.files['audio']
    print("Loading Whisper model...")
    stt_model = whisper.load_model("base")
    print("Model loaded.")

    tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    try:
        audio_file.save(tmp.name)
        transcription_result = stt_model.transcribe(tmp.name)
        transcription = transcription_result["text"]
    finally:
        tmp.close()
        os.remove(tmp.name)  # Clean up the temp file

    sentiment = analyze_sentiment_with_distilbert(transcription)

    if sentiment == "NEGATIVE":
        ai_response = analyze_with_gpt4(transcription)
    else:
        ai_response = analyze_with_mistral(transcription)

    return jsonify({
        "transcription": transcription,
        "sentiment": sentiment,
        "ai_response": ai_response
    })

# Optional: Revoke token if you want to invalidate it completely
def revoke_token(token):
    requests.post(
        "https://oauth2.googleapis.com/revoke",
        params={"token": token},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )

@app.route("/calendar")
def google_calendar():
    events = get_google_calendar_events()
    if events is None:
        return redirect(url_for("authorize"))
    if not events:
        return "No upcoming Google Calendar events found."
    return "<br>".join([event["summary"] for event in events if "summary" in event])

@app.route("/authorize")
def authorize():
    return redirect(get_google_auth_url())

@app.route("/oauth2callback")
def google_oauth2callback():
    if "error" in request.args:
        return f"Error: {request.args.get('error_description')}", 400

    credentials = get_google_token(request.url)
    if credentials:
        return redirect(url_for("google_calendar"))
    else:
        return "Failed to get Google token.", 400

@app.route("/login_microsoft")
def login_microsoft():
    return redirect(get_microsoft_auth_url())

@app.route("/microsoft_callback")
def microsoft_callback():
    code = request.args.get("code")
    if not code:
        return "No authorization code found.", 400
    result = get_microsoft_token(code)
    if "access_token" in result:
        return redirect(url_for("microsoft_calendar"))
    else:
        return "Could not acquire Microsoft token: " + str(result.get("error_description"))

@app.route("/microsoft_calendar")
def microsoft_calendar():
    events = get_microsoft_calendar_events()
    if events is None:
        return redirect(url_for("login_microsoft"))
    if not events:
        return "No upcoming Microsoft calendar events found."
    return "<br>".join([event.get("subject", "[No Subject]") for event in events])


db = firestore.client()

MAX_HISTORY_MESSAGES = 10  # Limit context length

def get_conversation_history(user_id):
    doc_ref = db.collection("conversations").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        history = doc.to_dict().get("messages", [])
        # Limit to last N messages
        return history[-MAX_HISTORY_MESSAGES:]
    else:
        return []

def save_conversation_history(user_id, messages):
    doc_ref = db.collection("conversations").document(user_id)
    doc_ref.set({"messages": messages})

def get_user_context(user_id):
    journals = [doc.to_dict() for doc in db.collection("journals").where("user_id", "==", user_id).stream()]
    calendars = [doc.to_dict() for doc in db.collection("calendar").where("user_id", "==", user_id).stream()]
    return {
        "journals": journals,
        "calendar": calendars
    }

def chat_with_mistral(messages, context_data=None):
    system_prompt = (
        "You are a compassionate cognitive wellness assistant. "
        "Help the user reflect, manage stress, and suggest improvements to wellbeing. "
        "Be thoughtful and kind."
    )

    # Prepare conversation in Mistral prompt format:
    # We build a dialogue string including system prompt + previous messages
    conversation_text = system_prompt + "\n\n"
    if context_data:
        context_str = json.dumps(context_data, indent=2)
        conversation_text += f"Context:\n{context_str}\n\n"

    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "user":
            conversation_text += f"User: {content}\n"
        else:  # assistant
            conversation_text += f"Assistant: {content}\n"

    conversation_text += "Assistant:"

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": conversation_text,
            "stream": False
        }
    )

    return response.json().get("response", "").strip()

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_id = data.get("user_id")
    user_message = data.get("message")

    if not user_id or not user_message:
        return jsonify({"error": "Missing user_id or message"}), 400

    # Load existing messages from Firestore
    user_ref = db.collection("chats").document(user_id)
    doc = user_ref.get()
    if doc.exists:
        chat_history = doc.to_dict().get("messages", [])
    else:
        chat_history = []

    # Append user message
    chat_history.append({"role": "user", "content": user_message})

    # Generate chatbot reply (replace with your actual model call)
    bot_reply = generate_chatbot_response(chat_history)  # your function to generate reply

    # Append bot reply
    chat_history.append({"role": "assistant", "content": bot_reply})

    # Save updated chat history back to Firestore
    user_ref.set({"messages": chat_history})

    return jsonify({"response": bot_reply})

@app.route('/api/wellness-score', methods=['GET'])
def wellness_score():
    result = generate_wellness_from_data()
    score = result["score"]
    suggestion = result["suggestion"]

    return jsonify({
        "score": score,
        "suggestion": suggestion
    })


if __name__ == '__main__':
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    app.run(debug=True, port=5000)