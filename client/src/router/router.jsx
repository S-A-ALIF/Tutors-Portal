import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
// Import other pages as you create them, e.g.:
// import StudentsPage from "../pages/StudentsPage"; 

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // Root element with Toaster and Outlet
        children: [
            {
                index: true, // This makes Dashboard the default view at "/"
                element: <Dashboard />,
            },
            /* Future routes follow this pattern:
            {
                path: "students",
                element: <StudentsPage />,
            },
            */
        ],
    },
]);

export default router;