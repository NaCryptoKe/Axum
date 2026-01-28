import { useState, useEffect } from 'react';
import { checkAuthStatus, logout as logoutService } from '../services/authService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {     // This is a wrapper component
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Use it using `const { user, loading, logout } = useContext(AuthContext);`

    // Check if user is already logged in when app starts
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await checkAuthStatus();
                console.log(response)
                if (response.status === "success") {
                    setUser(response.data);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const logout = async () => {
        await logoutService();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};