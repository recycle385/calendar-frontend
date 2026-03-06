import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarCreatePage from './pages/CalendarCreatePage';
import CalendarDetailPage from './pages/CalendarDetailPage';
import CalendarVotePage from './pages/CalendarVotePage';
import SignupPage from './pages/SignupPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { ProtectedRoute, PublicRoute } from './components/AuthRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/c/:slug" element={<CalendarDetailPage />} />
          <Route path="/c/:slug/vote" element={<CalendarVotePage />} />

          {/* Auth-only Routes for Unauthenticated Users */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Protected Routes for Authenticated Users */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/calendars/new" element={<ProtectedRoute><CalendarCreatePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
