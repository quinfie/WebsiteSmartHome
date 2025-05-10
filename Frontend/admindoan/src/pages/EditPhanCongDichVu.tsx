import { usePhanCongDichVu } from "../contexts/PhanCongDichVuContext";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const EditPhanCongDichVu = () => {
  const { updateTrangThai, hoanThanh } = usePhanCongDichVu();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trangThai, setTrangThai] = useState("");

  const handleUpdate = async () => {
    if (!id || !trangThai.trim()) return;
    await updateTrangThai(id, trangThai);
    navigate("/phan-cong");
  };

  const handleHoanThanh = async () => {
    if (!id) return;
    await hoanThanh(id);
    navigate("/phan-cong");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Cập nhật phân công</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Trạng thái mới</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nhập trạng thái mới"
            value={trangThai}
            onChange={(e) => setTrangThai(e.target.value)}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          Cập nhật trạng thái
        </button>

        <button
          onClick={handleHoanThanh}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Đánh dấu hoàn thành
        </button>
      </div>
    </div>
  );
};

export default EditPhanCongDichVu;
