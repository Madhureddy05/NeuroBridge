import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../ui/dropdown-menu"
import { Bell, User } from "lucide-react" // You can use Heroicons or your preferred icon set

export function Navbar({ onMenuClick }) {
  return (
    <header className="bg-white text-gray-800 px-4 py-3 shadow flex items-center justify-between">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={onMenuClick}
        className="text-gray-700 hover:text-gray-900 focus:outline-none lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold">Care Dashboard</h1>

      {/* Right-side icons */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        {/* Profile Icon Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <User className="w-6 h-6 text-gray-700 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 w-48">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:bg-red-50">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
