import { Link, useLocation } from "react-router-dom"
import { Home, MessageSquare, BarChart2, Settings, User, Bell } from "lucide-react"

export default function DashboardLayout({ children }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold text-blue-600">ElderCare AI</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/home" className={`flex items-center p-3 rounded-lg ${isActive("/")}`}>
                  <Home className="w-5 h-5 mr-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/voice-chat" className={`flex items-center p-3 rounded-lg ${isActive("/voice-chat")}`}>
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>Voice Chat</span>
                </Link>
              </li>
              <li>
                <Link to="/voice-mood" className={`flex items-center p-3 rounded-lg ${isActive("/mood")}`}>
                  <User className="w-5 h-5 mr-3" />
                  <span>Mood Tracking</span>
                </Link>
              </li>
              <li>
                <Link to="/timeline" className={`flex items-center p-3 rounded-lg ${isActive("/timeline")}`}>
                  <User className="w-5 h-5 mr-3" />
                  <span>Timeline</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className={`flex items-center p-3 rounded-lg ${isActive("/reports")}`}>
                  <BarChart2 className="w-5 h-5 mr-3" />
                  <span>Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications" className={`flex items-center p-3 rounded-lg ${isActive("/notifications")}`}>
                  <Bell className="w-5 h-5 mr-3" />
                  <span>Notifications</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100`}>
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-blue-600">ElderCare AI</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/notifications" className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">U</div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
