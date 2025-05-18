from vosk import Model, KaldiRecognizer
import wave
import json

class STTService:
    def __init__(self, model_path):
        self.model = Model(model_path)

    def transcribe(self, audio_path):
        wf = wave.open(audio_path, "rb")
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
            raise ValueError("Audio file must be WAV format Mono PCM.")

        rec = KaldiRecognizer(self.model, wf.getframerate())
        results = []

        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                results.append(result.get("text", ""))
        final = json.loads(rec.FinalResult())
        results.append(final.get("text", ""))
        return " ".join(results)
