import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn) {
        // If not logged in, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
