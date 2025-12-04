// LoginModal.jsx
import React, { useState } from "react";
import ButtonComponent from "../Components/ButtonComponent.jsx";
import InputFieldComponent from "../Components/InputFieldComponent.jsx";
import "../css/page.css";

import googleLogo from "../assets/google-logo.svg";
import api from "../api/api";

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/auth/login", {
                identifier,
                password,
            });

            alert(response.data.message);

            onClose(); // close modal after login success
        } catch (error) {
            const errorMessage = error.response?.data?.error?.details || "Login failed.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <h2>LOGIN</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <InputFieldComponent
                        type="text"
                        placeholder="Username or Email"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        variant="text"
                    />

                    <div className="password">
                        <InputFieldComponent
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="text"
                        />

                        <ButtonComponent
                            children={showPassword ? "👁️" : "🔒"}
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            variant="show"
                        />
                    </div>

                    <ButtonComponent
                        children={loading ? "LOGGING IN..." : "LOGIN"}
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    />

                    <div className="oauth">
                        <ButtonComponent variant="easy-access" disabled={loading}>
                            <img src={googleLogo} alt="google" />
                        </ButtonComponent>
                    </div>

                    <ButtonComponent variant="link" type="button" disabled={loading}>
                        Forgot password?
                    </ButtonComponent>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
