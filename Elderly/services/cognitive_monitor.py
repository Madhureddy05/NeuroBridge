from textblob import TextBlob

CONFUSION_KEYWORDS = [
    "where am i", "what time", "who are you", "what day",
    "what's going on", "i forgot", "don't remember", "am i supposed"
]

EMERGENCY_KEYWORDS = [
    "help me", "emergency", "call someone", "i fell", "i need help", "i'm hurt"
]

def analyze_text(user_text):
    text_lower = user_text.lower()

    confusion_flags = [kw for kw in CONFUSION_KEYWORDS if kw in text_lower]
    emergency_flags = [kw for kw in EMERGENCY_KEYWORDS if kw in text_lower]

    blob = TextBlob(user_text)
    polarity = blob.sentiment.polarity
    sentiment = "neutral"
    if polarity > 0.2:
        sentiment = "positive"
    elif polarity < -0.2:
        sentiment = "negative"

    return {
        "confusion_detected": len(confusion_flags) > 0,
        "confusion_phrases": confusion_flags,
        "emergency_detected": len(emergency_flags) > 0,
        "emergency_phrases": emergency_flags,
        "sentiment": sentiment,
        "polarity": polarity
    }
