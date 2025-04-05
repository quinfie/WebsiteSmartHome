using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.Repositories;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;
using WebsiteSmartHome.IServices;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ Controllers và các dịch vụ API cần thiết
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình kết nối cơ sở dữ liệu
var connectionString = builder.Configuration.GetConnectionString("WebsiteSmartHome");
builder.Services.AddDbContext<SmartHomeDbContext>(options =>
    options.UseSqlServer(connectionString));

// Đăng ký các repository và UnitOfWork
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Đăng ký các dịch vụ
builder.Services.AddScoped<IDanhMucService, DanhMucService>();
<<<<<<< HEAD
builder.Services.AddScoped<IDanhGiaService, DanhGiaService>();
builder.Services.AddScoped<IDonHangService, DonHangService>();
builder.Services.AddScoped<IChiTietDonHangService, ChiTietDonHangService>();
=======
builder.Services.AddScoped<IDonHangService, DonHangService>();

>>>>>>> 116c7e5212bdfa5dd3303972b31c08714dcde9d0

// Đăng ký dịch vụ LichBaoTri
builder.Services.AddScoped<ILichBaoTriService, LichBaoTriService>();

// Tạo ứng dụng
var app = builder.Build();

// Cấu hình cho môi trường phát triển
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Cấu hình các middleware cần thiết
app.UseHttpsRedirection();
app.UseAuthorization();

// Định tuyến các controller
app.MapControllers();

// Chạy ứng dụng
app.Run();
