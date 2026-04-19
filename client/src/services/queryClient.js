import { QueryClient } from "@tanstack/react-query";

/**
 * Global Query Client Configuration
 * This instance manages the caching, refetching, and synchronization 
 * of all server-side data (Students, Fees, Exams, etc.)
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered "fresh" for 5 minutes before background refetching occurs
            staleTime: 1000 * 60 * 5,
            
            // If a request fails (e.g., network glitch), retry automatically once
            retry: 1,
            
            // Automatically refetch data when the user refocuses the browser window
            refetchOnWindowFocus: true,
            
            // Throw errors to the nearest Error Boundary for centralized handling
            useErrorBoundary: true,
        },
        mutations: {
            // Default behavior for data-changing operations (Create, Update, Delete)
            retry: false,
        },
    },
});