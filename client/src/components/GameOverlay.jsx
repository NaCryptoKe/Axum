import React from 'react';

const GameOverlay = ({ title, description, price, cartIcon, wishlistIcon }) => {
    return (
    <article className='overlay'>
        <img src={title} alt="Title Logo" className='title-treatment'/>
        <p>{description}</p>
        <div className='more-info'>
        <img src={cartIcon} alt="Add to cart" />
        <img src={wishlistIcon} alt="Add to wishlist" />
        <h2>{price}</h2>
        </div>
    </article>
    );
};

export default GameOverlay;