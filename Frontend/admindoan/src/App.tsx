import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom"
import {
  CreateOrder,
  CreateReview,
  CreateUser,
  EditOrder,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Categories,
  EditCategory,
  CreateCategory,
  //Landing,
  LandingV2,
  Login,
  Notifications,
  Orders,
  Products,
  CreateProduct,
  EditProduct,
  Promotions,
  CreatePromotion,
  EditPromotion,
  Profile,
  NhaCungCap,
  CreateNhaCungCap,
  EditNhaCungCap,
  PhanCongDichVu,
  CreatePhanCongDichVu,
  EditPhanCongDichVu,
  YeuCauDichVu,
  CreateYeuCauDichVu,
  EditYeuCauDichVu,
  Register,
  Kho,
  CreateKho,
  //EditKho,
  Reviews,
  Users,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";


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
  {
    path: "/products",
    element: <Navigate to="/dashboard/products" replace />,
  },
  {
    path: "products/create-product",
    element: <CreateProduct />,
  },
  {
    path: "products/edit-product",
    element: <EditProduct />,
  },
  {
    path: "/dashboard/products/edit/:id",
    element: <EditProduct />,
  },

  {
    path: "/nha-cung-cap",
    element: <Navigate to="/dashboard/nha-cung-cap" replace />,
  },
  {
    path: "/suppliers/create-supplier",
    element: <CreateNhaCungCap />,
  },
  {
    path: "/suppliers/edit/:id",
    element: <EditNhaCungCap />,
  },


  {
    path: "/orders",
    element: <Navigate to="/dashboard/orders" replace />,
  },
  {
    path: "/orders/create-order",
    element: <CreateOrder />,
  },

  {
    path: "/orders/edit/:id",
    element: <EditOrder />,
  },
  {
    path: "/categories",
    element: <Navigate to="/dashboard/categories" replace />,
  },
  {
    path: "/danh-muc/tao-moi",
    element: <CreateDanhMuc />,
  },
  {
    path: "/yeucaudichvu",
    element: <Navigate to="/dashboard/yeu-cau-dich-vu" replace />,
  },
  {
    path: "/danh-muc/sua/:id",
    element: <EditDanhMuc />,
  },
  {
    path: "/phan-cong-dich-vu",
    element: <Navigate to="/dashboard/phan-cong-dich-vu" replace />,
  },
  {
    path: "/phan-cong/create",
    element: <CreatePhanCongDichVu />,
  },
  {
    path: "/phan-cong-dich-vu/edit/:id",
    element: <EditPhanCongDichVu />,
  },
  {
    path: "/users",
    element: <Navigate to="/dashboard/users" replace />,
  },
  {
    path: "/users/create-user",
    element: <CreateUser />,
  },
  {
    path: "/kho",
    element: <Navigate to="/dashboard/kho" replace />,
  },
  {
    path: "/kho/create",
    element: <CreateKho />,
  },
  {
    path: "/users/edit/:id",
    element: <EditUser />,
  },
  {
    path: "/reviews",
    element: <Navigate to="/dashboard/reviews" replace />,
  },
  {
    path: "/reviews/:id",
    element: <EditDanhGiaPage />,
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
        element: <LandingV2 />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "categories", element: <DanhMuc /> },
      { path: "categories/create", element: <CreateDanhMuc /> },
      { path: "danh-muc/sua/:id", element: <EditDanhMuc /> },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/create",
        element: <CreateProduct />,
      },
      {
        path: "products/:id/edit",
        element: <EditProduct />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/create",
        element: <CreateOrder />,
      },
      {
        path: "orders/edit/:id",
        element: <EditOrder />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/create-user",
        element: <CreateUser />,
      },
      {
        path: "users/edit/:id",
        element: <EditUser />,
      },
      {
        path: "reviews",
        element: <DanhGiaPage />,
      },
      {
        path: "reviews/create",
        element: <CreateReview />,
      },
      {
        path: "reviews/:id",
        element: <EditDanhGiaPage />,
      },
      {
        path: "promotions",
        element: <Promotions />,
      },
      {
        path: "promotions/create",
        element: <CreatePromotion />,
      },
      {
        path: "promotions/:id/edit",
        element: <EditPromotion />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "help-desk",
        element: <HelpDesk />,
      },
      {
        path: "nha-cung-cap",
        element: <NhaCungCap />,
      },
      {
        path: "nha-cung-cap/create",
        element: <CreateNhaCungCap />,
      },
      {
        path: "nha-cung-cap/:id/edit",
        element: <EditNhaCungCap />,
      },
      {
        path: "phan-cong-dich-vu",
        element: <PhanCongDichVu />,
      },
      {
        path: "phan-cong/create",
        element: <CreatePhanCongDichVu />,
      },
      {
        path: "phan-cong-dich-vu/edit/:id",
        element: <EditPhanCongDichVu />,
      },
      {
        path: "yeu-cau-dich-vu",
        element: <YeuCauDichVu />,
      },
      {
        path: "yeu-cau-dich-vu/create",
        element: <CreateYeuCauDichVu />,
      },
      {
        path: "yeu-cau-dich-vu/:id/edit",
        element: <EditYeuCauDichVu />,
      },
      {
        path: "kho",
        element: <Kho />,
      },
      {
        path: "kho/create",
        element: <CreateKho />,
      },
      /*{
        path: "kho/:id/edit",
        element: <EditKho />,
      },*/
    ],
  },
]);

import { SanPhamProvider } from "./contexts/SanPhamContext";
import { NhaCungCapProvider } from "./contexts/NhaCungCapContext";
import { DonHangProvider } from "./contexts/DonHangContext";
import EditDanhMuc from "./pages/EditDanhMuc";
import CreateDanhMuc from "./pages/CreateDanhMuc";
import { DanhMucProvider } from "./contexts/DanhMucContexts";
import DanhMuc from "./pages/DanhMuc";
import { PhanCongDichVuProvider } from '@/contexts/PhanCongDichVuContext';
import { NguoiDungProvider } from '@/contexts/NguoiDungContext';
import { KhoProvider } from "./contexts/KhoContext";
import EditDanhGiaPage from "./pages/EditDanhGia";
import { DanhGiaProvider } from "./contexts/DanhGiaContext";
import DanhGiaPage from "./pages/DanhGiaPage";

function App() {
  return (
    <SanPhamProvider>
      <NhaCungCapProvider>
        <DanhMucProvider>
          <DonHangProvider>
            < PhanCongDichVuProvider>
              <NguoiDungProvider>
                <KhoProvider>
                  <DanhGiaProvider>
                    <RouterProvider router={router} />
                  </DanhGiaProvider>
                </KhoProvider>
              </NguoiDungProvider>
            </PhanCongDichVuProvider>
          </DonHangProvider>
        </DanhMucProvider>
      </NhaCungCapProvider>
    </SanPhamProvider>
  );
}
export default App;



