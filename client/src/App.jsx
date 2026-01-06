import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerification from './pages/OtpVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './hello.css';;;
import './navbar.css';

function App() {
  const [isUserActive, setIsUserActive] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <Router>
      {/* Navbar stays here so it shows on every page */}
      <Navbar 
        isUserActive={isUserActive} 
        isVideoActive={isVideoActive} 
        isSearchFocused={isSearchFocused} 
        setIsSearchFocused={setIsSearchFocused} 
      /> 
      
      <Routes>
        <Route path="/" element={<Home 
          isUserActive={isUserActive} _
          isVideoActive={isVideoActive} 
          setIsUserActive={setIsUserActive} 
          setIsVideoActive={setIsVideoActive}
          isSearchFocused={isSearchFocused}
        />} />
        <Route path="/store" element={<Store />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;