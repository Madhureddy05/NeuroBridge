import { NavLink } from "react-router-dom"
import {
  HomeIcon,
  BarChart2Icon,
  MicIcon,
  SmileIcon,
  BellIcon,
} from "lucide-react"

export function Sidebar({ open }) {
  const navItems = [
    { path: "/", name: "Home", icon: <HomeIcon className="w-5 h-5" /> },
    { path: "/timeline", name: "Timeline", icon: <BarChart2Icon className="w-5 h-5" /> },
    { path: "/voice-chat", name: "Voice Chat", icon: <MicIcon className="w-5 h-5" /> },
    { path: "/voice-mood", name: "Voice Mood", icon: <SmileIcon className="w-5 h-5" /> },
    { path: "/notifications", name: "Notifications", icon: <BellIcon className="w-5 h-5" /> },
    { path: "/reports", name: "Reports", icon: <BarChart2Icon className="w-5 h-5" /> },
  ]

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } transition-all duration-300 bg-white shadow-md h-full`}
    >
      <div className="p-4 text-xl font-bold text-gray-800">
        {open ? "Dashboard" : "D"}
      </div>
      <nav className="flex flex-col space-y-2 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {open && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
