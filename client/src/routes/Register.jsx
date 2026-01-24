import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth/authService";
import { useAuth } from "../auth/AuthContext";
import { getFieldErrors } from "../api/errors";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null }); // Clear error when input changes
    };

    const { setState } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({}); // Clear previous errors

        const response = await register(formData);

        console.log("Full API Response:", response);

        if (response.status === "error") {
            const mainMessage = response.message || "Registration failed";
            console.error("Toast Error:", mainMessage);
            const errors = getFieldErrors(response);
            if (errors) {
                setFieldErrors(errors);
            }
        } else {
            // Assuming successful registration leads to OTP verification
            navigate("/verify-otp", { state: { userId: response.data.id, email: response.data.email } });
        }
    };

    return (
        <div className="auth-container">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Input
                        label="First Name"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="John"
                        error={fieldErrors.firstname?.message}
                    />
                    <Input
                        label="Last Name"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Doe"
                        error={fieldErrors.lastname?.message}
                    />
                </div>
                <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe123"
                    error={fieldErrors.username?.message}
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    error={fieldErrors.email?.message}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    error={fieldErrors.password?.message}
                />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
}