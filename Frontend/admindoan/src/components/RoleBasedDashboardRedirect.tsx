import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TongQuanPage from '../pages/TongQuanPage';

const RoleBasedDashboardRedirect: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        // Should ideally not happen with ProtectedRoute, but as a fallback
        return <Navigate to="/login" replace />;
    }

    if (user.vaiTro === "Nhân viên") {
        return <Navigate to="/dashboard/assignrequest" replace />;
    }

    // For other roles (Quan ly, Quan Tri Vien), render TongQuanPage
    return <TongQuanPage />;
};

export default RoleBasedDashboardRedirect; 