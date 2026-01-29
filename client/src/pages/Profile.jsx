import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import React, { useEffect } from 'react';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate(); // Initialize navigation
    const { user: currentUser, logout } = useAuth();
    const { profile, loading, fetchProfile } = useUser();

    useEffect(() => {
        fetchProfile(username);
    }, [username, fetchProfile]);
    console.log('Profile', username)

    if (loading || !profile) return <p>Loading...</p>;

    const isOwnProfile = currentUser?.username === profile.username;

    const handleEditClick = () => {
        navigate(`/edit-profile/@${profile.username}`);
    };

    return (
        <div className="profile-container">
            <img 
                src={profile.profilePicture || '/default-avatar.png'} 
                alt="Avatar" 
                style={{ width: '150px', borderRadius: '50%' }}
            />
            <h1>@{profile.username}</h1>
            <h3>{profile.displayName}</h3>
            <p>{profile.bio || "No bio yet."}</p>
            <div className="stats">
                <span>Followers: {profile.followerCount}</span>
                <span>Following: {profile.followingCount}</span>
            </div>
            
            {isOwnProfile ? (
                <div className="owner-actions">
                    
                    <span>Email: {profile.email}</span>
                    <button onClick={handleEditClick}>Edit Profile</button>
                    
                    <button onClick={logout} className="logout-btn">
                        Logout
                    </button>
                    <button className="delete-btn" style={{ color: 'red' }}>
                        Delete Account
                    </button>
                </div>
            ) : (
                <div className="visitor-actions">
                    <span className={`status-tag ${profile.isOnline ? 'online' : 'offline'}`}>
                        {profile.isOnline ? '● Online' : '○ Offline'}
                    </span>
                    <button className="follow-btn">
                        {profile.isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;