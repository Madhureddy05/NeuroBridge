import pyttsx3
import os
import logging

logger = logging.getLogger(__name__)

def synthesize_speech(text, output_path):
    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 160)  # Speaking speed
        engine.setProperty('volume', 1.0)  # Volume (0.0 to 1.0)
        
        # Get available voices
        voices = engine.getProperty('voices')
        
        # Try to set a more natural voice if available
        for voice in voices:
            if "female" in voice.name.lower():
                engine.setProperty('voice', voice.id)
                break
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save to file
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        
        return True
    except Exception as e:
        logger.error(f"Error in speech synthesis: {str(e)}")
        return False
