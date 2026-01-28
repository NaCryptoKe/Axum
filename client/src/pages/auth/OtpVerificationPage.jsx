import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateOtp, verifyOtp } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth'; // Assuming useAuth provides error/submitting states

const OTP_RESEND_TIMER_SECONDS = 300; // 5 minutes

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(OTP_RESEND_TIMER_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pageError, setPageError] = useState(null); // Separate error for this page

    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth(); // To set user after successful OTP verification

    const userId = location.state?.id;


    // Redirect if no email is provided (i.e., not coming from signup)
    useEffect(() => {
        if (!userId) {
            navigate('/signup', { replace: true });
        }
    }, [userId, navigate]);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleResendOtp = async () => {
        if (!canResend || !userEmail) return;

        setCanResend(false);
        setTimer(OTP_RESEND_TIMER_SECONDS);
        setPageError(null);
        try {
            // Call the service to generate a new OTP
            await generateOtp(userId);
            alert('New OTP sent to your email!');
        } catch (error) {
            setPageError(error.message || 'Failed to resend OTP.');
            setCanResend(true); // Allow resend again if failed
        }
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        if (!otp || !userId) {
            setPageError('Please enter the OTP.');
            return;
        }

        setIsSubmitting(true);
        setPageError(null);
        try {
            const response = await verifyOtp(userEmail, otp);
            if (response.status === "success") {
                setUser(response.data.user); // Update global auth context
                navigate('/dashboard', { replace: true });
            } else {
                setPageError(response.message || 'OTP verification failed.');
            }
        } catch (error) {
            setPageError(error.message || 'OTP verification failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="otp-container">
            <form onSubmit={handleSubmitOtp}>
                <h2>Verify Your Email</h2>
                <p>An OTP has been sent to {userEmail}. Please enter it below.</p>
                
                {pageError && <p className="error-text">{pageError}</p>}

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength="6" // Assuming 6-digit OTP
                    required
                />

                <p>Time remaining: {formatTime(timer)}</p>
                <button 
                    type="button" 
                    onClick={handleResendOtp} 
                    disabled={!canResend || isSubmitting}
                    className="resend-otp-button"
                >
                    {canResend ? "Resend OTP" : `Resend in ${formatTime(timer)}`}
                </button>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};

export default OtpVerificationPage;
