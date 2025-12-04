import React from 'react';
import { Link } from 'react-router-dom';
import NavbarComponent from "../Components/NavbarComponent.jsx";
import Ghost from "../assets/Images/Ghost of Yotei.png"
import GhostLogo from "../assets/Images/Logo.png"
import ButtonComponent from "../Components/ButtonComponent.jsx";

import '../css/home-page.css'

function HomePage() {
    return (
        <>
            <NavbarComponent />
            <div className="hero" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 75%, var(--color-borders) 100%), url(${Ghost})`}}>
                <div className="hero-detail">
                    <img src={GhostLogo} alt=""/>
                    <div className="detail">
                        <p>2025 . 17+ . 4.25</p>
                        <p>Embark on a journey as Jin Sakai, a samurai warrior in 13th-century Japan, fighting to protect his homeland from the Mongol invasion. Experience a rich open-world adventure with dynamic combat, stealth mechanics, and a deep narrative rooted in Japanese culture.</p>
                    </div>
                    <div className="action">
                        <ButtonComponent
                            variant="buy"
                            children="BUY NOW"
                        />
                        <h2>$ 69.99</h2>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage;