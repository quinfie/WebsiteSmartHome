import { HiOutlineHome } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineTruck } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { HiOutlineX } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineChartBar } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isLandingOpen, setIsLandingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const sidebarClass = isSidebarOpen ? "sidebar-open" : "sidebar-closed";
  const navActiveClass =
    "block dark:bg-whiteSecondary flex items-center self-stretch gap-4 py-4 px-6 cursor-pointer max-xl:py-3 dark:text-blackPrimary bg-white text-blackPrimary";
  const navInactiveClass =
    "block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary";


  return (
    <div className="relative">
      <div
        className={`w-72 h-[100vh] dark:bg-blackPrimary bg-whiteSecondary xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 ${sidebarClass} flex flex-col`}
      >
        <HiOutlineX
          className="dark:text-whiteSecondary text-blackPrimary text-2xl ml-auto mb-2 mr-2 cursor-pointer xl:py-3"
          onClick={() => dispatch(setSidebar())}
        />

        {/* Cuộn phần nội dung menu */}
        <div className="flex-1 overflow-y-auto">
          {/* Landing section */}
          <NavLink
            to="/dashboard/tongquan"
            className={({ isActive }) =>
              isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineHome className="text-xl" />
            <span className="text-lg">Tổng quan</span>
          </NavLink>

          {/* Phân công dịch vụ cho Nhân viên, Quản lý và Quản trị viên */}
          {(user?.vaiTro === "Nhân Viên" || user?.vaiTro === "Quản Lí" || user?.vaiTro === "Quản Trị Viên") && (
            <>
              <NavLink
                to="/dashboard/requestservice"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineClipboardList className="text-xl" />
                <span className="text-lg">Yêu cầu dịch vụ</span>
              </NavLink>
              <NavLink
                to="/dashboard/assignrequest"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineClipboardList className="text-xl" />
                <span className="text-lg">Phân công dịch vụ</span>
              </NavLink>
            </>
          )}

          {/* Các mục menu chính cho Quản lý và Quản trị viên */}
          {(user?.vaiTro === "Quản Lí" || user?.vaiTro === "Quản Trị Viên") && (
            <>
              <NavLink
                to="/dashboard/thong-ke"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineChartBar className="text-xl" />
                <span className="text-lg">Thống kê</span>
              </NavLink>
              <NavLink
                to="/dashboard/products"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineDevicePhoneMobile className="text-xl" />
                <span className="text-lg">Sản phẩm</span>
              </NavLink>
              <NavLink
                to="/dashboard/categories"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineTag className="text-xl" />
                <span className="text-lg">Danh mục</span>
              </NavLink>
              <NavLink
                to="/dashboard/suppliers"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineTag className="text-xl" />
                <span className="text-lg">Nhà cung cấp</span>
              </NavLink>
              <NavLink
                to="/dashboard/orders"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineTruck className="text-xl" />
                <span className="text-lg">Đơn hàng</span>
              </NavLink>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineUser className="text-xl" />
                <span className="text-lg">Người dùng</span>
              </NavLink>

              <NavLink
                to="/dashboard/reviews"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineStar className="text-xl" />
                <span className="text-lg">Đánh giá</span>
              </NavLink>

              <NavLink
                to="/dashboard/promotions"
                className={({ isActive }) =>
                  isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineTag className="text-xl" />
                <span className="text-lg">Khuyến mãi</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Help section cố định dưới đáy */}
        <div className="border-t border-blackSecondary dark:border-blackSecondary">
          <NavLink
            to="/dashboard/helpdesk"
            className={({ isActive }) =>
              isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineInformationCircle className="text-xl" />
            <span className="text-lg">Trợ giúp</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
