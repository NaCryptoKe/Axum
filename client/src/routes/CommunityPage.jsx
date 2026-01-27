import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrganizations } from "../auth/organizationService";

export default function CommunityPage() {
    const [allOrgs, setAllOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrganizations().then(res => {
            if (res.status === "success") setAllOrgs(res.data.organizations);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading communities...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Communities</h1>
                <Link to="/community/create">
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>+ Create Organization</button>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {allOrgs.map(o => (
                    <Link key={o.id} to={`/organizations/${o.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#464646ff' }}>
                            <h3>{o.name}</h3>
                            <p>@{o.slug}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}