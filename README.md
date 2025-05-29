# Đồ Án Website Quản Lý Smart Home

Hệ thống quản lý dịch vụ bảo trì, bảo hành và sửa chữa thiết bị smart home.

## Công Nghệ Sử Dụng

### Backend
- ASP.NET Core 6.0
- Entity Framework Core
- SQL Server 2019
- JWT Authentication
- AutoMapper
- Unit of Work & Repository Pattern
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Axios
- React Context API
- React Icons
- React Hook Form

## Yêu Cầu Hệ Thống

### Backend
- .NET Core SDK 6.0 trở lên
- SQL Server 2019 trở lên
- SQL Server Management Studio (SSMS) 18.0 trở lên
- Visual Studio 2022 (khuyến nghị) hoặc Visual Studio Code

### Frontend
- Node.js phiên bản 16.x trở lên
- npm hoặc yarn
- Visual Studio Code (khuyến nghị)

## Kiến Trúc Hệ Thống

### Backend Architecture
```
Backend/
├── Controllers/           # API Endpoints
├── Models/               # Database Entities
├── Services/             # Business Logic
├── IServices/            # Service Interfaces
├── Repositories/         # Data Access Layer
├── UnitOfWork/          # Transaction Management
├── Core/                # Core Business Logic
├── Middleware/          # Custom Middleware
├── Migrations/          # Database Migrations
└── Libraries/           # Shared Utilities
```

### Frontend Architecture
```
Frontend/admindoan/
├── src/
│   ├── api/            # API Integration
│   ├── components/     # Reusable Components
│   ├── contexts/       # React Context
│   ├── hooks/         # Custom Hooks
│   ├── layouts/       # Page Layouts
│   ├── pages/         # Route Components
│   ├── types/         # TypeScript Types
│   ├── utils/         # Utility Functions
│   └── App.tsx        # Root Component
```

## Cài Đặt và Chạy Ứng Dụng

### 1. Cài Đặt Database

Có hai cách để cài đặt database:

#### Cách 1: Sử dụng Migration (Database trống)
1. Cập nhật chuỗi kết nối trong file `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=WebsiteSmartHome;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

2. Mở terminal tại thư mục Backend và chạy lệnh:
```bash
dotnet ef database update
```

#### Cách 2: Import file BACPAC (Có sẵn dữ liệu)
1. Mở SQL Server Management Studio
2. Kết nối vào SQL Server
3. Chuột phải vào Databases > Import Data-tier Application
4. Trong wizard, chọn:
   - Import from local disk
   - Chọn file SmartHome.bacpac
   - Đặt tên database là "SmartHome"
   - Click Next và chờ quá trình import hoàn tất

Hoặc sử dụng SqlPackage command line:
```bash
sqlpackage /action:Import /SourceFile:"path\to\SmartHome.bacpac" /TargetServerName:"YOUR_SERVER" /TargetDatabaseName:"SmartHome" /TargetUser:"YourUsername" /TargetPassword:"YourPassword"
```

### 2. Cài Đặt Backend

1. Clone repository về máy:
```bash
git clone <repository-url>
```

2. Mở thư mục Backend:
```bash
cd Backend
```

3. Khôi phục các packages:
```bash
dotnet restore
```

4. Chạy ứng dụng:
```bash
dotnet run
```

Backend sẽ chạy tại địa chỉ: `https://localhost:5133`

### 3. Cài Đặt Frontend

1. Mở thư mục Frontend/admindoan:
```bash
cd Frontend/admindoan
```

2. Cài đặt các dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Cấu hình API endpoint trong file `src/api/axios.config.ts`:
```typescript
baseURL: 'https://localhost:5133/api'
```

4. Chạy ứng dụng trong môi trường development:
```bash
npm run dev
# hoặc
yarn dev
```

Frontend sẽ chạy tại địa chỉ: `http://localhost:5173`

## Cấu Trúc Thư Mục

```
├── Backend/
│   ├── Controllers/         # API Controllers
│   ├── Models/             # Database Models
│   ├── Services/           # Business Logic
│   └── appsettings.json    # Cấu hình ứng dụng
│
├── Frontend/
│   └── admindoan/
│       ├── src/
│       │   ├── api/        # API Calls
│       │   ├── components/ # React Components
│       │   ├── contexts/   # React Contexts
│       │   ├── pages/      # Page Components
│       │   └── types/      # TypeScript Types
│       └── package.json
│
├── Database/
│   └── SmartHome.bacpac    # File backup database
│
└── README.md
```

## Tài Khoản Demo

### Admin
- Username: temp
- Password: 12345678

### Nhân Viên
- Username: hongnhung
- Password: 12345678

### Khách Hàng
- Username: tuannguyen  
- Password: 12345678

## Các Chức Năng Chính

### 1. Quản Lý Người Dùng
- Đăng nhập, đăng ký tài khoản
- Phân quyền người dùng (Admin, Nhân viên, Khách hàng)
- Quản lý thông tin cá nhân
  * Cập nhật thông tin cơ bản
  * Đổi mật khẩu
- Quản lý nhân viên
  * Thêm/sửa/xóa nhân viên
  * Phân công công việc
  * Theo dõi hiệu suất
- Phân quyền chức năng
  * Cấp quyền truy cập
  * Quản lý role
  * Phân quyền chi tiết theo chức năng

### 2. Quản Lý Sản Phẩm
- Danh mục sản phẩm
  * Thêm/sửa/xóa danh mục
  * Phân cấp danh mục
  * Sắp xếp thứ tự
- Quản lý sản phẩm
  * Thêm/sửa/xóa sản phẩm
  * Upload nhiều hình ảnh
  * Quản lý thông số kỹ thuật
  * Quản lý giá và khuyến mãi
- Tìm kiếm và lọc
  * Tìm theo tên, mã
  * Lọc theo danh mục
  * Lọc theo giá
  * Lọc theo trạng thái

### 3. Quản Lý Đơn Hàng
- Quy trình đơn hàng
  * Tạo đơn hàng mới
  * Xác nhận đơn hàng
  * Xử lý đơn hàng
  * Giao hàng
  * Hoàn thành/Hủy đơn
- Chi tiết đơn hàng
  * Thông tin khách hàng
  * Danh sách sản phẩm
  * Thông tin thanh toán
  * Lịch sử thay đổi trạng thái
- Thanh toán
  * Nhiều phương thức thanh toán
  * Xác nhận thanh toán
  * Hoàn tiền
- Báo cáo đơn hàng
  * Thống kê theo thời gian
  * Thống kê theo trạng thái
  * Doanh thu theo đơn hàng

### 4. Quản Lý Dịch Vụ
- Dịch vụ bảo hành
  * Đăng ký bảo hành
  * Xác nhận bảo hành
  * Theo dõi tiến độ
  * Hoàn thành bảo hành
- Dịch vụ bảo trì
  * Lập lịch bảo trì
  * Nhắc nhở bảo trì
  * Thực hiện bảo trì
  * Báo cáo kết quả
- Dịch vụ sửa chữa
  * Tiếp nhận yêu cầu
  * Tạo phiếu sửa chữa
  * Báo giá sửa chữa
  * Thực hiện sửa chữa
  * Bàn giao
- Quản lý phụ tùng
  * Danh mục phụ tùng
  * Tồn kho phụ tùng
  * Lịch sử sử dụng

### 5. Quản Lý Lịch Bảo Trì
- Lập lịch bảo trì
  * Tạo lịch tự động
  * Tạo lịch thủ công
  * Phân công nhân viên
  * Đặt lịch hẹn
- Thông báo bảo trì
  * Gửi thông báo email
  * Gửi SMS
  * Thông báo trên hệ thống
  * Xác nhận từ khách hàng
- Theo dõi thực hiện
  * Cập nhật tiến độ
  * Ghi nhận kết quả
  * Xác nhận hoàn thành
  * Đánh giá chất lượng
- Báo cáo bảo trì
  * Thống kê theo thời gian
  * Thống kê theo loại
  * Thống kê theo nhân viên
  * Đánh giá hiệu quả

### 6. Thống Kê & Báo Cáo
- Báo cáo doanh thu
  * Doanh thu theo thời gian
  * Doanh thu theo sản phẩm
  * Doanh thu theo dịch vụ
  * So sánh các kỳ
- Báo cáo đơn hàng
  * Số lượng đơn hàng
  * Tỷ lệ hoàn thành
  * Thời gian xử lý trung bình
  * Phân tích hủy đơn
- Báo cáo dịch vụ
  * Số lượng yêu cầu
  * Thời gian xử lý
  * Đánh giá khách hàng
  * Chi phí phát sinh
- Báo cáo bảo trì
  * Lịch bảo trì đã thực hiện
  * Tỷ lệ đúng hẹn
  * Chi phí bảo trì
  * Hiệu quả bảo trì
- Báo cáo khách hàng
  * Thống kê khách hàng mới
  * Phân tích hành vi
  * Mức độ hài lòng
  * Giá trị khách hàng

### 7. Tích Hợp Hệ Thống
- Tích hợp thanh toán
  * Cổng thanh toán online
  * Quét mã QR
  * Thanh toán thẻ
  * Ví điện tử
- Tích hợp thông báo
  * Email
  * SMS
  * Push notification
  * Webhook
- Tích hợp bên thứ ba
  * Đơn vị vận chuyển
  * Nhà cung cấp
  * Đối tác bảo hành
  * API bên ngoài

## Lưu Ý

- Đảm bảo SQL Server đang chạy trước khi khởi động backend
- Nếu sử dụng file bacpac, đảm bảo account SQL Server có quyền sysadmin
- Đảm bảo backend đang chạy trước khi khởi động frontend
- Nếu gặp lỗi CORS, kiểm tra cấu hình trong file `Program.cs` của backend
- Đảm bảo đã cài đặt đầy đủ các công cụ phát triển cần thiết

## Xử Lý Lỗi Thường Gặp

### Lỗi Import BACPAC
1. Đảm bảo SQL Server version tương thích
2. Chạy SSMS với quyền Administrator
3. Kiểm tra account SQL có đủ quyền
4. Nếu gặp lỗi version, có thể export lại BACPAC từ phiên bản SQL Server thấp hơn

### Lỗi Kết Nối Database
1. Kiểm tra SQL Server đang chạy
2. Verify connection string trong appsettings.json
3. Đảm bảo Windows Authentication hoặc SQL Authentication được cấu hình đúng

## Hỗ Trợ

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình cài đặt hoặc sử dụng, vui lòng tạo issue trong repository hoặc liên hệ trực tiếp với team phát triển.

## License

[MIT License](LICENSE) 