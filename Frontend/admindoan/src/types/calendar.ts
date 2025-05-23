export interface UserEvent {
  id: string;
  type: 'maintenance' | 'service';
  title: string;
  date: string;
  status: string;
  description?: string;
  productName?: string;
  serviceType?: string;
  maintenanceType?: string;
  cost?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  orderCode?: string;
  orderId?: string;
  sanPhamId?: string;
  tenSanPham?: string;
  moTaSanPham?: string;
  giaSanPham?: number;
  thoiGianBaoHanh?: number;
  ngayHetHanBaoHanh?: string;
} 