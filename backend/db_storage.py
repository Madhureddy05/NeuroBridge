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
    doc_ref = db.collection("calendar_data").document(today)
    doc_ref.set({"events": events})

    print(f"Uploaded calendar data for {today} to Firestore")

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
