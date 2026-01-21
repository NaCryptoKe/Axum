import React, { useState } from 'react';
import './Button.css';

const Button = ({ children, color, onClick, className = "" }) => {
    const [status, setStatus] = useState('idle');

    const handlePress = () => setStatus('pressed');
    const handleRelease = () => {
        setStatus('released');
        if (onClick) onClick();
        setTimeout(() => setStatus('idle'), 150);
    };

    return (
        <button
            className={`apple-btn ${status} ${className}`}
            style={{ backgroundColor: color }}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={() => setStatus('idle')}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
        >
            {children}
        </button>
    );
};

export default Button;