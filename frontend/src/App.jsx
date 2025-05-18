import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import Navbar from "./components/navbar";
import ModeToggle from "./components/mode-toggle";

// Pages
import HomePage from "./pages/home";
import JournalPage from "./app/journal/page";
import ExercisesPage from "./app/exercises/page";
import ChatPage from "./app/chat/page";
import GamesPage from "./app/games/page";
import CalendarPage from "./app/calendar/page";
import ReportsPage from "./app/reports/page";
import ProfilePage from "./app/profile/page";
import SignupPage from "./pages/signup";


// Firebase Auth context
import { AuthProvider, useAuth } from "./contexts/auth-context";

import "./index.css";
import { ToastProvider } from "./components/ui/use-toast";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

function AppContent() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine if navbar should be shown
  const hideNavbarRoutes = ["/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname.toLowerCase());

  return (
    <>
      {shouldShowNavbar && (
        <>
          <Navbar />
          <ModeToggle />
        </>
      )}

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
  <Route path="/" element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } />
        <Route
          path="/journal"
          element={
            <ToastProvider>
              <JournalPage />
            </ToastProvider>
          }
        />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <ExercisesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/" element={<SignupPage />} />

        {/* Catch-all route - redirect to home or 404 page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
