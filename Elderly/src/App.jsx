import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom'

import TimelinePage from './pages/timeline'
import VoiceMoodPage from './pages/VoiceMood'
import ReportsPage from './pages/Reports'
import NotificationsPage from './pages/Notifications'
import VoiceChatPage from './pages/VoiceChat'
import SignupLogin from './pages/Signup'
import Home from './pages/index'
import DashboardLayout from './components/ui/dashboard-layout'

function App() {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="/" element={<SignupLogin />} />
      {/* Optional redirect for legacy route */}
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />

      {/* Pages already wrap themselves in DashboardLayout */}
      <Route path="/home" element={<Home />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/voice-mood" element={ <DashboardLayout>
              <VoiceMoodPage />
            </DashboardLayout>} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/voice-chat" element={
         <DashboardLayout>
              <VoiceChatPage />
            </DashboardLayout>
      } />
    </Routes>
  )
}

export default App
