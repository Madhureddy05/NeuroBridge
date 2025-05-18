"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../ui/button"
import { Calendar, Clock, Heart, Pill, Sun, ThumbsUp } from "lucide-react"

export function HomeContent() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Susan</h1>
            <p className="text-xl text-gray-600 mt-2">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {currentDate}
              </span>
              <span className="flex items-center gap-2 mt-1">
                <Clock className="h-5 w-5" />
                {currentTime}
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="text-lg py-6 px-6 bg-blue-600 hover:bg-blue-700">
              <ThumbsUp className="mr-2 h-5 w-5" /> Record Mood
            </Button>
            <Button variant="outline" className="text-lg py-6 px-6 border-2">
              <Heart className="mr-2 h-5 w-5 text-red-500" /> Health Check
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center">
              <Pill className="mr-2 h-6 w-6 text-blue-500" />
              Upcoming Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-medium">Blood Pressure Medication</p>
                <p className="text-gray-600">12:30 PM - With lunch</p>
              </li>
              <li className="p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-medium">Vitamin D Supplement</p>
                <p className="text-gray-600">6:00 PM - With dinner</p>
              </li>
            </ul>
            <Button variant="link" className="mt-4 text-lg text-blue-600">
              View All Medications
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center">
              <Sun className="mr-2 h-6 w-6 text-yellow-500" />
              Today's Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">72°F</p>
                <p className="text-lg text-gray-600">Sunny</p>
              </div>
              <div className="text-right">
                <p className="text-lg">High: 75°F</p>
                <p className="text-lg">Low: 62°F</p>
              </div>
            </div>
            <p className="mt-4 text-lg">Good day for a short walk in the morning or evening.</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center">
              <Heart className="mr-2 h-6 w-6 text-red-500" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-lg">Blood Pressure:</span>
                <span className="text-lg font-medium">120/80</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-lg">Heart Rate:</span>
                <span className="text-lg font-medium">72 bpm</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-lg">Steps Today:</span>
                <span className="text-lg font-medium">2,450</span>
              </li>
            </ul>
            <Button variant="link" className="mt-4 text-lg text-blue-600">
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
            <p className="text-lg font-medium">Morning Medication Taken</p>
            <p className="text-gray-600">Today, 8:30 AM</p>
          </div>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <p className="text-lg font-medium">Video Call with Family</p>
            <p className="text-gray-600">Yesterday, 4:15 PM</p>
          </div>
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
            <p className="text-lg font-medium">Blood Pressure Checked</p>
            <p className="text-gray-600">Yesterday, 9:45 AM</p>
          </div>
        </div>
        <Button variant="link" className="mt-4 text-lg text-blue-600">
          View All Activities
        </Button>
      </section>
    </div>
  )
}
