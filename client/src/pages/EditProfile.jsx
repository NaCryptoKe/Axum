import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';

const EditProfilePage = () => {
    const { user: currentUser, setUser } = useAuth();
    const { profile, fetchProfile, editProfile, editAvatar, loading, error } = useUser();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        newUsername: '',
        email: '',
        display_name: '',
        bio: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // 1. Fetch current data on load
    useEffect(() => {
        if (currentUser?.username) {
            const username = `@${currentUser.username}`
            fetchProfile(username).then(data => {
                if (data) {
                    setFormData({
                        newUsername: data.username || '',
                        email: data.email || '',
                        display_name: data.displayName || '',
                        bio: data.bio || ''
                    });
                }
            });
        }
    }, [currentUser, fetchProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateSuccess(false);
        try {
            // Update Text Data
            const result = await editProfile(currentUser.username, formData);
            console.log(result);
            setUpdateSuccess(true);
            setUser(result);
            navigate(`/@${formData.newUsername}`)
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    if (loading && !profile) return <p>Loading profile data...</p>;

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            
            {updateSuccess && <p style={{color: 'green'}}>Profile updated successfully! Redirecting...</p>}
            {error && <p style={{color: 'green'}}>{error}</p>}

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Display Name</label>
                    <input 
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        name="newUsername"
                        value={formData.newUsername}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProfilePage;