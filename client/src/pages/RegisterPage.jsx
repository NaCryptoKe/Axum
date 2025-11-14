import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/page.css'

import NavbarComponent from "../Components/NavbarComponent.jsx";
import InputFieldComponent from "../Components/InputFieldComponent.jsx";
import ButtonComponent from "../Components/ButtonComponent.jsx";

import googleImage from "../assets/google-logo.svg";

const RegisterPage = () =>{
    const [firstName, setFirstName] = useState('Bash');
    const [lastName, setLastName] = useState('Bash');
    const [username, setUsername] = useState('Bash')
    const [email, setEmail] = useState('Bash@Bash.Bash');
    const [password, setPassword] = useState('Bash1234#');
    const [confirmPassword, setConfirmPassword] = useState('Bash123#');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


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

    const signInWithGoogle = async () =>{
        await api.get('/auth/google')
    }




    return(
        <>
            <NavbarComponent />
            <div className="wrapper">
                <form onSubmit={handleSignup}>
                    <InputFieldComponent
                        type="text"
                        placeholder="First Name"
                        required={true}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="Last Name"
                        required={true}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="User Name"
                        required={true}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="Email"
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                    <div className="password">
                        <InputFieldComponent
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            required={true}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            variant="text"
                        />

                        <ButtonComponent
                            children={showPassword ? '👁️' : '🔒'}
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            variant="show"
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

                    <ButtonComponent
                        children="REGISTR"
                        variant="primary"
                        disabled={loading}
                        type="submit"
                    />

                    <div className="oauth">
                        <ButtonComponent
                            children={<img src={googleImage} alt="google Image"/>}
                            variant="secondary"
                            disabled={loading}
                            type="button"
                            onClick={signInWithGoogle}
                        />
                        <ButtonComponent
                            children={<img src={googleImage} alt="google Image"/>}
                            variant="secondary"
                            disabled={loading}
                            type="submit"
                        />
                        <ButtonComponent
                            children={<img src={googleImage} alt="google Image"/>}
                            variant="secondary"
                            disabled={loading}
                            type="submit"
                        />
                    </div>

                    <ButtonComponent
                        children="Already have an account login"
                        type="button"
                        variant="create"
                        disabled={loading}
                        onClick={() => navigate('/login')}
                    />

                </form>
            </div>
        </>
    )
}

export default RegisterPage;