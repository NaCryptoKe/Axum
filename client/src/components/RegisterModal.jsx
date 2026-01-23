import React, { useState, useEffect } from 'react';
import Button from './Button';
import './LoginModal.css'; // Reusing Login styles for identical look
import { useToast } from './Toast/useToast';
import api from '../api/api';

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
    const [status, setStatus] = useState('closed');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setStatus('opening');
            setTimeout(() => setStatus('active'), 10);
            document.body.style.overflow = 'hidden';
        } else if (status === 'active' || status === 'opening') {
            setStatus('closing');
            const timer = setTimeout(() => {
                setStatus('closed');
                document.body.style.overflow = 'auto';
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            addToast("Form Invalid", { type: 'error', subtitle: "Please fill all fields correctly." });
            return;
        }
        try {
            const response = await api.post('/auth/register', {
                firstname: formData.firstName,
                lastname: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            addToast("Registration Successful", { type: 'success', subtitle: "Please login to continue." });
            onLoginClick();
        } catch (error) {
            addToast("Registration Failed", { type: 'error', subtitle: error.response?.data?.message || "An unexpected error occurred." });
        }
    };

    if (status === 'closed') return null;

    const isFormValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.username &&
        formData.password.length >= 6;

    return (
        <div className={`login-overlay ${status === 'active' ? 'active' : ''} ${status === 'closing' ? 'closing' : ''}`} onClick={onClose}>
            <div className={`login-glass-card ${status}`} onClick={(e) => e.stopPropagation()}>
                <button className="login-close-x" onClick={onClose}>✕</button>

                <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Join us for the full experience</p>
                </div>

                <div className="login-content-wrapper">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="input-group" style={{ width: '50%' }}>
                                <label>First Name</label>
                                <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="input-group" style={{ width: '50%' }}>
                                <label>Last Name</label>
                                <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="jhon_doe" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                        </div>

                        <Button
                            color={isFormValid ? "#0071e3" : "rgba(255, 255, 255, 0.1)"}
                            className={`login-submit-btn ${!isFormValid ? 'disabled' : ''}`}
                            type="submit"
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