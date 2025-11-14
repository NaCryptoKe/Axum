import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/page.css'

import NavbarComponent from '../Components/NavbarComponent.jsx';
import ButtonComponent from '../Components/ButtonComponent.jsx';
import InputFieldComponent from '../Components/InputFieldComponent.jsx';

/* Image Imports */
import googleLogo from '../assets/google-logo.svg';


const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', {
                identifier: identifier,
                password: password,
            });

            alert(response.data.message);
            console.log(response.data);

        } catch (error) {
            console.error("Login failed:", error.response?.data?.error);

            const errorMessage = error.response?.data?.error.details || 'Login failed. Please try again.';
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarComponent/>

            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <InputFieldComponent
                        type="text"
                        placeholder="Username or Email"
                        required={true}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        variant="text"
                    />

                    <div className="password">
                        <InputFieldComponent
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="text"
                        />

                        <ButtonComponent
                            children={showPassword ? '👁️' : '🔒'}
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            variant="show"
                        />
                    </div>

                    <ButtonComponent
                        children="Forgot password?"
                        type="button"
                        variant="link"
                        disabled={loading}
                    />

                    <ButtonComponent
                        children={loading ? "LOGGING IN..." : "LOGIN"}
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    />
                    <div className="oauth">
                        <ButtonComponent
                            children={<img src={googleLogo} alt="google login image"/>}
                            variant="easy-access"
                            disabled={loading}/>
                        <ButtonComponent
                            children={<img src={googleLogo} alt="google login image"/>}
                            variant="easy-access"
                            disabled={loading}/>
                        <ButtonComponent
                            children={<img src={googleLogo} alt="google login image"/>}
                            variant="easy-access"
                            disabled={loading}/>
                    </div>

                    <ButtonComponent
                        children="Don't have an account? Create an account"
                        type="button"
                        variant="create"
                        disabled={loading}
                        onClick={() => navigate('/register')}
                    />
                </form>
            </div>
        </>

    );
}

export default LoginPage;