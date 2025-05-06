import { FAQSection, SearchInput, Sidebar } from "../components";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { faqs } from "../utils/data";

const HelpDesk = () => {
  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Trung tâm hỗ trợ
            </h2>
            <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
              <HiOutlineInformationCircle className="dark:text-whiteSecondary text-blackPrimary text-xl" />
              <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                Nhận trợ giúp
              </span>
            </button>
          </div>

          {/* Ô tìm kiếm câu hỏi */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            <SearchInput />
            <p className="dark:text-whiteSecondary text-blackPrimary mt-4">
              Chào mừng đến với Trung tâm hỗ trợ. Chúng tôi có thể giúp gì cho bạn hôm nay?
            </p>
          </div>

          {/* Mục Câu hỏi thường gặp */}
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;
