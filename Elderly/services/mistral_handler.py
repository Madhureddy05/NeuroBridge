import requests
import logging

logger = logging.getLogger(__name__)

ELDERLY_PROMPT = """You are a kind and thoughtful companion for an elderly person.
They just said: "{input}"
Respond in a warm, gentle, and friendly way. Keep it short and caring."""

def get_ai_response(user_text):
    try:
        prompt = ELDERLY_PROMPT.format(input=user_text)

        response = requests.post(
            "http://localhost:11434/api/generate",  # Ollama default port
            json={
                "model": "mistral",  # name of your pulled model
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        if response.status_code == 200:
            return response.json()["response"].strip()
        else:
            logger.error(f"Error from Mistral API: {response.status_code} - {response.text}")
            return "I'm here for you, but something went wrong getting my thoughts."
    except requests.exceptions.ConnectionError:
        logger.error("Could not connect to Ollama server. Make sure it's running.")
        return "I'm here for you, but I'm having trouble connecting to my thinking system."
    except Exception as e:
        logger.error(f"Error getting AI response: {str(e)}")
        return "I'm here for you, but something went wrong getting my thoughts."
