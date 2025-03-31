using System.ComponentModel;

namespace WebsiteSmartHome.Core.Store
{
    public enum StatusHelper
    {
        [Description("Đang chờ xử lý")]
        Pending,

        [Description("Đã xác nhận")]
        Confirmed,

        [Description("Đã hoàn thành")]
        Completed,

        [Description("Đã hủy")]
        Canceled
    }
}
