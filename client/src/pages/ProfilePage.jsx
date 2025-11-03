import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useParams } from 'react-router-dom';

const MOCK_USER = {
    id: '1a2b3c4d-e5f6-7890-1234-567890abcdef',
    username: 'player_one',
    email: 'user@example.com',
    displayName: 'The Explorer',
    bio: 'Avid gamer and occasional developer.',
    role: 'player',
    avatarUrl: 'https://placehold.co/100x100/3182CE/ffffff?text=U', // Placeholder
    emailVerified: true,
};

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {username} = useParams();
    console.log (username);

    useEffect(() => {
        const getUser = async (e) => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/${username}`);
                setUser(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Network Error');
            } finally {
                setLoading (false);
            }
        };
        getUser();
    }, [username]); // <-- empty array means "run once on mount"    
 
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            navigate('/login');
        } catch ( err ) {
            console.error (`Logout Failed: ${err}`);
        }
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
                        src={user.avatar_url}
                        alt="User Avatar"
                        className="profile-avatar"
                        style={{width: "300px"}}
                    />

                    <div className="basic-details">
                        <h2 className="display-name">{user.display_name}</h2>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </div>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span className="detail-label">Username: </span>
                        <span className="detail-value">@{user.username}</span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Email Address: </span>
                        <span className="detail-value">
                            {user.email}
                            {user.emailVerified && <span className="verified-status">(Verified)</span>}
                        </span>
                    </div>

                    <div className="detail-item full-width">
                        <span className="detail-label">Bio: </span>
                        <p className="bio-text">{user.bio || 'No bio provided.'}</p>
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