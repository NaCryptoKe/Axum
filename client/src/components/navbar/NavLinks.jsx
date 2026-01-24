import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../Input";
import { Button } from "../Button";
import { useAuth } from "../../auth/AuthContext"; 

export function NavLinks({ authState }) {
    const [search, setSearch] = useState("");
    // Use the 'logout' function provided by AuthContext, not dispatch
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    if (authState.status === "loading") {
        return null;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };

    const handleLogout = async () => {
        try {
            // This calls handleLogout in AuthContext.jsx
            // which runs the API call AND updates the state automatically
            await logout(); 
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <ul>
            {/* UNIVERSAL LINKS */}
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/charts">Charts</Link></li>

            <li>
                <form onSubmit={handleSearch} style={{ display: 'inline-flex' }}>
                    <Input
                        name="search"
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search..." 
                    />
                    <Button type="submit">Search</Button>    
                </form>    
            </li>

            {/* LOGGED OUT ONLY */}
            {authState.status === "unauthenticated" && (
                <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </>
            )}

            {/* LOGGED IN ONLY */}
            {authState.status === "authenticated" && (
                <>
                    <li><Link to="/messages">Message</Link></li>
                    <li><Link to="/notification">Notifications</Link></li>
                    
                    <li>
                        <Link to={`/@${authState.user?.username}`}>
                            {authState.user.avatarUrl ? (
                                <img src={authState.user.avatarUrl} alt="Profile" crossOrigin="anonymous" style={{ width: '30px', borderRadius: '50%' }} />
                            ) : authState.user.username}
                        </Link>
                    </li>

                    <li>
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </li>

                    {/* ADMIN ONLY */}
                    {authState.user.role === "admin" && (
                        <li><Link to="/admin">Admin</Link></li>
                    )}
                </>
            )}
        </ul>
    );
}