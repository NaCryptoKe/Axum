import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cartIcon from '../assets/shopping-cart.svg';

const Navbar = ({ isUserActive, isSearchFocused, setIsSearchFocused }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

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
                <Link to="/login" className="login-btn">Sign In</Link>
            </div>
        </nav>
    );
};

export default Navbar;