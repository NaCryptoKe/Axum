import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast/useToast';
import api from '../api/api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/authenticate');
                setUser(response.data.data.user);
            } catch (error) {
                addToast("Authentication Error", {
                    type: 'error',
                    subtitle: "Please log in to view your profile."
                });
                setTimeout(() => window.location.href = '/', 2000);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [addToast]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        addToast("Logged Out", { type: 'info', subtitle: "You have been successfully logged out." });
        setTimeout(() => window.location.href = '/', 1500);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div>
                <h1>Not Authenticated</h1>
                <p>Redirecting you to the homepage...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>User Profile</h1>
            {user.avatarUrl && <img src={user.avatarUrl} alt="User Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProfilePage;
