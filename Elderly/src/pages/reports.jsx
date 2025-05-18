import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { HealthChart } from "../components/ui/health-chart"
import { MoodChart } from "../components/ui/mood-chart"
import { ConfusionChart } from "../components/ui/confusionchart"
import { Download, Printer, Share2, AlertTriangle, Brain, Heart } from 'lucide-react'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("summary")
  const [healthData, setHealthData] = useState([])
  const [moodData, setMoodData] = useState([])
  const [memoryData, setMemoryData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch health data
    const fetchHealthData = async () => {
      try {
        const response = await fetch("/api/health-data")
        if (response.ok) {
          const data = await response.json()
          setHealthData(data)
        }
      } catch (error) {
        console.error("Error fetching health data:", error)
      }
    }

    // Fetch mood data
    const fetchMoodData = async () => {
      try {
        const response = await fetch("/api/event-logs")
        if (response.ok) {
          const data = await response.json()
          setMoodData(
            data.map((item) => ({
              date: new Date(item.timestamp).toLocaleDateString(),
              sentiment: item.sentiment,
              confusion: item.confusion,
              emergency: item.emergency,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching mood data:", error)
      }
    }

    // Fetch memory data
    const fetchMemoryData = async () => {
      try {
        const response = await fetch("/api/memories")
        if (response.ok) {
          const data = await response.json()
          setMemoryData(data)
        }
      } catch (error) {
        console.error("Error fetching memory data:", error)
      }
    }

    // Simulate data for demo if API endpoints aren't available
    const simulateData = () => {
      // Sample health data
      const sampleHealthData = [
        { date: "2025-05-10", value: 120, type: "blood_pressure" },
        { date: "2025-05-11", value: 118, type: "blood_pressure" },
        { date: "2025-05-12", value: 122, type: "blood_pressure" },
        { date: "2025-05-13", value: 119, type: "blood_pressure" },
        { date: "2025-05-14", value: 121, type: "blood_pressure" },
        { date: "2025-05-15", value: 117, type: "blood_pressure" },
        { date: "2025-05-16", value: 120, type: "blood_pressure" },
        { date: "2025-05-10", value: 98.6, type: "temperature" },
        { date: "2025-05-11", value: 98.4, type: "temperature" },
        { date: "2025-05-12", value: 99.1, type: "temperature" },
        { date: "2025-05-13", value: 98.7, type: "temperature" },
        { date: "2025-05-14", value: 98.5, type: "temperature" },
        { date: "2025-05-15", value: 98.6, type: "temperature" },
        { date: "2025-05-16", value: 98.8, type: "temperature" },
      ]

      // Sample mood data
      const sampleMoodData = [
        { date: "2025-05-10", sentiment: "positive", confusion: false, emergency: false },
        { date: "2025-05-11", sentiment: "positive", confusion: false, emergency: false },
        { date: "2025-05-12", sentiment: "negative", confusion: true, emergency: false },
        { date: "2025-05-13", sentiment: "neutral", confusion: false, emergency: false },
        { date: "2025-05-14", sentiment: "neutral", confusion: false, emergency: false },
        { date: "2025-05-15", sentiment: "positive", confusion: false, emergency: false },
        { date: "2025-05-16", sentiment: "negative", confusion: false, emergency: true },
      ]

      // Sample memory data
      const sampleMemoryData = {
        name: "Margaret",
        age: "72",
        daughter: "Sarah",
        son: "Michael",
        dog_name: "Buddy",
        favorite_color: "Blue",
        doctor: "Dr. Johnson",
        appointment_date: "June 15",
        medications: ["Lisinopril", "Metformin", "Vitamin D"],
        health_conditions: ["arthritis", "diabetes", "hypertension"],
      }

      setHealthData(sampleHealthData)
      setMoodData(sampleMoodData)
      setMemoryData(sampleMemoryData)
    }

    // Try to fetch data, or use simulated data
    Promise.all([fetchHealthData(), fetchMoodData(), fetchMemoryData()])
      .catch(() => {
        simulateData()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const countSentiments = () => {
    const counts = { positive: 0, neutral: 0, negative: 0 }
    moodData.forEach((item) => {
      counts[item.sentiment]++
    })
    return counts
  }

  const countConfusionEvents = () => {
    return moodData.filter((item) => item.confusion).length
  }

  const countEmergencyEvents = () => {
    return moodData.filter((item) => item.emergency).length
  }

  const sentimentCounts = countSentiments()
  const confusionCount = countConfusionEvents()
  const emergencyCount = countEmergencyEvents()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Health Reports</h1>
          <p className="text-xl text-gray-600 mt-2">Summary of your health, mood, and voice insights</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="text-lg py-2 px-4 border-2 flex items-center gap-2">
            <Printer className="h-5 w-5" /> Print
          </Button>
          <Button variant="outline" className="text-lg py-2 px-4 border-2 flex items-center gap-2">
            <Download className="h-5 w-5" /> Download
          </Button>
          <Button variant="outline" className="text-lg py-2 px-4 border-2 flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 text-lg">
          <TabsTrigger value="summary" className="text-lg py-3">
            Summary
          </TabsTrigger>
          <TabsTrigger value="health" className="text-lg py-3">
            Health
          </TabsTrigger>
          <TabsTrigger value="mood" className="text-lg py-3">
            Mood
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Basic Information</h3>
                      <div className="space-y-2">
                        <p className="text-lg">
                          <span className="font-medium">Name:</span> {memoryData.name || "Not provided"}
                        </p>
                        <p className="text-lg">
                          <span className="font-medium">Age:</span> {memoryData.age || "Not provided"}
                        </p>
                        {memoryData.doctor && (
                          <p className="text-lg">
                            <span className="font-medium">Doctor:</span> {memoryData.doctor}
                          </p>
                        )}
                        {memoryData.appointment_date && (
                          <p className="text-lg">
                            <span className="font-medium">Next Appointment:</span> {memoryData.appointment_date}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Health Information</h3>
                      <div className="space-y-2">
                        {Array.isArray(memoryData.health_conditions) && memoryData.health_conditions.length > 0 && (
                          <p className="text-lg">
                            <span className="font-medium">Health Conditions:</span>{" "}
                            {memoryData.health_conditions.join(", ")}
                          </p>
                        )}
                        {Array.isArray(memoryData.medications) && memoryData.medications.length > 0 && (
                          <p className="text-lg">
                            <span className="font-medium">Medications:</span> {memoryData.medications.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" /> Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-green-600">Good</p>
                      <p className="text-gray-600 mt-2">Based on recent measurements</p>
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-lg">
                        <span className="font-medium">Blood Pressure:</span> 120/80 mmHg
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Temperature:</span> 98.6°F
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" /> Cognitive Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-blue-600">Stable</p>
                      <p className="text-gray-600 mt-2">Based on conversation analysis</p>
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-lg">
                        <span className="font-medium">Confusion Events:</span> {confusionCount} in last 7 days
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Memory Recall:</span> Good
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" /> Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-amber-600">{emergencyCount}</p>
                      <p className="text-gray-600 mt-2">Emergency events detected</p>
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-lg">
                        <span className="font-medium">Last Alert:</span> {emergencyCount > 0 ? "May 16, 2025" : "None"}
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Status:</span> {emergencyCount > 0 ? "Resolved" : "No alerts"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Weekly Mood Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <MoodChart data={moodData} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{sentimentCounts.positive}</p>
                      <p className="text-lg text-green-800">Positive Days</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">{sentimentCounts.neutral}</p>
                      <p className="text-lg text-blue-800">Neutral Days</p>
                    </div>
                    <div className="bg-amber-100 p-4 rounded-lg">
                      <p className="text-3xl font-bold text-amber-600">{sentimentCounts.negative}</p>
                      <p className="text-lg text-amber-800">Negative Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="health" className="mt-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Blood Pressure Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <HealthChart
                      data={healthData.filter((item) => item.type === "blood_pressure")}
                      yAxisLabel="mmHg"
                      color="#3b82f6"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Temperature Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <HealthChart
                      data={healthData.filter((item) => item.type === "temperature")}
                      yAxisLabel="°F"
                      color="#ef4444"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Health Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Array.isArray(memoryData.health_conditions) && memoryData.health_conditions.length > 0 ? (
                      memoryData.health_conditions.map((condition, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-xl font-semibold capitalize">{condition}</h3>
                          <p className="text-gray-600 mt-2">
                            {condition === "arthritis"
                              ? "Joint inflammation causing pain and stiffness. Regular gentle exercise and medication can help manage symptoms."
                              : condition === "diabetes"
                                ? "Condition affecting how your body processes blood sugar. Regular monitoring and medication are important."
                                : condition === "hypertension"
                                  ? "High blood pressure that can lead to heart problems. Medication and lifestyle changes can help control it."
                                  : "Medical condition being monitored by your healthcare provider."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-lg text-gray-600">No health conditions recorded.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Array.isArray(memoryData.medications) && memoryData.medications.length > 0 ? (
                      memoryData.medications.map((medication, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-xl font-semibold">{medication}</h3>
                          <p className="text-gray-600 mt-2">
                            {medication.toLowerCase() === "lisinopril"
                              ? "Used to treat high blood pressure. Take once daily with or without food."
                              : medication.toLowerCase() === "metformin"
                                ? "Used to control blood sugar levels. Take with meals to reduce stomach upset."
                                : medication.toLowerCase() === "vitamin d"
                                  ? "Supplement to maintain bone health. Take daily with food."
                                  : "Take as prescribed by your doctor."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-lg text-gray-600">No medications recorded.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="mood" className="mt-6 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Mood Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <MoodChart data={moodData} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Confusion Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ConfusionChart data={moodData} />
                  </div>
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800">Confusion Analysis</h3>
                    <p className="text-gray-700 mt-2">
                      {confusionCount === 0
                        ? "No confusion events detected in the past week. Cognitive function appears stable."
                        : confusionCount === 1
                          ? "One minor confusion event detected. This is within normal range and not concerning."
                          : `${confusionCount} confusion events detected. Consider discussing with healthcare provider if this continues.`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Emergency Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyCount > 0 ? (
                      <>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <h3 className="text-xl font-semibold text-red-800">Emergency Alert</h3>
                          <p className="text-gray-700 mt-2">
                            {emergencyCount === 1
                              ? "One emergency event was detected on May 16, 2025. The caregiver was notified."
                              : `${emergencyCount} emergency events were detected in the past week. All caregivers were notified.`}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-xl font-semibold">Emergency Response Log</h3>
                          <div className="mt-4 space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-medium">May 16, 2025 - 3:42 PM</p>
                                <p className="text-gray-600">Emergency phrase detected: "I need help"</p>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Resolved
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-lg text-gray-600 p-4 bg-gray-50 rounded-lg">
                        No emergency events detected in the past week.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
