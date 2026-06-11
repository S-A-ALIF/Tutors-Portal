export const useAuthStorage = () => {
    const USER_KEY = 'tutors_portal_user';
    const TOKEN_KEY = 'tutors_portal_token';

    const setAuthData = (user, token) => {
        try {
            // Prevent saving undefined/null as literal strings
            if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
            if (token) localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving auth data to storage:', error);
        }
    };

    const clearAuthData = () => {
        try {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing auth data from storage:', error);
        }
    };

    const getAuthData = () => {
        try {
            const user = localStorage.getItem(USER_KEY);
            const token = localStorage.getItem(TOKEN_KEY);

            // FIX: Safely parse JSON and ignore "undefined" strings
            const parsedUser = (user && user !== 'undefined' && user !== 'null') 
                ? JSON.parse(user) 
                : null;
            
            const validToken = (token && token !== 'undefined' && token !== 'null') 
                ? token 
                : null;

            return {
                user: parsedUser,
                token: validToken,
            };
        } catch (error) {
            console.error('Error reading auth data from storage:', error);
            // CRITICAL: Clear corrupted data so the app can recover on refresh
            clearAuthData();
            return { user: null, token: null };
        }
    };

    return { setAuthData, clearAuthData, getAuthData };
};