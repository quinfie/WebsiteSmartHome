import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import {
  Categories,
  CreateCategory,
  CreateOrder,
  CreateProduct,
  CreateReview,
  CreateUser,
  EditCategory,
  EditOrder,
  EditProduct,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  LandingV2,
  Login,
  Notifications,
  Orders,
  Products,
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
  EditKho,
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
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/create",
        element: <CreateCategory />,
      },
      {
        path: "categories/:id/edit",
        element: <EditCategory />,
      },
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
        path: "orders/:id/edit",
        element: <EditOrder />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/create",
        element: <CreateUser />,
      },
      {
        path: "users/:id/edit",
        element: <EditUser />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "reviews/create",
        element: <CreateReview />,
      },
      {
        path: "reviews/:id/edit",
        element: <EditReview />,
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
        path: "phan-cong-dich-vu/create",
        element: <CreatePhanCongDichVu />,
      },
      {
        path: "phan-cong-dich-vu/:id/edit",
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
      {
        path: "kho/:id/edit",
        element: <EditKho />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
