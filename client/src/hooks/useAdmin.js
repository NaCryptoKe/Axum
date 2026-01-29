import { useState } from 'react';
import * as userService from '../services/userService';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.adminGetAllUsers();
            return res.data; // Returns formattedUsers from your controller
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const changeRole = async (username, newRole) => {
        setLoading(true);
        try {
            return await userService.adminChangeRole(username, newRole);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const restoreUser = async (username) => {
        setLoading(true);
        try {
            return await userService.adminUndeleteUser(username);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { getAllUsers, changeRole, restoreUser, loading, error };
};