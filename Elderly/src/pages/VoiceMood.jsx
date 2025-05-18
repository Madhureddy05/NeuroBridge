"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Mic, Square, Send, ThumbsUp, ThumbsDown, Meh } from "lucide-react"
import { AudioRecorder } from "../services/audioRecorder"

export default function VoiceMoodPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [transcription, setTranscription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [moodRecords, setMoodRecords] = useState([
    {
      id: 1,
      date: "May 16, 2025",
      mood: "good",
      notes: "Feeling energetic and positive today",
      transcription: "I'm feeling really good today. I had a nice breakfast and my arthritis isn't bothering me much.",
      analysis: {
        sentiment: "positive",
        confusion_detected: false,
        emergency_detected: false,
      },
    },
    {
      id: 2,
      date: "May 14, 2025",
      mood: "neutral",
      notes: "Average day, slight headache in the morning",
      transcription:
        "Today is okay. I had a bit of a headache this morning but it's better now. Nothing special happened.",
      analysis: {
        sentiment: "neutral",
        confusion_detected: false,
        emergency_detected: false,
      },
    },
    {
      id: 3,
      date: "May 12, 2025",
      mood: "bad",
      notes: "Feeling tired and a bit anxious",
      transcription:
        "I didn't sleep well last night. I'm feeling tired and a bit worried about my doctor's appointment tomorrow.",
      analysis: {
        sentiment: "negative",
        confusion_detected: false,
        emergency_detected: false,
      },
    },
    {
      id: 4,
      date: "May 10, 2025",
      mood: "good",
      notes: "Had a nice visit with family, feeling happy",
      transcription:
        "My daughter and grandchildren visited today. We had a wonderful time together and they brought me flowers.",
      analysis: {
        sentiment: "positive",
        confusion_detected: false,
        emergency_detected: false,
      },
    },
  ])

  const audioRecorder = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    audioRecorder.current = new AudioRecorder()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      await audioRecorder.current?.startRecording()
      setIsRecording(true)
      setRecordingComplete(false)
      setTranscription("")
      setRecordingTime(0)

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = async () => {
    if (!isRecording) return

    setIsRecording(false)
    setIsProcessing(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    try {
      const audioBlob = await audioRecorder.current?.stopRecording()
      if (!audioBlob) throw new Error("No audio recorded")

      // Create form data with audio blob
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      // Send to backend for processing
      const response = await fetch("/api/process-audio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to process audio")

      const data = await response.json()

      setTranscription(data.transcription)

      // Auto-select mood based on sentiment
      if (data.analysis.sentiment === "positive") {
        setSelectedMood("good")
      } else if (data.analysis.sentiment === "negative") {
        setSelectedMood("bad")
      } else {
        setSelectedMood("neutral")
      }

      setRecordingComplete(true)
    } catch (error) {
      console.error("Error processing audio:", error)
      alert("There was an error processing your voice. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const submitMood = async () => {
    if (!selectedMood || !transcription) return

    setIsProcessing(true)

    try {
      // Get analysis of transcription
      const analysisResponse = await fetch("/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcription,
        }),
      })

      if (!analysisResponse.ok) throw new Error("Failed to analyze text")

      const analysis = await analysisResponse.json()

      // Create new mood record
      const newRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        mood: selectedMood,
        notes: transcription.length > 50 ? transcription.substring(0, 50) + "..." : transcription,
        transcription: transcription,
        analysis: analysis,
      }

      // Save to backend
      const saveResponse = await fetch("/api/save-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      })

      if (!saveResponse.ok) throw new Error("Failed to save mood record")

      // Update local state
      setMoodRecords((prev) => [newRecord, ...prev])

      // Reset form
      setRecordingComplete(false)
      setSelectedMood(null)
      setTranscription("")
    } catch (error) {
      console.error("Error saving mood:", error)
      alert("There was an error saving your mood. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Voice Mood Recorder</h1>
        <p className="text-xl text-gray-600 mt-2">Record how you're feeling today with your voice</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Record Your Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-8 py-6">
            <div className="text-center">
              <p className="text-xl mb-4">
                Tell us how you're feeling today. Speak naturally about your mood, energy level, and any concerns.
              </p>
              <p className="text-lg text-gray-600">Your voice helps us understand your emotional wellbeing.</p>
            </div>

            <div className="w-full max-w-md bg-gray-100 rounded-xl p-8 flex flex-col items-center">
              {isRecording ? (
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-4">
                    <Mic className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-2xl font-bold">{formatTime(recordingTime)}</p>
                  <p className="text-lg text-red-600 mt-2">Recording...</p>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <div className="animate-spin h-12 w-12 border-4 border-white rounded-full border-t-transparent"></div>
                  </div>
                  <p className="text-xl">Processing...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Mic className="h-12 w-12 text-gray-600" />
                  </div>
                  <p className="text-xl">Ready to record</p>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                {!isRecording && !recordingComplete && !isProcessing ? (
                  <Button onClick={startRecording} className="text-lg py-6 px-8 bg-red-600 hover:bg-red-700">
                    <Mic className="mr-2 h-5 w-5" /> Start Recording
                  </Button>
                ) : isRecording ? (
                  <Button
                    onClick={stopRecording}
                    variant="outline"
                    className="text-lg py-6 px-8 border-2 border-red-500 text-red-600"
                  >
                    <Square className="mr-2 h-5 w-5" /> Stop Recording
                  </Button>
                ) : null}
              </div>

              {transcription && recordingComplete && (
                <div className="mt-6 w-full">
                  <h4 className="text-lg font-medium mb-2">Your recording:</h4>
                  <div className="bg-white p-4 rounded-lg text-gray-700">{transcription}</div>
                </div>
              )}
            </div>

            {recordingComplete && (
              <div className="w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button
                    variant={selectedMood === "good" ? "default" : "outline"}
                    className={`text-lg py-8 ${
                      selectedMood === "good"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-2 border-green-500 text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => setSelectedMood("good")}
                  >
                    <ThumbsUp className="mr-2 h-6 w-6" /> Good
                  </Button>
                  <Button
                    variant={selectedMood === "neutral" ? "default" : "outline"}
                    className={`text-lg py-8 ${
                      selectedMood === "neutral"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setSelectedMood("neutral")}
                  >
                    <Meh className="mr-2 h-6 w-6" /> Neutral
                  </Button>
                  <Button
                    variant={selectedMood === "bad" ? "default" : "outline"}
                    className={`text-lg py-8 ${
                      selectedMood === "bad"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                    }`}
                    onClick={() => setSelectedMood("bad")}
                  >
                    <ThumbsDown className="mr-2 h-6 w-6" /> Not Well
                  </Button>
                </div>
                <Button onClick={submitMood} disabled={!selectedMood || isProcessing} className="w-full text-lg py-6">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Submit Mood
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Recent Mood Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodRecords.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-lg border ${
                  record.mood === "good"
                    ? "bg-green-100 border-green-300"
                    : record.mood === "neutral"
                      ? "bg-blue-100 border-blue-300"
                      : "bg-amber-100 border-amber-300"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="flex items-center">
                      <p className="text-lg font-medium">
                        Mood: {record.mood.charAt(0).toUpperCase() + record.mood.slice(1)}
                      </p>
                      {record.analysis.confusion_detected && (
                        <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">Confusion</span>
                      )}
                      {record.analysis.emergency_detected && (
                        <span className="ml-2 bg-red-200 text-red-800 text-xs px-2 py-1 rounded">Emergency</span>
                      )}
                    </div>
                    <p className="text-gray-600">{record.notes}</p>
                  </div>
                  <p className="text-gray-500 mt-2 md:mt-0">{record.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 text-lg text-blue-600">
            View All Recordings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}