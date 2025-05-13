import { RouterProvider, createBrowserRouter, Navigate, useParams, useLocation } from "react-router-dom"
import { ReactNode } from "react";
import {
  HomeLayout,
  User,
  Profile,
  Login,
  Register,
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
  Landing,
  LandingV2,
  HelpDesk,
  Notifications,
  // Create components
  CreateProduct,
  CreateCategory,
  CreateOrder,
  CreateUser,
  CreateReview,
  CreatePromotion,
  CreateSupplier,
  CreateStorage,
  CreateRequestService,
  CreateAssignRequest,
  // Edit components
  EditProduct,
  EditCategory,
  EditOrder,
  EditReview,
  EditPromotion,
  EditSupplier,
  EditRequestService,
  EditAssignRequest,
  LichBaoTriPage,
  EditUser,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import { SanPhamProvider } from "./contexts/SanPhamContext";
import { NhaCungCapProvider } from "./contexts/NhaCungCapContext";
import { DonHangProvider } from "./contexts/DonHangContext";
import { DanhMucProvider } from "./contexts/DanhMucContexts";
import { PhanCongDichVuProvider } from './contexts/PhanCongDichVuContext';
import { NguoiDungProvider } from './contexts/NguoiDungContext';
import { KhoProvider } from "./contexts/KhoContext";
import { DanhGiaProvider } from "./contexts/DanhGiaContext";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import TongQuanPage from "./pages/TongQuanPage";

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
          <PhanCongDichVuProvider>
            <NguoiDungProvider>
              <KhoProvider>
                <DanhGiaProvider>
                  {children}
                </DanhGiaProvider>
              </KhoProvider>
            </NguoiDungProvider>
          </PhanCongDichVuProvider>
        </DonHangProvider>
      </DanhMucProvider>
    </NhaCungCapProvider>
  </SanPhamProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
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
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/products" replace />,
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
        ],
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
            element: <CreatePromotion />,
          },
          {
            path: ":id/edit",
            element: <EditPromotion />,
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
    ],
  },
  // Catch all other routes
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  }
]);

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;



