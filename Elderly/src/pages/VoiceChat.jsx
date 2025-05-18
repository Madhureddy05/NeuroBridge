"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mic, Square, Send, Play, Pause, Bot } from "lucide-react";
import { Textarea } from "../components/ui/textarea";
import { AudioRecorder } from "../services/audioRecorder";

export default function VoiceChatPage() {
  const [messages, setMessages] = useState([
  {
    id: 1,
    type: "ai",
    content: "Hello! I'm your voice assistant. How can I help you today?",
    timestamp: new Date(),
    hasAudio: false,
    audioUrl: null,
  },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isPlaying, setIsPlaying] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRecorder = useRef(null);
  const audioRefs = useRef({});
  const timerRef = useRef(null);

  useEffect(() => {
    audioRecorder.current = new AudioRecorder();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.current?.startRecording();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    setIsProcessing(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const audioBlob = await audioRecorder.current?.stopRecording();
      if (!audioBlob) throw new Error("No audio recorded");

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process audio");

      const data = await response.json();

      const newUserMessage = {
        id: Date.now(),
        type: "user",
        content: data.transcription,
        timestamp: new Date(),
        hasAudio: true,
        analysis: {
          sentiment: data.analysis.sentiment,
          confusion_detected: data.analysis.confusion_detected,
          emergency_detected: data.analysis.emergency_detected,
        },
      };

      setMessages((prev) => [...prev, newUserMessage]);

      const aiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.transcription,
          analysis: data.analysis,
        }),
      });

      if (!aiResponse.ok) throw new Error("Failed to get AI response");

      const aiData = await aiResponse.json();

      const newAiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiData.response,
        timestamp: new Date(),
        hasAudio: true,
        audioUrl: `/api/tts?text=${encodeURIComponent(aiData.response)}`,
      };

      setMessages((prev) => [...prev, newAiMessage]);
      scrollToBottom();

      setTimeout(() => {
        audioRefs.current[newAiMessage.id]?.play();
      }, 500);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("There was an error processing your voice. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextMessage = async () => {
    if (!inputText.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const newUserMessage = {
        id: Date.now(),
        type: "user",
        content: inputText,
        timestamp: new Date(),
        hasAudio: false,
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputText("");

      const analysisResponse = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!analysisResponse.ok) throw new Error("Failed to analyze text");

      const analysis = await analysisResponse.json();

      const aiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          analysis: analysis,
        }),
      });

      if (!aiResponse.ok) throw new Error("Failed to get AI response");

      const aiData = await aiResponse.json();

      const newAiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: aiData.response,
        timestamp: new Date(),
        hasAudio: true,
        audioUrl: `/api/tts?text=${encodeURIComponent(aiData.response)}`,
      };

      setMessages((prev) => [...prev, newAiMessage]);
      scrollToBottom();

      setTimeout(() => {
        audioRefs.current[newAiMessage.id]?.play();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayAudio = (messageId, audioUrl) => {
    if (!audioUrl) return;

    if (isPlaying === messageId) {
      audioRefs.current[messageId]?.pause();
      setIsPlaying(null);
    } else {
      if (isPlaying !== null && audioRefs.current[isPlaying]) {
        audioRefs.current[isPlaying]?.pause();
      }

      audioRefs.current[messageId]?.play();
      setIsPlaying(messageId);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Voice Chat Assistant</h1>
        <p className="text-xl text-gray-600 mt-2">Ask questions or get help using your voice</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Chat with Your Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.type === "ai" && (
                        <div className="flex items-center mb-2">
                          <Bot className="h-5 w-5 mr-2" />
                          <span className="font-medium">Assistant</span>
                        </div>
                      )}
                      <p className="text-lg">{message.content}</p>

                      {message.analysis && (
                        <div className="mt-2 text-xs opacity-70">
                          {message.analysis.emergency_detected && (
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded mr-2">Emergency</span>
                          )}
                          {message.analysis.confusion_detected && (
                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded mr-2">Confusion</span>
                          )}
                          <span
                            className={`px-2 py-1 rounded ${
                              message.analysis.sentiment === "positive"
                                ? "bg-green-200 text-green-800"
                                : message.analysis.sentiment === "negative"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {message.analysis.sentiment.charAt(0).toUpperCase() + message.analysis.sentiment.slice(1)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.hasAudio && message.audioUrl && (
                          <>
                            <audio
                              ref={(el) => (audioRefs.current[message.id] = el)}
                              src={message.audioUrl}
                              onEnded={() => setIsPlaying(null)}
                              onError={(e) => console.error("Audio error:", e)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePlayAudio(message.id, message.audioUrl)}
                              className={`h-8 w-8 rounded-full p-0 ${
                                message.type === "user"
                                  ? "text-white hover:bg-blue-700"
                                  : "text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {isPlaying === message.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t pt-4">
              {isRecording ? (
                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-lg">Recording... {formatTime(recordingTime)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={stopRecording}
                    className="h-10 w-10 rounded-full border-2 border-red-500 text-red-600"
                  >
                    <Square className="h-5 w-5" />
                  </Button>
                </div>
              ) : isProcessing ? (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
                  <span className="text-lg">Processing...</span>
                </div>
              ) : null}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startRecording}
                  disabled={isRecording || isProcessing}
                  className="h-12 w-12 rounded-full border-2"
                >
                  <Mic className="h-6 w-6" />
                </Button>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 text-lg p-4 min-h-[60px]"
                  disabled={isProcessing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendTextMessage()
                    }
                  }}
                />
                <Button
                  onClick={sendTextMessage}
                  disabled={!inputText.trim() || isProcessing}
                  className="h-12 w-12 rounded-full"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Voice Assistant Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-xl font-medium mb-2">Things you can ask:</h3>
              <ul className="list-disc list-inside space-y-2 text-lg">
                <li>What medications do I need to take today?</li>
                <li>When is my next doctor's appointment?</li>
                <li>Can you remind me to take my medication at 2 PM?</li>
                <li>What activities do I have scheduled today?</li>
                <li>How has my blood pressure been this week?</li>
              </ul>
            </div>
            <p className="text-lg">
              You can speak naturally to your assistant. If you prefer, you can also type your questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
