import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MOCK_USER = {
    id: '1a2b3c4d-e5f6-7890-1234-567890abcdef',
    username: 'player_one',
    email: 'user@example.com',
    displayName: 'The Explorer',
    bio: 'Avid gamer and occasional developer.',
    role: 'player',
    avatarUrl: 'https://placehold.co/100x100/3182CE/ffffff?text=U', // Placeholder
    emailVerified: true,
    createdAt: '2024-01-15T10:00:00Z'
};

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // MOCK: Simulate API fetch of user data
        setTimeout(() => {
            // In a real app, you would fetch the user associated with the current session/token
            setUser(MOCK_USER);
            setLoading(false);
        }, 800);
    }, []);

    const handleLogout = () => {
        // MOCK: Clear session/token and redirect
        console.log("MOCK: User logged out.");
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return <div className="page-wrapper"><p className="loading-text">Loading profile...</p></div>;
    }

    if (!user) {
        return <div className="page-wrapper"><p className="error-message">Not logged in. <Link to="/login" className="link-text">Go to Login</Link></p></div>;
    }

    return (
        <div className="page-wrapper profile-page">
            <div className="profile-container">

                <div className="profile-header">
                    <h1 className="profile-title">My Profile</h1>
                    <button onClick={handleLogout} className="secondary-button logout-button">
                        Log Out
                    </button>
                </div>

                <div className="user-info-section">
                    <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="profile-avatar"
                    />

                    <div className="basic-details">
                        <h2 className="display-name">{user.displayName}</h2>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </div>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span className="detail-label">Username</span>
                        <span className="detail-value">@{user.username}</span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-value">
                            {user.email}
                            {user.emailVerified && <span className="verified-status">(Verified)</span>}
                        </span>
                    </div>

                    <div className="detail-item full-width">
                        <span className="detail-label">Bio</span>
                        <p className="bio-text">{user.bio || 'No bio provided.'}</p>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Member Since</span>
                        <span className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                </div>

                <div className="profile-actions">
                    <button className="primary-button">Edit Profile</button>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;