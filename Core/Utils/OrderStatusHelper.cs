using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum OrderStatusHelper
    {
        [Description("Chờ xác nhận")]
        ChoXacNhan,

        [Description("Đã xác nhận")]
        DaXacNhan,

        [Description("Đang giao")]
        DangGiaog,

        [Description("Hoàn thành")]
        HoanThanh,

        [Description("Đã hủy")]
        DaHuy
    }
}
