import React,{useState, useEffect} from "react";
import ButtonComponent from "./ButtonComponent";
import InputFieldComponent from "./InputFieldComponent";

import "../css/color-scheme.css"
import "../css/navbar.css"

/*Image imports*/
import AxumLogo from "../assets/Axum Logo.svg";
import notification from "../assets/bell.svg";
import message from "../assets/chat-circle.svg";
import cart from "../assets/shopping-cart.svg";
import profile from "../assets/user-circle.svg";
import home from "../assets/house.svg";
import wishlist from "../assets/bookmark-simple.svg";
import library from "../assets/game-controller.svg";
import downloads from "../assets/cloud-arrow-down.svg";


const NavbarComponent = () => {

    const [mode, setMode] = useState(() => {
        return localStorage.getItem('theme-mode') === 'light' ? 'light' : 'dark';
    });

    // 1. Logic to apply the CSS class to the document body
    useEffect(() => {
        const body = document.body;

        // Ensure only the correct class is present
        body.classList.remove('dark-mode', 'light-mode');

        // The key action: applying the .light-mode class, which triggers the CSS variable overrides in colors.css
        if (mode === 'light') {
            body.classList.add('light-mode');
        } else {
            // Optional: You can explicitly add dark-mode, though it relies on the CSS :root defaults
            body.classList.add('dark-mode');
        }

        // Persist the user's choice
        localStorage.setItem('theme-mode', mode);

    }, [mode]);


    // 2. Logic to toggle the mode
    const toggleMode = () => {
        setMode(prevMode => prevMode === 'dark' ? 'light' : 'dark');
    };



    return (
        <nav>
            <div className="primary-navbar navbar">
                <img
                    className="logo"
                    src={AxumLogo}
                    alt="axum logo"
                />

                <div className="navbar-elements main">
                    <button>
                        <img className="primary-logos" src={home} alt="home image"/>
                        <p>HOME</p>
                    </button>
                    <button>
                        <img className="primary-logos" src={wishlist} alt="wishlist image"/>
                        <p>WISHLIST</p>
                    </button>
                    <button>
                        <img className="primary-logos" src={library} alt="library image"/>
                        <p>LIBRARY</p>
                    </button>
                    <button>
                        <img className="primary-logos" src={downloads} alt="download image"/>
                        <p>DOWNLOADS</p>
                    </button>
                </div>

                <div className="navbar-elements side">
                    <ButtonComponent
                        children={<img src={cart} alt=""/>}
                    />
                    <ButtonComponent
                        children={<img src={notification} alt=""/>}
                    />
                    <ButtonComponent
                        children={<img src={message} alt=""/>}
                    />
                    <ButtonComponent
                        children={<img src={profile} alt=""/>}
                    />
                </div>
            </div>

            <div className="secondary-navbar navbar">
                <div className="navbar-elements">
                    <ButtonComponent
                        children="HOME"
                    />
                    <ButtonComponent
                        children="BROWSE"
                    />
                    <ButtonComponent
                        children="DISCOVER"
                    />
                    <ButtonComponent
                        children="COMMUNITY"
                    />
                    <ButtonComponent
                        children="NEWS"
                    />
                </div>

                <div className="search">
                    <InputFieldComponent placeholder="Search Games, Users, and Organizations" variant="search"/>
                    <ButtonComponent children={<img src={notification} alt=""/>} variant="search" />
                </div>
                <ButtonComponent
                    variant="color-switch"
                    children={<img src={home} alt=""/>}
                    onClick={toggleMode}
                />
            </div>
        </nav>
    );
}

export default NavbarComponent;