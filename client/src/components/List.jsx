export function List ({ title, list }) {
    return(
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
}