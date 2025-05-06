using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum TrangThaiYeuCauDichVu
    {
        [Description("Chờ xác nhận")]
        ChoXacNhan,

        [Description("Đã xác nhận")]
        DaXacNhan,

        [Description("Đang xử lý")]
        DangXuLy,

        [Description("Hoàn thành")]
        HoanThanh,

        [Description("Đã hủy")]
        DaHuy
    }
}