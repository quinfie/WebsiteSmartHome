using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum AccountStatus
    {
        [Description("Hoạt động")]
        HoatDong,

        [Description("Bị khóa")]
        BiKhoa,

        [Description("Chờ xác minh")]
        ChoXacMinh
    }
}
