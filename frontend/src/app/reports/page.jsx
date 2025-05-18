"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Sample data - in a real app, this would come from an API or database
const getMoodData = (timeframe) => {
  if (timeframe === "day") {
    return [
      { time: "6am", score: 6 },
      { time: "9am", score: 7 },
      { time: "12pm", score: 8 },
      { time: "3pm", score: 7 },
      { time: "6pm", score: 8 },
      { time: "9pm", score: 9 },
    ]
  } else if (timeframe === "week") {
    return [
      { time: "Mon", score: 7 },
      { time: "Tue", score: 6 },
      { time: "Wed", score: 8 },
      { time: "Thu", score: 7 },
      { time: "Fri", score: 9 },
      { time: "Sat", score: 8 },
      { time: "Sun", score: 8 },
    ]
  } else if (timeframe === "month") {
    return [
      { time: "Week 1", score: 7.5 },
      { time: "Week 2", score: 6.8 },
      { time: "Week 3", score: 7.2 },
      { time: "Week 4", score: 8.4 },
    ]
  } else {
    return [
      { time: "Jan", score: 6.5 },
      { time: "Feb", score: 7.0 },
      { time: "Mar", score: 7.2 },
      { time: "Apr", score: 6.8 },
      { time: "May", score: 7.5 },
      { time: "Jun", score: 8.0 },
      { time: "Jul", score: 8.2 },
      { time: "Aug", score: 7.8 },
      { time: "Sep", score: 7.5 },
      { time: "Oct", score: 8.0 },
      { time: "Nov", score: 8.5 },
      { time: "Dec", score: 7.5 },
    ]
  }
}

const getMoodDistribution = () => [
  { name: "Happy", value: 45, color: "#10b981" },
  { name: "Calm", value: 20, color: "#3b82f6" },
  { name: "Neutral", value: 15, color: "#9ca3af" },
  { name: "Stressed", value: 12, color: "#f59e0b" },
  { name: "Sad", value: 8, color: "#6366f1" }
]

const getActivityImpact = () => [
  { name: "Exercise", impact: 8.5, color: "#10b981" },
  { name: "Meditation", impact: 7.8, color: "#3b82f6" },
  { name: "Reading", impact: 7.2, color: "#6366f1" },
  { name: "Social", impact: 8.2, color: "#f59e0b" },
  { name: "Outdoors", impact: 9.0, color: "#84cc16" },
  { name: "Creative", impact: 7.5, color: "#ec4899" }
]

const getMetrics = (timeframe) => {
  const metrics = {
    day: { mood: 7.2, moodChange: -0.3, stress: "Medium", stressChange: 0, activities: 3, activitiesChange: 1 },
    week: { mood: 7.5, moodChange: 0.3, stress: "Medium", stressChange: -5, activities: 12, activitiesChange: 3 },
    month: { mood: 7.3, moodChange: 0.5, stress: "Low-Med", stressChange: -10, activities: 42, activitiesChange: 7 },
    year: { mood: 7.6, moodChange: 0.8, stress: "Medium", stressChange: -15, activities: 520, activitiesChange: 104 }
  }
  return metrics[timeframe]
}

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState("week")
  const metrics = getMetrics(timeframe)
  const moodData = getMoodData(timeframe)
  const moodDistribution = getMoodDistribution()
  const activityImpact = getActivityImpact()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Wellness Reports</h1>
          <p className="text-muted-foreground">Track your mental wellbeing over time and identify patterns.</p>
        </div>

        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
          <TabsTrigger value="activity">Activity Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Mood</CardTitle>
                <CardDescription>Past {timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.mood.toFixed(1)}/10</div>
                <p className={`text-xs ${metrics.moodChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.moodChange >= 0 ? '+' : ''}{metrics.moodChange} from previous {timeframe}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stress Level</CardTitle>
                <CardDescription>Past {timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.stress}</div>
                <p className={`text-xs ${metrics.stressChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.stressChange <= 0 ? '' : '+'}{metrics.stressChange}% from previous {timeframe}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Wellness Activities</CardTitle>
                <CardDescription>Past {timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activities}</div>
                <p className={`text-xs ${metrics.activitiesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.activitiesChange >= 0 ? '+' : ''}{metrics.activitiesChange} from previous {timeframe}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                Wellness Score Trend
              </CardTitle>
              <CardDescription>Your overall wellness score over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Mood Score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Mood Distribution
                </CardTitle>
                <CardDescription>Breakdown of your mood entries</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={moodDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Activity Impact
                </CardTitle>
                <CardDescription>How activities affect your wellbeing</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityImpact} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value}/10`, 'Impact']} />
                    <Bar dataKey="impact" name="Wellbeing Impact">
                      {activityImpact.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>Detailed analysis of your mood patterns</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} label={{ value: 'Mood Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Mood Score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mood Factors</CardTitle>
                <CardDescription>Elements affecting your mood</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { factor: "Sleep", impact: 8.2, color: "#6366f1" },
                      { factor: "Nutrition", impact: 7.5, color: "#84cc16" },
                      { factor: "Exercise", impact: 8.7, color: "#10b981" },
                      { factor: "Social", impact: 7.8, color: "#f59e0b" },
                      { factor: "Work", impact: 5.4, color: "#ef4444" }
                    ]} 
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 10]} />
                    <YAxis dataKey="factor" type="category" width={70} />
                    <Tooltip formatter={(value) => [`${value}/10`, 'Impact']} />
                    <Bar dataKey="impact" name="Impact on Mood">
                      {activityImpact.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time of Day Analysis</CardTitle>
                <CardDescription>How your mood varies throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { time: "Morning", score: 6.5 },
                      { time: "Midday", score: 7.2 },
                      { time: "Afternoon", score: 6.8 },
                      { time: "Evening", score: 8.4 },
                      { time: "Night", score: 7.5 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Mood Score"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 6, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Analysis</CardTitle>
              <CardDescription>Insights into your activities and their impact</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { name: "Exercise", frequency: 8, impact: 8.5, color: "#10b981" },
                    { name: "Meditation", frequency: 12, impact: 7.8, color: "#3b82f6" },
                    { name: "Reading", frequency: 10, impact: 7.2, color: "#6366f1" },
                    { name: "Social", frequency: 6, impact: 8.2, color: "#f59e0b" },
                    { name: "Outdoors", frequency: 4, impact: 9.0, color: "#84cc16" },
                    { name: "Creative", frequency: 7, impact: 7.5, color: "#ec4899" }
                  ]}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="frequency" name="Times Practiced" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="impact" name="Wellbeing Impact (0-10)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Effective Activities</CardTitle>
                <CardDescription>Activities with the highest positive impact</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Outdoors", impact: 9.0, color: "#84cc16" },
                      { name: "Exercise", impact: 8.5, color: "#10b981" },
                      { name: "Social", impact: 8.2, color: "#f59e0b" },
                      { name: "Meditation", impact: 7.8, color: "#3b82f6" },
                      { name: "Creative", impact: 7.5, color: "#ec4899" }
                    ].sort((a, b) => b.impact - a.impact)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip formatter={(value) => [`${value}/10`, 'Impact']} />
                    <Bar dataKey="impact" name="Wellbeing Impact">
                      {activityImpact.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Frequency</CardTitle>
                <CardDescription>How often you engage in wellness activities</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={[
                        { name: "Exercise", value: 20, color: "#10b981" },
                        { name: "Meditation", value: 30, color: "#3b82f6" },
                        { name: "Reading", value: 25, color: "#6366f1" },
                        { name: "Social", value: 15, color: "#f59e0b" },
                        { name: "Creative", value: 10, color: "#ec4899" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
