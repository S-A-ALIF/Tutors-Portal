import { createContext, useContext, useState } from 'react';
import authService from '../features/authentication/services/authServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

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
            
            // DEBUG: Check what the service is actually returning
            console.log("DEBUG: Data received from authService.login:", userData);
            
            if (userData) {
                setUser(userData);
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
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);