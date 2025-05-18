// Function to get all memories
export const getMemories = async () => {
  try {
    const response = await fetch("/api/memories")
    if (!response.ok) {
      throw new Error("Failed to fetch memories")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching memories:", error)
    return {}
  }
}

// Function to extract facts from text
export const extractFacts = async (text) => {
  try {
    const response = await fetch("/api/extract-facts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) {
      throw new Error("Failed to extract facts")
    }
    return await response.json()
  } catch (error) {
    console.error("Error extracting facts:", error)
    return {}
  }
}

// Function to analyze text for sentiment, confusion, and emergency
export const analyzeText = async (text) => {
  try {
    const response = await fetch("/api/analyze-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) {
      throw new Error("Failed to analyze text")
    }
    return await response.json()
  } catch (error) {
    console.error("Error analyzing text:", error)
    return {
      sentiment: "neutral",
      confusion_detected: false,
      emergency_detected: false,
    }
  }
}

// Function to log an event
export const logEvent = async (sentiment, confusion, emergency) => {
  try {
    await fetch("/api/log-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sentiment, confusion, emergency }),
    })
  } catch (error) {
    console.error("Error logging event:", error)
  }
}

// Function to get event logs
export const getEventLogs = async () => {
  try {
    const response = await fetch("/api/event-logs")
    if (!response.ok) {
      throw new Error("Failed to fetch event logs")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching event logs:", error)
    return []
  }
}
