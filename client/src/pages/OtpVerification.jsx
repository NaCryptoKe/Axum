import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import './OtpVerification.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const toast = useToasts();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (userId && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [userId]);

  const handleSubmit = async (otpString) => {
    setLoading(true);
    if (!userId) {
      toast.error('User ID not found. Please register again.');
      setLoading(false);
      navigate('/register');
      return;
    }

    try {
      const response = await api.post('/auth/verify-otp', { user_id: userId, otp: otpString });
      if (response.data.success) {
        toast.success('Email verified successfully!');
        navigate(`/@${response.data.data.user.username}`);
      } else {
        toast.error(response.data.error?.details || 'An unknown error occurred during OTP verification.');
        setOtp(new Array(6).fill(''));
        inputRefs.current[0].focus();
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.details || 'An unexpected error occurred. Please try again.');
      setOtp(new Array(6).fill(''));
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-submit if all fields are filled
    const otpString = newOtp.join('');
    if (otpString.length === 6) {
      handleSubmit(otpString);
    } else if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (isNaN(paste) || paste.length !== 6) return;
    const newOtp = paste.split('');
    setOtp(newOtp);
    handleSubmit(paste);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await api.post('/auth/generate-otp', { user_id: userId });
      toast.success('A new OTP has been sent to your email.');
      setCountdown(300);
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="otp-verification-container">
      <div className="overlay">
        <h1>Verify Your Email</h1>
        <p>Enter the 6-digit OTP sent to your email address.</p>
        <div className="otp-input-fields" onPaste={handlePaste}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              className="otp-input"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => (inputRefs.current[index] = el)}
              disabled={loading}
            />
          ))}
        </div>
        <div className="resend-otp">
          <button onClick={handleResendOtp} className="btn-link" disabled={countdown > 0}>
            Resend OTP {countdown > 0 ? `(${formatTime(countdown)})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

