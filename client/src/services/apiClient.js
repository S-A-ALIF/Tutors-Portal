import axios from "axios";

/**
 * Axios Instance Configuration
 * Centralized API client to handle base URLs, timeouts, and headers.
 */
const apiClient = axios.create({
    // We explicitly set the port here to avoid issues with env variables
    // If you use an .env file, ensure VITE_API_BASE_URL is correct: http://localhost:5000/api/v1
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true, // Required for cross-origin cookies/sessions
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach tokens if needed
apiClient.interceptors.request.use(
    (config) => {
        // Example: Add token logic here
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access - Redirecting...");
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;