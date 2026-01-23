import React, { useState, useEffect } from 'react';
import Button from './Button';
import './LoginModal.css';
import { useToast } from './Toast/useToast';
import api from '../api/api';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const [status, setStatus] = useState('closed'); 
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setStatus('opening');
            setTimeout(() => setStatus('active'), 10);
            document.body.style.overflow = 'hidden';
        } else if (status === 'active' || status === 'opening') {
            // When isOpen is toggled to false by parent, trigger closing animation
            setStatus('closing');
            const timer = setTimeout(() => {
                setStatus('closed');
                document.body.style.overflow = 'auto';
            }, 600); // Duration of the CSS transition
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose(); // Just tell the parent to close; useEffect handles the animation
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            const response = await api.post('/auth/login', { identifier, password });
            localStorage.setItem('token', response.data.data.token);
            addToast("Login Successful", { type: 'success', subtitle: "Welcome back!" });
            onClose();
            setTimeout(() => {
                window.location.reload(); // Refresh to update logged-in state
            }, 1500);
        } catch (error) {
            addToast("Login Failed", { type: 'error', subtitle: error.response?.data?.message || "Invalid credentials." });
        }
    };

    if (status === 'closed') return null;

    const isFormValid = identifier.length > 0 && password.length > 0;

    return (
        <div className={`login-overlay ${status === 'active' ? 'active' : ''} ${status === 'closing' ? 'closing' : ''}`} onClick={handleClose}>
            <div className={`login-glass-card ${status}`} onClick={(e) => e.stopPropagation()}>
                <button className="login-close-x" onClick={handleClose}>✕</button>
                
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Login to your account to continue</p>
                </div>

                <div className="login-content-wrapper">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email or Username</label>
                            <input type="text" placeholder="Enter your identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label>Password</label>
                                <span className="forgot-link">Forgot password?</span>
                            </div>
                            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <Button 
                            type="submit"
                            color={isFormValid ? "#0071e3" : "rgba(255, 255, 255, 0.1)"} 
                            className={`login-submit-btn ${!isFormValid ? 'disabled' : ''}`}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="divider"><span>OR</span></div>

                    <Button color="rgba(255, 255, 255, 1)" className="google-btn" onClick={() => {}}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                        <span>Continue with Google</span>
                    </Button>

                    <p className="register-footer">
                        Don't have an account? <span onClick={onRegisterClick}>Register now</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;