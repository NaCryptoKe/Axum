import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import OtpVerificationPage from '../pages/auth/OtpVerificationPage';
import DashboardPage from '../pages/Dashboard';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import HomePage from '../pages/Home';
import ProfilePage from '../pages/Profile';
import EditProfilePage from '../pages/EditProfile';
import CreateOrganizationPage from '../pages/CreateOrgPage';
import OrganizationPage from '../pages/OrgPage';
import ProtectedRoute from './ProtectedRoute';
import UploadGamePage from '../pages/UploadGame';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/edit-profile/:username" element={<EditProfilePage />} />
            <Route path="/org/register" element={<CreateOrganizationPage />} />
            <Route path="/org/:slug" element={<OrganizationPage />} />
            <Route path="/orgs/:slug/upload-game" element={<UploadGamePage />} />

            <Route path="/" element={<HomePage />} />

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
