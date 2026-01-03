import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToasts();
  const navigate = useNavigate();

  const { identifier, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);

      if (response.data.success) {
        toast.success('Login successful!');
        navigate('/'); // Redirect to home page on successful login
      } else {
        // This case might not be hit if backend always returns non-2xx on error
        const { error } = response.data;
        if (error && error.details) {
            toast.error(error.details);
        } else {
            toast.error('An unknown error occurred during login.');
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

  const handleGoogleSignIn = () => {
      window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="login-container">
      <h1>Sign In</h1>
      <p>Access your account</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Username or Email" name="identifier" value={identifier} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="divider">OR</div>

      <button className="btn btn-google" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>

      <p className="toggle-auth">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;