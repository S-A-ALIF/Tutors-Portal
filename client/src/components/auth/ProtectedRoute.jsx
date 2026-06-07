import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        // Redirect if not logged in
        return <Navigate to="/login" replace />;
    }

    // Render child routes if logged in
    return <Outlet />;
};

export default ProtectedRoute;