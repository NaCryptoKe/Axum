import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import PasswordStrength from '../components/PasswordStrength';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: 'Tester',
    lastname: 'uSeR',
    username: 'test__',
    email: 'tester@gmail.com',
    password: 'SecurePassword123! @#',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToasts();
  const navigate = useNavigate();

  const { firstname, lastname, username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
          ...formData,
          email: formData.email.replace(/\s/g, '')
      });

      if (response.data.success) {
        const userId = response.data.data.id;
                await api.post('/auth/generate-otp', { user_id: userId });
        toast.success('Registration successful! Please check your email for the OTP.');
        navigate('/otp-verification', { state: { userId } });
      } else {
        const { error } = response.data;
        if (error && error.details) {
            toast.error(error.details);
        } else {
            toast.error('An unknown error occurred during registration.');
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
    <div className="register-container">
      <h1>Sign Up</h1>
      <p>Create your account</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="First Name" name="firstname" value={firstname} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Last Name" name="lastname" value={lastname} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        <PasswordStrength password={password} />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="divider">OR</div>

      <button className="btn btn-google" onClick={handleGoogleSignIn}>
        Sign up with Google
      </button>
    </div>
  );
};

export default Register;
