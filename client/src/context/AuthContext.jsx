import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            const { token } = response.data.data;
            if (token) {
                try {
                    localStorage.setItem('token', token);
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                } catch (error) {
                    console.error("Failed to decode token on login:", error);
                    setUser(null); 
                }
            }
        }
        return response;
    };

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed on server, clearing client-side session.', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
