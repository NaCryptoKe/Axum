import React, { useState, useEffect } from 'react';
import Button from './Button';
import './LoginModal.css'; // Reusing Login styles for identical look

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
    const [status, setStatus] = useState('closed');
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });

    useEffect(() => {
        if (isOpen) {
            setStatus('opening');
            setTimeout(() => setStatus('active'), 10);
            document.body.style.overflow = 'hidden';
        } else if (status === 'active' || status === 'opening') {
            setStatus('closing');
            const timer = setTimeout(() => setStatus('closed'), 600);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (status === 'closed') return null;

    const isFormValid = formData.firstName && formData.email && formData.password.length >= 6 && <formData className="lastNam"></formData> && formData.username;

    return (
        <div className={`login-overlay ${status === 'active' ? 'active' : ''} ${status === 'closing' ? 'closing' : ''}`} onClick={onClose}>
            <div className={`login-glass-card ${status}`} onClick={(e) => e.stopPropagation()}>
                <button className="login-close-x" onClick={onClose}>✕</button>
                
                <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Join us for the full experience</p>
                </div>

                <div className="login-content-wrapper">
                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="input-group" style={{ width: '50%' }}>
                                <label>First Name</label>
                                <input type="text" placeholder="John" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ width: '50%' }}>
                                <label>Last Name</label>
                                <input type="text" placeholder="Doe" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="input-group">
                            <label>Username</label>
                            <input type="username" placeholder="jhon_doe" onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <Button 
                            color={isFormValid ? "#0071e3" : "rgba(255, 255, 255, 0.1)"} 
                            className={`login-submit-btn ${!isFormValid ? 'disabled' : ''}`}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="divider"><span>OR</span></div>

                    <Button color="white" className="google-btn" onClick={() => {}}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
                        <span>Sign up with Google</span>
                    </Button>

                    <p className="register-footer">
                        Already have an account? <span onClick={onLoginClick}>Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;