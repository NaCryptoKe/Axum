import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [form, setForm] = useState({
        email: '', username: '', displayName: '', password: '', confirmPassword: '',
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
        setError('');
        setLoading(true);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // --- MOCK API CALL (http://localhost:3000/api/auth/register) ---
        console.log('API call to /api/auth/register initiated:', form);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // MOCK Success: Redirect to OTP page (passing a mock ID)
            navigate('/verify-otp/new_user_id_123');

        } catch (err) {
            setError('Registration failed. Username or email may already be in use.');
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
                        <input name="displayName" type="text" required onChange={handleChange} placeholder="The name others will see" className="text-input" />
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