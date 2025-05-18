// Function to get all notifications
export const getNotifications = async () => {
  try {
    const response = await fetch("/api/notifications")
    if (!response.ok) {
      throw new Error("Failed to fetch notifications")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

// Function to mark a notification as read
export const markNotificationAsRead = async (id) => {
  try {
    await fetch(`/api/notifications/${id}/read`, {
      method: "POST",
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    await fetch("/api/notifications/read-all", {
      method: "POST",
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
  }
}

// Function to get notification settings
export const getNotificationSettings = async () => {
  try {
    const response = await fetch("/api/notification-settings")
    if (!response.ok) {
      throw new Error("Failed to fetch notification settings")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return {
      visualAlerts: true,
      soundAlerts: true,
      medicationReminders: true,
      appointmentReminders: true,
      dailyActivities: true,
      reminderVoice: "female",
    }
  }
}

// Function to update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    await fetch("/api/notification-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
  } catch (error) {
    console.error("Error updating notification settings:", error)
  }
}

// Function to create a notification
export const createNotification = async (title, description, type) => {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        type,
      }),
    })
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}

// Function to play notification sound
export const playNotificationSound = async () => {
  try {
    const settings = await getNotificationSettings()
    if (settings.soundAlerts) {
      const audio = new Audio("/notification-sound.mp3")
      await audio.play()
    }
  } catch (error) {
    console.error("Error playing notification sound:", error)
  }
}

// Function to speak notification
export const speakNotification = async (text) => {
  try {
    const settings = await getNotificationSettings()
    if (settings.soundAlerts) {
      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice based on settings
      const voices = window.speechSynthesis.getVoices()
      const femaleVoices = voices.filter((voice) => voice.name.includes("female") || voice.name.includes("Female"))
      const maleVoices = voices.filter((voice) => voice.name.includes("male") || voice.name.includes("Male"))

      if (settings.reminderVoice === "female" && femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0]
      } else if (settings.reminderVoice === "male" && maleVoices.length > 0) {
        utterance.voice = maleVoices[0]
      }

      window.speechSynthesis.speak(utterance)
    }
  } catch (error) {
    console.error("Error speaking notification:", error)
  }
}
