import React, { useState, useRef } from 'react';
import { useGlassEffect } from '../Navbar/useGlass';
import './LoginPage.css';
import api from '../../api/api';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTOS, setAgreeTOS] = useState(false);
    
    const cardRef = useRef(null);
    const filterRef = useRef(null);

    // Use the same "Apple" clarity settings from our previous discussion
    useGlassEffect(filterRef, {
        tintOpacity: 0.04,
        distortionStrength: 77,
        frostBlur: 4,
        outerShadowBlur: 25
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { identifier, password });
            localStorage.setItem('token', response.data.token);
            addToast("Welcome!", { type: 'success', subtitle: "Login successful." });
        } catch (error) {
            addToast("Login Failed", { type: 'error', subtitle: error.response?.data?.message || "Invalid credentials" });
        }
    };

    return (
        <div className="login-page-container">
            {/* The Glass Card */}
            <div className="login-card" ref={cardRef}>
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Please enter your details</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="identifier">Username or Email</label>
                        <input 
                            type="text" 
                            id="identifier" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. nahom@fedora"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="tos-row">
                        <label className="checkbox-container">
                            <input 
                                type="checkbox" 
                                checked={agreeTOS}
                                onChange={(e) => setAgreeTOS(e.target.checked)}
                                required
                            />
                            <span className="checkmark"></span>
                            I agree to the Terms of Service
                        </label>
                    </div>

                    <div className="forgot-password">
                        <a href="/forgot">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className="google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                    Sign in with Google
                </button>

                <div className="signup-footer">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </div>

            {/* SVG Filter for the card distortion */}
            <svg width="0" height="0" style={{ position: 'absolute' }} ref={filterRef}>
                <defs>
                    <filter id="login-glass-distortion">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="92" result="noise" />
                        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default LoginPage;