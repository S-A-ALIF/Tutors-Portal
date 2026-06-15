import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        // Redirect if not logged in
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.data?.role || user?.role || 'admin';

    // Enforce role-based access control
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'tutor') return <Navigate to="/tutor-dashboard" replace />;
        if (userRole === 'student') return <Navigate to="/student-dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    // Render child routes if logged in
    return children ? children : <Outlet />;
};

export default ProtectedRoute;