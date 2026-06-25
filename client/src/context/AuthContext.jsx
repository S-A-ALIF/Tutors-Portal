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
            const response = await authService.login(credentials);
            
            if (response && response.data) {
                // response is { status: 'success', token: '...', data: { id, email, role } }
                const normalizedUser = {
                    ...response.data,
                    token: response.token
                };
                setUser(normalizedUser);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                return normalizedUser;
            } else {
                console.error("DEBUG: authService.login returned undefined or null");
                return null;
            }
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
    const userId = user?.id || user?.data?.user?.id || user?.data?.id;

    const { data: fetchedProfileResponse } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: authService.getMe,
        enabled: !!userId,
    });

    const actualProfile = fetchedProfileResponse?.data ? fetchedProfileResponse.data : fetchedProfileResponse;

    // Dynamically merge the fetched profile into the user object
    const fullUser = user ? {
        ...user,
        profile: actualProfile !== undefined ? actualProfile : user.profile
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