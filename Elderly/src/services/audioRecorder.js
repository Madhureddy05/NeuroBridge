export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async startRecording() {
    try {
      // Reset state
      this.audioChunks = [];

      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream);

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("MediaRecorder not initialized"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Stop all tracks in the stream
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        // Create audio blob from chunks
        if (this.audioChunks.length === 0) {
          resolve(null);
          return;
        }

        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
        resolve(audioBlob);
      };

      if (this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }
}
