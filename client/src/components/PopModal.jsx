import React, { useEffect, useState } from 'react';
import './PopModal.css';

const PopModal = ({ isOpen, item, onClose }) => {
    const [status, setStatus] = useState('closed'); // 'closed', 'opening', 'active', 'closing'

    useEffect(() => {
        if (isOpen) {
            setStatus('opening');
            // Small delay to allow initial rect styles to apply before expanding
            const timer = setTimeout(() => setStatus('active'), 20);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setStatus('closing');
        // Wait for the CSS transition (0.6s) before calling the parent onClose
        setTimeout(() => {
            setStatus('closed');
            onClose();
        }, 600); 
    };

    if (status === 'closed' || !item) return null;

    const { originRect } = item;

    // These styles force the modal to start and end exactly where the card is
    const rectStyle = {
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
    };

    return (
        <div 
            className={`modal-overlay ${status === 'active' ? 'active' : ''} ${status === 'closing' ? 'closing' : ''}`} 
            onClick={handleClose}
        >
            <div 
                className="modal-pop-content"
                style={(status === 'opening' || status === 'closing') ? rectStyle : {}}
                onClick={(e) => e.stopPropagation()}
            >
                <img src={item.coverImage} alt="" className="modal-hero-img" />
                <button className="modal-close-btn" onClick={handleClose}>✕</button>
                
                <div className="modal-body-content">
                    <h1>{item.title}</h1>
                    <div className="modal-meta">
                        <span className="match-score">98% Match</span>
                        <span className="year">2026</span>
                        <span className="rating-badge">18+</span>
                    </div>
                    <p className="description">
                        When you close this, it will shrink back into the exact grid position 
                        it came from, completing the iOS-style shared element transition.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PopModal;