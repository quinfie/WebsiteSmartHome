import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { authService } from '../api/auth';

interface ProtectedEcommerceRouteProps {
    children: React.ReactNode;
}

const ProtectedEcommerceRoute: React.FC<ProtectedEcommerceRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fallback to localStorage if context isn't ready
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('vaiTro');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // Determine if authenticated either from context or localStorage
    const authenticated = isAuthenticated || !!token;

    // Get role from context or localStorage
    const role = user?.vaiTro || userRole || '';

    useEffect(() => {
        let isMounted = true;

        const checkAccountStatus = async () => {
            if (authenticated) {
                try {
                    const profileData = await authService.getProfile();

                    if (!isMounted) return;

                    // Kiểm tra trạng thái tài khoản
                    if (profileData.trangThai === 'Chờ xác minh') {
                        setError('Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.');
                        return;
                    }

                    if (profileData.trangThai === 'Bị khóa') {
                        setError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với chúng tôi để được hỗ trợ.');
                        return;
                    }

                    // Cập nhật thông tin người dùng trong localStorage
                    const updatedUserInfo = {
                        ...userInfo,
                        trangThai: profileData.trangThai
                    };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                } catch (err) {
                    console.error('Error checking account status:', err);
                    if (isMounted) {
                        setError('Có lỗi xảy ra khi kiểm tra trạng thái tài khoản. Vui lòng thử lại sau.');
                    }
                }
            }
            if (isMounted) {
                setIsLoading(false);
            }
        };

        checkAccountStatus();

        return () => {
            isMounted = false;
        };
    }, [authenticated]);

    // Nếu đang kiểm tra trạng thái, hiển thị loading spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Nếu có lỗi về trạng thái tài khoản, chuyển hướng đến trang đăng nhập với thông báo
    if (error) {
        return <Navigate to="/ecommerce/login" state={{ error }} replace />;
    }

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