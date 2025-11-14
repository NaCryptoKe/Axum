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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', {
                identifier: identifier,
                password: password,
            });

            console.log(response.data);
            console.log(response.data.data.user.name);

            setName(response.data.data.user.name);
            //navigate(`/@${name}`);

        } catch (error) {
            console.error("Login failed:", error.response.data);

            const errorMessage = error.response?.data?.error.details || 'Login failed. Please try again.';
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarComponent/>

            <div className="page-wrapper">
                <form onSubmit={handleLogin} className="form-body">
                    <InputFieldComponent
                        type="text"
                        placeholder="Username or Email"
                        required={true}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <InputFieldComponent
                        type="password"
                        placeholder="Password"
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Link to="/forgot-password" className="link-text">Forgot password?</Link>

                    {error && <p className="error-message">{error}</p>}

                    <ButtonComponent
                        children={loading ? "Logging in..." : "Login"}
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    />
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
                    <p>
                        {name === "" ? "" : `You are: ${name}`}
                    </p>
                </form>
            </div>
        </>

    );
}

export default LoginPage;