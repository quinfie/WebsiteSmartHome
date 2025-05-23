using System.ComponentModel;

namespace WebsiteSmartHome.Core.Utils
{
    public enum LoaiDichVu
    {
        [Description("Bảo hành")]
        BaoHanh,
        [Description("Sửa chữa")]
        SuaChua
    }

    public enum TrangThaiYeuCau
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

    // ... existing code ...
}