import { NavLinks } from "./NavLinks";
import { useAuth } from "../../auth/AuthContext";

export function Navbar() {
    const { state } = useAuth();

    return (
        <nav>
            <div>
                <span>Axum</span>
            </div>

            {/* We pass the whole state here */}
            <NavLinks authState={state} /> 
        </nav>
    );
}