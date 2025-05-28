import { RouterProvider, createBrowserRouter, Navigate, useParams, useLocation } from "react-router-dom"
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import RoleBasedDashboardRedirect from "./components/RoleBasedDashboardRedirect";
import {
  HomeLayout,
  User,
  Profile,
  Product,
  Order,
  Category,
  Review,
  ChangePassword,
  Promotion,
  RequestService,
  AssignRequest,
  Supplier,
  Storage,
  HelpDesk,
  Notifications,
  // Create components
  CreateProduct,
  CreateCategory,
  CreateOrder,
  CreateUser,
  CreateReview,
  CreateKhuyenMai,
  CreateSupplier,
  CreateStorage,
  CreateRequestService,
  CreateAssignRequest,
  // Edit components
  EditProduct,
  EditCategory,
  EditOrder,
  EditReview,
  EditKhuyenMai,
  EditSupplier,
  EditRequestService,
  EditAssignRequest,
  LichBaoTriPage,
  EditUser,
  DanhGiaDetail,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { SanPhamProvider } from "./contexts/SanPhamContext";
import { NhaCungCapProvider } from "./contexts/NhaCungCapContext";
import { DonHangProvider } from "./contexts/DonHangContext";
import { DanhMucProvider } from "./contexts/DanhMucContexts";
import { PhanCongDichVuProvider } from './contexts/PhanCongDichVuContext';
import { YeuCauDichVuProvider } from './contexts/YeuCauDichVuContext';
import { NguoiDungProvider } from './contexts/NguoiDungContext';
import { KhoProvider } from "./contexts/KhoContext";
import { DanhGiaProvider } from "./contexts/DanhGiaContext";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import TongQuanPage from "./pages/TongQuanPage";
import YeuCauDichVuDetailPage from "./pages/YeuCauDichVuDetailPage";
import PhanCongCalendarPage from "./pages/PhanCongCalendarPage";
import PhanCongDetailPage from "./pages/PhanCongDetailPage";
import ThongKePage from "./pages/ThongKePage";

// Import ecommerce routes
import { ecommerceRoutes } from "./pages/ecommerce/routes";

// Redirect component for old routes
const OldRouteRedirect = () => {
  const { id } = useParams();
  const location = useLocation();

  // Check if this is a path to view products
  if (location.pathname.includes('/san-pham')) {
    return <Navigate to={`/dashboard/categories/${id}/products`} replace />;
  }

  // Default to edit path
  return <Navigate to={`/dashboard/categories/${id}/edit`} replace />;
};

// Combine all providers into a single component
const AppProviders = ({ children }: { children: ReactNode }) => (
  <SanPhamProvider>
    <NhaCungCapProvider>
      <DanhMucProvider>
        <DonHangProvider>
          <YeuCauDichVuProvider>
            <PhanCongDichVuProvider>
              <NguoiDungProvider>
                <KhoProvider>
                  <DanhGiaProvider>
                    {children}
                  </DanhGiaProvider>
                </KhoProvider>
              </NguoiDungProvider>
            </PhanCongDichVuProvider>
          </YeuCauDichVuProvider>
        </DonHangProvider>
      </DanhMucProvider>
    </NhaCungCapProvider>
  </SanPhamProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/ecommerce" replace />,
  },
  {
    path: "/login",
    element: <Navigate to="/ecommerce/login" replace />,
  },
  {
    path: "/register",
    element: <Navigate to="/ecommerce/register" replace />,
  },
  // Add ecommerce routes first to ensure they take precedence
  ...ecommerceRoutes,
  // Add redirects for old routes
  {
    path: "/danh-muc/tao-moi",
    element: <Navigate to="/dashboard/categories/create" replace />,
  },
  {
    path: "/danh-muc/:id/*",
    element: <OldRouteRedirect />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["Quản Trị Viên", "Quản Lí", "Nhân Viên"]}>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RoleBasedDashboardRedirect />,
      },
      {
        path: "thong-ke",
        element: (
          <ProtectedRoute allowedRoles={["Quản Trị Viên", "Quản Lí"]}>
            <ThongKePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      // Products routes
      {
        path: "products",
        children: [
          {
            index: true,
            element: <Product />,
          },
          {
            path: "create",
            element: <CreateProduct />,
          },
          {
            path: ":id/edit",
            element: <EditProduct />,
          },
        ],
      },
      // Suppliers routes
      {
        path: "suppliers",
        children: [
          {
            index: true,
            element: <Supplier />,
          },
          {
            path: "create",
            element: <CreateSupplier />,
          },
          {
            path: ":id/edit",
            element: <EditSupplier />,
          },
        ],
      },
      // Orders routes
      {
        path: "orders",
        children: [
          {
            index: true,
            element: <Order />,
          },
          {
            path: "create",
            element: <CreateOrder />,
          },
          {
            path: ":id/edit",
            element: <EditOrder />,
          },
        ],
      },
      // Categories routes
      {
        path: "categories",
        children: [
          {
            index: true,
            element: <Category />,
          },
          {
            path: "create",
            element: <CreateCategory />,
          },
          {
            path: ":id/edit",
            element: <EditCategory />,
          },
          {
            path: ":categoryId/products",
            element: <CategoryProductsPage />,
          },
        ],
      },
      // Request Service routes
      {
        path: "requestservice",
        children: [
          {
            index: true,
            element: <RequestService />,
          },
          {
            path: "create",
            element: <CreateRequestService />,
          },
          {
            path: ":id/edit",
            element: <EditRequestService />,
          },
          {
            path: "view/:id",
            element: <YeuCauDichVuDetailPage />,
          },
        ],
      },
      // Assign Request routes
      {
        path: "assignrequest",
        children: [
          {
            index: true,
            element: <AssignRequest />,
          },
          {
            path: "create",
            element: <CreateAssignRequest />,
          },
          {
            path: ":id/edit",
            element: <EditAssignRequest />,
          },
          {
            path: "calendar",
            element: <PhanCongCalendarPage />,
          },
          {
            path: "detail/:id",
            element: <PhanCongDetailPage />,
          },
        ],
      },
      // Calendar route
      {
        path: "calendar/:kyThuatVienId",
        element: <PhanCongCalendarPage />,
      },
      // Users routes
      {
        path: "users",
        children: [
          {
            index: true,
            element: <User />,
          },
          {
            path: "create",
            element: <CreateUser />,
          },
          {
            path: ":id/edit",
            element: <EditUser />,
          }
        ],
      },
      // Storage routes
      {
        path: "storages",
        children: [
          {
            index: true,
            element: <Storage />,
          },
          {
            path: "create",
            element: <CreateStorage />,
          },
        ],
      },
      // Reviews routes
      {
        path: "reviews",
        children: [
          {
            index: true,
            element: <Review />,
          },
          {
            path: "create",
            element: <CreateReview />,
          },
          {
            path: ":id/edit",
            element: <EditReview />,
          },
          {
            path: ":id",
            element: <DanhGiaDetail />,
          },
        ],
      },
      // Promotions routes
      {
        path: "promotions",
        children: [
          {
            index: true,
            element: <Promotion />,
          },
          {
            path: "create",
            element: <CreateKhuyenMai />,
          },
          {
            path: ":id/edit",
            element: <EditKhuyenMai />,
          },
        ],
      },
      {
        path: "helpdesk",
        element: <HelpDesk />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "lich-bao-tri/:donHangId",
        element: <LichBaoTriPage />,
      },
      {
        path: "tongquan",
        element: <TongQuanPage />,
      },
      {
        path: "assigncalendar",
        element: <PhanCongCalendarPage />,
      },
    ],
  },
  // Catch all route - redirect to ecommerce
  {
    path: "*",
    element: <Navigate to="/ecommerce" replace />,
  }
]);

function App() {
  return (
    <AppProviders>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;



