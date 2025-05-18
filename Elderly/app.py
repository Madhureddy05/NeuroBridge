from flask import Flask, request, jsonify, send_file
import os
import tempfile
import json
import logging
from werkzeug.utils import secure_filename
from datetime import datetime

# Import our services
from services.stt_service import STTService
from services.tts_service import synthesize_speech
from services.cognitive_monitor import analyze_text
from services.mistral_handler import get_ai_response

app = Flask(__name__, static_folder='./dist', static_url_path='/')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
MODEL_PATH = os.environ.get('VOSK_MODEL_PATH', 'models/vosk-model-small-en-us-0.15')
stt_service = STTService(MODEL_PATH)

# Create directories for storing audio and data
os.makedirs('temp', exist_ok=True)
os.makedirs('data', exist_ok=True)

# Store conversation history and mood records
conversation_history = []
mood_records = []

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/process-audio', methods=['POST'])
def process_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save the audio file temporarily
        temp_audio_path = os.path.join('temp', f"recording_{datetime.now().strftime('%Y%m%d%H%M%S')}.wav")
        audio_file.save(temp_audio_path)
        
        # Transcribe the audio
        transcription = stt_service.transcribe(temp_audio_path)
        
        # Analyze the text
        analysis_result = analyze_text(transcription)
        
        # Clean up the temporary file
        os.remove(temp_audio_path)
        
        return jsonify({
            'transcription': transcription,
            'analysis': analysis_result
        })
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text_endpoint():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        analysis_result = analyze_text(text)
        
        return jsonify(analysis_result)
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        analysis = data.get('analysis', {})
        
        # Add to conversation history
        conversation_history.append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.now().isoformat(),
            'analysis': analysis
        })
        
        # Get AI response
        ai_response = get_ai_response(user_message)
        
        # Add AI response to history
        conversation_history.append({
            'role': 'assistant',
            'content': ai_response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Save conversation history periodically
        if len(conversation_history) % 10 == 0:
            with open('data/conversation_history.json', 'w') as f:
                json.dump(conversation_history, f, indent=2)
        
        return jsonify({
            'response': ai_response
        })
        
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tts', methods=['GET'])
def text_to_speech():
    try:
        text = request.args.get('text')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Generate a unique filename
        filename = f"speech_{datetime.now().strftime('%Y%m%d%H%M%S')}.mp3"
        output_path = os.path.join('temp', filename)
        
        # Generate speech
        synthesize_speech(text, output_path)
        
        # Send the file
        return send_file(output_path, mimetype='audio/mpeg')
        
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-mood', methods=['POST'])
def save_mood():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Add timestamp if not present
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        
        # Add to mood records
        mood_records.append(data)
        
        # Save mood records
        with open('data/mood_records.json', 'w') as f:
            json.dump(mood_records, f, indent=2)
        
        return jsonify({'success': True})
        
    except Exception as e:
        logger.error(f"Error saving mood: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Catch-all route to handle client-side routing
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
