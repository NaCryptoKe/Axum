import React, { useEffect, useMemo } from 'react';
import { useGames } from '../hooks/useGames';
import { List } from '../components/List'

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
            <List title="Popular Games" list={data.popular} />
            <List title="New Arrivals" list={data.newArrivals} />
            <List title="Top Rated" list={data.topRated} />
            
        </div>
    );
};

export default HomePage;