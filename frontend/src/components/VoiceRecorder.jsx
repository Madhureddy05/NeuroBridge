import { useState, useRef } from 'react';
import axios from 'axios';

export default function VoiceRecorder({ onTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const res = await axios.post('/api/transcribe', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const { text } = res.data;
        setTranscript(text);
        onTranscription && onTranscription(text);
      } catch (error) {
        console.error('Transcription failed:', error);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="mt-6 text-center">
      <button
        className={`px-6 py-3 rounded text-white font-semibold ${
          isRecording ? 'bg-red-600' : 'bg-green-600 hover:bg-green-700'
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow text-left">
          <h4 className="font-semibold mb-2">Transcribed Text:</h4>
          <p className="text-gray-700 whitespace-pre-line">{transcript}</p>
        </div>
      )}
    </div>
  );
}
