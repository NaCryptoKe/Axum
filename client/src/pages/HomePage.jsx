import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="page-wrapper home-page">
            <div className="content-container">
                <h1 className="main-title">Welcome to the App!</h1>
                <p className="description">
                    Please use the links below to access the authentication flow.
                </p>
                <div className="button-group">
                    <Link to="/login" className="primary-button">
                        Go to Login
                    </Link>
                    <Link to="/register" className="secondary-button">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;