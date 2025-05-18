import json
import os
from datetime import datetime

LOG_FILE = "output/event_log.json"
os.makedirs("output", exist_ok=True)

# Ensure log file exists
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, "w") as f:
        json.dump([], f)

def log_event(sentiment, confusion, emergency):
    timestamp = datetime.now().isoformat()
    entry = {
        "timestamp": timestamp,
        "sentiment": sentiment,
        "confusion": confusion,
        "emergency": emergency
    }

    with open(LOG_FILE, "r") as f:
        data = json.load(f)

    data.append(entry)

    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_logs():
    with open(LOG_FILE, "r") as f:
        return json.load(f)
