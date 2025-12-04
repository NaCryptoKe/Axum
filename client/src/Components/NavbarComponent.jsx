import React, { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import SearchBarComponent from "./SearchBarComponent";
import LoginPage from "../pages/LoginPage.jsx"

import Logo from "../assets/svg files/Logo.jsx";
import Home from "../assets/svg files/Home.jsx";
import Wishlist from "../assets/svg files/Wishlist.jsx";
import Library from "../assets/svg files/Library.jsx";
import Downloads from "../assets/svg files/Downloads.jsx";
import Cart from "../assets/svg files/Cart.jsx";
import Message from "../assets/svg files/Message.jsx";
import Notification from "../assets/svg files/Notification.jsx";
import Profile from "../assets/svg files/Profile.jsx";

import "../css/navbar.css";

const NavbarComponent = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <nav>
                <Logo />

                <div className="main-nav">
                    <ButtonComponent variant="nav" children={<><Home /> HOME</>} />
                    <ButtonComponent variant="nav" children={<><Wishlist /> WISHLIST</>} />
                    <ButtonComponent variant="nav" children={<><Library /> LIBRARY</>} />
                    <ButtonComponent variant="nav" children={<><Downloads /> DOWNLOADS</>} />
                </div>

                <SearchBarComponent />

                <div className="secondary-nav">
                    <ButtonComponent children={<Cart />} />
                    <ButtonComponent children={<Notification />} />
                    <ButtonComponent children={<Message />} />

                    {/* OPEN LOGIN MODAL HERE */}
                    <ButtonComponent
                        children={<Profile />}
                        onClick={() => setIsLoginOpen(true)}
                    />
                </div>
            </nav>

            {/* MODAL */}
            <LoginPage
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
};

export default NavbarComponent;
