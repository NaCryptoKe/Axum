import { useState } from 'react';
import { requestPasswordReset, updatePassword } from '../services/passwordResetService';

const usePasswordReset = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const requestReset = async (identifier) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await requestPasswordReset(identifier);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await updatePassword(token, password);
            setSuccess(true);
            return response;
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            return { status: "error", message: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { requestReset, resetPassword, loading, error, success };
};

export default usePasswordReset;
