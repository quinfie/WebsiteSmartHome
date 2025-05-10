import { useNavigate } from "react-router-dom";

const PhanCongDichVu = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Phân công dịch vụ</h2>
          <p className="text-sm text-gray-500">Bảng điều khiển &gt; Phân công</p>
        </div>
        <button
          onClick={() => navigate("/phan-cong/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          + Thêm phân công
        </button>
      </div>

      <div className="mt-10 text-gray-600 text-center">
        Hiện tại hệ thống không hỗ trợ danh sách phân công.<br />
        Vui lòng sử dụng chức năng <strong>Thêm, Cập nhật trạng thái</strong> hoặc <strong>Hoàn thành</strong> từ các trang chi tiết.
      </div>
    </div>
  );
};

export default PhanCongDichVu;
