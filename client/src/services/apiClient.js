import axios from "axios";

/**
 * Axios Instance Configuration
 * Centralized API client to handle base URLs, timeouts, and headers.
 */
const apiClient = axios.create({
    // Replace with your actual backend URL
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true, // Required for cross-origin cookies/sessions
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach tokens if needed before the request is sent
apiClient.interceptors.request.use(
    (config) => {
        // You can add logic here to attach a Bearer token from local storage or a store
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Logic to redirect to login or refresh token could go here
            console.error("Unauthorized access - Redirecting...");
        }
        return Promise.reject(error);
    }
);

export default apiClient;