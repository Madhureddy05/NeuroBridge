from flask import Flask, request, jsonify
import whisper
import os
from dotenv import load_dotenv
import torch
from transformers import pipeline
import tempfile
import requests
from openai import OpenAI
from flask import Flask, redirect, request, session, url_for
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
import os
import datetime
import requests
from calendar_test import format_events_for_prompt
from db_storage import save_events_to_json, upload_events_to_firestore

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-default-secret")
app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",  # Helps cookies be accepted during OAuth redirects
    SESSION_COOKIE_SECURE=False     # Only set True if you're using HTTPS
)

print("Loading Whisper model...")
stt_model = whisper.load_model("base")
print("Model loaded.")

device = 0 if torch.cuda.is_available() else -1
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    device=device
)

def analyze_sentiment_with_distilbert(text):
    result = sentiment_pipeline(text)
    return result[0]['label'].upper()

def analyze_with_mistral(text):
    prompt = f"""
You are a cognitive wellness assistant. The user has shared the following message. Your goal is to respond with empathy and offer 2–3 personalized suggestions to improve their cognitive wellness.

Consider aspects like stress, overwhelm, work-life balance, sleep, focus, or emotional fatigue. Use a calm and supportive tone.

User message: "{text}"

Your response should include:
- A brief empathetic reflection.
- 2–3 practical and gentle suggestions for improving cognitive wellness.

Response:
"""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        }
    )
    result = response.json()
    return result["response"].strip().split("Response:")[-1].strip()

def analyze_with_gpt4(text):
    prompt = f"""
You are a compassionate AI wellness coach. The user has shared a message about how they're feeling.

Your job is to:
- Respond empathetically in the first 1–2 sentences.
- Offer 2–3 practical tips to improve cognitive wellness based on what they’re expressing.
- Keep the tone kind, supportive, and grounded.

User Message:
\"\"\"{text}\"\"\"

Your response:
"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a compassionate and practical wellness coach."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({"error": "Missing audio file"}), 400

    audio_file = request.files['audio']

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


SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
CLIENT_SECRETS_FILE = r"NeuroBridge\backend\credentials\client_secret.json"

# Optional: Revoke token if you want to invalidate it completely
def revoke_token(token):
    requests.post(
        "https://oauth2.googleapis.com/revoke",
        params={"token": token},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )

@app.route("/calendar")
def index():
    if "credentials" not in session:
        return redirect("authorize")

    credentials = Credentials(**session["credentials"])
    service = build("calendar", "v3", credentials=credentials)

    events_result = service.events().list(
        calendarId="primary", maxResults=5, singleEvents=True, orderBy="startTime"
    ).execute()
    events = events_result.get("items", [])

    save_events_to_json(events)
    upload_events_to_firestore(events)
    
    if not events:
        return "No upcoming events found."
    return get_todays_events(credentials)

@app.route("/authorize")
def authorize():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES
    )
    flow.redirect_uri = url_for("oauth2callback", _external=True)

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",  # ← forces refresh_token
        include_granted_scopes="true"
    )

    session["state"] = state
    return redirect(authorization_url)



@app.route("/oauth2callback")
def oauth2callback():
    print("Stored session state:", session.get("state"))
    print("Returned state:", request.args.get("state"))

    state = session["state"]
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        state=state
    )
    flow.redirect_uri = url_for("oauth2callback", _external=True)
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials

    # Store all required credential fields
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }

    print("Stored session credentials:")
    for k, v in session["credentials"].items():
        print(f"{k}: {v}")

    return redirect(url_for("index"))

def get_todays_events(credentials):
    service = build("calendar", "v3", credentials=credentials)

    now = datetime.datetime.utcnow().isoformat() + 'Z'
    end_of_day = datetime.datetime.utcnow().replace(
        hour=23, minute=59, second=59).isoformat() + 'Z'

    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        timeMax=end_of_day,
        singleEvents=True,
        orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])

    ai_response = format_events_for_prompt(events)
    return ai_response

if __name__ == '__main__':
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    app.run(debug=True, port=5000)