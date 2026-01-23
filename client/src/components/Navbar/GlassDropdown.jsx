import React, { useRef, useEffect } from 'react';
import './Navbar.css'; // Reusing styles

const GlassDropdown = ({ isOpen, onClose, children, title }) => {
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="glass-dropdown-menu" ref={dropdownRef}>
            {title && <div className="dropdown-header">{title}</div>}
            <div className="dropdown-content">
                {children}
            </div>
        </div>
    );
};

export default GlassDropdown;