from transformers import pipeline
from openai import OpenAI
import torch
import requests
import os

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
