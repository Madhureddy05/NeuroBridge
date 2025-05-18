"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertTriangle } from 'lucide-react'
import { useState, useEffect } from "react"

export default function WellnessScore() {
  const [score, setScore] = useState(78)

  // Simulate score changing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
        const newScore = Math.max(0, Math.min(100, prev + change))
        return newScore
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score) => {
    if (score < 40) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    return "text-green-500"
  }

  const getScoreText = (score) => {
    if (score < 40) return "Needs Attention"
    if (score < 70) return "Doing Okay"
    return "Doing Great"
  }

  const showAlert = score < 40

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Your Wellness Score</CardTitle>
          <CardDescription>Based on your mood entries, activities, and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            Status: <span className={getScoreColor(score)}>{getScoreText(score)}</span>
          </p>
        </CardContent>
      </Card>

      {showAlert && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wellness Alert</AlertTitle>
          <AlertDescription>
            Your wellness score is low. Consider taking a break, talking to someone, or using our relief exercises.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}