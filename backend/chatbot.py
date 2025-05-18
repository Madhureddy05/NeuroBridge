from flask import Flask, request, jsonify
import requests
import json
from firebase_admin import firestore

db = firestore.client()

MAX_HISTORY_MESSAGES = 10 

def get_conversation_history(user_id):
    doc_ref = db.collection("conversations").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        history = doc.to_dict().get("messages", [])
        # Limit to last N messages
        return history[-MAX_HISTORY_MESSAGES:]
    else:
        return []

def save_conversation_history(messages):
    doc_ref = db.collection("conversations").document()
    doc_ref.set({"messages": messages})

def get_user_context(user_id):
    journals = [doc.to_dict() for doc in db.collection("journals").where("user_id", "==", user_id).stream()]
    calendars = [doc.to_dict() for doc in db.collection("calendar").where("user_id", "==", user_id).stream()]
    return {
        "journals": journals,
        "calendar": calendars
    }

def chat_with_mistral(messages, context_data=None, max_words=50):
    system_prompt = (
        "You are a compassionate cognitive wellness assistant. "
        "Keep your responses brief (under 50 words). "
        "Help the user reflect and improve wellbeing."
    )

    conversation_text = system_prompt + "\n\n"
    if context_data:
        context_str = json.dumps(context_data, indent=2)
        conversation_text += f"Context:\n{context_str}\n\n"

    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        conversation_text += f"{'User' if role == 'user' else 'Assistant'}: {content}\n"

    conversation_text += "Assistant:"

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": conversation_text,
                "stream": False,
                "options": {
                    "num_predict": 40  # lower = shorter
                }
            }
        )
        full_text = response.json().get("response", "").strip()
        return " ".join(full_text.split()[:max_words])
    except requests.RequestException as e:
        print("LLM Error:", e)
        return "Sorry, I'm unable to respond right now."
