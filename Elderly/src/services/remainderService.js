// Function to get all reminders
export const getReminders = async () => {
  try {
    const response = await fetch("/api/reminders")
    if (!response.ok) {
      throw new Error("Failed to fetch reminders")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return []
  }
}

// Function to add a reminder
export const addReminder = async (text, time, type, date) => {
  try {
    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        time,
        type,
        date,
      }),
    })
    if (!response.ok) {
      throw new Error("Failed to add reminder")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding reminder:", error)
    return null
  }
}

// Function to mark a reminder as completed
export const markReminderAsCompleted = async (id) => {
  try {
    await fetch(`/api/reminders/${id}/complete`, {
      method: "POST",
    })
  } catch (error) {
    console.error("Error marking reminder as completed:", error)
  }
}

// Function to delete a reminder
export const deleteReminder = async (id) => {
  try {
    await fetch(`/api/reminders/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Error deleting reminder:", error)
  }
}

// Function to get due reminders
export const getDueReminders = async () => {
  try {
    const response = await fetch("/api/reminders/due")
    if (!response.ok) {
      throw new Error("Failed to fetch due reminders")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching due reminders:", error)
    return []
  }
}

// Function to extract reminders from text
export const extractRemindersFromText = async (text) => {
  try {
    const response = await fetch("/api/extract-reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) {
      throw new Error("Failed to extract reminders")
    }
    return await response.json()
  } catch (error) {
    console.error("Error extracting reminders:", error)
    return []
  }
}
