import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlayerLibrary, getPopularGames, getNewGames } from "../auth/gameService";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
    const { state: authState } = useAuth();
    const [sections, setSections] = useState({
        library: [],
        popular: [],
        newReleases: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHomeData() {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [libRes, popRes, newRes] = await Promise.all([
                    getPlayerLibrary(),
                    getPopularGames(),
                    getNewGames()
                ]);

                setSections({
                    library: libRes.status === "success" ? libRes.data : [],
                    popular: popRes.status === "success" ? popRes.data : [],
                    newReleases: newRes.status === "success" ? newRes.data : []
                });
            } catch (err) {
                console.error("Failed to load homepage data", err);
            } finally {
                setLoading(false);
            }
        }
        loadHomeData();
    }, []);

    if (loading) return <div className="loading">Loading your universe...</div>;

    return (
        <div className="homepage" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* 1. LIBRARY SECTION (Only shows if user has games) */}
            {sections.library.length > 0 && (
                <section style={{ marginBottom: "40px" }}>
                    <h2>Continue Playing</h2>
                    <div className="game-row" style={rowStyle}>
                        {sections.library.map(game => (
                            <GameCard key={game.gameId} game={game} isLibrary={true} />
                        ))}
                    </div>
                </section>
            )}

            {/* 2. POPULAR SECTION */}
            <section style={{ marginBottom: "40px" }}>
                <h2>Popular Games</h2>
                <div className="game-row" style={rowStyle}>
                    {sections.popular.length > 0 ? (
                        sections.popular.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <p>No popular games found.</p>
                    )}
                </div>
            </section>

            {/* 3. NEW RELEASES SECTION */}
            <section style={{ marginBottom: "40px" }}>
                <h2>New Releases</h2>
                <div className="game-row" style={rowStyle}>
                    {sections.newReleases.length > 0 ? (
                        sections.newReleases.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <p>No new releases today.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

// Internal Sub-component for Game Cards
function GameCard({ game, isLibrary = false }) {
    // Determine pathing based on your controller slugs
    const path = `/@${game.organizationSlug || 'dev'}/${game.gameSlug || game.slug}`;

    return (
        <Link to={path} style={cardStyle}>
            <div style={{ position: "relative" }}>
                <img 
                    src={game.coverImage || "/default-game.jpg"} 
                    alt={game.title} 
                    style={imgStyle} 
                />
                {isLibrary && (
                    <div style={playtimeBadge}>
                        {Math.floor(game.playtimeSeconds / 3600)}h played
                    </div>
                )}
            </div>
            <h4 style={{ margin: "10px 0 5px 0", color: "#fff" }}>{game.title}</h4>
            <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
                {isLibrary ? "Owned" : "View Details"}
            </span>
        </Link>
    );
}

// --- Styles ---
const rowStyle = {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "15px",
    scrollbarWidth: "thin"
};

const cardStyle = {
    minWidth: "200px",
    maxWidth: "200px",
    textDecoration: "none",
    background: "#1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s",
    border: "1px solid #333"
};

const imgStyle = {
    width: "100%",
    height: "250px",
    objectFit: "cover"
};

const playtimeBadge = {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem"
};