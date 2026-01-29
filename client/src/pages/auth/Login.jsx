import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login, isSubmitting, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ identifier, password });
            console.log('Login:' ,response.data.user.username)

            if (response.status === 'success') {
                navigate(`/@${response.data.user.username}`); // Redirect after success
            } else {
                if (response?.message === 'Email not verified') {
                    navigate('/verify-otp', { state: { id: response.data.userId } });
                }
            }
        } catch {
            // Error is already handled by the hook's state
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                
                <input 
                    type="text" 
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder="Identifier"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    required 
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>Dont have an account?<Link to="/signup">Click Here</Link></p>
            <p><Link to="/forgot-password">Forgot Password</Link></p>
        </div>
    );
};

export default LoginPage;