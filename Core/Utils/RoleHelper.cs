using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum RoleHelper
    {
        [Description("Khách hàng")]
        Customer,

        [Description("Nhân viên")]
        Worker,

        [Description("Quản trị viên")]
        Admin,

        [Description("Quản lí")]
        Manager,
    }
}
