import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Layout from "../components/layouts/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { pages } from "../pages";

// Filter pages for cleaner routing logic
const protectedPages = pages.filter((p) => p.isProtected);
const publicPages = pages.filter((p) => !p.isProtected);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Map public pages directly so you can freely navigate to them
      ...publicPages.map((page) => ({
        path: page.path,
        element: <page.component />,
      })),
      
      // Default landing page redirect to login
      { index: true, element: <Navigate to="/login" replace /> },

      // Protected routes wrapped in Layout
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: protectedPages.map((page) => ({
              path: page.path,
              element: <page.component />,
            })),
          },
        ],
      },
    ],
  },
]);

export default router;