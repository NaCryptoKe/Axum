import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import OtpVerificationPage from '../pages/auth/OtpVerificationPage';
import DashboardPage from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Catch-all for unauthenticated users */}
            {!user && <Route path="*" element={<Navigate to="/login" />} />}
            {/* Catch-all for authenticated users */}
            {user && <Route path="*" element={<Navigate to="/dashboard" />} />}
        </Routes>
    );
};

export default AppRoutes;
