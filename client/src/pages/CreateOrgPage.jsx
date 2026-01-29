import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '../hooks/useOrganizations';

const CreateOrgPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const { createNewOrg, loading, error } = useOrganizations();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const org = await createNewOrg({ 
                name: name,
                description: description,
                website_url: website
            });
            
            if (org.status === 'success') {
                console.log(org.data.name)
            }
            //navigate(`/organizations/@${org.slug}`);
        } catch (err) {
            // Error is handled by the hook's state
            console.error("Creation failed:", err);
        }
    };

    return (
        <div className="create-org-container">
            <h1>Create a New Organization</h1>
            <p>Organizations allow you to manage teams and publish games together.</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="orgName">Organization Name</label>
                    <input
                        id="orgName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Moonlight Studios"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="orgWebsite">Organization Website</label>
                    <input
                        id="orgWebsite"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="e.g. https://Moonlight-Studios.com"
                        disabled={loading}
                    />
                    <p>Optional</p>
                </div>

                <div className="form-group">
                    <label htmlFor="orgDesc">Organization Description</label>
                    <textarea
                        id="orgDesc"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. A Description about Moonlight Studios"
                        disabled={loading}
                    />
                    <p>Optional</p>
                </div>

                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={loading || !name.trim()}>
                    {loading ? "Creating..." : "Create Organization"}
                </button>
                <button type="button" onClick={() => navigate(-1)} disabled={loading}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateOrgPage;