import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; 
import './Hero.css';

const Hero = ({ backgroundImage, logoImage, videoSrc, price, info, rating }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isScrolledPast, setIsScrolledPast] = useState(false);
    const videoRef = useRef(null);

    // Effect for the 5s initial delayed video start
    useEffect(() => {
        if (videoSrc && !isScrolledPast && !showVideo) {
            const timer = setTimeout(() => {
                setShowVideo(true);
                if (videoRef.current) videoRef.current.play();
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [videoSrc, isScrolledPast, showVideo]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 0.5;
            
            if (window.scrollY > scrollThreshold) {
                // User scrolled down: Hide and Pause
                setIsScrolledPast(true);
                setShowVideo(false);
                if (videoRef.current) videoRef.current.pause();
            } else {
                // User scrolled up: Re-enable video logic
                setIsScrolledPast(false);
                // If we scroll back up, we want the video to reappear
                setShowVideo(true);
                if (videoRef.current) videoRef.current.play();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <section className="hero-container">
            {/* Background Image Layer */}
            <div 
                className={`hero-bg ${showVideo ? 'fade-out' : ''}`} 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            
            {/* Video Layer */}
            {videoSrc && (
                <video 
                    ref={videoRef}
                    className={`hero-video ${showVideo ? 'visible' : ''}`}
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
            )}

            <div className="hero-vignette" />

            <div className={`hero-glass-card ${showVideo ? 'minimized' : ''}`}>
                <div className="hero-badge-row">
                    <span className="hero-price">${price}</span>
                    <div className="hero-rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span>{rating}</span>
                    </div>
                </div>

                <div className="hero-logo-wrapper">
                    <img src={logoImage} alt="Game Title" className="hero-title-img" />
                </div>

                <p className="hero-info">{info}</p>

                <div className="hero-actions">
                    <Button 
                        color="#ffffff" 
                        className="hero-cta-btn" 
                        onClick={() => console.log("Play!")}
                    >
                        Play Now
                    </Button>

                    {showVideo && (
                        <Button 
                            color="rgba(255, 255, 255, 0.1)" 
                            className="mute-btn" 
                            onClick={toggleMute}
                        >
                            <span className="mute-icon-fix">{isMuted ? '🔇' : '🔊'}</span>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;