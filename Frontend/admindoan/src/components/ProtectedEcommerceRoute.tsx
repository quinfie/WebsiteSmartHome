import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedEcommerceRouteProps {
    children: React.ReactNode;
}

const ProtectedEcommerceRoute: React.FC<ProtectedEcommerceRouteProps> = ({ children }) => {
    // Use Auth context
    const { isAuthenticated, user } = useAuth();

    // Fallback to localStorage if context isn't ready
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('vaiTro');

    // Determine if authenticated either from context or localStorage
    const authenticated = isAuthenticated || !!token;

    // Get role from context or localStorage
    const role = user?.vaiTro || userRole || '';

    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập ecommerce
    if (!authenticated) {
        return <Navigate to="/ecommerce/login" replace />;
    }

    // Nếu đã đăng nhập nhưng là Quản Trị Viên/Quản Lí/Nhân Viên, chuyển hướng đến dashboard
    if (role === "Quản Trị Viên" || role === "Quản Lí" || role === "Nhân Viên") {
        return <Navigate to="/dashboard" replace />;
    }

    // Đã đăng nhập và là Khách Hàng hoặc không có vai trò rõ ràng, cho phép truy cập
    return <>{children}</>;
};

export default ProtectedEcommerceRoute; 