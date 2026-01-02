import React, { useState, useEffect, useRef } from 'react';

// Components
import Background from '../components/Background';
import GameOverlay from '../components/GameOverlay';

// Assets
import coverart from '../assets/Images/Ghost of Yotei.png';
import titleTreatment from '../assets/Images/Logo.png';
import cart from '../assets/shopping-cart.svg';
import wishlist from '../assets/bookmark-simple.svg';
import trailer from '../assets/Trailer.mp4';

const Home = ({ isUserActive, isVideoActive, setIsUserActive, setIsVideoActive }) => {
    const videoRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
    // Start video after 7 seconds
    const timer = setTimeout(() => {
        setIsVideoActive(true);
        videoRef.current?.play();
        setIsUserActive(false); 
    }, 7000);

    return () => clearTimeout(timer);
    }, [setIsVideoActive, setIsUserActive]);

    const handleMouseMove = () => {
    setIsUserActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Hide UI after 3 seconds of inactivity if video is active
    timeoutRef.current = setTimeout(() => {
        if (isVideoActive) setIsUserActive(false);
    }, 3000);
    };

    return (
    <main 
        className={`container ${isVideoActive ? 'video-mode' : ''} ${!isUserActive ? 'hide-ui' : ''}`}
        onMouseMove={handleMouseMove}
    >
        <Background 
        ref={videoRef} 
        coverImg={coverart} 
        videoSrc={trailer} 
        isVideoActive={isVideoActive} 
        />

        <GameOverlay 
        title={titleTreatment}
        description="Ghost of Yotei: In 1603, a new Ghost, Atsu, sets out on a journey in the lands surrounding Mount Yōtei, an area filled with sprawling grasslands, snowy tundras, and unexpected dangers."
        price="69.99$"
        cartIcon={cart}
        wishlistIcon={wishlist}
        />
    </main>
    );
};

export default Home;