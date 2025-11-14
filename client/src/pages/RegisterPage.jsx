import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/page.css'

import NavbarComponent from "../Components/NavbarComponent.jsx";
import InputFieldComponent from "../Components/InputFieldComponent.jsx";
import ButtonComponent from "../Components/ButtonComponent.jsx";

import googleImage from "../assets/google-logo.svg";

const RegisterPage = () =>{
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [correctPassword, setCorrectPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState("");


    const handleSignup = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if(password !== confirmPassword){
                throw new Error("Passwords don't match");
            }


            const response = await api.post('/auth/register', {
                firstname: firstName,
                lastname: lastName,
                username: username,
                email: email,
                password: password,
            });

            console.log(response.data);

        } catch (error) {
            console.error("Login failed:", error.response.data);

            const errorMessage = error.response?.data?.error.details || 'Login failed. Please try again.';
            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <NavbarComponent />
            <div className="signup-wrapper">
                <form onSubmit={handleSignup}>
                    <div className="data-inputs">
                        <InputFieldComponent
                        type="text"
                        placeholder="First Name"
                        required={true}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        />

                        <InputFieldComponent
                            type="text"
                            placeholder="Last Name"
                            required={true}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <InputFieldComponent
                            type="text"
                            placeholder="User Name"
                            required={true}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <InputFieldComponent
                            type="text"
                            placeholder="Email"
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputFieldComponent
                            type="password"
                            placeholder="Password"
                            required={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputFieldComponent
                            type="password"
                            placeholder="Confirm Password"
                            required={true}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="checkboxes">
                        <div className="check-box">
                            <InputFieldComponent
                                type="checkbox"
                                required={true}
                            />
                            <label>I have read the terms and conditions and accept them</label>
                        </div>
                        <div className="check-box">
                            <InputFieldComponent
                                type="checkbox"
                            />
                            <label>Send me updates via email (Optional)</label>
                        </div>
                    </div>

                    <div className="register">
                        <div className="register-button">
                            <ButtonComponent
                                children="REGISTR"
                                variant="primary"
                                onClick={() => navigate('/register')}
                                disabled={loading}
                                type="submit"
                            />
                        </div>

                        <div className="simple-register">
                            <ButtonComponent
                                children={<img src={googleImage} alt="google Image"/>}
                                variant="secondary"
                                onClick={() => navigate('/register')}
                                disabled={loading}
                                type="submit"
                            />
                            <ButtonComponent
                                children={<img src={googleImage} alt="google Image"/>}
                                variant="secondary"
                                onClick={() => navigate('/register')}
                                disabled={loading}
                                type="submit"
                            />
                            <ButtonComponent
                                children={<img src={googleImage} alt="google Image"/>}
                                variant="secondary"
                                onClick={() => navigate('/register')}
                                disabled={loading}
                                type="submit"
                            />
                        </div>
                    </div>

                    <p>Already have an account login</p>

                </form>
            </div>
        </>
    )
}

export default RegisterPage;