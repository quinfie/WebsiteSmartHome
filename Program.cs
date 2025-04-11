using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Data;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Middleware;
using WebsiteSmartHome.Repositories;
using WebsiteSmartHome.Services;
using WebsiteSmartHome.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseExceptionHandler("/error");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseCors("AllowAll");


app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
