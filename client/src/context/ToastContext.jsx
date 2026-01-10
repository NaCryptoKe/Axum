import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import Toast from '../components/toasts/Toast';

const ToastContext = createContext(null);
const MAX_TOASTS = 5;

export const useToasts = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToasts must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [queuedToasts, setQueuedToasts] = useState([]);

    const addToast = useCallback((type, messages) => {
        const newToast = { id: Date.now() + Math.random(), type, messages };
        setToasts(prevToasts => {
            if (prevToasts.length < MAX_TOASTS) {
                return [...prevToasts, newToast];
            } else {
                setQueuedToasts(prevQueued => [...prevQueued, newToast]);
                return prevToasts;
            }
        });
    }, []); // No dependencies needed now

    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    useEffect(() => {
        if (toasts.length < MAX_TOASTS && queuedToasts.length > 0) {
            const [nextToast, ...remainingQueue] = queuedToasts;
            setQueuedToasts(remainingQueue);
            setToasts(prevToasts => [...prevToasts, nextToast]);
        }
    }, [toasts, queuedToasts]);

    const toast = useMemo(() => ({
        success: (messages) => addToast('success', messages),
        error: (messages) => addToast('error', messages),
        warning: (messages) => addToast('warning', messages),
    }), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container">
                {toasts.map(({ id, type, messages }) => (
                    <Toast
                        key={id}
                        type={type}
                        messages={messages}
                        onClose={() => removeToast(id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

