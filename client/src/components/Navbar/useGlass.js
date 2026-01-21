import { useEffect, useMemo } from 'react';

const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const match = hex.match(/\w\w/g);
    return match ? match.map(h => parseInt(h, 16)).join(',') : "255,255,255";
};

export const useGlassEffect = (filterRef, config = {}) => {
    // Memoize config to prevent instability in the effect
    const finalConfig = useMemo(() => {
        const defaultConfig = {
            shadowColor: "#ffffff",
            shadowBlur: 20,
            shadowSpread: -5,
            tintColor: "#ffffff",
            tintOpacity: 0.04,      // "Apple" clarity default
            frostBlur: 2,
            noiseFrequency: 0.008,
            distortionStrength: 77, // "Apple" distortion default
            outerShadowBlur: 10,
        };
        return { ...defaultConfig, ...config };
    }, [config]);

    useEffect(() => {
        const root = document.documentElement;
        
        // Update CSS Variables (Scope these if you want truly independent styling per nav)
        root.style.setProperty('--shadow-color', finalConfig.shadowColor);
        root.style.setProperty('--shadow-blur', finalConfig.shadowBlur + 'px');
        root.style.setProperty('--shadow-spread', finalConfig.shadowSpread + 'px');
        root.style.setProperty('--tint-color', hexToRgb(finalConfig.tintColor));
        root.style.setProperty('--tint-opacity', finalConfig.tintOpacity);
        root.style.setProperty('--frost-blur', finalConfig.frostBlur + 'px');
        root.style.setProperty('--outer-shadow-blur', finalConfig.outerShadowBlur + 'px');

        // Update SVG Filter attributes directly
        if (filterRef.current) {
            const turbulence = filterRef.current.querySelector('feTurbulence');
            const displacementMap = filterRef.current.querySelector('feDisplacementMap');
            
            if (turbulence) {
                const freq = finalConfig.noiseFrequency;
                turbulence.setAttribute('baseFrequency', `${freq} ${freq}`);
            }
            if (displacementMap) {
                displacementMap.setAttribute('scale', finalConfig.distortionStrength);
            }
        }
    }, [filterRef, finalConfig]);
};