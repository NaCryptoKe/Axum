import { createContext, useContext, useEffect, useState } from "react";
import { authenticate, logout } from "./authService";
import { isApiError } from "../api/errors";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [state, setState] = useState({ status: "loading" });

    useEffect(() => {
        authenticate().then((res) => {
            if (isApiError(res)) {
                setState({ status: "unauthenticated" });
            } else {
                setState({
                    status: "authenticated",
                    user: res.data,
                });
            }
        });
    }, []);

    async function handleLogout() {
        try {
            // Attempt to notify server
            await logout(); 
        } catch (error) {
            console.error("Logout API failed, forcing client logout", error);
        } finally {
            // ALWAYS update state, even if API fails
            setState({ status: "unauthenticated" });
        }
    }

    return (
        <AuthContext.Provider value={{ state, setState, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}