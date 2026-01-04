import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password }) => {
    const criteria = [
        { name: '8+ Characters', regex: /.{8,}/ },
        { name: 'Uppercase', regex: /[A-Z]/ },
        { name: 'Lowercase', regex: /[a-z]/ },
        { name: 'Number', regex: /[0-9]/ },
        { name: 'Special Char', regex: /[^A-Za-z0-9]/ },
    ];

    return (
        <div className="password-strength-container">
            <ul className="strength-criteria-list">
                {criteria.map((item, index) => {
                    const isMet = item.regex.test(password);
                    return (
                        <li key={index} className={`criterion-item ${isMet ? 'met' : ''}`}>
                            <span className="criterion-indicator">{isMet ? '✔' : '✖'}</span>
                            <span className="criterion-name">{item.name}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PasswordStrength;
