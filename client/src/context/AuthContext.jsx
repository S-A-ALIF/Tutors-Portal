import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../features/authentication/services/authServices';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Rehydrate user from storage on initial load/refresh
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('user'); 
                
                if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("DEBUG: Failed to parse stored user during initialization:", error);
                localStorage.removeItem('user');
            } finally {
                setIsInitializing(false);
            }
        };

        initAuth();
    }, []);

    const signup = async (userData) => {
        setLoading(true);
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const userData = await authService.login(credentials);
            
            if (userData) {
                setUser(userData);
                // Ensure data survives a refresh
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.error("DEBUG: authService.login returned undefined or null");
            }
            
            return userData;
        } catch (error) {
            console.error("DEBUG: Login request error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('user');
    };

    // Use TanStack Query to fetch profile automatically
    const userId = user?.data?.id || user?.id;

    const { data: fetchedProfileResponse } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: authService.getMe,
        enabled: !!userId,
    });

    const actualProfile = fetchedProfileResponse?.data ? fetchedProfileResponse.data : fetchedProfileResponse;

    // Dynamically merge the fetched profile into the user object
    const fullUser = user ? {
        ...user,
        data: user.data ? { 
            ...user.data, 
            profile: actualProfile !== undefined ? actualProfile : user.data.profile 
        } : undefined,
        profile: !user.data ? (actualProfile !== undefined ? actualProfile : user.profile) : undefined
    } : null;

    // Prevent protected routes from kicking the user out before storage is checked
    if (isInitializing) {
        return null; 
    }

    return (
        <AuthContext.Provider value={{ user: fullUser, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);