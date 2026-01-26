import React, { useState } from 'react';

import * as adminService from '../auth/adminService';
import * as analyticsService from '../auth/analyticsService';
import * as authService from '../auth/authService';
import * as communityService from '../auth/communityService';
import * as financialsService from '../auth/financialsService';
import * as gameService from '../auth/gameService';
import * as notificationService from '../auth/notificationService';
import * as organizationService from '../auth/organizationService';
import * as publishingService from '../auth/publishingService';
import * as socialService from '../auth/socialService';
import * as userService from '../auth/userService';

const ApiTestPage = () => {
    const [response, setResponse] = useState("Click a button to test an API endpoint.");

    const handleApiCall = async (apiFunc, ...args) => {
        setResponse("Loading...");
        try {
            const parsedArgs = args.map(arg => {
                try {
                    return JSON.parse(arg);
                } catch (e) {
                    return arg; 
                }
            });
            const res = await apiFunc(...parsedArgs);
            setResponse(JSON.stringify(res, null, 2));
        } catch (error) {
            console.error("API call failed", error);
            setResponse(JSON.stringify({
                name: error.name,
                message: error.message,
                status: error.status,
                body: error.body,
            }, null, 2));
        }
    };

    // --- Updated Expandable Section ---
    const ServiceSection = ({ title, children }) => (
        <details style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            margin: '10px 0', 
            backgroundColor: '#fff',
            overflow: 'hidden'
        }}>
            <summary style={{ 
                padding: '15px', 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: '1.2rem',
                backgroundColor: '#f8f9fa',
                userSelect: 'none'
            }}>
                {title}
            </summary>
            <div style={{ padding: '10px 20px' }}>
                {children}
            </div>
        </details>
    );

    const ApiButton = ({ fn, params = [] }) => {
        const [inputs, setInputs] = useState(params.map(p => p.defaultValue || ''));
        const handleInputChange = (index, value) => {
            const newInputs = [...inputs];
            newInputs[index] = value;
            setInputs(newInputs);
        };

        return (
            <div style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                <div style={{ marginBottom: '8px' }}>
                    <code style={{ color: '#d63384', fontWeight: 'bold' }}>{fn.name}</code>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {params.map((p, i) => (
                        p.type === 'textarea'
                            ? <textarea key={p.name} placeholder={p.name} value={inputs[i]} onChange={e => handleInputChange(i, e.target.value)} rows={4} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            : <input key={p.name} type="text" placeholder={p.name} value={inputs[i]} onChange={e => handleInputChange(i, e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    ))}
                </div>
                <button 
                    onClick={() => handleApiCall(fn, ...inputs)}
                    style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Execute
                </button>
            </div>
        );
    };

    // Mapping of services to simplify rendering
    const services = [
        { title: "Admin Service", module: adminService },
        { title: "Analytics Service", module: analyticsService },
        { title: "Auth Service", module: authService },
        { title: "Community Service", module: communityService },
        { title: "Financials Service", module: financialsService },
        { title: "Game Service", module: gameService },
        { title: "Notification Service", module: notificationService },
        { title: "Organization Service", module: organizationService },
        { title: "Publishing Service", module: publishingService },
        { title: "Social Service", module: socialService },
        { title: "User Service", module: userService },
    ];

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#333' }}>
            <h1>🛠 API Dashboard</h1>
            <p>Select a service below to expand and test endpoints.</p>
            
            <div style={{ position: 'sticky', top: '10px', zIndex: 100 }}>
                <h3>Response:</h3>
                <pre style={{ 
                    background: '#2d2d2d', 
                    color: '#61dafb', 
                    padding: '15px', 
                    borderRadius: '8px',
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-all',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {response}
                </pre>
            </div>

            <hr style={{ margin: '30px 0' }} />

            {services.map(svc => (
                <ServiceSection key={svc.title} title={svc.title}>
                    {Object.values(svc.module).map(fn => (
                        <ApiButton key={fn.name} fn={fn} params={getParamsFor(fn.name)} />
                    ))}
                </ServiceSection>
            ))}
        </div>
    );
};

// ... [getParamsFor function remains exactly the same as your original code] ...
function getParamsFor(functionName) {
    const params = {
        softDeleteUser: [{ name: 'username' }],
        changeUserRole: [{ name: 'username' }, { name: 'role' }],
        permanentDeleteUser: [{ name: 'username' }],
        undeleteUser: [{ name: 'username' }],
        recordTelemetryEvent: [{ name: 'eventData', type: 'textarea', defaultValue: '{"game_id": "your_game_id", "event_type": "test_event"}' }],
        login: [{ name: 'credentials', type: 'textarea', defaultValue: '{"identifier": "user", "password": "password"}' }],
        register: [{ name: 'userData', type: 'textarea', defaultValue: '{"firstname": "test", "lastname": "user", "username": "testuser", "email": "test@test.com", "password": "password"}' }],
        generateResetLink: [{ name: 'data', type: 'textarea', defaultValue: '{"email": "test@test.com"}' }],
        resetPassword: [{ name: 'token' }, { name: 'data', type: 'textarea', defaultValue: '{"newPassword": "newpassword123"}' }],
        verifyOtp: [{ name: 'data', type: 'textarea', defaultValue: '{"user_id": "your_user_id", "otp": "123456"}' }],
        generateOtp: [{ name: 'data', type: 'textarea', defaultValue: '{"user_id": "your_user_id"}' }],
        createSpace: [{ name: 'spaceData', type: 'textarea', defaultValue: '{"name": "My Test Space", "slug": "my-test-space"}' }],
        getSpace: [{ name: 'slug' }],
        updateSpace: [{ name: 'id' }, { name: 'spaceData', type: 'textarea' }],
        softDeleteSpace: [{ name: 'id' }],
        undeleteSpace: [{ name: 'id' }],
        createPost: [{ name: 'postData', type: 'textarea', defaultValue: '{"space_id": "your_space_id", "title": "My Post"}' }],
        getPost: [{ name: 'id' }],
        getPostsBySpace: [{ name: 'spaceSlug' }],
        updatePost: [{ name: 'id' }, { name: 'postData', type: 'textarea' }],
        softDeletePost: [{ name: 'id' }],
        undeletePost: [{ name: 'id' }],
        createComment: [{ name: 'commentData', type: 'textarea', defaultValue: '{"post_id": "your_post_id", "body": "A comment"}' }],
        getComment: [{ name: 'id' }],
        getCommentsByPost: [{ name: 'postId' }],
        updateComment: [{ name: 'id' }, { name: 'commentData', type: 'textarea' }],
        softDeleteComment: [{ name: 'id' }],
        undeleteComment: [{ name: 'id' }],
        addPostVote: [{ name: 'postId' }, { name: 'value', defaultValue: '1' }],
        removePostVote: [{ name: 'postId' }],
        addCommentVote: [{ name: 'commentId' }, { name: 'value', defaultValue: '1' }],
        removeCommentVote: [{ name: 'commentId' }],
        initializePayment: [{ name: 'paymentData', type: 'textarea', defaultValue: '{"amount": "100", "currency": "USD", "email": "test@test.com", "first_name": "Test", "last_name": "User"}' }],
        verifyPayment: [{ name: 'tx_ref' }],
        createGame: [{ name: 'gameData', type: 'textarea' }],
        getGame: [{ name: 'orgSlug' }, { name: 'gameSlug' }],
        updateGame: [{ name: 'gameId' }, { name: 'updates', type: 'textarea' }],
        deleteGame: [{ name: 'gameId' }],
        getOrganizationGames: [{ name: 'orgSlug' }],
        createGameVersion: [{ name: 'versionData', type: 'textarea' }],
        getGameVersions: [{ name: 'gameId' }],
        updateGameVersion: [{ name: 'versionId' }, { name: 'versionData', type: 'textarea' }],
        createGameAsset: [{ name: 'assetData', type: 'textarea' }],
        getAssetsByVersion: [{ name: 'versionId' }],
        deleteGameAsset: [{ name: 'assetId' }],
        createTag: [{ name: 'tagData', type: 'textarea' }],
        getTagsForGame: [{ name: 'gameId' }],
        assignTagToGame: [{ name: 'gameId' }, { name: 'tagId' }],
        removeTagFromGame: [{ name: 'gameId' }, { name: 'tagId' }],
        getGamesByTag: [{ name: 'tagId' }],
        createReview: [{ name: 'reviewData', type: 'textarea' }],
        getGameReviews: [{ name: 'gameId' }],
        updateReview: [{ name: 'reviewId' }, { name: 'updateData', type: 'textarea' }],
        softDeleteGameReview: [{ name: 'reviewId' }],
        markAsRead: [{ name: 'notificationId' }],
        deleteNotification: [{ name: 'notificationId' }],
        setPreferences: [{ name: 'preferences', type: 'textarea' }],
        getUserOrganizations: [{ name: 'userId' }],
        createCategory: [{ name: 'categoryData', type: 'textarea' }],
        createArticle: [{ name: 'articleData', type: 'textarea' }],
        getArticle: [{ name: 'id' }],
        getArticlesByOrganization: [{ name: 'org_id' }],
        updateArticle: [{ name: 'id' }, { name: 'articleData', type: 'textarea' }],
        deleteArticle: [{ name: 'id' }],
        followUser: [{ name: 'userId' }],
        unfollowUser: [{ name: 'userId' }],
        createConversation: [{ name: 'data', type: 'textarea', defaultValue: '{"recipient_id": "some_user_id", "initial_message": "Hello!"}' }],
        acceptMessageRequest: [{ name: 'conversation_id' }],
        createMessage: [{ name: 'conversation_id' }, { name: 'data', type: 'textarea', defaultValue: '{"body": "Another message"}' }],
        getMessages: [{ name: 'conversation_id' }],
        getUserProfile: [{ name: 'username' }],
        updateProfilePicture: [{ name: 'username' }, { name: 'data', type: 'textarea', defaultValue: '{"avatar_url": "http://example.com/avatar.png"}' }],
        updateProfile: [{ name: 'username' }, { name: 'updateData', type: 'textarea' }],
        deleteUser: [{ name: 'username' }],
        getOnlineStatus: [{ name: 'username' }],
    };
    return params[functionName] || [];
}

export default ApiTestPage;