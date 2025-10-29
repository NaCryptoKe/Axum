import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

function Profile() {
  const { username } = useParams();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("URL param username:++", username);
    console.log("Current logged-in user:", user);

    const loadProfile = async () => {
      try {
        // if current user matches the requested one, use cached data
        if (user && user.username === username) {
          console.log("Using cached profile:", user);
          setProfile(user);
        } else {
          console.log("Fetching profile from API:", `/auth/profile/${username}`);
          const res = await api.get(`/auth/profile/${username}`);
          console.log("API success:", res.data);
          setProfile(res.data);
        }
      } catch (err) {
        console.error("API error:", err.response?.data || err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, user]);

  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>Profile not found 😔</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1>@{profile.username}</h1>
      <p><strong>Display Name:</strong> {profile.display_name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      {user && user.username === profile.username && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}

export default Profile;
