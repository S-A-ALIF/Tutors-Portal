import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../features/authentication/services/authServices';

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
            
            console.log("DEBUG: Data received from authService.login:", userData);
            
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

    // Update user state dynamically (e.g., after profile creation)
    const updateUser = (newProfileData) => {
        setUser((prevUser) => {
            if (!prevUser) return prevUser;
            
            // This safely targets the flat profile object shown in your console log
            const updatedUser = {
                ...prevUser,
                profile: {
                    ...(prevUser.profile || {}),
                    ...newProfileData
                }
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    // Prevent protected routes from kicking the user out before storage is checked
    if (isInitializing) {
        return null; 
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);