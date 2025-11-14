import React from 'react';

const WireframeComponent = () => {
    return (
        <div className="container">
            {/* // Vanilla CSS Styles for Structure and Shimmer Animation
            // NOTE: All Tailwind classes have been replaced with pure CSS.
            */}
            <style>
                {`
                /* ------------------------------------------------------------------ */
                /* 1. CONTAINER STYLES (MODIFIED for Full Screen) */
                /* ------------------------------------------------------------------ */
                .container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 100vh;
                    background-color: #4a5568; /* A dark gray background */
                    /* FIX: Removed padding: 1rem; to allow full screen coverage */
                    padding: 0;
                    position: relative;
                    overflow: hidden; 
                    font-family: 'Inter', sans-serif;
                }

                /* ------------------------------------------------------------------ */
                /* 2. SKELETON (SVG) STYLES */
                /* ------------------------------------------------------------------ */
                .wireframe-svg {
                    position: relative;
                    z-index: 10;
                    border-radius: 0.5rem;
                    /* Custom shadow for depth */
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    /* Ensures the shimmer effect doesn't bleed out of the SVG corners */
                    overflow: hidden; 
                }

                /* ------------------------------------------------------------------ */
                /* 3. SHIMMER STREAK STYLES & ANIMATION */
                /* ------------------------------------------------------------------ */
                .shimmer-streak {
                    /* Replaces: absolute inset-0 z-20 pointer-events-none animate-shimmer */
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 20;
                    pointer-events: none;

                    /* Use the full width/height of the container */
                    width: 150%; 
                    height: 100%;

                    /* Apply the custom shimmer animation */
                    animation: shimmer 1.5s infinite linear;
                }

                /* The actual shimmer animation keyframes */
                @keyframes shimmer {
                    0% {
                        /* Start position: way off the left edge, skewed */
                        transform: translateX(-100%) skewX(-30deg);
                    }
                    100% {
                        /* End position: way off the right edge, skewed */
                        transform: translateX(200%) skewX(-30deg);
                    }
                }
                `}
            </style>

            {/* The SVG wireframe content - positioned relatively above the shimmer */}
            <svg
                viewBox="0 0 1920 1080"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="wireframe-svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <g clipPath="url(#clip0_201_14)">
                    <rect width="1920" height="1080" fill="#777777"/>
                    <g filter="url(#filter0_d_201_14)">
                        <path d="M660 238C660 229.163 667.163 222 676 222H1244C1252.84 222 1260 229.163 1260 238V1006C1260 1014.84 1252.84 1022 1244 1022H676C667.163 1022 660 1014.84 660 1006V238Z" fill="#888888"/>
                        <rect x="768" y="305" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="768" y="385" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="768" y="465" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="768" y="545" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="768" y="625" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="768" y="705" width="400" height="35" rx="8" fill="#999999"/>
                        <rect x="786" y="772" width="20" height="20" rx="4" fill="#999999"/>
                        <rect x="816" y="772" width="300" height="20" fill="#999999"/>
                        <rect x="786" y="807" width="20" height="20" rx="4" fill="#999999"/>
                        <rect x="816" y="807" width="200" height="20" fill="#999999"/>
                        <rect x="853" y="857" width="246" height="34" rx="8" fill="#999999"/>
                        <rect x="868" y="911" width="32" height="32" fill="#999999"/>
                        <rect x="960" y="911" width="32" height="32" fill="#999999"/>
                        <rect x="1052" y="911" width="32" height="32" fill="#999999"/>
                        <rect x="853" y="971" width="250" height="20" fill="#999999"/>
                    </g>
                    <rect y="93" width="1920" height="70" fill="#888888"/>
                    <rect x="1840" y="112" width="32" height="32" fill="#AAAAAA"/>
                    <rect x="690" y="108" width="650" height="40" rx="8" fill="#999999"/>
                    <rect x="1297" y="116" width="24" height="24" fill="#AAAAAA"/>
                    <rect x="530" y="113" width="110" height="30" fill="#999999"/>
                    <rect x="412" y="113" width="110" height="30" fill="#999999"/>
                    <rect x="294" y="113" width="110" height="30" fill="#999999"/>
                    <rect x="176" y="113" width="110" height="30" fill="#999999"/>
                    <rect x="58" y="113" width="110" height="30" fill="#999999"/>
                    <g filter="url(#filter1_d_201_14)">
                        <rect width="1920" height="93.3333" fill="#888888"/>
                    </g>
                    <rect x="1825" y="27" width="42" height="42" fill="#999999"/>
                    <rect x="1763" y="27" width="42" height="42" fill="#999999"/>
                    <rect x="1701" y="27" width="42" height="42" fill="#999999"/>
                    <rect x="1639" y="27" width="42" height="42" fill="#999999"/>
                    <rect x="879" y="32" width="160" height="30" fill="#999999"/>
                    <rect x="699" y="32" width="160" height="30" fill="#999999"/>
                    <rect x="519" y="32" width="160" height="30" fill="#999999"/>
                    <rect x="339" y="32" width="160" height="30" fill="#999999"/>
                    <rect x="59" y="7" width="80" height="80" fill="#999999"/>
                </g>
                <defs>
                    <filter id="filter0_d_201_14" x="635" y="197" width="650" height="850" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="12.5"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.313726 0 0 0 0 0.313726 0 0 0 0 0.333333 0 0 0 1 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_201_14"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_201_14" result="shape"/>
                    </filter>
                    <filter id="filter1_d_201_14" x="-100" y="-90" width="2120" height="293.333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="10"/>
                        <feGaussianBlur stdDeviation="50"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_201_14"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_201_14" result="shape"/>
                    </filter>
                    <clipPath id="clip0_201_14">
                        <rect width="1920" height="1080" fill="white"/>
                    </clipPath>
                </defs>
            </svg>

            {/* The Animated Glossy Streak Element */}
            <div
                className="shimmer-streak"
                style={{
                    // Creates the glossy, slanted white streak using a linear gradient background
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 100%)',
                }}
            ></div>
        </div>
    );
}

export default WireframeComponent;