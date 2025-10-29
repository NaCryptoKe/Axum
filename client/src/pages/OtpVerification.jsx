import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Axios instance

function OtpVerification({ userId }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify_otp', { user_id: userId, otp });
      if (res.data.success) {
        navigate(`/@${res.data.username}`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Server error, try again later.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Email Verification</h2>
      <p>Enter the OTP sent to your email.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
          maxLength={6}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Verify OTP
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  );
}

export default OtpVerification;
