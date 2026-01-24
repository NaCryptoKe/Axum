import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth/authService"; 
import { getFieldErrors } from "../api/errors";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
// 1. Import useAuth
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const navigate = useNavigate();
    
    // 2. Get the setState function from context
    const { setState } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await login(formData);
        
        if (response.status === "error") {
            const mainError = response.message || "Login failed";
            console.error("Toast Error:", mainError);

            if (mainError === "Email not verified") {
                navigate("/verify-otp", { 
                    state: { 
                        userId: response.data?.userId, 
                        email: response.data?.email // or response.data.email 
                    } 
                });
                return;
            }
            const fieldErrors = getFieldErrors(response);
            console.log("Field specific details:", fieldErrors);
            
        } else {
            // 3. UPDATE CONTEXT STATE HERE
            // Assuming response.data.user contains the user info, similar to VerifyOTP logic
            setState({ status: "authenticated", user: response.data.user });
            
            navigate("/"); 
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Username or Email"
                    name="identifier" 
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your username"
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                />
                <Link to={"/forgot-password"}>Forgot Password</Link>
                <Button type="submit">Sign In</Button>
            </form>
        </div>
    );
}