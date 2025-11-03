import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/api';

function OtpVerificationPage() {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { userId } = useParams();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            setLoading(false);
            return;
        }

        // --- MOCK API CALL ---
        console.log(`API call to verify OTP for User ID: ${userId}`, fullOtp);

        try {
            const res = await api.post('/auth/verify_otp',
                {user_id: userId,otp: fullOtp}
            );
            console.log('NAHOM');
            const username = res.data.username;
            console.log(username);
            navigate(`/@${username}`);

        } catch (err) {
            setError('Invalid or expired code. Please try resending.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="form-container">
                <h1 className="form-title">Verify Your Email</h1>
                <p className="form-instruction">
                    We sent a 6-digit code to your email.
                </p>
                <form onSubmit={handleVerify} className="form-body">

                    <div className="otp-input-container">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                className="otp-input"
                                type="text"
                                name={`otp-${index}`}
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                required
                            />
                        ))}
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading} className="primary-button">
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                <p className="secondary-link-text">
                    Didn't receive a code?{' '}
                    <button onClick={() => console.log('MOCK: Resend OTP initiated')} className="link-text as-button" disabled={loading}>
                        Resend Code
                    </button>
                </p>
            </div>
            <h1>TImer</h1>
        </div>
    );
}

export default OtpVerificationPage;