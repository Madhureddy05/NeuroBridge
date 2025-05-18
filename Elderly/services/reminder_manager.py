from datetime import datetime

reminders = []

def add_reminder(text, time_str):
    reminders.append({
        "text": text,
        "time": time_str,
        "spoken_today": False
    })

def get_due_reminders():
    now = datetime.now().strftime("%H:%M")
    due = []
    for r in reminders:
        if r["time"] == now and not r["spoken_today"]:
            due.append(r["text"])
            r["spoken_today"] = True
    return due

def reset_daily_flags():
    for r in reminders:
        r["spoken_today"] = False
