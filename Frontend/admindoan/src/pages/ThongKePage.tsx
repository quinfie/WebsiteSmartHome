import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { thongKeService } from '../api/thongke';
import {
    ThongKeDonHangDto,
    ThongKeSanPhamDto,
    ThongKeDanhMucDto,
    ThongKeDichVuDto,
    ThongKeDanhGiaDto
} from '../types/thongke';
import {
    HiOutlineShoppingBag,
    HiOutlineCurrencyDollar,
    HiOutlineShoppingCart,
    HiOutlineBriefcase,
    HiOutlineStar
} from 'react-icons/hi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Card thống kê
const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}) => {
    return (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg')} bg-opacity-20`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Card biểu đồ
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
            {children}
        </div>
    );
};

export default function ThongKePage() {
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date().setDate(1), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Data states
    const [salesData, setSalesData] = useState<ThongKeDonHangDto[]>([]);
    const [productData, setProductData] = useState<ThongKeSanPhamDto[]>([]);
    const [categoryData, setCategoryData] = useState<ThongKeDanhMucDto[]>([]);
    const [serviceData, setServiceData] = useState<ThongKeDichVuDto[]>([]);
    const [ratingData, setRatingData] = useState<ThongKeDanhGiaDto[]>([]);

    // Summary states
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalServices: 0,
        averageRating: 0
    });

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch all data in parallel
            const [
                salesResponse,
                productResponse,
                categoryResponse,
                serviceResponse,
                ratingResponse
            ] = await Promise.all([
                thongKeService.getThongKeDonHang(dateRange.startDate, dateRange.endDate),
                thongKeService.getThongKeSanPham(dateRange.startDate, dateRange.endDate),
                thongKeService.getThongKeTheoDanhMuc(dateRange.startDate, dateRange.endDate),
                thongKeService.getThongKeDichVu(dateRange.startDate, dateRange.endDate),
                thongKeService.getThongKeDanhGia(dateRange.startDate, dateRange.endDate)
            ]);

            setSalesData(salesResponse);
            setProductData(productResponse);
            setCategoryData(categoryResponse);
            setServiceData(serviceResponse);
            setRatingData(ratingResponse);

            // Calculate summary
            setSummary({
                totalSales: salesResponse.reduce((acc, curr) => acc + curr.tongTien, 0),
                totalOrders: salesResponse.reduce((acc, curr) => acc + curr.soDonHang, 0),
                totalProducts: productResponse.reduce((acc, curr) => acc + curr.soLuongBan, 0),
                totalServices: serviceResponse.reduce((acc, curr) => acc + curr.soLuong, 0),
                averageRating: ratingResponse.reduce((acc, curr) => acc + (curr.rating * curr.soLuong), 0) /
                    ratingResponse.reduce((acc, curr) => acc + curr.soLuong, 0)
            });

        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Thống Kê Chi Tiết</h1>
                <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-600">Từ ngày:</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-gray-600">Đến ngày:</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="Tổng doanh thu"
                    value={formatCurrency(summary.totalSales)}
                    icon={<HiOutlineCurrencyDollar className="text-green-600 text-2xl" />}
                    color="border-green-500"
                />
                <StatCard
                    title="Số đơn hàng"
                    value={summary.totalOrders}
                    icon={<HiOutlineShoppingBag className="text-blue-600 text-2xl" />}
                    color="border-blue-500"
                />
                <StatCard
                    title="Sản phẩm đã bán"
                    value={summary.totalProducts}
                    icon={<HiOutlineShoppingCart className="text-purple-600 text-2xl" />}
                    color="border-purple-500"
                />
                <StatCard
                    title="Yêu cầu dịch vụ"
                    value={summary.totalServices}
                    icon={<HiOutlineBriefcase className="text-orange-600 text-2xl" />}
                    color="border-orange-500"
                />
                <StatCard
                    title="Đánh giá trung bình"
                    value={`${summary.averageRating.toFixed(1)}/5`}
                    icon={<HiOutlineStar className="text-yellow-600 text-2xl" />}
                    color="border-yellow-500"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Doanh thu theo thời gian */}
                <ChartCard title="Doanh thu theo thời gian">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="ngay"
                                    tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: vi })}
                                    stroke="#6b7280"
                                />
                                <YAxis
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                    stroke="#6b7280"
                                />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: vi })}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="tongTien"
                                    name="Doanh thu"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Top sản phẩm bán chạy */}
                <ChartCard title="Top sản phẩm bán chạy">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="tenSanPham" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="soLuongBan"
                                    name="Số lượng bán"
                                    fill="#82ca9d"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Phân bố theo danh mục */}
                <ChartCard title="Phân bố theo danh mục">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="soLuongSanPham"
                                    nameKey="tenDanhMuc"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    label={({
                                        cx,
                                        cy,
                                        midAngle,
                                        innerRadius,
                                        outerRadius,
                                        value,
                                        index
                                    }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill="#374151"
                                                textAnchor={x > cx ? 'start' : 'end'}
                                                dominantBaseline="central"
                                                className="text-sm"
                                            >
                                                {`${categoryData[index].tenDanhMuc}: ${value}`}
                                            </text>
                                        );
                                    }}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={entry.tenDanhMuc}
                                            fill={COLORS[index % COLORS.length]}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        `${value} sản phẩm`,
                                        `Danh mục: ${name}`
                                    ]}
                                />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    formatter={(value, entry) => (
                                        <span className="text-gray-600">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Thống kê dịch vụ */}
                <ChartCard title="Thống kê dịch vụ">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="loaiDichVu" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="soLuong"
                                    name="Số lượng yêu cầu"
                                    fill="#8884d8"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Bảng chi tiết */}
            <ChartCard title="Chi tiết đơn hàng">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trung bình/đơn
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salesData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {format(new Date(item.ngay), 'dd/MM/yyyy', { locale: vi })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.soDonHang}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.tongTien)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(item.tongTien / item.soDonHang)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>
        </div>
    );
} 