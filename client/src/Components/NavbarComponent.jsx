import React, { useState } from "react";
import ButtonComponent from "./ButtonComponent";
import SearchBarComponent from "./SearchBarComponent";

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
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";

const NavbarComponent = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
                        onClick={() => setIsRegisterOpen(true)}
                    />
                </div>
            </nav>

            {/* MODAL */}
            <RegisterPage
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                openLogin={() => setIsLoginOpen(true)}
            />

            <LoginPage
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                openRegister={() => setIsRegisterOpen(true)}
            />
        </>
    );
};

export default NavbarComponent;
