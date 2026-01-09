import { useAuth } from '../context/AuthContext';

const useUser = () => {
    const { user, loading, logout } = useAuth();
    return { user, isLoading: loading, logout };
};

export default useUser;
