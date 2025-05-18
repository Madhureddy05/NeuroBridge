"use client"

import DashboardLayout from "../components/ui/dashboard-layout" // ✅ default import
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { HealthChart } from "../components/ui/health-chart"
import { MoodChart } from "../components/ui/mood-chart"

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health & Mood Timeline</h1>
          <p className="text-xl text-gray-600 mt-2">Track your health metrics and mood over time</p>
        </div>

        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 text-lg">
            <TabsTrigger value="health" className="text-lg py-3">
              Health Metrics
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-lg py-3">
              Mood Tracking
            </TabsTrigger>
          </TabsList>
          <TabsContent value="health" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Health Metrics Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <HealthChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mood" className="mt-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <MoodChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Health Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: "May 15, 2025",
                  event: "Blood Pressure Check",
                  details: "120/80 - Normal range",
                  status: "normal",
                },
                {
                  date: "May 12, 2025",
                  event: "Heart Rate Monitoring",
                  details: "85 bpm - Slightly elevated",
                  status: "warning",
                },
                {
                  date: "May 10, 2025",
                  event: "Weight Measurement",
                  details: "152 lbs - Stable",
                  status: "normal",
                },
                {
                  date: "May 8, 2025",
                  event: "Blood Sugar Test",
                  details: "110 mg/dL - Normal range",
                  status: "normal",
                },
                {
                  date: "May 5, 2025",
                  event: "Sleep Tracking",
                  details: "6.5 hours - Below recommended",
                  status: "warning",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${item.status === "normal" ? "bg-green-50" : "bg-amber-50"}`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <p className="text-lg font-medium">{item.event}</p>
                      <p className="text-gray-600">{item.details}</p>
                    </div>
                    <p className="text-gray-500 mt-2 md:mt-0">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
