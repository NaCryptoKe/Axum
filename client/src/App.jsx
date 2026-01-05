import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerification from './pages/OtpVerification';
import './hello.css';;;
import './navbar.css';

function App() {
  const [isUserActive, setIsUserActive] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(false);

  return (
    <Router>
      {/* Navbar stays here so it shows on every page */}
      <Navbar isUserActive={isUserActive} isVideoActive={isVideoActive}/> 
      
      <Routes>
        <Route path="/" element={<Home isUserActive={isUserActive} isVideoActive={isVideoActive} setIsUserActive={setIsUserActive} setIsVideoActive={setIsVideoActive}/>} />
        <Route path="/store" element={<Store />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
      </Routes>
    </Router>
  );
}

export default App;