"use client"

import * as React from "react"
import { cn } from "../../lib/utils"




const Chart = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("w-full", className)} ref={ref} {...props}></div>
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props}></div>
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef(
  ({ className, labelFormatter, formatter, ...props }, ref) => {
    return (
      <div className={cn("p-2 bg-white border rounded-md shadow-md", className)} ref={ref} {...props}>
        {props.label && (
          <div className="font-semibold">
            {labelFormatter ? labelFormatter(props.label) : props.label}
          </div>
        )}
        {props.payload &&
          props.payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="mr-2">{item.name}</span>
              <span>
                {formatter ? formatter(item.value, item.name)[0] : item.value}
              </span>
            </div>
          ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = React.forwardRef(({ className, content, ...props }, ref) => {
  return (
    <div className={cn("", className)} ref={ref} {...props}>
      {content}
    </div>
  )
})
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent }
