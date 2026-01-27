import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../auth/organizationService";

export default function CreateOrganization() {
    const [data, setData] = useState({ name: "", slug: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await createOrganization(data);
        if (res.status === "success") {
            navigate(`/organizations/@${res.data.organization.slug}`);
        } else {
            alert(res.message || "Error creating organization");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h1>Register Organization</h1>
            <form onSubmit={handleSubmit}>
                <label>Organization Name</label>
                <input style={{ width: '100%', marginBottom: '10px' }} type="text" required 
                    onChange={e => setData({...data, name: e.target.value})} />
                
                <label>Slug (URL handle)</label>
                <input style={{ width: '100%', marginBottom: '20px' }} type="text" required 
                    onChange={e => setData({...data, slug: e.target.value})} />
                
                <button type="submit" style={{ width: '100%' }}>Create</button>
            </form>
        </div>
    );
}