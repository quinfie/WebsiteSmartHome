using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum OrderStatusHelper
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
