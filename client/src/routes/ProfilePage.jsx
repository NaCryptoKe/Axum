import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    getUserProfile, 
    updateProfile, 
    updateProfilePicture, 
    deleteUser, 
    followUser, 
    unfollowUser 
} from "../auth/authService";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/Button";

export default function ProfilePage() {
    const { username } = useParams();
    const { state: authState, logout } = useAuth(); 
    const navigate = useNavigate();
    const fileInputRef = useRef(null); 

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // New state for follows
    const [editData, setEditData] = useState({
        newUsername: "",
        display_name: "",
        bio: "",
        email: ""
    });

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            const response = await getUserProfile(username);
            
            if (response.status === "success") {
                setProfile(response.data);
                // Set follow status from backend data
                setIsFollowing(response.data.isFollowing || false);
                
                setEditData({
                    newUsername: response.data.username || "",
                    display_name: response.data.displayName || "",
                    bio: response.data.bio || "",
                    email: response.data.email || ""
                });
                setError(null);
            } else {
                setError(response.message || "User not found");
            }
            setLoading(false);
        }
        fetchProfile();
    }, [username]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleFollowToggle = async () => {
        try {
            const res = isFollowing 
                ? await unfollowUser(profile.id) 
                : await followUser(profile.id);
            
            if (res.status === "success") {
                // Update both the toggle and the count locally
                setIsFollowing(!isFollowing);
                setProfile(prev => ({
                    ...prev,
                    followerCount: isFollowing 
                        ? parseInt(prev.followerCount) - 1 
                        : parseInt(prev.followerCount) + 1
                }));
            }
        } catch (err) {
            console.error("Follow toggle error:", err);
        }
    };

    const handleImageClick = () => {
        if (authState.user?.username === profile?.username) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);

        try {
            const res = await updateProfilePicture(username, { avatar_url: previewUrl });
            if (res.status === "success") {
                setProfile((prev) => ({ ...prev, profilePicture: previewUrl }));
            } else {
                alert(res.message || "Image update failed");
            }
        } catch (err) {
            console.error("Image upload error:", err);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action is permanent and you will be logged out."
        );

        if (!confirmed) return;

        try {
            // Keeping your specific @ logic
            const response = await deleteUser(`@${profile.username}`);
            
            if (response.status === "success") {
                alert("Account successfully deactivated.");
                await logout(); 
                navigate("/login");
            } else {
                alert(response.message || "Failed to delete account.");
            }
        } catch (err) {
            console.error("Delete account error:", err);
            alert("An error occurred while trying to delete the account.");
        }
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                newUsername: editData.newUsername,
                email: editData.email,
                bio: editData.bio,
                display_name: editData.display_name
            };

            const res = await updateProfile(username, payload);
            
            if (res.status === "success") {
                if (editData.newUsername !== username) {
                    navigate(`/@${editData.newUsername}`);
                }

                setProfile((prev) => ({ 
                    ...prev, 
                    username: editData.newUsername,
                    displayName: editData.display_name, 
                    bio: editData.bio,
                    email: editData.email 
                }));
                setIsEditing(false);
            } else {
                alert(res.message || "Update failed");
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return null;

    const isOwner = authState.user?.username === profile.username;

    return (
        <div className="profile-page" style={{ padding: "20px" }}>
            <div className="profile-container">
                <header className="profile-header" style={{ textAlign: "center", marginBottom: "30px" }}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: "none" }} 
                        accept="image/*" 
                        onChange={handleFileChange}
                    />
                    
                    <div 
                        onClick={handleImageClick}
                        style={{ 
                            position: "relative", 
                            display: "inline-block", 
                            cursor: isOwner ? "pointer" : "default" 
                        }}
                    >
                        <img 
                            src={profile.profilePicture || "/guest.jpg"} 
                            alt={profile.username} 
                            style={{ 
                                width: '150px', 
                                height: '150px', 
                                borderRadius: '50%', 
                                objectFit: 'cover',
                                border: isOwner ? '3px solid #007bff' : '3px solid #ccc'
                            }}
                        />
                        {isOwner && (
                            <div style={{
                                position: "absolute",
                                bottom: "5px",
                                right: "5px",
                                background: "#fff",
                                borderRadius: "50%",
                                padding: "5px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                            }}>📷</div>
                        )}
                    </div>
                    <h1>{profile.displayName} (@{profile.username})</h1>
                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "15px 0" }}>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontWeight: "bold", display: "block" }}>{profile.followingCount}</span>
                            <span style={{ color: "#666", fontSize: "0.9rem" }}>Following</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span style={{ fontWeight: "bold", display: "block" }}>{profile.followerCount}</span>
                            <span style={{ color: "#666", fontSize: "0.9rem" }}>Followers</span>
                        </div>
                    </div>
                    <p className={`status ${profile.isOnline ? 'online' : 'offline'}`}>
                        {profile.isOnline ? "● Online" : "○ Offline"}
                    </p>
                </header>

                <div className="profile-details">
                    <h3>Bio</h3>
                    {isEditing ? (
                        <textarea 
                            style={{ width: '100%', minHeight: '80px', padding: '10px' }}
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        />
                    ) : (
                        <p>{profile.bio || "No bio yet."}</p>
                    )}

                    <h3>Details</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</li>
                        
                        {(isOwner || isFollowing) && (
                            <li style={{ marginTop: "10px" }}>
                                <strong>Email:</strong> {isEditing ? (
                                    <input 
                                        value={editData.email}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    />
                                ) : profile.email}
                            </li>
                        )}
                        {isEditing && (
                            <>
                                <li style={{ marginTop: "10px" }}>
                                    <strong>Username:</strong>
                                    <input 
                                        value={editData.newUsername}
                                        onChange={(e) => setEditData({ ...editData, newUsername: e.target.value })}
                                    />
                                </li>
                                <li style={{ marginTop: "10px" }}>
                                    <strong>Display Name:</strong>
                                    <input 
                                        value={editData.display_name}
                                        onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                                    />
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
                {isOwner ? (
                    <>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {isEditing ? (
                                <>
                                    <Button onClick={handleUpdate}>Save Changes</Button>
                                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                                </>
                            )}
                        </div>
                        {!isEditing && (
                            <Button 
                                variant="danger" 
                                onClick={handleDeleteAccount}
                                style={{ backgroundColor: '#dc3545', color: 'white', marginTop: '10px' }}
                            >
                                Delete Account
                            </Button>
                        )}
                    </>
                ) : (
                    /* FOLLOW BUTTON FOR NON-OWNERS */
                    <Button 
                        variant={isFollowing ? "secondary" : "primary"} 
                        onClick={handleFollowToggle}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                )}            
            </div>            
        </div>
    );
}