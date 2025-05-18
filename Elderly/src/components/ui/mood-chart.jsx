import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function MoodChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Format dates for display
    const labels = sortedData.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    // Convert sentiment to numeric value
    const values = sortedData.map((item) => {
      switch (item.sentiment) {
        case "positive":
          return 1
        case "neutral":
          return 0
        case "negative":
          return -1
        default:
          return 0
      }
    })

    // Create gradient for background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.5)") // Green for positive
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.5)") // Blue for neutral
    gradient.addColorStop(1, "rgba(239, 68, 68, 0.5)") // Red for negative

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Mood",
            data: values,
            borderColor: "#6366f1",
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: (context) => {
              const value = context.dataset.data[context.dataIndex]
              return value > 0 ? "#22c55e" : value < 0 ? "#ef4444" : "#3b82f6"
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y
                return value > 0 ? "Positive" : value < 0 ? "Negative" : "Neutral"
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            min: -1.5,
            max: 1.5,
            ticks: {
              callback: (value) => {
                if (value === 1) return "Positive"
                if (value === 0) return "Neutral"
                if (value === -1) return "Negative"
                return ""
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
