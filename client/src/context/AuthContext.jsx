// src/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch profile on initial load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile', { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  // --- All your auth functions ---
  
  const login = async (data) => {
    const res = await api.post('/auth/login', data, { withCredentials: true });
    setUser(res.data.user);
    navigate(`/@${res.data.user.username}`);
  };

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data, { withCredentials: true });
      const userId = res.data.user.id;
      await api.post('/auth/generate_otp', { user_id: userId });
      
      setUser(res.data.user);
      navigate(`/verify-otp/${userId}`);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch { /* ignore */ }
    setUser(null);
    navigate('/login');
  };

  // 3. Provide the state and functions to children
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create the custom hook that *consumes* the context
export const useAuth = () => {
  return useContext(AuthContext);
};