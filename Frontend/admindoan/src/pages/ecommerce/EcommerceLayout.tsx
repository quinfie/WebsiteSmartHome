import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCartFromStorage } from '../../api/cart';
import ChatBox from '../../components/ChatBox';


interface EcommerceLayoutProps {
    children: ReactNode;
}

interface UserInfo {
    tenNguoiDung?: string;
    tenTaiKhoan?: string;
    email?: string;
    vaiTro?: string;
    diaChi?: string;
    soDienThoai?: string;
    fullName?: string;
}

export default function EcommerceLayout({ children }: EcommerceLayoutProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();
    const accountMenuRef = useRef<HTMLLIElement>(null);
    const { user, isAuthenticated, logout } = useAuth();

    // Authentication state from localStorage as fallback
    const token = localStorage.getItem('token');
    const tokenIsAuthenticated = token !== null;
    const userRole = localStorage.getItem('vaiTro');

    // Determine authenticated status (either from context or localStorage)
    const authenticated = isAuthenticated || tokenIsAuthenticated;

    // Load user information from localStorage
    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            try {
                const parsedUserInfo = JSON.parse(userInfoString);
                setUserInfo(parsedUserInfo);
            } catch (error) {
                console.error('Error parsing user info from localStorage:', error);
            }
        }
    }, []);

    // Fetch cart item count
    useEffect(() => {
        const fetchCartCount = () => {
            try {
                const cart = getCartFromStorage();
                const count = cart.items.reduce((total, item) => total + item.quantity, 0);
                setCartItemCount(count);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        fetchCartCount();

        // Listen for cart update events
        const handleCartUpdated = () => {
            fetchCartCount();
        };

        window.addEventListener('cart-updated', handleCartUpdated);

        // Set up interval to check cart count every 30 seconds
        const intervalId = setInterval(fetchCartCount, 30000);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('cart-updated', handleCartUpdated);
        };
    }, []);

    // Xử lý click bên ngoài để đóng menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        }

        // Add listener when menu is open
        if (isAccountMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isAccountMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/ecommerce/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout(); // Use Auth context logout
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất
        navigate('/ecommerce/login');
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    // Close account menu when mobile menu is toggled
    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isAccountMenuOpen) {
            setIsAccountMenuOpen(false);
        }
    };

    // Get user display name - prioritize localStorage userInfo for ecommerce consistency
    const getUserDisplayName = () => {
        if (userInfo?.tenNguoiDung) {
            return userInfo.tenNguoiDung;
        }
        if (userInfo?.fullName) {
            return userInfo.fullName;
        }
        if (userInfo?.tenTaiKhoan) {
            return userInfo.tenTaiKhoan;
        }
        if (user?.nguoiDung?.tenNguoiDung) {
            return user.nguoiDung.tenNguoiDung;
        }
        return user?.tenTaiKhoan || 'Tài khoản';
    };

    // Get user email - prioritize localStorage userInfo for ecommerce consistency
    const getUserEmail = () => {
        return userInfo?.email || user?.email || '';
    };

    // Get user role
    const getUserRole = () => {
        return userInfo?.vaiTro || user?.vaiTro || userRole || 'Khách hàng';
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            
      <ChatBox /> 

            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* Logo */}
                        <Link to="/ecommerce" className="flex items-center mb-4 md:mb-0">
                            <span className="text-green-600 text-2xl font-bold">Smart Home</span>
                        </Link>

                        


                        {/* Nav */}
                        <div className="flex items-center">
                            <button
                                className="md:hidden text-gray-500 mr-4"
                                onClick={toggleMobileMenu}
                            >
                                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                            </button>

                            <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                                <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                    <li>
                                        <NavLink
                                            to="/ecommerce"
                                            className={({ isActive }) =>
                                                isActive ? "text-green-600 font-medium" : "text-gray-600 hover:text-green-600"
                                            }
                                            end
                                        >
                                            Trang chủ
                                        </NavLink>
                                    </li>
                                    {authenticated ? (
                                        <>
                                            <li>
                                                <NavLink
                                                    to="/ecommerce/cart"
                                                    className={({ isActive }) =>
                                                        isActive
                                                            ? "text-green-600 font-medium relative flex items-center"
                                                            : "text-gray-600 hover:text-green-600 relative flex items-center"
                                                    }
                                                >
                                                    <i className="fas fa-shopping-cart"></i>
                                                    {cartItemCount > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                                        </span>
                                                    )}
                                                    <span className="ml-2 md:inline">Giỏ hàng</span>
                                                </NavLink>
                                            </li>
                                            <li ref={accountMenuRef} className="relative">
                                                <button
                                                    className="text-gray-600 hover:text-green-600 flex items-center py-2 px-3 rounded-full hover:bg-gray-100 transition-colors"
                                                    onClick={toggleAccountMenu}
                                                >
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                    <span className="md:block hidden">
                                                        {getUserDisplayName()}
                                                    </span>
                                                    <i className={`fas ${isAccountMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ml-1 text-xs md:inline hidden`}></i>
                                                </button>
                                                {isAccountMenuOpen && (
                                                    <div className="fixed md:absolute md:right-0 right-2 top-auto md:top-full mt-16 md:mt-2 w-64 md:w-56 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200">
                                                        <div className="px-4 py-3 border-b border-gray-100">
                                                            <p className="font-medium text-gray-800 truncate">{getUserDisplayName()}</p>
                                                            <p className="text-sm text-gray-500 truncate">{getUserEmail()}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{getUserRole()}</p>
                                                        </div>
                                                        <Link
                                                            to="/ecommerce/profile"
                                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50"
                                                            onClick={() => setIsAccountMenuOpen(false)}
                                                        >
                                                            <i className="fas fa-user-circle w-5 text-green-600"></i>
                                                            <span className="ml-2">Thông tin tài khoản</span>
                                                        </Link>
                                                        <Link
                                                            to="/ecommerce/orders"
                                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50"
                                                            onClick={() => setIsAccountMenuOpen(false)}
                                                        >
                                                            <i className="fas fa-shopping-bag w-5 text-green-600"></i>
                                                            <span className="ml-2">Đơn hàng của tôi</span>
                                                        </Link>
                                                        <Link
                                                            to="/ecommerce/warranty"
                                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50"
                                                            onClick={() => setIsAccountMenuOpen(false)}
                                                        >
                                                            <i className="fas fa-tools w-5 text-green-600"></i>
                                                            <span className="ml-2">Lịch bảo trì</span>
                                                        </Link>
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                                                        >
                                                            <i className="fas fa-sign-out-alt w-5"></i>
                                                            <span className="ml-2">Đăng xuất</span>
                                                        </button>
                                                       
                                                    </div>
                                                    
                                                )}
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <Link to="/ecommerce/login" className="text-gray-600 hover:text-green-600">
                                                    <i className="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/ecommerce/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                                    Đăng ký
                                                </Link>
                                            </li>
                                            
                                        </>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </div>
                    
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>
            

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Smart Home</h3>
                            <p className="mb-4">Giải pháp thông minh cho ngôi nhà của bạn</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-white hover:text-green-400">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="text-white hover:text-green-400">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-white hover:text-green-400">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="text-white hover:text-green-400">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Thông tin</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white">Về chúng tôi</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Chính sách bảo mật</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Điều khoản sử dụng</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Chính sách đổi trả</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Dịch vụ khách hàng</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white">Liên hệ</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Trung tâm hỗ trợ</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Câu hỏi thường gặp</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white">Tra cứu đơn hàng</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                                    <span>141 Lê Trọng Tấn, Tây Thạnh, Tân Phú, Tp.HCM</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-phone mr-2"></i>
                                    <span>0123 456 789</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-envelope mr-2"></i>
                                    <span>info@smarthome.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p>&copy; {new Date().getFullYear()} Smart Home. Tất cả quyền được bảo lưu.</p>
                    </div>
                    
                </div>
            </footer>
            
        </div>
    );
} 