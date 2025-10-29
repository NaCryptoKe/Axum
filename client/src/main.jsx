import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/Register';
import LoginForm from './pages/Login';
import Profile from './pages/Profile';
import OtpVerificationWrapper from './pages/OTP';
import './css/i.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/@:username" element={<Profile />} />
      <Route path="/:username" element={<Profile />} />
      <Route path="/verify-otp/:userId" element={<OtpVerificationWrapper />} />
    </Routes>
  </BrowserRouter>
);
