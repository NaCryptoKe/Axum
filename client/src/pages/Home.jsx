import React, { useEffect, useMemo } from 'react';
import { useGames } from '../hooks/useGames';

const HomePage = () => {
    const { data, loading, error, fetchAllHomeData } = useGames();

    useEffect(() => {
        fetchAllHomeData();
    }, []);

    const featuredGame = useMemo(() => {
        if (data.topRated && data.topRated.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.topRated.length);
            return data.topRated[randomIndex];
        }
        return null;
    }, [data.topRated]);

    if (loading) return <p>Loading Discovery Feed...</p>;

    // Helper component to keep code clean
    const GameSection = ({ title, list }) => (
        <section >
            <h2>{title} ({list.length})</h2>
            <div className="game-grid" >
                {list.length > 0 ? list.map(game => (
                    <div key={game.id} className="game-card" >
                        <h4>{game.title}</h4>
                        <p>Rating: {game.avg_rating || 'N/A'}</p>
                        <p>${game.price?.toFixed(2) || '0.00'}</p>
                    </div>
                )) : <p>No games found in this category.</p>}
            </div>
        </section>
    );

    return (
        <div className="home-container">     

            {featuredGame && (
                <div className="hero-banner" >
                    <span>Featured Spotlight</span>
                    <h1>{featuredGame.title}</h1>
                    <p>{featuredGame.description || "Jump back into the action."}</p>
                    <button className="play-button">Play Now</button>
                </div>
            )}

            {data.libray > 0 ? (<GameSection title="Continue Playing" list={data.library} />) : null}
            <GameSection title="Popular Games" list={data.popular} />
            <GameSection title="New Arrivals" list={data.newArrivals} />
            <GameSection title="Top Rated" list={data.topRated} />
            
        </div>
    );
};

export default HomePage;