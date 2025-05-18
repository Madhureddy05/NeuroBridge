import * as React from "react"

export function Tabs({ children, className = "", ...props }) {
  return <div className={`tabs ${className}`} {...props}>{children}</div>
}

export function TabsList({ children, className = "", ...props }) {
  return <div className={`flex border-b ${className}`} {...props}>{children}</div>
}

export function TabsTrigger({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 text-gray-700 hover:text-blue-600 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, className = "", ...props }) {
  return <div className={`py-4 ${className}`} {...props}>{children}</div>
}