import { useState, useCallback } from 'react';
import * as userService from '../services/userService';

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    const fetchProfile = useCallback(async (username) => {
        setLoading(true);
        setError(null);
        try {
            console.log(`Username ${username}`)
            const res = await userService.getUserProfile(username);
            setProfile(res.data);
            return res.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const editProfile = async (username, updateData) => {
        setLoading(true);
        try {
            const res = await userService.updateProfile(username, updateData);
            if (res.status === "success") {
                setProfile(prev => ({ ...prev, ...updateData }));
                return res.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editAvatar = async (username, avatarUrl) => {
        setLoading(true);
        try {
            // Your backend expects { avatar_url } in the body
            const res = await userService.updateProfilePicture(username, { avatar_url: avatarUrl });
            setProfile(prev => ({ ...prev, profilePicture: avatarUrl }));
            return res.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, error, fetchProfile, editProfile, editAvatar };
};