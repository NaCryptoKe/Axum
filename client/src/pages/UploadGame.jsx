import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGames } from '../hooks/useGames';

const UploadGamePage = () => {
    const { slug } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); // Required to access location.state
    const { addNewGame, loading, error } = useGames();

    const orgId = location.state?.orgId;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        status: 'draft',
        tags_cache: '',
        cover_image_url: '',
        release_date: '',
        metadata: {} 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const gamePayload = {
                ...formData,
                org_id: orgId
            };

            console.log(gamePayload.org_id, gamePayload.title, gamePayload.slug, gamePayload.status)
            const result = await addNewGame(gamePayload);
            
            if (result) {
                navigate(`/orgs/${slug}`);
            }
        } catch (err) {
            // Error is handled by hook state
        }
    };

    const cleanOrgSlug = slug.startsWith('@') ? slug.substring(1) : slug;

    return (
        <div className="upload-page">
            <h2>Upload New Game to {cleanOrgSlug}</h2>
            
            {error && <p className="error-msg" style={{color: 'red'}}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Game Title</label>
                    <input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="e.g. Space Explorer"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Game URL Slug</label>
                    <input 
                        name="slug" 
                        value={formData.slug} 
                        onChange={handleChange} 
                        placeholder="e.g. space-explorer"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label>Release Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="draft">Draft</option>
                        <option value="upcoming">Early Access</option>
                        <option value="published">Released</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Cover Image URL</label>
                    <input 
                        name="cover_image_url" 
                        value={formData.cover_image_url} 
                        onChange={handleChange} 
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label>Release Date</label>
                    <input 
                        name="release_date" 
                        type="date"
                        value={formData.release_date} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>Tags (Comma separated)</label>
                    <input 
                        name="tags_cache" 
                        value={formData.tags_cache} 
                        onChange={handleChange} 
                        placeholder="indie, multiplayer, 2d"
                    />
                </div>

                <div className="form-group">
                    <label>System Requirements / Metadata (JSON string)</label>
                    <textarea 
                        name="metadata" 
                        value={formData.metadata} 
                        onChange={handleChange} 
                        placeholder='{"os": "Windows 10", "ram": "8GB"}'
                    />
                </div>

                <div className="form-actions" style={{marginTop: '20px'}}>
                    <button type="submit" disabled={loading}>
                        {loading ? "Uploading..." : "Create Game"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadGamePage;