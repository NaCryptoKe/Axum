import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute"

import LoginPage from "./routes/Login";
import RegisterPage from "./routes/Register";
import ProfilePage from "./routes/ProfilePage";
import VerifyOtpPage from "./routes/VerifyOTP";
import ForgotPassword from "./routes/ForgotPassword";
import ResetPasswordPage from "./routes/ResetPassword";
import Home from "./routes/Home";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* PUBLIC ROUTES - Anyone can see these */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/" element={<Home />} />

            {/* 404 - Page Not Found fallback */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}