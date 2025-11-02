import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // --- MOCK API CALL (http://localhost:3000/api/auth/login) ---
        console.log('API call to /api/auth/login initiated:', { identifier, password, rememberMe });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // MOCK Success:
            navigate('/profile');

        } catch (err) {
            setError('Invalid credentials or network error.');
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="form-container">
                <h1 className="form-title">Sign In</h1>
                <form onSubmit={handleLogin} className="form-body">

                    <div className="input-group">
                        <label htmlFor="identifier" className="input-label">Username / Email</label>
                        <input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your username or email" className="text-input" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="text-input" />
                    </div>

                    <div className="form-options">
                        <div className="checkbox-group">
                            <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="checkbox-input" />
                            <label htmlFor="remember-me" className="checkbox-label">Remember Me</label>
                        </div>

                        <Link to="/forgot-password" className="link-text">Forgot password?</Link>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading} className="primary-button">
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                <p className="secondary-link-text">
                    New user?{' '}
                    <Link to="/register" className="link-text">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;