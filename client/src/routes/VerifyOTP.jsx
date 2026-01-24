import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, generateOtp } from "../auth/authService"; // You'll need these
import { useAuth } from "../auth/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const { state: authState, setState } = useAuth();
    
    // Get userId passed from Register page
    const { state: locationState } = useLocation();
    const userId = locationState?.userId;
    const email = locationState?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);

    if (!userId) {
        return <div>Invalid session. Please register again.</div>;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        const response = await verifyOtp({ user_id: userId, otp });

        if (response.status === "success") {
            setState({ status: "authenticated", user: response.data.user });
            navigate("/"); // Now they can go home
        } else {
            setError(response.message || "Invalid OTP");
        }
    };

    const handleResend = async () => {
        try {
            const response = await generateOtp({ user_id: userId });
            if (response.status === "success") {
                alert("A new OTP has been sent to your email.");
                setError(null); // Clear any previous errors
            } else {
                setError(response.message || "Failed to resend OTP.");
            }
        } catch (err) {
            setError("An unexpected error occurred while resending OTP.");
        }
    };

    return (
        <div className="auth-container">
            <h1>Verify Your Email</h1>
            <p>Enter the code sent to <strong>{email}</strong></p>
            
            <form onSubmit={handleVerify}>
                <Input
                    label="One-Time Password"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <Button type="submit">Verify & Login</Button>
            </form>
            
            <button onClick={handleResend} style={{ marginTop: "10px", background: "none", border: "none", color: "blue", cursor: "pointer" }}>
                Resend Code
            </button>
        </div>
    );
}