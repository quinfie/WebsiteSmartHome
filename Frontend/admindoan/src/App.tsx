import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom"
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
    element: <Product />,
  },
  {
    path: "/suppliers",
    element: <Supplier />,
  },
  {
    path: "/orders",
    element: <Order />,
  },
  {
    path: "/categories",
    element: <Category />,
  },
  {
    path: "/requestservice",
    element: <RequestService />,
  },
  {
    path: "/assignrequest",
    element: <AssignRequest />,
  },
  {
    path: "/users",
    element: <User />,
  },
  {
    path: "/storages",
    element: <Storage />,
  },
  {
    path: "/reviews",
    element: <Review />,
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
        element: <HomeLayout />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/products",
        element: <Product />,
      },
      {
        path: "/suppliers",
        element: <Supplier />,
      },
      {
        path: "/orders",
        element: <Order />,
      },
      {
        path: "/categories",
        element: <Category />,
      },
      {
        path: "/requestservice",
        element: <RequestService />,
      },
      {
        path: "/assignrequest",
        element: <AssignRequest />,
      },
      {
        path: "/users",
        element: <User />,
      },
      {
        path: "/storages",
        element: <Storage />,
      },
      {
        path: "/reviews",
        element: <Review />,
      },
    ],
  },
]);

import { SanPhamProvider } from "./contexts/SanPhamContext";
import { NhaCungCapProvider } from "./contexts/NhaCungCapContext";
import { DonHangProvider } from "./contexts/DonHangContext";
import EditDanhMuc from "./pages/EditDanhMuc";
import CreateDanhMuc from "./pages/CreateDanhMuc";
import { DanhMucProvider } from "./contexts/DanhMucContexts";
import DanhMuc from "./pages/DanhMucPage";
import { PhanCongDichVuProvider } from './contexts/PhanCongDichVuContext';
import { NguoiDungProvider } from './contexts/NguoiDungContext';
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



