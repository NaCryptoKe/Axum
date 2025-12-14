import React, { useState, useRef } from 'react';
import InputFieldComponent from "../Components/InputFieldComponent.jsx";
import ButtonComponent from "../Components/ButtonComponent.jsx";
import "../css/page.css";


function OtpVerificationPage({ isOpen = true }) {
    if (!isOpen) return null;

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value.slice(-1);
        setOtp(newOtp);
    };

    const handleVerify = async (e) => {

    };

    // Placeholder function for Resend
    const handleResendOtp = () => {
        console.log("Resend Clicked.");
        alert("Resend logic disabled.");
    };

    return (
        // Dummy wrapper structure kept for styling components
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Verification Code</h2>
                <p>The 6-digit code was sent to your email.</p>

                {/* OTP Boxes (6 Inputs) */}
                <div className="otp-inputs">
                    {otp.map((data, index) => (
                        <InputFieldComponent
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            // Attach ref to enable focus control
                            ref={(el) => (inputRefs.current[index] = el)}
                            required={true}
                            variant="otp"
                        />
                    ))}
                </div>

                {/* VERIFY Button */}
                <ButtonComponent
                    children={"VERIFY"}
                    variant="primary"
                    onClick={handleVerify} // Using onClick for direct execution
                />

                {/* RESEND Button */}
                <ButtonComponent
                    children="RESEND CODE"
                    onClick={handleResendOtp}
                    variant="link"
                />
            </div>
        </div>
    );
}

export default OtpVerificationPage;