using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Middleware;
using WebsiteSmartHome.Repositories;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Website Smart Home API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Chỉ cần dán token (không cần chữ 'Bearer '). Ví dụ: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, // <- đổi từ ApiKey sang Http
        Scheme = "bearer",              // <- phải là lowercase
        BearerFormat = "JWT"            // <- tuỳ chọn, giúp UI hiển thị rõ hơn
    });


    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var connectionString = builder.Configuration.GetConnectionString("WebsiteSmartHome");
builder.Services.AddDbContext<SmartHomeDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<IDanhMucService, DanhMucService>();
builder.Services.AddScoped<IVaiTroService, VaiTroService>();
builder.Services.AddScoped<ITaiKhoanService, TaiKhoanService>();
builder.Services.AddScoped<INguoiDungService, NguoiDungService>();
builder.Services.AddScoped<IKhoService, KhoService>();
builder.Services.AddScoped<INhaCungCapService, NhaCungCapService>();
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
//builder.Services.AddScoped<INguoiPhanCongService, NguoiPhanCongService>();
builder.Services.AddScoped<ILichBaoTriService, LichBaoTriService>();
builder.Services.AddScoped<IDanhGiaService, DanhGiaService>();
builder.Services.AddScoped<IDonHangService, DonHangService>();
builder.Services.AddScoped<IChiTietDonHangService, ChiTietDonHangService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy => 
        policy.RequireRole("Quản Trị Viên"));
    options.AddPolicy("RequireStaffRole", policy => 
        policy.RequireRole("Nhân Viên", "Quản Trị Viên", "Quản Lí"));
    options.AddPolicy("RequireCustomerRole", policy => 
        policy.RequireRole("Khách Hàng", "Nhân Viên", "Quản Trị Viên"));
    options.AddPolicy("RequireManagerRole", policy =>
        policy.RequireRole("Quản Lí", "Quản Trị Viên"));
    options.AddPolicy("RequireAllRoles", policy =>
        policy.RequireRole("Quản Trị Viên", "Quản Lí", "Nhân Viên", "Khách Hàng"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .WithOrigins("http://localhost:3000", "http://localhost:5173", "https://localhost:3000", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler("/error");
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
