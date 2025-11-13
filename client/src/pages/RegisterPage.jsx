import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

function RegisterPage() {
    const [form, setForm] = useState({ firstname: '', lastname: '',
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

        const { firstname, lastname, username, email, display_name, password } = form;

        console.log(`Firsname: ${firstname}\nLastname: ${lastname}\nUsername: ${username}\nEmail: ${email}\nDisplay Name: ${display_name}\nPassword: ${password}`);

        setTimeout(() => {
            console.log("Simulating Registration");
            setLoading(false);
        }, 5000);
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