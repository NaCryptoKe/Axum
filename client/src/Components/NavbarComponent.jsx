import React from "react";
import ButtonComponent from "./ButtonComponent";
import InputFieldComponent from "./InputFieldComponent";

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
    return (
        <>
            <div className="primary-navbar">
                <img
                    className="logo"
                    src={AxumLogo}
                    alt="axum logo"
                />

                <div className="main-navbar-elements">
                    <span>
                        <img className="primary-logos" src={home} alt="home image"/>
                        <p>HOME</p>
                    </span>
                    <span>
                        <img className="primary-logos" src={wishlist} alt="wishlist image"/>
                        <p>WISHLIST</p>
                    </span>
                    <span>
                        <img className="primary-logos" src={library} alt="library image"/>
                        <p>LIBRARY</p>
                    </span>
                    <span>
                        <img className="primary-logos" src={downloads} alt="download image"/>
                        <p>DOWNLOADS</p>
                    </span>
                </div>

                <div className="navbar-elements">
                    <img className="primary-logos" src={cart} alt="cart image"/>
                    <img className="primary-logos" src={notification} alt="notification image"/>
                    <img className="primary-logos" src={message} alt="message image"/>
                    <img className="primary-logos" src={profile} alt="profile image"/>
                </div>
            </div>

            <div className="secondary-navbar">
                <div className="navbar-elements">
                    <p>HOME</p>
                    <p>BROWSE</p>
                    <p>DISCOVER</p>
                    <p>COMMUNITY</p>
                    <p>NEWS</p>

                    <div className="search">
                        <InputFieldComponent placeholder="Search Games, Users, and Organizations" />
                        <ButtonComponent children={<img src={notification} alt=""/>} variant="search" />
                    </div>
                </div>
                <img src={home} alt=""/>
            </div>
        </>
    );
}

export default NavbarComponent;