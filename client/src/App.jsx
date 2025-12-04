import React from 'react';
import { Routes, Route } from "react-router-dom";

// --- Import All Pages ---
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OtpVerificationPage from "./pages/OtpVerificationPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify-otp/:userId" element={<OtpVerificationPage />} />
            <Route path="/:username" element={<ProfilePage />} />
        </Routes>

    );
}

export default App;