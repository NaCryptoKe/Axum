import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToasts } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const toast = useToasts();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        newUsername: '',
        display_name: '',
        bio: '',
    });
    const [onlineStatus, setOnlineStatus] = useState({ online: 'Offline', last_seen_at: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profileRes = await api.get(`/user/@${username}`);
                setUser(profileRes.data.data);
                setFormData({
                    email: profileRes.data.data.email || '',
                    newUsername: profileRes.data.data.username || '',
                    display_name: profileRes.data.data.displayName || '',
                    bio: profileRes.data.data.bio || '',
                });

                const statusRes = await api.get(`/user/@${username}/status`);
                setOnlineStatus(statusRes.data.data);

            } catch (error) {
                toast.error('Failed to fetch user data.');
                // navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username, toast, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.patch(`/user/@${username}/update`, formData);
            toast.success('Profile updated successfully!');
            if (formData.newUsername !== username) {
                navigate(`/@${formData.newUsername}`);
            } else {
                setUser(prev => ({ ...prev, ...formData, displayName: formData.display_name, username: formData.newUsername }));
            }
        } catch (error) {
            toast.error(error.response?.data?.error?.details || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // This is a placeholder for where you would upload the file to a service
        // like S3, Cloudinary, etc., and get a URL back.
        // For now, we'll simulate this with a timeout and a placeholder URL.
        toast.warning('Avatar upload is a placeholder. Using a mock URL.');
        setIsSubmitting(true);

        setTimeout(async () => {
            const mockAvatarUrl = `https://i.pravatar.cc/150?u=${Date.now()}`;
            try {
                await api.patch(`/user/@${username}/update-profile-picture`, { avatar_url: mockAvatarUrl });
                setUser(prev => ({ ...prev, avatar_url: mockAvatarUrl }));
                toast.success('Profile picture updated!');
            } catch (error) {
                toast.error('Failed to update profile picture.');
            } finally {
                setIsSubmitting(false);
            }
        }, 1000);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to deactivate your account? This action is reversible by contacting support.')) {
            try {
                await api.delete(`/user/@${username}`);
                toast.success('Account deactivated successfully.');
                navigate('/login');
            } catch (error) {
                toast.error('Failed to deactivate account.');
            }
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    if (!user) {
        return <div className="profile-container">User not found.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <header className="profile-header">
                    <div className="profile-avatar">
                        <img src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.username}`} alt="Avatar" />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                        <button className="avatar-upload-button" onClick={() => fileInputRef.current.click()} title="Upload new picture">
                            ✏️
                        </button>
                    </div>
                    <div className="profile-info">
                        <h1>{user.displayName}</h1>
                        <p>@{user.username}</p>
                         <span className={`online-status ${onlineStatus.online.toLowerCase()}`}>
                            {onlineStatus.online}
                        </span>
                    </div>
                </header>

                <form className="profile-body" onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label htmlFor="display_name">Display Name</label>
                        <input id="display_name" name="display_name" value={formData.display_name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newUsername">Username</label>
                        <input id="newUsername" name="newUsername" value={formData.newUsername} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange}></textarea>
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <div className="danger-zone">
                    <h2>Danger Zone</h2>
                    <p>Deactivating your account will remove your profile and content. You can reactivate it later by contacting support.</p>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>
                        Deactivate Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
