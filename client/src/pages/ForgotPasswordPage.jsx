import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!identifier) {
            setError('Please enter your username or email.');
            setLoading(false);
            return;
        }

        // --- MOCK API CALL ---
        console.log('API call to /api/auth/forgot-password initiated:', identifier);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // SECURITY CRITICAL: Generic success message
            setMessage('If an account exists, a password reset link has been sent to the associated email.');

        } catch (err) {
            setMessage('Could not send the reset link due to a server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="form-container">
                <h1 className="form-title">Reset Password</h1>
                <p className="form-instruction">
                    Enter your username or email and we'll send a recovery link.
                </p>
                <form onSubmit={handleSubmit} className="form-body">

                    <div className="input-group">
                        <label htmlFor="identifier" className="input-label">Username / Email</label>
                        <input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Your username or email" className="text-input" />
                    </div>

                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading} className="primary-button">
                        {loading ? 'Sending Request...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="secondary-link-text">
                    <Link to="/login" className="link-text">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;