import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTOS, setAgreedToTOS] = useState(false);
    const { register, isSubmitting, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await register({ firstname, lastname, username, email, password });
            
            if (result.status === "success") {
                navigate('/verify-otp', { state: { id: result.data.id } });
            }
        } catch {
            // Error is already handled by the hook's state
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Signup</h2>
                
                <input 
                    type="text" 
                    value={firstname} 
                    onChange={(e) => setFirstname(e.target.value)} 
                    placeholder="Firstname"
                    required 
                />
                <input 
                    type="text" 
                    value={lastname} 
                    onChange={(e) => setLastname(e.target.value)} 
                    placeholder="Lastname"
                    required 
                />
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="john_doe"
                    required 
                />
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john_doe@example.com"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    required 
                />

                <div className="checkbox-group">
                    <input 
                        type="checkbox" 
                        id="tos" 
                        checked={agreedToTOS} 
                        onChange={(e) => setAgreedToTOS(e.target.checked)} 
                        required 
                    />
                    <label htmlFor="tos">I agree to the Terms of Service</label>
                </div>

                <div className="checkbox-group">
                    <input 
                        type="checkbox" 
                        id="news" 
                    />
                    <label htmlFor='news'>I want to be in newsletter</label>
                </div>

                <button type="submit" disabled={isSubmitting || !agreedToTOS}>
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            <p>Already have an account?<Link to="/login">Login Here</Link></p>
        </div>
    );
};

export default SignupPage;