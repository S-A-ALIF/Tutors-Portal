import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard";
import StudentDashboard from "../pages/StudentDashboard";
import LoginPage from "../pages/authentication/LoginPage";
import SignupPage from "../pages/authentication/SignupPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "signup",
                element: <SignupPage />,
            },
            {
                path: "dashboard",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                ],
            },
            {
                path: "student-dashboard",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <StudentDashboard />,
                    },
                ],
            },
        ],
    },
]);

export default router;