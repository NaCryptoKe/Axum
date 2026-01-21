import React, { createContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
// Change this line:
import { useBackgroundCanvas, calculateComplement } from '../Navbar/useGlass'; 
import './Toast.css';

// ... (DEFAULT_THEME remains the same) ...
const DEFAULT_THEME = {
    limit: 5,
    defaultDuration: 4000,
    glass: {
        blur: 12,
        opacity: 0.4,
        distortion: 77,
        frequency: 0.008
    },
    types: {
        success: {
            title: "Success",
            color: "#28a745",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            )
        },
        error: {
            title: "Error",
            color: "#E50914",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            )
        },
        warning: {
            title: "Warning",
            color: "#ffa500",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            )
        },
        info: {
            title: "Info",
            color: "#17a2b8",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            )
        }
    }
};

export const ToastContext = createContext(null);

const Toast = ({ toast, removeToast, globalConfig }) => {
    const { id, type, title, subtitle, duration, icon, color } = toast;
    const [isExiting, setIsExiting] = useState(false);
    const [dynamicTintColor, setDynamicTintColor] = useState("255, 255, 255"); // State for tint
    const toastRef = useRef(null); // Ref for the toast element

    // Merge global type config with specific toast overrides
    const typeConfig = globalConfig.types[type] || globalConfig.types.info;
    const finalDuration = duration || globalConfig.defaultDuration;
    const finalColor = color || typeConfig.color;
    const finalIcon = icon || typeConfig.icon;
    const finalTitle = title || typeConfig.title;

    const removeRef = useRef(null);
    const borderTimerRef = useRef(null);

    // Sample color when the toast appears
    useLayoutEffect(() => {
        if (toastRef.current) {
            const rect = toastRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            sampleColorAt(centerX, centerY).then(({ r, g, b }) => {
                setDynamicTintColor(calculateComplement(r, g, b));
            });
        }
    }, []); // Run only once when the toast mounts

    const handleRemove = useCallback(() => {
        setIsExiting(true);
        removeRef.current = setTimeout(() => {
            removeToast(id);
        }, 600); 
    }, [id, removeToast]);

    useEffect(() => {
        const timerRef = setTimeout(handleRemove, finalDuration);
        return () => clearTimeout(timerRef);
    }, [finalDuration, handleRemove]);

    useEffect(() => {
        if (borderTimerRef.current) {
            borderTimerRef.current.animate([
                { transform: 'scaleX(1)' },
                { transform: 'scaleX(0)' }
            ], {
                duration: finalDuration,
                easing: 'linear'
            });
        }
    }, [finalDuration]);

    return (
        <div
            ref={toastRef}
            className={`toast-notification ${isExiting ? 'exit' : ''}`}
            style={{ 
                '--accent-color': finalColor,
                '--local-tint-color': dynamicTintColor // Set the local CSS variable
            }}
            role="alert"
        >
            <div className="status-icon">
                {typeof finalIcon === 'string' ? (
                     <svg
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="3"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     dangerouslySetInnerHTML={{ __html: finalIcon }}
                 />
                ) : (
                    finalIcon
                )}
            </div>
            <div className="toast-content">
                <div className="toast-title">{finalTitle}</div>
                {subtitle && <div className="toast-subtitle">{subtitle}</div>}
            </div>
            <button className="close-btn" onClick={handleRemove} aria-label="Close">&times;</button>
            <div className="timer-border" ref={borderTimerRef}></div>
        </div>
    );
};

// ... (ToastProvider remains the same) ...
export const ToastProvider = ({ 
    children, 
    theme = {}, 
    position = 'bottom-right' // top-right, top-left, bottom-left, bottom-right
}) => {
    const [toasts, setToasts] = useState([]);
    const filterRef = useRef(null);

    const { sampleColorAt, isCanvasReady } = useBackgroundCanvas();
    
    // Merge custom theme with defaults
    const config = useMemo(() => {
        return {
            ...DEFAULT_THEME,
            ...theme,
            glass: { ...DEFAULT_THEME.glass, ...theme.glass },
            types: { ...DEFAULT_THEME.types, ...theme.types }
        };
    }, [theme]);

    useEffect(() => {
        // Apply Glass effects to root
        const root = document.documentElement;
        root.style.setProperty('--frost-blur', config.glass.blur + 'px');
        root.style.setProperty('--tint-opacity', config.glass.opacity);

        if (filterRef.current) {
            const turbulence = filterRef.current.querySelector('feTurbulence');
            const displacementMap = filterRef.current.querySelector('feDisplacementMap');
            if (turbulence) turbulence.setAttribute('baseFrequency', config.glass.frequency);
            if (displacementMap) displacementMap.setAttribute('scale', config.glass.distortion);
        }
    }, [config.glass]);

    /**
     * @param {string} title - Main message
     * @param {object} options - { type, subtitle, duration, icon, color }
     */
    const addToast = useCallback((title, options = {}) => {
        setToasts(currentToasts => {
            const type = options.type || 'info';
            
            const newToast = { 
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                title,
                ...options, // spreads subtitle, duration, icon overrides
                type
            };

            // Limit logic: Remove oldest if limit reached
            let updatedToasts = [newToast, ...currentToasts];
            if (updatedToasts.length > config.limit) {
                updatedToasts = updatedToasts.slice(0, config.limit);
            }
            return updatedToasts;
        });
    }, [config.limit]);

    const removeToast = useCallback((id) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const contextValue = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {createPortal(
                <>
                    <div id="toast-container" className={`toast-wrapper ${position}`}>
                        {toasts.map(toast => (
                            <Toast 
                                key={toast.id} 
                                toast={toast} 
                                removeToast={removeToast} 
                                globalConfig={config}
                            />
                        ))}
                    </div>
                    {/* SVG Filter for Glass Effect */}
                    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} ref={filterRef}>
                        <defs>
                            <filter id="glass-distortion">
                                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="92" result="noise" />
                                <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                                <feDisplacementMap in="SourceGraphic" in2="blurred" scale="77" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                    </svg>
                </>
            , document.body)}
        </ToastContext.Provider>
    );
};