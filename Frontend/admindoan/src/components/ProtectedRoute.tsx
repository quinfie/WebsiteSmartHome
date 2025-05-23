import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // Nếu chưa đăng nhập, lưu lại URL hiện tại và chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/ecommerce/login" state={{ from: location }} replace />;
    }

    // Lấy vai trò từ context hoặc localStorage
    const role = user?.vaiTro || localStorage.getItem('vaiTro') || '';

    // Kiểm tra nếu đang truy cập vào /dashboard
    const isAccessingDashboard = location.pathname.startsWith('/dashboard');

    // Nếu là khách hàng và đang cố truy cập dashboard
    if (role === "Khách Hàng" && isAccessingDashboard) {
        return <Navigate to="/ecommerce" replace />;
    }

    // Kiểm tra quyền truy cập dashboard cho nhân viên và quản trị
    if (isAccessingDashboard) {
        const staffRoles = ["Nhân Viên", "Quản Trị Viên", "Quản Lí"];
        if (!staffRoles.includes(role)) {
            return <Navigate to="/ecommerce" replace />;
        }

        // Nếu có danh sách vai trò được phép và người dùng không nằm trong danh sách này
        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            return <Navigate to="/dashboard" replace />;
        }
        return <>{children}</>;
    }

    // Cho phép truy cập các route khác
    return <>{children}</>;
};

export default ProtectedRoute; 