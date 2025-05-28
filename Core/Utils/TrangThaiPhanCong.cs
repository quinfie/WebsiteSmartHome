using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum TrangThaiPhanCong
    {
        [Description("Đang chờ xác nhận")]
        DangChoXacNhan,

        [Description("Hoàn thành")]
        HoanThanh,

        [Description("Đã xác nhận")]
        DaXacNhan,

        [Description("Đã hủy")]
        DaHuy
    }
}