import React, { useRef } from 'react';
import './MediaRow.css';

const MediaRow = ({ rowTitle, items, onOpenModal }) => {
    const scrollerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollerRef.current) {
            const { scrollLeft, clientWidth } = scrollerRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.8 
                : scrollLeft + clientWidth * 0.8;
            
            scrollerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const handleCardClick = (e, item) => {
        // Capture exact position of the clicked card
        const rect = e.currentTarget.getBoundingClientRect();
        onOpenModal({
            ...item,
            originRect: rect // Pass coordinates to the modal
        });
    };

    return (
        <section className="media-row-container">
            <div className="media-row-glass-base" />
            <div className="media-row-content">
                <h2 className="media-row-header">{rowTitle}</h2>
                <div className="media-row-wrapper">
                    <button className="nav-btn left" onClick={() => scroll('left')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <div className="media-scroller" ref={scrollerRef}>
                        {items.map((item, index) => (
                            <div 
                                key={index} 
                                className="media-card" 
                                onClick={(e) => handleCardClick(e, item)}
                            >
                                <div className="media-card-inner">
                                    <img src={item.coverImage} alt={item.title} className="media-cover" />
                                    <div className="media-card-overlay" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="nav-btn right" onClick={() => scroll('right')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MediaRow;