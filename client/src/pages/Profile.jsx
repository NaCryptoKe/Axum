import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import './Profile.css';
import { useToasts } from '../context/ToastContext';

const Profile = () => {
    const  {username}  = useParams();

        console.log('Username from useParams:', username);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToasts();

    useEffect(() => {
        if (!username) {
            setLoading(false); // If no username, stop loading and display "User not found"
            setUser(null);
            return;
        }

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/users/${username}`);
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                toast.error('User not found or an error occurred.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username, toast]);

    if (loading) {
        return (
            <div className="profile-page-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-page-container">
                <h1>User not found</h1>
            </div>
        );
    }

    const badges = Array.from({ length: 15 }, (_, i) => `Badge ${i + 1}`);

    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="profile-page-container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-picture-container">
                        <div
                            className="profile-picture"
                            style={{
                                backgroundImage: `url(${user.profilePicture || 'https://via.placeholder.com/150'})`,
                            }}
                        />
                        {user.isOnline && <div className="online-status" />}
                    </div>

                    <div className="user-details">
                        <div className="display-name">
                            {user.displayName || `${user.firstname} ${user.lastname}`}
                        </div>
                        <div className="username">@{user.username}</div>
                        <div className="bio">
                            {user.bio || 'This user has not set a bio yet.'}
                        </div>
                        <div className="joined-date">
                            Joined: {joinedDate}
                        </div>
                    </div>
                </div>

                <div className="badges-section">
                    <h3>Badges</h3>
                    <div className="badges-container">
                        {badges.map((badge, index) => (
                            <div key={index} className="badge">
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
