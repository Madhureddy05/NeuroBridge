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

def generate_chatbot_response(chat_history):
    # Dummy example, replace with your Mistral or GPT call
    last_user_message = chat_history[-1]["content"]
    return f"Echo: {last_user_message}"