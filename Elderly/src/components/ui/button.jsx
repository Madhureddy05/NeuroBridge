import * as React from "react"

export const Button = React.forwardRef(({ children, className = "", variant = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "text-blue-600 hover:underline",
  }

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"