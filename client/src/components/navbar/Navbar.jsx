import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    if (loading) return null; // prevent flicker

    return (
        <nav className="navbar">
            <li><Link to="/" className="logo">MyApp</Link></li>
            <li><Link to="/browse" className="logo">Browse</Link></li>
            <li><Link to="/community" className="logo">Community</Link></li>

            <li>{!user ? (
                <>
                    <Link to="/login">Login</Link>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/dashboard')}>
                        Notification
                    </button>
                    <button onClick={() => navigate('/dashboard')}>
                        Messages
                    </button>
                    <button onClick={() => navigate('/dashboard')}>
                        Cart
                    </button>
                    <button onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </button>
                </>
            )}</li>

            <li>{user &&  user.role === 'admin' && (
                <button onClick={() => navigate('/admin')}>
                    Admin
                </button>
            )}</li>
        </nav>
    );
};

export default Navbar;
