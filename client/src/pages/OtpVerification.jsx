import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import './OtpVerification.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToasts();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const onChange = e => setOtp(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      toast.error('User ID not found. Please register again.');
      setLoading(false);
      navigate('/register');
      return;
    }

    try {
            const response = await api.post('/auth/verify-otp', { user_id: userId, otp });

      if (response.data.success) {
        toast.success('Email verified successfully! You can now log in.');
        navigate('/login');
      } else {
        const { error } = response.data;
        if (error && error.details) {
            toast.error(error.details);
        } else {
            toast.error('An unknown error occurred during OTP verification.');
        }
      }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.details) {
            toast.error(err.response.data.error.details);
        } else {
            toast.error('An unexpected error occurred. Please try again.');
        }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
                await api.post('/auth/generate-otp', { user_id: userId });
        toast.success('A new OTP has been sent to your email.');
    } catch (err) {
        toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="otp-verification-container">
      <h1>Verify Your Email</h1>
      <p>Enter the OTP sent to your email address.</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Enter OTP" name="otp" value={otp} onChange={onChange} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      <div className="resend-otp">
        <button onClick={handleResendOtp} className="btn-link">Resend OTP</button>
      </div>
    </div>
  );
};

export default OtpVerification;
