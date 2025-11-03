import React from 'react';
import { Routes, Route } from "react-router-dom";

// --- Import All Pages ---
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OtpVerificationPage from "./pages/OtpVerificationPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx"; // Used for both /profile and /@:username

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Auth Flow Routes */}
            {/* The user ID is passed here after registration */}
            <Route path="/verify-otp/:userId" element={<OtpVerificationPage />} />

            {/* Authenticated/Profile Routes */}
            <Route 
                path="/:username" 
                element={
                    <ProfilePage />
                } 
            />
        </Routes>
    );
}

export default App;