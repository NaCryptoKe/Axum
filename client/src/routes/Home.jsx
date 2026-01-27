import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularGames, getPlayerLibrary, getNewGames } from "../auth/gameService";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
    const [populargames, setPopulargames] = useState([]);
    const [newgames, setNewgames] = useState([]);
    const [librarygames, setLibrarygames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGames() {
            try {
                setLoading(true);
                const response = await getPopularGames();
                console.log(response);
                
                if (response.status === 'success') {
                    setPopulargames(response.data); 
                } else {
                    setError("Failed to load games");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, []);

    useEffect(() => {
        async function fetchNewGames() {
            try {
                setLoading(true);
                const response = await getNewGames();
                console.log(response);
                
                if (response.status === 'success') {
                    setNewgames(response.data); 
                } else {
                    setError("Failed to load games");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        }

        fetchNewGames();
    }, []);

    useEffect(() => {
        async function fetchLibrary() {
            try {
                setLoading(true);
                const response = await getPlayerLibrary();
                console.log(response);
                
                if (response.status === 'success') {
                    setLibrarygames(response.data); 
                } else {
                    setError("Failed to load games");
                }
            } catch (err) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        }

        fetchLibrary();
    }, []);

    if (loading) return <p>Loading games...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <img src="https://qrdohxvbcmznrejxijgg.supabase.co/storage/v1/object/public/Axum/uploads/1769508639322_nature-3082832.jpg" alt="A description of the image" style={{width: '100dvw', height: '100dvh'}} />
            
            <h1>Popular Game Goes Here</h1>
            <h3>It's details</h3>
            <p>Price: $1000</p>
            <p>Rating: 4.8</p>
            <p>Downloads: 15,000</p>
            {librarygames && librarygames.length > 0 ? (
                <>
                    <h1>Continue Playing</h1>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {librarygames.map((game) => (
                            <div key={game.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                                <img 
                                    src={game.cover_image_url} 
                                    alt={game.title} 
                                    style={{ width: '150px', height: '200px', objectFit: 'cover' }} 
                                />
                                <h3>{game.title}</h3>
                                <p>Acquired: {new Date(game.acquiredAt).toLocaleDateString()}</p>
                                <p>Playtime: {game.playtime} mins</p>
                                <p>Last Played: {game.lastPlayed || 'Never'}</p>
                                <button>Play Now</button>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            <h1>Popular Games</h1>
            <div>
                {populargames.length > 0 ? (
                    populargames.map((game) => (
                        <div key={game.id} >
                            <p>{game.cover_image_url}</p>
                            <h3>{game.title}</h3>
                            <p>${(game.price).toFixed(2)}</p>
                            <p>{game.review_count}</p>
                            <p>{game.avgRating === null ? 0 : game.avgRating}</p>
                            <Link to={`/game/${game.slug}`}>View Details</Link>
                        </div>
                    ))
                ) : (
                    <p>No games found.</p>
                )}
            </div>

            <h1>New Games</h1>
            <div>
                {newgames.length > 0 ? (
                    newgames.map((game) => (
                        <div key={game.id} >
                            <p>{game.cover_image_url}</p>
                            <h3>{game.title}</h3>
                            <p>${(game.price).toFixed(2)}</p>
                            <p>{game.review_count}</p>
                            <p>{game.avgRating === null ? 0 : game.avgRating}</p>
                            <Link to={`/game/${game.slug}`}>View Details</Link>
                        </div>
                    ))
                ) : (
                    <p>No games found.</p>
                )}
            </div>
        </div>
    );
}