import firebase_admin
from firebase_admin import credentials, firestore
import requests
import json

cred = credentials.Certificate(r"credentials/neurobridge.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_user_data(user_id):
    journal_ref = db.collection('journals').document(user_id)
    calendar_ref = db.collection('calendar').document(user_id)

    journal_doc = journal_ref.get()
    calendar_doc = calendar_ref.get()

    journal_data = journal_doc.to_dict() if journal_doc.exists else {}
    calendar_data = calendar_doc.to_dict() if calendar_doc.exists else {}

    return journal_data, calendar_data

def get_all_data():
    # Fetch all documents from 'journals' collection
    journal_docs = db.collection('journals').stream()
    journals = [doc.to_dict() for doc in journal_docs]

    # Fetch all documents from 'calendar' collection
    calendar_docs = db.collection('calendar').stream()
    calendars = [doc.to_dict() for doc in calendar_docs]

    return journals, calendars


def generate_wellness_from_data():
    journal_data, calendar_data = get_all_data()

    prompt = f"""
You are a cognitive wellness assistant. Given the user's journal and calendar data, generate a wellness score out of 100 and a short suggestion.

Journal Entries:
{json.dumps(journal_data, indent=2)}

Calendar Overview:
{json.dumps(calendar_data, indent=2)}

Respond in this format:
Score: <number>
Suggestion: <your suggestion>
    """

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": prompt,
            "stream": False
        }
    )

    output = response.json()["response"]
    lines = output.strip().splitlines()

    score_line = next((line for line in lines if line.startswith("Score:")), None)
    suggestion_line = next((line for line in lines if line.startswith("Suggestion:")), None)

    try:
        score = float(score_line.split(":", 1)[1].strip()) if score_line else None
        suggestion = suggestion_line.split(":", 1)[1].strip() if suggestion_line else output
    except Exception:
        score = None
        suggestion = output.strip()

    return {
        "score": score,
        "suggestion": suggestion
    }
