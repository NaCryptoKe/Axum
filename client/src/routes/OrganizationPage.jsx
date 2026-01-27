import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // Import your Auth Context
import { 
    getOrganization, getOrganizationMembers, joinOrganization, 
    leaveOrganization, updateOrganization 
} from "../auth/organizationService";

export default function OrganizationPage() {
    const { slug } = useParams();
    const { state: authState, logout } = useAuth(); 
    const [org, setOrg] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Update State (Matches your specific requirement)
    const [editData, setEditData] = useState({
        name: null, slug: slug, description: "", website_url: "", contact_email: ""
    });

    const fetchData = async () => {
        const [orgRes, memRes] = await Promise.all([getOrganization(slug), getOrganizationMembers(slug)]);
        if (orgRes.status === "success") {
            setOrg(orgRes.data.organization);
            setEditData({ ...editData, description: orgRes.data.organization.description || "" });
        }
        if (memRes.status === "success") setMembers(memRes.data.members);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [slug]);

    const isMember = members.some(m => m.user_id === user?.id);
    const isOwner = org?.owner_id === user?.id;

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateOrganization(org.id, editData);
        setIsEditing(false);
        fetchData();
    };

    if (loading) return <p>Loading...</p>;
    if (!org) return <p>Organization not found.</p>;

    return (
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            <div>
                <h1>{org.name} {org.is_verified && "✅"}</h1>
                <p>{org.description || "No description provided."}</p>
                
                {/* ACTION BUTTONS */}
                <div style={{ marginBottom: '20px' }}>
                    {isMember ? (
                        <button onClick={() => leaveOrganization(slug, {user_id: user.id}).then(fetchData)}>Leave Organization</button>
                    ) : (
                        <button onClick={() => joinOrganization(slug, {role: 'member'}).then(fetchData)}>Join Organization</button>
                    )}

                    {isOwner && (
                        <button style={{ marginLeft: '10px' }} onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel Edit" : "Update Details"}
                        </button>
                    )}
                </div>

                {/* OWNER UPDATE FORM */}
                {isEditing && (
                    <form onSubmit={handleUpdate} style={{ background: '#eee', padding: '15px', borderRadius: '8px' }}>
                        <h3>Edit Organization</h3>
                        <textarea style={{ width: '100%' }} value={editData.description} 
                            onChange={e => setEditData({...editData, description: e.target.value})} placeholder="Description" /><br/>
                        <input type="url" value={editData.website_url} 
                            onChange={e => setEditData({...editData, website_url: e.target.value})} placeholder="Website URL" /><br/>
                        <button type="submit">Save Changes</button>
                    </form>
                )}
            </div>

            {/* MEMBERS LIST */}
            <aside>
                <h3>Members ({members.length})</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {members.map(m => (
                        <li key={m.user_id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            User: {m.user_id} <br/>
                            <small style={{ color: '#666' }}>Role: {m.role}</small>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}