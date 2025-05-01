using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum RoleHelper
    {
        [Description("Khách Hàng")]
        KhachHang,

        [Description("Nhân Viên")]
        NhanVien,

        [Description("Quản Trị Viên")]
        QuanTriVien,

        [Description("Quản Lí")]
        QuanLy,
    }
}
