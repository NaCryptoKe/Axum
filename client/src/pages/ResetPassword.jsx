import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import PasswordStrength from '../components/PasswordStrength';
import './Login.css'; // Reusing styles from Login.css for consistency

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToasts();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post(`/password-reset/update-password/${token}`, { password });
            if (response.data.success) {
                toast.success('Password has been reset successfully. You can now log in.');
                navigate('/login');
            } else {
                const errorMessage = response.data.error?.details ? 
                    (Array.isArray(response.data.error.details) ? response.data.error.details.join(' ') : response.data.error.details)
                    : (response.data.message || 'Failed to reset password.');
                toast.error(errorMessage);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error?.details ? 
                (Array.isArray(err.response.data.error.details) ? err.response.data.error.details.join(' ') : err.response.data.error.details)
                : (err.response?.data?.message || 'An unexpected error occurred.');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <h1>Reset Password</h1>
                <p>Enter your new password below.</p>
                <form onSubmit={onSubmit}>
                    <div className="form-group password-group">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <span className="password-toggle-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? '🙈' : '👁️'}
                        </span>
                    </div>
                    <PasswordStrength password={password} />
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
