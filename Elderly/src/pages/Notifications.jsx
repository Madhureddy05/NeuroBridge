import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Bell, Calendar, Clock, Pill, Volume2, VolumeX } from 'lucide-react'
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState({
    visualAlerts: true,
    soundAlerts: true,
    medicationReminders: true,
    appointmentReminders: true,
    dailyActivities: true,
    reminderVoice: "female",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    // Fetch notification settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/notification-settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
      }
    }

    // Simulate data for demo if API endpoints aren't available
    const simulateData = () => {
      // Sample notifications
      const sampleNotifications = [
        {
          id: 1,
          title: "Blood Pressure Medication",
          description: "Time to take your blood pressure medication",
          time: "12:30 PM",
          type: "medication",
          isRead: false,
        },
        {
          id: 2,
          title: "Doctor's Appointment",
          description: "Reminder: You have a doctor's appointment tomorrow at 10:00 AM",
          time: "9:00 AM",
          type: "appointment",
          isRead: true,
        },
        {
          id: 3,
          title: "Vitamin D Supplement",
          description: "Time to take your Vitamin D supplement",
          time: "6:00 PM",
          type: "medication",
          isRead: false,
        },
        {
          id: 4,
          title: "Evening Walk",
          description: "Reminder for your evening walk",
          time: "5:00 PM",
          type: "reminder",
          isRead: true,
        },
        {
          id: 5,
          title: "Water Reminder",
          description: "Remember to drink a glass of water",
          time: "2:00 PM",
          type: "reminder",
          isRead: false,
        },
        {
          id: 6,
          title: "Confusion Detected",
          description: "Confusion was detected in your recent conversation. A caregiver has been notified.",
          time: "11:23 AM",
          type: "confusion",
          isRead: false,
        },
        {
          id: 7,
          title: "Emergency Alert",
          description: "Emergency phrases detected in your speech. Emergency contacts have been notified.",
          time: "Yesterday",
          type: "emergency",
          isRead: true,
        },
      ]

      setNotifications(sampleNotifications)
    }

    // Try to fetch data, or use simulated data
    Promise.all([fetchNotifications(), fetchSettings()])
      .catch(() => {
        simulateData()
      })
      .finally(() => {
        setLoading(false)
      })

    // Set up notification checking interval
    const checkInterval = setInterval(() => {
      // Check for new notifications
      fetchNotifications().catch(() => {})
    }, 30000) // Check every 30 seconds

    return () => clearInterval(checkInterval)
  }, [])

  const markAsRead = async (id) => {
    try {
      // Update on server
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      })

      // Update locally regardless of server response
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Still update locally even if server request fails
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
      )
    }
  }

  const markAllAsRead = async () => {
    try {
      // Update on server
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      // Update locally regardless of server response
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      // Still update locally even if server request fails
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      // Update on server
      const response = await fetch("/api/notification-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      })

      // Update locally regardless of server response
      setSettings(newSettings)
    } catch (error) {
      console.error("Error updating notification settings:", error)
      // Still update locally even if server request fails
      setSettings(newSettings)
    }
  }

  const testAlert = () => {
    // Create a temporary notification
    const testNotification = {
      id: Date.now(),
      title: "Test Alert",
      description: "This is a test notification alert",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "reminder",
      isRead: false,
    }

    // Add to notifications
    setNotifications((prev) => [testNotification, ...prev])

    // Play sound if enabled
    if (settings.soundAlerts) {
      const audio = new Audio("/notification-sound.mp3")
      audio.play().catch((e) => console.error("Error playing notification sound:", e))
    }
  }

  const testVoiceAlert = () => {
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(
      "This is a test voice alert. Your voice assistant is working properly.",
    )

    // Set voice based on settings
    const voices = window.speechSynthesis.getVoices()
    const femaleVoices = voices.filter((voice) => voice.name.includes("female") || voice.name.includes("Female"))
    const maleVoices = voices.filter((voice) => voice.name.includes("male") || voice.name.includes("Male"))

    if (settings.reminderVoice === "female" && femaleVoices.length > 0) {
      utterance.voice = femaleVoices[0]
    } else if (settings.reminderVoice === "male" && maleVoices.length > 0) {
      utterance.voice = maleVoices[0]
    }

    // Speak the message
    window.speechSynthesis.speak(utterance)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "medication":
        return <Pill className="h-6 w-6 text-blue-500" />
      case "appointment":
        return <Calendar className="h-6 w-6 text-purple-500" />
      case "reminder":
        return <Clock className="h-6 w-6 text-green-500" />
      case "emergency":
        return <Bell className="h-6 w-6 text-red-500" />
      case "confusion":
        return <Bell className="h-6 w-6 text-yellow-500" />
      default:
        return <Bell className="h-6 w-6 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-xl text-gray-600 mt-2">Stay updated with your medication and appointment reminders</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="text-lg py-6 px-6 border-2" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <Button className="text-lg py-6 px-6" onClick={testAlert}>
            Test Alert
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 text-lg">
          <TabsTrigger value="all" className="text-lg py-3">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="text-lg py-3">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-lg py-3">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.isRead ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"
                      } ${notification.type === "emergency" ? "border-red-300 bg-red-50" : ""} ${
                        notification.type === "confusion" ? "border-yellow-300 bg-yellow-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                              <h3 className="text-lg font-medium">{notification.title}</h3>
                              <p className="text-gray-600">{notification.description}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                              <span className="text-gray-500 whitespace-nowrap">{notification.time}</span>
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Unread Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadCount > 0 ? (
                  notifications
                    .filter((n) => !n.isRead)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          notification.type === "emergency"
                            ? "border-red-300 bg-red-50"
                            : notification.type === "confusion"
                              ? "border-yellow-300 bg-yellow-50"
                              : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <h3 className="text-lg font-medium">{notification.title}</h3>
                                <p className="text-gray-600">{notification.description}</p>
                              </div>
                              <div className="flex items-center gap-4 mt-2 md:mt-0">
                                <span className="text-gray-500 whitespace-nowrap">{notification.time}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  Mark as read
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-500">No unread notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Alert Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-gray-700" />
                        <Label htmlFor="visual-alerts" className="text-lg">
                          Visual Alerts
                        </Label>
                      </div>
                      <Switch
                        id="visual-alerts"
                        checked={settings.visualAlerts}
                        onCheckedChange={(checked) => updateSettings({ ...settings, visualAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.soundAlerts ? (
                          <Volume2 className="h-5 w-5 text-gray-700" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-gray-700" />
                        )}
                        <Label htmlFor="sound-alerts" className="text-lg">
                          Sound Alerts
                        </Label>
                      </div>
                      <Switch
                        id="sound-alerts"
                        checked={settings.soundAlerts}
                        onCheckedChange={(checked) => updateSettings({ ...settings, soundAlerts: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Reminder Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-gray-700" />
                        <Label htmlFor="medication-reminders" className="text-lg">
                          Medication Reminders
                        </Label>
                      </div>
                      <Switch
                        id="medication-reminders"
                        checked={settings.medicationReminders}
                        onCheckedChange={(checked) => updateSettings({ ...settings, medicationReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-700" />
                        <Label htmlFor="appointment-reminders" className="text-lg">
                          Appointment Reminders
                        </Label>
                      </div>
                      <Switch
                        id="appointment-reminders"
                        checked={settings.appointmentReminders}
                        onCheckedChange={(checked) => updateSettings({ ...settings, appointmentReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-700" />
                        <Label htmlFor="daily-activities" className="text-lg">
                          Daily Activities
                        </Label>
                      </div>
                      <Switch
                        id="daily-activities"
                        checked={settings.dailyActivities}
                        onCheckedChange={(checked) => updateSettings({ ...settings, dailyActivities: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Voice Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={settings.reminderVoice === "female" ? "default" : "outline"}
                      className={`text-lg py-6 ${
                        settings.reminderVoice === "female"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => updateSettings({ ...settings, reminderVoice: "female" })}
                    >
                      Female Voice
                    </Button>
                    <Button
                      variant={settings.reminderVoice === "male" ? "default" : "outline"}
                      className={`text-lg py-6 ${
                        settings.reminderVoice === "male"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => updateSettings({ ...settings, reminderVoice: "male" })}
                    >
                      Male Voice
                    </Button>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full text-lg py-6" onClick={testVoiceAlert}>
                      Test Voice Alert
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
