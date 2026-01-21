import React from 'react';
import { useToast } from '../components/Toast/useToast'; // Import useToast

const Home = () => {
    const { addToast } = useToast();

    const testSuccess = () => {
        addToast("Action Completed!", { 
            type: 'success', 
            subtitle: "The profile was updated successfully." 
        });
    };

    const testFailure = () => {
        addToast("Upload Failed", { 
            type: 'error', 
            subtitle: "Please check your internet connection and try again.",
            duration: 6000
        });
    };

    const testWarning = () => {
        addToast("Low Storage", { 
            type: 'warning', 
            subtitle: "Your account is reaching its limit." 
        });
    };

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: '#1d1d1f' }}>
      <h2>Home Page</h2>
      <p>Welcome to the home page! Here you can test the toast notifications.</p>
        <div style={{ padding: '40px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
                onClick={testSuccess} 
                style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
            >
                Test Success
            </button>
            
            <button 
                onClick={testFailure} 
                style={{ backgroundColor: '#E50914', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
            >
                Test Failure
            </button>
            
            <button 
                onClick={testWarning} 
                style={{ backgroundColor: '#ffa500', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
            >
                Test Warning
            </button>
        </div>
    </div>
  );
};

export default Home;