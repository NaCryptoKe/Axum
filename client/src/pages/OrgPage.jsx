import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrganizations } from '../hooks/useOrganizations';

const OrgPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    // 1. We only need 'fetchAllOrgData' now, not the individual fetchers
    const { 
        organization, 
        games, 
        members, 
        role, 
        fetchAllOrgData, 
        loading, 
        error 
    } = useOrganizations();

    // 2. Single Effect to load everything at once
    useEffect(() => {
        fetchAllOrgData(slug);
    }, [slug, fetchAllOrgData]);

    if (loading) return <div className="loading">Loading Organization...</div>;
    if (error) return <div className="error">{error}</div>;
    // Safe check: Only render "Not Found" if we are NOT loading and org is null
    if (!loading && !organization) return <div className="not-found">Organization not found</div>;

    // 3. Simplified Role Checks
    // Ensure role exists before checking equality to prevent crashes
    const isOwner = role === 'owner';
    const isAdmin = role === 'admin';
    const isDev = role === 'developer'; 
    const isFinance = role === 'finance';

    return (
        <div className="org-page-container">
            <header className="org-header">
                <h1>{organization.name}</h1>
                
                {(isOwner) && (
                    <div className="org-actions">
                        <button onClick={() => navigate(`/orgs/${slug}/edit`)} className="edit-org-button">
                            RBAC
                        </button>
                    </div>
                )}
                {(isOwner || isAdmin) && (
                    <div className="org-actions">
                        <button onClick={() => navigate(`/orgs/${slug}/edit`)} className="edit-org-button">
                            Edit Organization
                        </button>
                        
                        {/* Only show "Manage" if they have permission */}
                        <button className="admin-org-button">
                            Manage Members
                        </button>
                    </div>
                )}
                {(isOwner || isAdmin || isFinance) && (
                    <div className="org-actions">
                        <button onClick={() => navigate(`/orgs/${slug}/edit`)} className="edit-org-button">
                            Check Finance Analytics
                        </button>
                    </div>
                )}
                {(isOwner || isAdmin || isDev) && (
                    <div className="org-actions">
                        <button onClick={() => navigate(`/orgs/${slug}/edit`)} className="edit-org-button">
                            Upload Game
                        </button>
                    </div>
                )}
            </header>

            <section className="org-description">
                <h3>@{organization.slug}</h3>
                <p>{organization.description || "No description provided."}</p>
                <p>Created at: {new Date(organization.created_at).toLocaleDateString()}</p>
                
                {organization.website_url && (
                    <p>
                        Website: <a href={organization.website_url} target="_blank" rel="noreferrer">{organization.website_url}</a>
                    </p>
                )}
                
                {organization.contact_email && (
                    <p>Contact: <a href={`mailto:${organization.contact_email}`}>{organization.contact_email}</a></p>
                )}
            </section>

            <section>
                {/* 5. Safe Access for Arrays */}
                <h2>Members ({members?.length || 0})</h2>
                <div className="member-grid">
                    {members && members.length > 0 ? members.map(member => (
                        <div key={member.id} className="member-card">
                            <h4>
                                <Link to={`/@${member.username}`}>@{member.username}</Link>
                            </h4>
                            {/* Simple fallback for images */}
                            <img 
                                src={member.avatarUrl || '/default-avatar.png'} 
                                alt={member.username} 
                                style={{width: 50, height: 50, borderRadius: '50%'}}
                            />
                            <p>Role: {member.role}</p>
                            <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
                        </div>
                    )) : <p>No members found in this organization.</p>}
                </div>
            </section>

            <section>
                <h2>Games ({games?.length || 0})</h2>
                <div className="game-grid">
                    {games && games.length > 0 ? games.map(game => (
                        <div key={game.id} className="game-card">
                            <h4>{game.title}</h4>
                            <p>Status: {game.status}</p>
                            <p>Release: {game.release_date || 'TBD'}</p>
                        </div>
                    )) : <p>No games found in this organization.</p>}
                </div>
            </section>
        </div>
    );
};

export default OrgPage;