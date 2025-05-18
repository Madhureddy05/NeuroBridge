// src/lib/utils.js

/**
 * Joins class names conditionally.
 * Usage: cn("base", isActive && "active", isDisabled && "disabled")
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  /**
   * Capitalizes the first letter of a string.
   * Usage: capitalize("hello world") => "Hello world"
   */
  export function capitalize(str) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  /**
   * Formats a Date object or ISO string to readable format.
   * Usage: formatDate("2025-05-17") => "May 17, 2025"
   */
  export function formatDate(date) {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  