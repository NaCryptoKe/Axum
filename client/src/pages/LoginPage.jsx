import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/page.css'

import NavbarComponent from '../Components/NavbarComponent.jsx';
import ButtonComponent from '../Components/ButtonComponent.jsx';
import InputFieldComponent from '../Components/InputFieldComponent.jsx';

/* Image Imports */
import googleLogo from '../assets/google-logo.svg';


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

        try {
            const res = await api.post('/auth/login', 
                { identifier, password, rememberMe });
            console.log('Login Response:', res.data.user.username);
            navigate(`/@${res.data.user.username}`);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Network Error');
        } finally {
            setLoading (false);
        }
    };

    return (
        <>
            <NavbarComponent/>

            <div className="page-wrapper">
                <form onSubmit={handleLogin} className="form-body">
                    <InputFieldComponent type="text" placeholder="Username or Email" required={true}/>
                    <InputFieldComponent type="password" placeholder="Password" required={true}/>

                    <Link to="/forgot-password" className="link-text">Forgot password?</Link>

                    {error && <p className="error-message">{error}</p>}

                    <ButtonComponent children="Login" variant="primary" onClick={handleLogin} disabled={false}/>
                    <div className="oauth">
                        <ButtonComponent children={<img src={googleLogo} alt="google login image"/>}
                                         variant="primary" onClick={handleLogin} disabled={false}/>
                        <ButtonComponent children={<img src={googleLogo} alt="google login image"/>}
                                         variant="primary" onClick={handleLogin} disabled={false}/>
                        <ButtonComponent children={<img src={googleLogo} alt="google login image"/>}
                                         variant="primary" onClick={handleLogin} disabled={false}/>
                    </div>

                    <p className="secondary-link-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="link-text">Create an account</Link>
                    </p>
                </form>
            </div>
        </>

    );
}

export default LoginPage;