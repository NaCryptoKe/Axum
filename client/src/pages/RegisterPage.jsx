// RegisterModal.jsx
import React, { useState } from "react";
import InputFieldComponent from "../Components/InputFieldComponent.jsx";
import ButtonComponent from "../Components/ButtonComponent.jsx";
import "../css/page.css";

import googleImage from "../assets/google-logo.svg";
import api from "../api/api";

const RegisterModal = ({ isOpen, onClose, openLogin }) => {
    if (!isOpen) return null;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords don't match");
            }

            const res = await api.post("/auth/register", {
                firstname: firstName,
                lastname: lastName,
                username,
                email,
                password,
            });

            alert(res.data.message);

            onClose(); // close modal
        } catch (err) {
            const errorMessage =
                err.response?.data?.error?.details ||
                err.message ||
                "Registration failed.";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        await api.get("/auth/google");
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Create an Account</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSignup}>
                    <InputFieldComponent
                        type="text"
                        placeholder="First Name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="Last Name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-text"
                    />

                    <InputFieldComponent
                        type="text"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-text"
                    />

                    {/* Password */}
                    <div className="password">
                        <InputFieldComponent
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-text"
                        />

                        <ButtonComponent
                            children={showPassword ? "👁️" : "🔒"}
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            className="button-show"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="password">
                        <InputFieldComponent
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-text"
                        />

                        <ButtonComponent
                            children={showPassword ? "👁️" : "🔒"}
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            className="button-show"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="checkboxes">
                        <div className="check-box">
                            <InputFieldComponent type="checkbox" required />
                            <label>I accept the Terms & Conditions</label>
                        </div>

                        <div className="check-box">
                            <InputFieldComponent type="checkbox" />
                            <label>Send me updates (optional)</label>
                        </div>
                    </div>

                    {/* Register Button */}
                    <ButtonComponent
                        children="REGISTER"
                        disabled={loading}
                        className="button-primary"
                        type="submit"
                    />

                    {/* OAuth */}
                    <div className="oauth">
                        <ButtonComponent
                            children={<img src={googleImage} alt="google" />}
                            className="button-primary"
                            onClick={signInWithGoogle}
                            type="button"
                        />
                    </div>

                    {/* Switch to Login */}
                    <ButtonComponent
                        children="Already have an account? Login"
                        type="button"
                        className="button-link"
                        onClick={() => {
                            onClose();
                            openLogin(); // open login modal after closing register
                        }}
                    />
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
