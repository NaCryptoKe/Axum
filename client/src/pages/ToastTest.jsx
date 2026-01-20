// client/src/pages/ToastTest.jsx
import React from 'react';
import { useToast } from '../components/Toast/useToast';

const ToastTest = () => {
    const { addToast } = useToast();

    const testSuccess = () => {
        // This will use the overrides in your toastTheme.js
        addToast("Action Completed!", { 
            type: 'success', 
            subtitle: "The profile was updated successfully." 
        });
    };

    const testFailure = () => {
        // This will use the default 'error' config in ToastProvider.jsx
        addToast("Upload Failed", { 
            type: 'error', 
            subtitle: "Please check your internet connection and try again.",
            duration: 6000 // Custom duration just for this toast
        });
    };

    const testWarning = () => {
        // This uses the default 'warning' config
        addToast("Low Storage", { 
            type: 'warning', 
            subtitle: "Your account is reaching its limit." 
        });
    };

    return (
        <div style={{ padding: '40px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
                onClick={testSuccess} 
                style={{ backgroundColor: '#28a745', color: 'white' }}
            >
                Test Success
            </button>
            
            <button 
                onClick={testFailure} 
                style={{ backgroundColor: '#E50914', color: 'white' }}
            >
                Test Failure
            </button>
            
            <button 
                onClick={testWarning} 
                style={{ backgroundColor: '#ffa500', color: 'white' }}
            >
                Test Warning
            </button>
        </div>
    );
};

export default ToastTest;