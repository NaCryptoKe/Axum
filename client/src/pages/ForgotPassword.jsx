import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import './Login.css';

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToasts();

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/password-reset/generate-password-reset', { identifier });
            // Always show a generic success message to prevent user enumeration
            toast.success('If an account with that email or username exists, a password reset link has been sent.');
        } catch (err) {
            // Even if it fails (e.g., user not found), show a generic success message.
            toast.success('If an account with that email or username exists, a password reset link has been sent.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <h1>Forgot Password</h1>
                <p>Enter your username or email and we'll send you a link to reset your password.</p>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username or Email"
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="toggle-auth" style={{ marginTop: '1.5rem' }}>
                    Remember your password? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
