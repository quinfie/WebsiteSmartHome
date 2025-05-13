// ... existing code ...
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';

Modal.setAppElement('#root'); // Đặt root cho accessibility

export default function WarrantySchedule() {
  // Dữ liệu lịch bảo trì/bảo hành (giả lập)
  const lichBaoTriList = [
    {
        Id: '1',
        MaChiTietDonHang: 101,
        NgayBaoTri: '2024-07-01T09:00:00',
        LoaiBaoTri: 'Bảo hành',
        TrangThai: 'Đã thông báo',
        NguonPhatSinh: 'Tự động',
        MaYeuCauDichVu: '201',
        chiTietDonHang: {
          Id: 101,
          TenSanPham: 'Tủ lạnh Samsung 2023',
          SoLuong: 1,
          Gia: 12000000,
          TenKhachHang: 'Nguyễn Văn A',
          SoDienThoai: '0901234567',
          DiaChi: 'Hà Nội'
        },
        phanCong: {
          Id: '301',
          MaYeuCau: '201',
          MaKyThuatVien: '401',
          NgayPhanCong: '2024-06-25T10:00:00',
          NgayHoanThanh: null,
          TrangThaiPhanCong: 'Đang thực hiện',
          kyThuatVien: {
            Id: '401',
            HoTen: 'KTV Trần Văn B',
            SoDienThoai: '0987654321'
          }
        },
        yeuCauDichVu: {
          Id: '201',
          NoiDung: 'Bảo trì định kỳ',
          NgayTao: '2024-06-20T08:00:00'
        }
      }
  ];

  // Lấy tất cả ngày có lịch
  const allDates = lichBaoTriList.map(l => new Date(l.NgayBaoTri).toDateString());

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Khi click vào ngày
  const handleDayClick = (date) => {
    const lichTrongNgay = lichBaoTriList.filter(
      l => new Date(l.NgayBaoTri).toDateString() === date.toDateString()
    );
    if (lichTrongNgay.length > 0) {
      setModalData(lichTrongNgay);
      setSelectedDate(date);
    }
  };

  return (
    <div className="container my-10 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Lịch bảo hành/bảo trì</h2>
      <Calendar
        tileClassName={({ date }) =>
          allDates.includes(date.toDateString()) ? 'bg-green-500 text-white rounded-full' : ''
        }
        onClickDay={handleDayClick}
      />

      {/* Modal hiển thị chi tiết */}
      <Modal
        isOpen={!!modalData}
        onRequestClose={() => setModalData(null)}
        contentLabel="Chi tiết lịch bảo trì/bảo hành"
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <button
          className="float-right text-gray-500 hover:text-red-500"
          onClick={() => setModalData(null)}
        >
          Đóng
        </button>
        <h3 className="text-xl font-bold mb-4 text-green-700">Chi tiết lịch ngày {selectedDate && selectedDate.toLocaleDateString('vi-VN')}</h3>
        {modalData && modalData.map((lich, idx) => (
          <div key={lich.Id} className="mb-6 border-b pb-4">
            <div><b>Loại:</b> {lich.LoaiBaoTri}</div>
            <div><b>Trạng thái:</b> {lich.TrangThai}</div>
            <div><b>Nguồn phát sinh:</b> {lich.NguonPhatSinh}</div>
            <div className="mt-2"><b>Thông tin đơn hàng:</b></div>
            <ul className="ml-4">
              <li><b>Sản phẩm:</b> {lich.chiTietDonHang.TenSanPham}</li>
              <li><b>Số lượng:</b> {lich.chiTietDonHang.SoLuong}</li>
              <li><b>Giá:</b> {lich.chiTietDonHang.Gia.toLocaleString()}đ</li>
              <li><b>Khách hàng:</b> {lich.chiTietDonHang.TenKhachHang}</li>
              <li><b>SĐT:</b> {lich.chiTietDonHang.SoDienThoai}</li>
              <li><b>Địa chỉ:</b> {lich.chiTietDonHang.DiaChi}</li>
            </ul>
            <div className="mt-2"><b>Thông tin phân công:</b></div>
            <ul className="ml-4">
              <li><b>Kỹ thuật viên:</b> {lich.phanCong.kyThuatVien.HoTen}</li>
              <li><b>SĐT KTV:</b> {lich.phanCong.kyThuatVien.SoDienThoai}</li>
              <li><b>Ngày phân công:</b> {new Date(lich.phanCong.NgayPhanCong).toLocaleString('vi-VN')}</li>
              <li><b>Trạng thái:</b> {lich.phanCong.TrangThaiPhanCong}</li>
            </ul>
            <div className="mt-2"><b>Yêu cầu dịch vụ:</b> {lich.yeuCauDichVu.NoiDung}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
}