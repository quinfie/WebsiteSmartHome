export const selectList = [
  {
    label: "Select category",
    value: "default",
  },
  {
    label: "Cảm Biến SmartHome",
    value: "cảm biến smartHome",
  },
  {
    label: "Thiết Bị Điều Khiển",
    value: "thiết bị điều khiển",
  },
  {
    label: "Chiếu Sáng Thông Minh",
    value: "chiếu sáng thông minh",
  },
  {
    label: "An Ninh SmartHome",
    value: "an ninh smartHome",
  },
];

export const stockStatusList = [
  {
    label: "In stock",
    value: "in-stock",
  },
  {
    label: "Out of stock",
    value: "out-of-stock",
  },
];

export const roles = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "User",
    value: "user",
  },
];

export const products = [
  {
    label: "Product 1",
    value: "product1",
  },
  {
    label: "Product 2",
    value: "product2",
  },
];

export const categories = [
  {
    id: 1,
    tenDanhMuc: "Cảm Biến SmartHome",
    moTa: "Các loại cảm biến thông minh như cảm biến chuyển động, nhiệt độ, độ ẩm",
    imageUrl: "src/assets/cam-bien-chuyen-dong-.jpg",
  },
  {

    id:2 ,
    tenDanhMuc: "Thiết Bị Điều Khiển",
    moTa: "Các thiết bị điều khiển thông minh như công tắc, ổ cắm, bộ điều khiển trung tâm",
    imageUrl: "src/assets/thiet-bi-dieu-khien.jpg",
  },
  {

    id: 3,
    tenDanhMuc: "Chiếu Sáng Thông Minh",
    moTa: "Hệ thống chiếu sáng thông minh, đèn LED tự động, đèn cảm biến",
    imageUrl: "src/assets/chieu-sang-thong-minh.jpg",
  },
  {

    id: 4,
    tenDanhMuc: "An Ninh SmartHome",
    moTa: "Hệ thống an ninh gồm camera, chuông cửa thông minh, khóa điện tử",
    imageUrl: "src/assets/he-thong-an-ninh.jpg",
  },
];


export const faqs = [
  {
    question: "Làm thế nào để đặt lại mật khẩu?",
    answer: "Vào phần cài đặt và nhấn vào 'Đặt lại mật khẩu'.",
  },
  {
    question: "Tôi có thể xem lịch sử mua hàng ở đâu?",
    answer:
      "Lịch sử mua hàng của bạn nằm trong phần cài đặt tài khoản, mục 'Lịch sử mua hàng'.",
  },
  {
    question: "Làm thế nào để chỉnh sửa người dùng?",
    answer:
      "Nhấn vào nút 'Người dùng' trong thanh bên, sau đó chọn người dùng bạn muốn chỉnh sửa bằng cách nhấn vào biểu tượng cây bút.",
  },
  {
    question: "Làm thế nào để chỉnh sửa sản phẩm?",
    answer:
      "Nhấn vào nút 'Sản phẩm' trong thanh bên, sau đó chọn sản phẩm bạn muốn chỉnh sửa bằng cách nhấn vào biểu tượng cây bút.",
  },
  {
    question: "Làm thế nào để chỉnh sửa đơn hàng?",
    answer:
      "Nhấn vào nút 'Đơn hàng' trong thanh bên, sau đó chọn đơn hàng bạn muốn chỉnh sửa bằng cách nhấn vào biểu tượng cây bút.",
  },
  {
    question: "Làm thế nào để chỉnh sửa danh mục?",
    answer:
      "Nhấn vào nút 'Danh mục' trong thanh bên, sau đó chọn danh mục bạn muốn chỉnh sửa bằng cách nhấn vào biểu tượng cây bút.",
  },
 
];


export const orderAdminItems = [
  {
    user: {
      name: "Nguyễn Minh Tuấn Anh",
      imageUrl: "/src/assets/random user 1.jpg",
    },
    status: "Cancelled", // tương ứng "Đã hủy"
    total: "2,702,352 VNĐĐ",
    date: "07/03/2025 20:58:26",
  },
  {
    user: {
      name: "Phạm Thị Hồng Nhung",
      imageUrl: "/src/assets/random user 2.jpg",
    },
    status: "Shipping", // tương ứng "Đang giao"
    total: "3,285,138 VNĐ",
    date: "17/03/2025 20:58:26",
  },
  {
    user: {
      name: "Trần Quốc Bảo",
      imageUrl: "/src/assets/random user 3.jpg",
    },
    status: "Completed", // tương ứng "Hoàn thành"
    total: "4,441,879 VNĐ",
    date: "16/02/2025 20:58:26",
  },
  {
    user: {
      name: "Lê Thanh Mai",
      imageUrl: "/src/assets/random user 4.jpg",
    },
    status: "Shipping", // tương ứng "Đang giao"
    total: "1,308,987 VNĐ",
    date: "04/03/2025 20:58:26",
  },
  {
    user: {
      name: "Nguyễn Minh Tuấn Anh",
      imageUrl: "/src/assets/random user 5.jpg",
    },
    status: "Pending", // tương ứng "Chờ xác nhận"
    total: "3,597,598 VNĐ",
    date: "02/04/2025 20:58:26",
  },
];

export const productAdminItems = [
  {
    TenSanPham: "Cảm Biến Chuyển Động Xiaomi",
    Gia: "450,000 VNĐ",
    SoLuongTon: 100,
    ThoiGianBaoHanh: 12,
    MoTa: "Cảm biến chuyển động thông minh, kết nối Zigbee.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "Cảm Biến SmartHome",
    MaNhaCungCap: "Công Ty TNHH Phát Triển SmartHome",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/cam-bien-chuyen-dong.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Ổ Cắm Thông Minh TP-Link",
    Gia: "550,000 VNĐ",
    SoLuongTon: 80,
    ThoiGianBaoHanh: 24,
    MoTa: "Ổ cắm Wi-Fi điều khiển từ xa qua ứng dụng.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "Thiết Bị Điều Khiển",
    MaNhaCungCap: "Công Ty TNHH Phát Triển SmartHome",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/o-cam-thong-minh.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Đèn LED RGB Philips Hue",
    Gia: "750,000 VNĐ",
    SoLuongTon: 50,
    ThoiGianBaoHanh: 36,
    MoTa: "Đèn LED đổi màu, tích hợp điều khiển giọng nói.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "Chiếu Sáng Thông Minh",
    MaNhaCungCap: "Công Ty TNHH Thiết Bị Điện",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/den-led-RGB-Philips.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Camera An Ninh Hikvision",
    Gia: "2,200,000 VNĐ",
    SoLuongTon: 40,
    ThoiGianBaoHanh: 24,
    MoTa: "Camera giám sát thông minh, hỗ trợ quan sát từ xa.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "An Ninh SmartHome",
    MaNhaCungCap: "Công Ty TNHH Thiết Bị Điện",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/camera-an-ninh-Hikvision.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Camera An Ninh Xiaomi",
    Gia: "1,200,000 VNĐ",
    SoLuongTon: 200,
    ThoiGianBaoHanh: 24,
    MoTa: "Camera an ninh 1080p, kết nối Wi-Fi, có khả năng nhận diện chuyển động.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "An Ninh SmartHome",
    MaNhaCungCap: "Công Ty TNHH Thiết Bị Điện",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/camera-an-ninh-Xiaomi.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Cảm Biến Nhiệt Độ Xiaomi",
    Gia: "350,000 VNĐ",
    SoLuongTon: 150,
    ThoiGianBaoHanh: 12,
    MoTa: "Cảm biến nhiệt độ thông minh, đo nhiệt độ và độ ẩm, kết nối Zigbee.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "Cảm Biến SmartHome",
    MaNhaCungCap: "Công Ty Cổ Phần Công Nghệ Mới",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/cam-bien-nhiet-do-Xiaomi.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
  {
    TenSanPham: "Bộ Điều Khiển Trung Tâm SmartLife",
    Gia: "1,500,000 VNĐ",
    SoLuongTon: 60,
    ThoiGianBaoHanh: 36,
    MoTa: "Bộ điều khiển trung tâm, kết nối với các thiết bị SmartHome qua Wi-Fi và Zigbee.",
    NgaySanXuat: "2025-05-02",
    MaDanhMuc: "Thiết Bị Điều Khiển",
    MaNhaCungCap: "Công Ty Cổ Phần Công Nghệ Mới",
    MaKho: "Kho Tổng Khu Vực Miền Nam",
    imageUrl: "src/assets/bo-dieu-khien-trung-tam.jpg", // Thêm URL hình ảnh cho sản phẩm
  },
];


export const userAdminItems = [
  {
    id :"1",
    user: {
      name: "Nguyễn Minh Tuấn Anh",
      imageUrl: "/src/assets/random user 1.jpg",
    },
    email: "tuannguyen@gmail.com",
    role: "Customer",
    gioiTinh: "Nam",
    ngaySinh: "1987-09-12",
    cccd: "123456789012",
    soDienThoai: "0912345678",
    diaChi: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    tenTaiKhoan: "tuannguyen"
  },
  {
    id :"22",
    user: {
      name: "Phạm Thị Hồng Nhung",
      imageUrl: "/src/assets/random user 2.jpg",
    },
    email: "hongnhung@gmail.com",
    role: "Worker",
    gioiTinh: "Nữ",
    ngaySinh: "1993-06-25",
    cccd: "987652109876",
    soDienThoai: "0987654321",
    diaChi: "456 Đường Nguyễn Trãi, Quận 5, TP.HCM",
    tenTaiKhoan: "hongnhung"
  },
  {

    id :"33",
    user: {
      name: "Trần Quốc Bảo",
      imageUrl: "/src/assets/random user 3.jpg",
    },
    email: "quocbao@gmail.com",
    role: "Admin",
    gioiTinh: "Nam",
    ngaySinh: "1985-02-18",
    cccd: "112233456677",
    soDienThoai: "0905123456",
    diaChi: "789 Đường Trần Hưng Đạo, Quận 3, TP.HCM",
    tenTaiKhoan: "quocbao"
  },
  {
    id :"4",
    user: {
      name: "Lê Thanh Mai",
      imageUrl: "/src/assets/random user 4.jpg",
    },
    email: "lethanhmai@gmail.com",
    role: "Manager",
    gioiTinh: "Nữ",
    ngaySinh: "1990-11-08",
    cccd: "667788001122",
    soDienThoai: "0932987654",
    diaChi: "101 Đường Pasteur, Quận 1, TP.HCM",
    tenTaiKhoan: "lethanhmai"
  }
];



export const reviewsAdminItems = [
  {
    user: {
      name: "Bùi Lan Anh",
      imageUrl: "/src/assets/random user 1.jpg",
    },
    rating: 5,
    product: "Apple HomePod Mini",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Lê Thanh Nhàn",
      imageUrl: "/src/assets/random user 2.jpg",
    },
    rating: 4,
    product: "Samsung SmartThings Hub v3",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Lê Vũ Luân",
      imageUrl: "/src/assets/random user 3.jpg",
    },
    rating: 5,
    product: "Xiaomi Mi Smart Home Hub",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Nguyễn Thanh Thảo",
      imageUrl: "/src/assets/random user 4.jpg",
    },
    rating: 4,
    product: "Samsung Galaxy S21 Ultra 5G",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Lê Thanh Lý",
      imageUrl: "/src/assets/random user 5.jpg",
    },
    rating: 5,
    product: "Hubitat Elevation",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Nguyễn Thị Thu Nga",
      imageUrl: "/src/assets/random user 6.jpg",
    },
    rating: 3,
    product: "Fibaro Home Center 3",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Ngô Thị Ý Nhi",
      imageUrl: "/src/assets/random user 7.jpg",
    },
    rating: 4,
    product: "Logitech Harmony Hub",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Bùi Thanh Công",
      imageUrl: "/src/assets/random user 8.jpg",
    },
    rating: 5,
    product: "TP-Link Kasa Smart Light",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Nguyễn Thị Thanh Thanh",
      imageUrl: "/src/assets/random user 9.jpg",
    },
    rating: 5,
    product: "Meross Smart LED Bulb",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Ngô Văn Thành",
      imageUrl: "/src/assets/random user 10.jpg",
    },
    rating: 4,
    product: "Arlo Security Light",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Trần Chí Nhật",
      imageUrl: "/src/assets/random user 11.jpg",
    },
    rating: 5,
    product: "EcoSmart Smart Bulb",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Võ Hồng Thanh",
      imageUrl: "/src/assets/random user 12.jpg",
    },
    rating: 5,
    product: "Google Nest Cam",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Nguyễn Hồng Đào",
      imageUrl: "/src/assets/random user 13.jpg",
    },
    rating: 4,
    product: "Blink Outdoor",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Trần Thanh Hào",
      imageUrl: "/src/assets/random user 14.jpg",
    },
    rating: 5,
    product: "Reolink Argus 3 Pro",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
  {
    user: {
      name: "Nguyễn Hồng Loan",
      imageUrl: "/src/assets/random user 15.jpg",
    },
    rating: 5,
    product: "Nest Learning Thermostat",
    lastLogin:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
  },
];

export const promotions = [
  {
    id: "promo1",
    name: "Giảm 20% toàn bộ sản phẩm",
    code: "GIAM20",
    discount: 20,
    startDate: "2025-05-01",
    endDate: "2025-05-15",
    status: "Đang diễn ra",
  },
  {
    id: "promo2",
    name: "Giảm giá mùa hèhè",
    code: "MUAHE",
    discount: 20,
    startDate: "2025-05-01",
    endDate: "2025-05-15",
    status: "Đang diễn ra",
  },
  
];
export const nhaCungCapItems = [
  {
    Id: "ncc001",
    TenNhaCungCap: "Công ty TNHH Thiết Bị ABC",
    SoDienThoai: "0123456789",
    Email: "abc@nhacungcap.vn",
    DiaChi: "123 Lê Lợi, Quận 1, TP.HCM"
  },
  {
    Id: "ncc002",
    TenNhaCungCap: "SmartHome VN",
    SoDienThoai: "0987654321",
    Email: "smarthome@vn.com",
    DiaChi: "456 Nguyễn Trãi, Quận 5, TP.HCM"
  },
  
];
export const phanCongDichVuItems = [
  {
    Id: "pcdv1",
    MaYeuCau: "yc1",
    MaKyThuatVien: "ktv1",
    NgayPhanCong: "2025-05-01",
    TrangThaiPhanCong: "Đang chờ xử lý",
  },
  {
    Id: "pcdv2",
    MaYeuCau: "yc2",
    MaKyThuatVien: "ktv2",
    NgayPhanCong: "2025-05-03",
    TrangThaiPhanCong: "Đã tiếp nhận",
  },
];
export const khoItems = [
  {
    Id: "kho1",
    TenKho: "Kho Trung Chuyển A",
    DiaChi: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    SoDienThoai: "0912345678",
  },
  {
    Id: "kho2",
    TenKho: "Kho HCM",
    DiaChi: "456 Đường Nguyễn Trãi, Quận 5, TP.HCM",
    SoDienThoai: "0987654321",
  },
];
export const yeuCauDichVuItems = [
  {
    Id: "yc1",
    MaChiTietDonHang: 101,
    LoaiDichVu: "Bảo hành",
    TrangThaiYeuCau: "Đang chờ xác nhận",
    ChiPhiYeuCau: 500.00,
    NgayHen: "2025-05-10",
    MoTa: "Kiểm tra và sửa chữa linh kiện",
  },
  {
    Id: "yc2",
    MaChiTietDonHang: 102,
    LoaiDichVu: "Sửa chữa",
    TrangThaiYeuCau: "Đã xác nhận",
    ChiPhiYeuCau: 1200.50,
    NgayHen: "2025-05-12",
    MoTa: "Thay pin và vệ sinh thiết bị",
  },
];


