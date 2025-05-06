import { HiOutlineEye } from "react-icons/hi";
import { SimpleNotification, Sidebar, WhiteButton } from "../components";

const Notifications = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông báo
              </h2>
            </div>
            <WhiteButton
                link="/notifications"
                textSize="lg"
                width="48"
                py="2"
                text="Đánh dấu tất cả là đã đọc"
              >
                <HiOutlineEye className="dark:text-blackPrimary text-whiteSecondary text-xl" />
              </WhiteButton>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            {/* Thông báo */}
            <div className="flex flex-col gap-1">
              {/* Thông báo đơn */}
              <SimpleNotification
                username="johndoe"
                imgSrc="/src/assets/random user 1.jpg"
                date="Thứ Năm 4:20 chiều"
                hoursAgo="2 giờ trước"
                action="theo dõi bạn"
              />
              <SimpleNotification
                username="markkwik"
                imgSrc="/src/assets/random user 2.jpg"
                date="Thứ Năm 3:15 chiều"
                hoursAgo="3 giờ trước"
                action="thích bài viết của bạn"
              />
              <SimpleNotification
                username="markdoe"
                imgSrc="/src/assets/random user 3.jpg"
                date="Thứ Năm 1:30 chiều"
                hoursAgo="4 giờ trước"
                action="theo dõi bạn"
              />
              <SimpleNotification
                username="gg86"
                imgSrc="/src/assets/random user 4.jpg"
                date="Thứ Năm 12:10 sáng"
                hoursAgo="5 giờ trước"
                action="mời bạn vào nhóm riêng"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
