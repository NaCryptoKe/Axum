import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

function RegisterPage() {
    const [form, setForm] = useState({
        email: '', username: '', display_name: '', password: '', confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
            if (error) setError('');
        };

        const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        const { username, email, display_name, password } = form;

        try {
            const res = await api.post('/auth/register', { username, email, display_name, password });
            console.log('Register response:', res.data);
            const user_id = res.data.user.id;
            await api.post('/auth/generate_otp', 
                {user_id}
            )
            navigate(`/verify-otp/${user_id}`); // optionally redirect after successful register
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Username or email may already be in use.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="page-wrapper">
            <div className="form-container">
                <h1 className="form-title">Create Account</h1>
                <form onSubmit={handleRegister} className="form-body">

                    <div className="input-group"><label htmlFor="email" className="input-label">Email</label>
                        <input name="email" type="email" required onChange={handleChange} placeholder="example@domain.com" className="text-input" />
                    </div>

                    <div className="input-group"><label htmlFor="username" className="input-label">Username</label>
                        <input name="username" type="text" required onChange={handleChange} placeholder="Unique identifier (3-30 chars)" className="text-input" />
                        <small className="input-hint">3-30 characters, letters, numbers, and underscores only.</small>
                    </div>

                    <div className="input-group"><label htmlFor="displayName" className="input-label">Display Name</label>
                        <input name="display_name" type="text" required onChange={handleChange} placeholder="The name others will see" className="text-input" />
                    </div>

                    <div className="input-group"><label htmlFor="password" className="input-label">Password</label>
                        <input name="password" type="password" required onChange={handleChange} placeholder="••••••••" className="text-input" />
                    </div>

                    <div className="input-group"><label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                        <input name="confirmPassword" type="password" required onChange={handleChange} placeholder="Re-enter password" className="text-input" />
                    </div>

                    <p>Capital Ltter</p>
                    <p>SMall Ltter</p>
                    <p>Special character</p>
                    <p>numbre</p>
                    <p>length atleast 8</p>
                    <h4>Caps on</h4>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading} className="primary-button">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="secondary-link-text">
                    Already have an account?{' '}
                    <Link to="/login" className="link-text">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;