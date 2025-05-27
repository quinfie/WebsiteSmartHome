using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum TrangThaiPhanCong
    {
        [Description("Đang chờ xử lý")]
        DangChoXuLy,

        [Description("Hoàn thành")]
        HoanThanh,

        [Description("Đã xác nhận")]
        DaXacNhan,

        [Description("Đã hủy")]
        DaHuy
    }
}