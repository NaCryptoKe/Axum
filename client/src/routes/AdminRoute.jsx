import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AdminRoute({ children }) {
    const { state } = useAuth();

    if (state.status !== "authenticated") {
        return <Navigate to="/login" replace />;
    }

    if (state.user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
