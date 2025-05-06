using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum TrangThaiPhanCong
    {
        [Description("Đang chờ xử lý")]
        ChoXuLy,

        [Description("Đã tiếp nhận")]
        DaTiepNhan,

        [Description("Đang thực hiện")]
        DangThucHien,

        [Description("Hoàn thành")]
        HoanThanh
    }
}