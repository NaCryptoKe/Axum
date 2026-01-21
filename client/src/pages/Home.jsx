import React, { useState, useRef } from 'react';
import Hero from '../components/Hero';
import MediaRow from '../components/MediaRow';
import PopModal from '../components/PopModal'; // New component
import { useGlassEffect } from '../components/Navbar/useGlass';
import video from '../Trailer.mp4';

const Home = () => {
    const filterRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Liquid Glass Hook for the SVG filter
    useGlassEffect(filterRef, {
        tintColor: "#ffffff",
        tintOpacity: 0.08,
        distortionStrength: 80,
        frostBlur: 10, 
    });

    const heroData = {
        backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop", 
        logoImage: "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_Cyberpunk_2077.svg", 
        price: "59.99",
        videoSrc: video,
        info: "Enter the massive open world of Night City, a place that sets new standards in terms of visuals, complexity and depth.",
        rating: "9.5/10 Editor's Choice"
    };

    const continuePlaying = [
        { title: "Cyberpunk 2077", coverImage: "https://images.unsplash.com/photo-1605898960710-9aa878345203?q=80&w=1000", rating: "9.2", price: "59.99" },
        { title: "Ghost of Tsushima", coverImage: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000", rating: "9.8", price: "49.99" },
        { title: "The Witcher 3", coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000", rating: "9.9", price: "29.99" },
        { title: "Death Stranding", coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000", rating: "9.0", price: "39.99" },
        { title: "Red Dead 2", coverImage: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=1000", rating: "10/10", price: "59.99" }
    ];

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        // Optional: Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="home-page" style={{ backgroundColor: '#424242', minHeight: '100vh' }}>
            <main>
                {/* Sticky Hero section: Slides behind content as you scroll */}
                <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 1 }}>
                    <Hero 
                        backgroundImage={heroData.backgroundImage}
                        logoImage={heroData.logoImage}
                        videoSrc={heroData.videoSrc}
                        price={heroData.price}
                        info={heroData.info}
                        rating={heroData.rating}
                    />
                </div>

                {/* Content Sections: Overlays the Hero with liquid glass rows */}
                <div 
                    className="content-sections" 
                    style={{ 
                        position: 'relative', 
                        zIndex: 10, 
                        backgroundColor: 'transparent',
                        marginTop: '-10vh' // Slight overlap with Hero vignette
                    }}
                >
                    <MediaRow 
                        rowTitle="Continue Playing" 
                        items={continuePlaying} 
                        onOpenModal={handleOpenModal}
                    />

                    <MediaRow 
                        rowTitle="Trending Now" 
                        items={continuePlaying} 
                        onOpenModal={handleOpenModal}
                    />

                    <MediaRow 
                        rowTitle="Most Anticipated" 
                        items={continuePlaying} 
                        onOpenModal={handleOpenModal}
                    />

                    <MediaRow 
                        rowTitle="Award Winners" 
                        items={continuePlaying} 
                        onOpenModal={handleOpenModal}
                    />
                    
                    {/* Extra spacing at the bottom */}
                    <div style={{ height: '200px' }} />
                </div>
            </main>

            {/* The iOS-style Pop Modal */}
            <PopModal 
                isOpen={!!selectedItem} 
                item={selectedItem} 
                onClose={handleCloseModal} 
            />

            {/* Liquid Glass Distortion SVG */}
            <svg width="0" height="0" style={{ position: 'absolute' }} ref={filterRef}>
                <defs>
                    <filter id="navbar-glass-distortion">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="92" result="noise" />
                        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="80" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default Home;