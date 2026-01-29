import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService, 
    register as registerService, 
    generateOtp as generateOtpService,
    verifyOtp as verifyOtpService
} from '../services/authService';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const login = async (credentials) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await loginService(credentials);

            if (response.status === "error") {
                const errorMessage = response.message || "An error occurred during login";
                
                setError(errorMessage);
                console.error("Login Error Profile:", response.message);
                return response;
            }
            context.setUser(response.data.user);
            
            return response;

        } catch (err) {
            setError(err.message || "Login failed");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const register = async (userData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await registerService(userData);
            if (response.status === "error") {
                const errorMessage = response.message || "An error occurred during login";
                
                setError(errorMessage);
                console.error("Login Error Profile:", response.message);
            }

            return response;
        } catch (err) {
            setError(err.message || "Registration failed");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateOtp = async (data) => {
        try {
            console.log(`Data`, data)
            const response = await generateOtpService(data);

            if (response?.status === 'error' ){
                const errorMessage = response.message || "An error occurred during login";
                
                setError(errorMessage);
            }
            return response
        } catch {
            setError(err.message || "Registration failed");
            throw err;
        }
    }

    const verifyOtp = async (data) => {
        try {
            const response = await verifyOtpService(data);

            if (response?.status === 'error' ){
                const errorMessage = response.message || "An error occurred during login";
                
                setError(errorMessage);
            }
            return response
        } catch {
            setError(err.message || "Registration failed");
            throw err;
        }
    }

    return {
        ...context, // user, logout, loading
        login,
        register,
        isSubmitting,
        error,
        verifyOtp,
        generateOtp
    };
};