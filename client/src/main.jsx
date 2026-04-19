import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import router from "./router/router";
import { queryClient } from "./services/queryClient";
import "./index.css"; // Ensure Tailwind 4 is imported here

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* Provides server-state management to the entire app */}
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            
            {/* Development tool for debugging API queries */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
);