using Microsoft.EntityFrameworkCore;
using WebsiteSmartHome.Data;
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

var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
