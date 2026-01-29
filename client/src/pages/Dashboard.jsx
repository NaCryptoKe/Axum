import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {

    const { user, logout } = useAuth();
    console.log('Nahom', user)

    return (
        <>
            {user && (
                <>
                    <h1>Username: @{user?.username}</h1>
                    <h3>Hello</h3>
                </>
            )}

            
        </>
    );
} 

export default DashboardPage;