import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cartIcon from '../assets/shopping-cart.svg';
import useUser from '../hooks/useUser';

const Navbar = ({ isUserActive, isSearchFocused, setIsSearchFocused }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const { user, logout, isLoading } = useUser();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return null; // Don't render navbar until we know user status
    }

    return (
        <nav className={`navbar ${isHomePage && !isUserActive && !isSearchFocused ? 'hide-ui' : ''}`}>
            <div className="nav-logo">
                <Link to="/"><h1>AXUM</h1></Link>
            </div>
            
            <ul className="nav-links">
                <li><Link to="/store">Store</Link></li>
                <li><Link to="/">Games</Link></li>
                <li><Link to="/">News</Link></li>
            </ul>

            <div className="nav-search">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
                <button>Go</button>
            </div>

            <div className="nav-actions">
                <div className="cart-wrapper">
                    <img src={cartIcon} alt="cart" />
                    <span className="cart-count">0</span>
                </div>
                {user ? (
                    <>
                        <Link to={`/@${user.username}`} className="login-btn">Profile</Link>
                        <button onClick={handleLogout} className="login-btn" style={{marginLeft: '10px'}}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;