import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile', { withCredentials: true });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (data) => {
    const res = await api.post('/auth/login', data, { withCredentials: true });
    setUser(res.data.user);
    navigate(`/@${res.data.user.username}`);
  };

  const register = async (data) => {
    try {
      // 1️⃣ Register the user
      const res = await api.post('/auth/register', data, { withCredentials: true });
      const newUser = res.data.user;

      const userId = res.data.user.id; // ✅ define userId here

      // 2️⃣ Generate OTP for this user
      const otpRes = await api.post('/auth/generate_otp', { user_id: userId });
      console.log('OTP generated for new user:', otpRes.data);

      setUser(newUser);
      // 3️⃣ Navigate to OTP verification page
      console.log('Navigating to OTP page for user:', userId);
      navigate(`/verify-otp/${userId}`);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      throw err; // so RegisterForm's alert works
    }
  };


  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true }); // clears cookie
    } catch { /* ignore */ }

    setUser(null);       // clears the cached user in React
    localStorage.removeItem('authToken'); // if you store tokens there
    navigate('/login');
};
console.log(`EDITED==================== ${user}`);

  return { user, login, register, logout };
};
