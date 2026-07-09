import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SchedulePage from './pages/schedule/SchedulePage';
import ScheduleDetailPage from './pages/schedule/ScheduleDetailPage';
import ScheduleGeneratorPage from './pages/schedule/ScheduleGeneratorPage';
import UsersPage from './pages/users/UsersPage';
import MasterDataPage from './pages/masterdata/MasterDataPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Main Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/schedules" element={<SchedulePage />} />
              <Route path="/schedules/:id" element={<ScheduleDetailPage />} />
              <Route path="/schedules/:id/generate" element={<ScheduleGeneratorPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/master-data" element={<MasterDataPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
