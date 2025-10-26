import yotei from '../assets/ghost-of-yotei-game-5762x2880-19048.jpg'
import '../css/hero.css'
import Detail from './HeroDetails'

export default function Hero() { 
  return (
    <>
        <section>
            <img src={yotei} alt='' />
        </section>
        <Detail/>
    </>
  );
};


// ******************************
// Conceptual CSS for MainFeature
// ******************************
/*
.main-feature-section {
    position: relative;
    height: 70vh; // Approx. height based on the design
    width: 100%;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    width: 100%;
    height: 100%;
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.leaf-overlay {
    // This would be a pseudo-element or separate div with a texture/gradient 
    // to create the visual effect of falling leaves and mist.
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // Apply a subtle black-to-transparent gradient at the bottom for smooth transition
    background: linear-gradient(to bottom, rgba(0,0,0,0) 75%, #1e1e1e 100%); 
}

.feature-content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center; // Adjust alignment to position the card correctly
    padding-left: 10%;
}
*/