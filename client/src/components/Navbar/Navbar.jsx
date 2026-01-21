import React, { useState, useRef, useEffect } from 'react';
import { useGlassEffect } from './useGlass';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';
import './Navbar.css';

// Asset Imports
import userIcon from '../../assets/user.svg';
import message from '../../assets/mail.svg';
import cart from '../../assets/shoppingcart.svg';
import bell from '../../assets/bell.svg';
import logo from "../../assets/react.svg";

const GlassDropdown = ({ isOpen, onClose, children, title }) => {
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    return (
        <div className="glass-dropdown-menu" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            {title && <div className="dropdown-header">{title}</div>}
            <div className="dropdown-content">{children}</div>
        </div>
    );
};

const NAV_LINKS = ["Home", "About", "Products", "Contact"];
const ACTION_ICONS = [
    { id: 'cart', icon: cart, label: 'Cart' },
    { id: 'message', icon: message, label: 'Messages' },
    { id: 'notification', icon: bell, label: 'Notifications' },
    { id: 'user', icon: userIcon, label: 'Profile' }
];

const Navbar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const filterRef = useRef(null);
    const indicatorRef = useRef(null);
    const itemsRef = useRef([]);

    useGlassEffect(filterRef, { tintOpacity: 0.04, distortionStrength: 77 });

    // --- ELASTIC INDICATOR ANIMATION ---
    useEffect(() => {
        const indicator = indicatorRef.current;
        const targetItem = itemsRef.current[activeIndex];
        if (!indicator || !targetItem) return;
        const distance = Math.abs(activeIndex - prevIndex);
        const travelTime = 140 + distance * 70;

        indicator.style.transition = "none";
        indicator.style.transform = "translateY(-50%) scale(1)";
        indicator.offsetHeight; 

        indicator.style.transition = `left ${travelTime}ms cubic-bezier(0.25, 0.9, 0.25, 1), width ${travelTime}ms cubic-bezier(0.25, 0.9, 0.25, 1), transform ${travelTime}ms cubic-bezier(0.3, 0, 0.2, 1)`;
        indicator.style.left = `${targetItem.offsetLeft}px`;
        indicator.style.width = `${targetItem.offsetWidth}px`;
        indicator.style.transform = "translateY(-50%) scaleX(1.15) scaleY(0.7)";

        const impactTimeout = setTimeout(() => {
            indicator.style.transition = "transform 140ms cubic-bezier(0.2, 0.8, 0.2, 1)";
            indicator.style.transform = "translateY(-50%) scaleX(1.05) scaleY(1.15)";
            setTimeout(() => {
                indicator.style.transition = "transform 160ms cubic-bezier(0.25, 0.9, 0.25, 1)";
                indicator.style.transform = "translateY(-50%) scale(1)";
            }, 120);
        }, travelTime - 40);
        return () => clearTimeout(impactTimeout);
    }, [activeIndex, prevIndex]);

    const handleActionClick = (id) => {
        if (id === 'user') { setShowLogin(true); setOpenDropdownId(null); } 
        else { setOpenDropdownId(openDropdownId === id ? null : id); }
    };

    // --- SEQUENTIAL MODAL SWAPPING ---
    const switchToRegister = () => {
        setShowLogin(false); // Triggers Login's internal 600ms closing animation
        setTimeout(() => {
            setShowRegister(true); // Pops up Register once Login is gone
        }, 650); 
    };

    const switchToLogin = () => {
        setShowRegister(false); // Triggers Register's internal 600ms closing animation
        setTimeout(() => {
            setShowLogin(true); // Pops up Login once Register is gone
        }, 650);
    };

    return (
        <>
            <nav className="navbar-container">
                <div className="glass-indicator" ref={indicatorRef}></div>
                
                <div className="nav-left-section">
                    <div className="nav-logo"><img src={logo} alt="Logo" /></div>
                    <div className="nav-group">
                        {NAV_LINKS.map((item, index) => (
                            <div key={item} className={`nav-item ${activeIndex === index ? 'active' : ''}`} ref={el => itemsRef.current[index] = el} onClick={() => { setPrevIndex(activeIndex); setActiveIndex(index); }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
                    <button className="search-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    <input type="text" className="nav-search" placeholder="Search..." onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} />
                </div>

                <div className="nav-group">
                    {ACTION_ICONS.map((item) => (
                        <div key={item.id} className="nav-item icon-item" onClick={() => handleActionClick(item.id)}>
                            <img src={item.icon} alt={item.id} />
                            {item.id !== 'user' && (
                                <GlassDropdown isOpen={openDropdownId === item.id} onClose={() => setOpenDropdownId(null)} title={item.label}>
                                    <div className="dropdown-item">View {item.label}</div>
                                </GlassDropdown>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onRegisterClick={switchToRegister} />
            <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onLoginClick={switchToLogin} />

            <svg width="0" height="0" style={{ position: 'absolute' }} ref={filterRef}>
                <defs>
                    <filter id="navbar-glass-distortion">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="92" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
                    </filter>
                </defs>
            </svg>
        </>
    );
};

export default Navbar;