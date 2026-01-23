import { useEffect, useMemo } from 'react';

const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const match = hex.match(/\w\w/g);
    return match ? match.map(h => parseInt(h, 16)).join(',') : "255,255,255";
};

export const useGlassEffect = (filterRef, config = {}) => {
    const finalConfig = useMemo(() => ({
        shadowColor: "#ffffff",
        shadowBlur: 20,
        shadowSpread: -5,
        tintColor: "#ffffff",
        tintOpacity: 0.04,
        frostBlur: 2,
        noiseFrequency: 0.008,
        distortionStrength: 77,
        outerShadowBlur: 10,
        ...config
    }), [config]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--shadow-color', finalConfig.shadowColor);
        root.style.setProperty('--shadow-blur', finalConfig.shadowBlur + 'px');
        root.style.setProperty('--shadow-spread', finalConfig.shadowSpread + 'px');
        root.style.setProperty('--tint-color', hexToRgb(finalConfig.tintColor));
        root.style.setProperty('--tint-opacity', finalConfig.tintOpacity);
        root.style.setProperty('--frost-blur', finalConfig.frostBlur + 'px');
        root.style.setProperty('--outer-shadow-blur', finalConfig.outerShadowBlur + 'px');

        if (filterRef.current) {
            const turbulence = filterRef.current.querySelector('feTurbulence');
            const displacementMap = filterRef.current.querySelector('feDisplacementMap');
            if (turbulence) turbulence.setAttribute('baseFrequency', finalConfig.noiseFrequency);
            if (displacementMap) displacementMap.setAttribute('scale', finalConfig.distortionStrength);
        }
    }, [filterRef, finalConfig]);
};