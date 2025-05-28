import { RouteObject } from 'react-router-dom';
import EcommerceLayout from './EcommerceLayout';
import Home from './Home';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Login from './Login';
import Register from './Register';
import CustomerProfile from './Profile';
import CustomerOrders from './Orders';
import OrderDetail from './OrderDetail';
import OrderReview from './OrderReview';
import CheckoutSuccess from './CheckoutSuccess';
import CategoryPage from './CategoryPage';
import Products from './Products';
import ProtectedEcommerceRoute from '../../components/ProtectedEcommerceRoute';
import UserWarrantyPage from './UserWarrantyPage';
import MaintenanceCalendarPage from './MaintenanceCalendarPage';
import ServiceRequestPage from './ServiceRequestPage';
import ServiceRequestDetailPage from './ServiceRequestDetail';
import Checkout from './Checkout';
import { Outlet } from 'react-router-dom';
import PaymentCallback from './PaymentCallback';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

// The ecommerce routes configuration
export const ecommerceRoutes: RouteObject[] = [
    {
        path: 'ecommerce',
        element: (
            <EcommerceLayout>
                <Outlet />
            </EcommerceLayout>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'product/:id',
                element: <ProductDetail />
            },
            {
                path: 'category/:categoryId',
                element: <CategoryPage />
            },
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'cart',
                element: (
                    <ProtectedEcommerceRoute>
                        <Cart />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'checkout/success',
                element: (
                    <ProtectedEcommerceRoute>
                        <CheckoutSuccess />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'checkout/:id',
                element: (
                    <ProtectedEcommerceRoute>
                        <Checkout />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'profile',
                element: (
                    <ProtectedEcommerceRoute>
                        <CustomerProfile />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'orders',
                element: (
                    <ProtectedEcommerceRoute>
                        <CustomerOrders />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'orders/:id',
                element: (
                    <ProtectedEcommerceRoute>
                        <OrderDetail />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'orders/:orderId/review',
                element: (
                    <ProtectedEcommerceRoute>
                        <OrderReview />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'warranty',
                element: (
                    <ProtectedEcommerceRoute>
                        <UserWarrantyPage />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'warranty/calendar',
                element: (
                    <ProtectedEcommerceRoute>
                        <MaintenanceCalendarPage />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'service-request',
                element: (
                    <ProtectedEcommerceRoute>
                        <ServiceRequestPage />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'service-request/:id',
                element: (
                    <ProtectedEcommerceRoute>
                        <ServiceRequestDetailPage />
                    </ProtectedEcommerceRoute>
                )
            },
            {
                path: 'payment-callback',
                element: <PaymentCallback />
            },
            {
                path: 'payment-success',
                element: <PaymentSuccess />
            },
            {
                path: 'payment-failed',
                element: <PaymentFailed />
            }
        ]
    },
    {
        path: 'api/vnpay/payment-callback',
        element: <PaymentCallback />
    }
];

export default ecommerceRoutes; 