using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum TrangThaiYeuCauDichVu
    {

        [Description("Đang chờ xác nhận")]
        DangChoXacNhan,

        [Description("Đã xác nhận")]
        DaXacNhan,

        [Description("Hoàn thành")]
        HoanThanh,

        [Description("Đã hủy")]
        DaHuy
    }
}