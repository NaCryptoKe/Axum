import { useState } from 'react';
import usePasswordReset from '../../hooks/usePasswordReset';

const ForgotPasswordPage = () => {
    const [identifier, setIdentifier] = useState('');
    const { requestReset, loading, error, success } = usePasswordReset();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await requestReset(identifier);
    };

    if (success) {
        return (
            <div className="login-container">
                <h2>Check your email</h2>
                <p>If an account exists for {identifier}, a reset link has been sent.</p>
            </div>
        );
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <p>Enter your email or username to receive a reset link.</p>
                
                {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}

                <input 
                    type="text" 
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;