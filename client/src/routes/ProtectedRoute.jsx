import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute({ children }) {
    const { state } = useAuth();

    if (state.status === "loading") {
        return null;
    }

    if (state.status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return children;
}
