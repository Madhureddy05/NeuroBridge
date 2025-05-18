import json
import os
import re

MEMORY_FILE = "memory/memory.json"

# Ensure memory file exists
os.makedirs("memory", exist_ok=True)
if not os.path.exists(MEMORY_FILE):
    with open(MEMORY_FILE, "w") as f:
        json.dump({}, f)

def load_memories():
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)

def save_memories(memories):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memories, f, indent=2)

def extract_facts(text):
    memories = load_memories()
    # Very simple pattern-based extraction (can be upgraded)
    patterns = {
        "name": r"my name is ([A-Za-z]+)",
        "daughter": r"my daughter'?s name is ([A-Za-z]+)",
        "son": r"my son'?s name is ([A-Za-z]+)",
        "pet": r"my (dog|cat|pet)'?s name is ([A-Za-z]+)",
        "favorite_color": r"my favorite color is ([A-Za-z]+)",
        "age": r"I am (\d+) years old",
        "health_condition": r"I have (arthritis|diabetes|hypertension|asthma)",
        "medication": r"I('m| am) taking ([A-Za-z]+)",
        "doctor": r"my doctor'?s name is ([A-Za-z ]+)",
        "appointment": r"(have|got) (a|an) appointment on ([A-Za-z]+ \d+)",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if key == "pet":
                pet_type = match.group(1)
                pet_name = match.group(2)
                memories[f"{pet_type}_name"] = pet_name.capitalize()
            elif key == "medication":
                medication = match.group(2)
                if "medications" not in memories:
                    memories["medications"] = []
                if medication.capitalize() not in memories["medications"]:
                    memories["medications"].append(medication.capitalize())
            elif key == "health_condition":
                condition = match.group(1)
                if "health_conditions" not in memories:
                    memories["health_conditions"] = []
                if condition.lower() not in memories["health_conditions"]:
                    memories["health_conditions"].append(condition.lower())
            elif key == "appointment":
                date = match.group(3)
                memories["appointment_date"] = date
            else:
                value = match.group(1)
                memories[key] = value.capitalize()

    save_memories(memories)
    return memories

def inject_memories(prompt):
    memories = load_memories()
    memory_lines = []
    
    for k, v in memories.items():
        if isinstance(v, list):
            formatted_value = ", ".join(v)
            memory_lines.append(f"{k.replace('_', ' ').capitalize()}: {formatted_value}")
        else:
            memory_lines.append(f"{k.replace('_', ' ').capitalize()}: {v}")
            
    memory_context = "\n".join(memory_lines)

    return f"Here is what you remember about the user:\n{memory_context}\n\nUser said: {prompt}"

# API handler functions for frontend integration
def handle_get_memories():
    return load_memories()

def handle_extract_facts_api(text):
    return extract_facts(text)

def handle_analyze_text(text):
    # Simple sentiment analysis and emergency detection
    # In a real application, this would use more sophisticated NLP
    negative_words = ["sad", "depressed", "anxious", "worried", "pain", "hurt", 
                      "bad", "terrible", "awful", "miserable", "unhappy"]
    positive_words = ["happy", "good", "great", "wonderful", "joy", "excited", 
                      "pleased", "delighted", "content", "calm", "relaxed"]
    confusion_words = ["confused", "can't remember", "forgot", "don't know", 
                       "unsure", "uncertain", "disoriented", "lost"]
    emergency_words = ["emergency", "help", "fallen", "can't breathe", "chest pain", 
                       "severe", "dizzy", "faint", "ambulance"]
    
    text_lower = text.lower()
    
    # Count word instances
    negative_count = sum(1 for word in negative_words if word in text_lower)
    positive_count = sum(1 for word in positive_words if word in text_lower)
    confusion_detected = any(phrase in text_lower for phrase in confusion_words)
    emergency_detected = any(phrase in text_lower for phrase in emergency_words)
    
    sentiment = "neutral"
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    
    return {
        "sentiment": sentiment,
        "confusion_detected": confusion_detected,
        "emergency_detected": emergency_detected
    }