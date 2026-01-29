import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePasswordReset from '../../hooks/usePasswordReset';

const ResetPasswordPage = () => {
    const { token } = useParams(); // Grabs the token from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { resetPassword, loading, error } = usePasswordReset();
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setLocalError("Passwords do not match");
        }

        const response = await resetPassword(token, password);
        if (response?.status === "success") {
            alert("Password updated successfully!");
            navigate('/login');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Create New Password</h2>
                {(error || localError) && (
                    <p className="error-text" style={{color: 'red'}}>{error || localError}</p>
                )}
                <input 
                    type="password" 
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;