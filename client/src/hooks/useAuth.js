import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
    login as loginService, 
    register as registerService, 
    generateOtp as generateOtpService,
    verifyOtp as verifyOtpService
} from '../services/authService';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Ensure the hook is used within the proper provider
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const login = async (credentials) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await loginService(credentials);

            // Handling the error structure from your backend/service
            if (response.success === false || response.status === "error") {
                const errorMessage = response.message || "An error occurred during login";
                setError(errorMessage);
                console.error("Login Error Profile:", response.message);
                return response;
            }

            // Successfully authenticated, update global user state
            if (response.data?.user) {
                context.setUser(response.data.user);
            }
            
            return response;

        } catch (err) {
            const msg = err.message || "Login failed";
            setError(msg);
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
            
            if (response.success === false || response.status === "error") {
                const errorMessage = response.message || "An error occurred during registration";
                setError(errorMessage);
                console.error("Registration Error Profile:", response.message);
            }

            return response;
        } catch (err) {
            const msg = err.message || "Registration failed";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateOtp = async (data) => {
        setIsSubmitting(true); // Maintain consistency with other actions
        setError(null);
        try {
            console.log(`Generating OTP for:`, data);
            const response = await generateOtpService(data);

            if (response.success === false || response.status === 'error') {
                const errorMessage = response.message || "An error occurred generating OTP";
                setError(errorMessage);
            }
            return response;
        } catch (err) {
            setError(err.message || "OTP Generation failed");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const verifyOtp = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await verifyOtpService(data);

            if (response.success === false || response.status === 'error') {
                const errorMessage = response.message || "An error occurred during verification";
                setError(errorMessage);
                return response;
            }

            // verifyOtp controller also returns a user and cookie
            if (response.data?.user) {
                context.setUser(response.data.user);
            }

            return response;
        } catch (err) {
            setError(err.message || "Verification failed");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        ...context, // user, logout, isInitialized, setUser
        login,
        register,
        isSubmitting,
        error,
        verifyOtp,
        generateOtp
    };
};