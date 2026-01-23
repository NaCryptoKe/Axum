import React from 'react';
import { useToast } from '../components/Toast/useToast';

const Home = () => {
    const { addToast } = useToast();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        position: 'relative'
    };

    const buttonGroupStyle = {
        position: 'fixed',
        top: '120px', // Below your Navbar
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 100, // Ensure it's above images but below navbar
    };

    const btnBase = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

    return (
        <div style={containerStyle}>
            {/* Test Buttons Overlay */}
            <div style={buttonGroupStyle}>
                <button 
                    style={{...btnBase, backgroundColor: 'rgba(40, 167, 69, 0.6)'}} 
                    onClick={() => addToast("Payment Successful!", { type: 'success', subtitle: 'Your order is on the way.' })}
                >
                    Success Toast
                </button>
                <button 
                    style={{...btnBase, backgroundColor: 'rgba(229, 9, 20, 0.6)'}} 
                    onClick={() => addToast("Upload Failed", { type: 'error', subtitle: 'Please check your connection.' })}
                >
                    Error Toast
                </button>
                <button 
                    style={{...btnBase, backgroundColor: 'rgba(23, 162, 184, 0.6)'}} 
                    onClick={() => addToast("New Update Available", { type: 'info' })}
                >
                    Info Toast
                </button>
                <button 
                    style={{...btnBase, backgroundColor: 'rgba(255, 165, 0, 1)'}} 
                    onClick={() => addToast("You Might Die", { type: 'warning', subtitle: 'Your order is on the way.' })}
                >
                    Caution Toast
                </button>
            </div>
        </div>
    );
};

export default Home;