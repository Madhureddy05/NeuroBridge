import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function ConfusionChart({ data }) {
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

    // Convert confusion to numeric value (0 or 1)
    const values = sortedData.map((item) => (item.confusion ? 1 : 0))

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Confusion Events",
            data: values,
            backgroundColor: (context) => {
              const value = context.dataset.data[context.dataIndex]
              return value > 0 ? "rgba(234, 179, 8, 0.7)" : "rgba(234, 179, 8, 0.1)"
            },
            borderColor: (context) => {
              const value = context.dataset.data[context.dataIndex]
              return value > 0 ? "rgb(234, 179, 8)" : "rgba(234, 179, 8, 0.3)"
            },
            borderWidth: 1,
            borderRadius: 4,
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
                return value > 0 ? "Confusion detected" : "No confusion"
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
            min: 0,
            max: 1,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                if (value === 1) return "Yes"
                if (value === 0) return "No"
                return ""
              },
            },
            title: {
              display: true,
              text: "Confusion Detected",
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
