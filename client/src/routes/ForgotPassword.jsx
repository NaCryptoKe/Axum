import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { generateResetLink } from "../auth/authService"; // You will need to create this in authService

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const response = await generateResetLink({ identifier });
        console.log(response.data?.token)

        if (response.status === "success") {
            setIsSubmitted(true);
        } else {
            setError(response.message || "Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    if (isSubmitted) {
        return (
            <div className="auth-container">
                <h1>Check your email</h1>
                <p>If an account exists for <strong>{identifier}</strong>, you will receive a password reset code shortly.</p>
                <Link to="/login">
                    <Button style={{ width: '100%', marginTop: '20px' }}>Return to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h1>Forgot Password</h1>
            <p>Enter your email or username and we'll send you a code to reset your password.</p>
            
            <form onSubmit={handleSubmit}>
                <Input
                    label="Username or Email"
                    name="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or username"
                    required
                    error={error}
                />
                
                <Button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', marginTop: '10px' }}
                >
                    {loading ? "Sending..." : "Send Reset Code"}
                </Button>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Link to="/login" style={{ fontSize: "0.9rem", color: "#666" }}>
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}