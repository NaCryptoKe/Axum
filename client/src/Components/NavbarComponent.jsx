import React,{useState, useEffect} from "react";
import ButtonComponent from "./ButtonComponent";
import InputFieldComponent from "./InputFieldComponent";

import "../css/color-scheme.css"
import "../css/navbar.css"

/*Image imports*/
import AxumLogo from "../assets/Axum Logo.svg";
import Logo from "../assets/svg files/Logo.jsx";
import notification from "../assets/bell.svg";
import message from "../assets/chat-circle.svg";
import cart from "../assets/shopping-cart.svg";
import profile from "../assets/user-circle.svg";
import home from "../assets/house.svg";
import wishlist from "../assets/bookmark-simple.svg";
import library from "../assets/game-controller.svg";
import downloads from "../assets/cloud-arrow-down.svg";
import Home from "../assets/svg files/Home.jsx";
import Wishlist from "../assets/svg files/Wishlist.jsx";
import Library from "../assets/svg files/Library.jsx";
import Downloads from "../assets/svg files/Downloads.jsx";
import Cart from "../assets/svg files/Cart.jsx";
import Message from "../assets/svg files/Message.jsx";
import Notification from "../assets/svg files/Notification.jsx";
import Profile from "../assets/svg files/Profile.jsx";
import SearchButton from "../assets/svg files/SearchButton.jsx";
import Settings from "../assets/svg files/Settings.jsx";


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

    const home = `${Home}`

    return (
        <nav>
            <div className="primary-navbar navbar">

                <Logo />

                <div className="navbar-elements main">
                    <div className="navbar-elements-logo">
                        <Home />
                        <ButtonComponent
                            children="Home" />
                    </div>
                    <div className="navbar-elements-logo">
                        <Wishlist />
                        <ButtonComponent
                            children="Wishlist" />
                    </div>
                    <div className="navbar-elements-logo">
                        <Library />
                        <ButtonComponent
                            children="Library" />
                    </div>
                    <div className="navbar-elements-logo">
                        <Downloads />
                        <ButtonComponent
                            children="Downloads" />
                    </div>
                </div>

                <div className="navbar-elements side">
                    <ButtonComponent
                        children={<Cart />}
                    />
                    <ButtonComponent
                        children={<Notification />}
                    />
                    <ButtonComponent
                        children={<Message />}
                    />
                    <ButtonComponent
                        children={<Profile />}
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
                    <ButtonComponent children={<SearchButton />} variant="search"/>
                </div>
                <ButtonComponent
                    variant="color-switch"
                    children={<Settings />}
                    onClick={toggleMode}
                />
            </div>
        </nav>
    );
}

export default NavbarComponent;