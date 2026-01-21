import React, { useState, useRef, useLayoutEffect } from 'react';
import { useGlassEffect } from './useGlass';
import './Navbar.css';

const NAV_ITEMS = ["Home", "About", "Products", "Contact"];

const Navbar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);

    const navRef = useRef(null);
    const itemsRef = useRef([]);
    const indicatorRef = useRef(null);
    const filterRef = useRef(null);
    const timeoutRef = useRef(null);

    // 1. Updated Configuration to match apple.js GLASS_CONFIG
    useGlassEffect(filterRef, {
        shadowColor: "#ffffff",      // Inner glow
        shadowBlur: 20,
        shadowSpread: -5,
        tintColor: "#ffffff",
        tintOpacity: 0.04,           // Crucial: Apple's glass is much clearer (was 0.2)
        frostBlur: 2,                // Background blur
        noiseFrequency: 0.008,       // Larger, smoother ripples (was 0.015)
        distortionStrength: 77,      // Stronger refraction (was 30)
        outerShadowBlur: 10,         // The drop shadow spread
    });

    useLayoutEffect(() => {
        // ... (Keep your existing animation logic exactly the same) ...
        if (prevIndex === null) { 
             const targetItem = itemsRef.current[activeIndex];
             if (!targetItem || !indicatorRef.current || !navRef.current) return;
             indicatorRef.current.style.transition = 'none';
             indicatorRef.current.style.width = `${targetItem.offsetWidth}px`;
             indicatorRef.current.style.left = `${targetItem.offsetLeft}px`;
             indicatorRef.current.offsetHeight;
             indicatorRef.current.style.transition = '';
             return;
        }

        const toItem = itemsRef.current[activeIndex];
        
        if (!toItem || !indicatorRef.current) return;

        if(timeoutRef.current) clearTimeout(timeoutRef.current);

        const distance = Math.abs(activeIndex - prevIndex);
        const travelTime = 140 + distance * 70;

        const indicator = indicatorRef.current;
        indicator.style.transition = "none";
        indicator.offsetHeight; 

        indicator.style.transition = `
            left ${travelTime}ms cubic-bezier(0.25, 0.9, 0.25, 1),
            width ${travelTime}ms cubic-bezier(0.25, 0.9, 0.25, 1),
            transform ${travelTime}ms cubic-bezier(0.3, 0, 0.2, 1)
        `;
        indicator.style.transform = "translateY(-50%) scaleX(1.15) scaleY(0.7)";
        indicator.style.left = `${toItem.offsetLeft}px`;
        indicator.style.width = `${toItem.offsetWidth}px`;

        timeoutRef.current = setTimeout(() => {
            indicator.style.transition = "transform 140ms cubic-bezier(0.2,0.8,0.2,1)";
            indicator.style.transform = "translateY(-50%) scaleX(1.05) scaleY(1.15)";

            timeoutRef.current = setTimeout(() => {
                indicator.style.transition = "transform 160ms cubic-bezier(0.25,0.9,0.25,1)";
                indicator.style.transform = "translateY(-50%) scale(1)";
            }, 120);
        }, travelTime - 40);

    }, [activeIndex, prevIndex]);
    
    const handleItemClick = (index) => {
        if (index === activeIndex) return;
        setPrevIndex(activeIndex);
        setActiveIndex(index);
    }

    return (
        <>
            <nav className="navbar-container" ref={navRef}>
                <div className="glass-indicator" ref={indicatorRef}></div>
                {NAV_ITEMS.map((item, index) => (
                    <div
                        key={item}
                        className="nav-item"
                        ref={el => itemsRef.current[index] = el}
                        onClick={() => handleItemClick(index)}
                    >
                        {item}
                    </div>
                ))}
            </nav>

            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} ref={filterRef}>
                <defs>
                    <filter id="navbar-glass-distortion">
                        {/* Updated baseFrequency to match apple.js logic (controlled by hook, but good default) */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="92" result="noise" />
                        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                        {/* Scale is updated by the hook to 77 */}
                        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
        </>
    );
};

export default Navbar;