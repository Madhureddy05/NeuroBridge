import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

def save_events_to_json(events):
    today_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"calendar_events_{today_str}.json"
    with open(filename, "w") as f:
        json.dump(events, f, indent=2)
    print(f"Saved calendar events to {filename}")

def upload_events_to_firestore(events):
    if not firebase_admin._apps:
        cred = credentials.Certificate(r"NeuroBridge\backend\credentials\neurobridge.json")
        firebase_admin.initialize_app(cred)

    db = firestore.client()
    today = datetime.now().strftime("%Y-%m-%d")

    # Optional: Clear and replace all events
    doc_ref = db.collection("calendar_data").document(today)
    doc_ref.set({"events": events})

    print(f"Uploaded {len(events)} calendar events for {today} to Firestore")
