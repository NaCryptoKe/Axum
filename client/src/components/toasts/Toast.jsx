import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ type, messages, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsFadingOut(true);
        // Wait for fade-out animation to complete before removing the toast
        setTimeout(onClose, 450); 
    };

    const messageList = Array.isArray(messages) ? messages : [messages];

    return (
        <div className={`toast toast-${type} ${isFadingOut ? 'toast-fade-out' : ''}`}>
            <div className="toast-message">
                {messageList.length > 1 ? (
                    <ul>
                        {messageList.map((msg, index) => <li key={index}>{msg}</li>)}
                    </ul>
                ) : (
                    messageList[0]
                )}
            </div>
            <button className="toast-close-btn" onClick={handleClose}>
                &times;
            </button>
            <div className="toast-timer"></div>
        </div>
    );
};

export default Toast;
