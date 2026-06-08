import axios from "axios";

/**
 * Axios Instance Configuration
 * Centralized API client to handle base URLs, timeouts, and headers.
 */
const apiClient = axios.create({
    // baseURL points to your backend. 
    // Defaults to http://localhost:5000/api/v1 if env variable is missing.
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true, // Required to send/receive cookies
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Request Interceptor
 * Useful for attaching dynamic headers (like JWT tokens if you switch from cookies)
 */
apiClient.interceptors.request.use(
    (config) => {
        // You can add logic here to fetch tokens from local storage 
        // if your security requirements change.
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles global errors. 401s are critical to catch for session expiration.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the server returns a 401, the user's session has expired
        if (error.response?.status === 401) {
            console.error("Session expired or unauthorized. Redirecting to login...");
            
            // Clear any local client-side auth data if necessary
            localStorage.removeItem("user"); 
            
            // Force a reload or redirect
            window.location.href = "/login";
        }
        
        // Propagate the error so specific components can still handle unique errors
        return Promise.reject(error);
    }
);

export default apiClient;