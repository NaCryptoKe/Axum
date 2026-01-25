import { NavLinks } from "./NavLinks";
import { useAuth } from "../../auth/AuthContext";
import './navbar.css';

export function Navbar() {
    const { state } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span>Axum</span>
            </div>

            {/* We pass the whole state here */}
            <NavLinks authState={state} /> 
        </nav>
    );
}