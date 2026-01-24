import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../auth/authService";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function ResetPasswordPage() {
    const { token } = useParams(); // Grabs the token from the URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // 1. Basic validation
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        setLoading(true);

        // 2. Call API
        const response = await resetPassword(token, { newPassword: formData.password });
        console.log(response)

        if (response.success === true) {
            setSuccess(true);
            // Optionally redirect after 3 seconds
            setTimeout(() => navigate("/login"), 3000);
        } else {
            setError(response.message || "Link expired or invalid");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="auth-container">
                <h1>Success!</h1>
                <p>Your password has been reset. You will be redirected to login shortly.</p>
                <Link to="/login">Click here to login now</Link>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h1>Reset Password</h1>
            <p>Please enter your new password below.</p>

            <form onSubmit={handleSubmit}>
                <Input
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
                <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

                <Button type="submit" disabled={loading} style={{ width: "100%", marginTop: "10px" }}>
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </div>
    );
}