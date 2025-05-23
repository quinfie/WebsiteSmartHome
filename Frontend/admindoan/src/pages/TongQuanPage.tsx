import { useState, useEffect } from "react";
import { Sidebar } from "../components";
import {
    HiOutlineShoppingBag,
    HiOutlineUsers,
    HiOutlineCurrencyDollar,
    HiOutlineTag,
    HiOutlineClipboardCheck,
    HiOutlineChevronRight,
    HiOutlineBriefcase,
    HiOutlineOfficeBuilding,
    HiOutlineChartBar
} from "react-icons/hi";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { motion } from "framer-motion";
import {
    getDashboardStats,
    getRevenueData,
    getOrderStatusData,
    getTopSellingProducts,
    getMonthlyNewUsers,
    DashboardStats,
    RevenueData,
    OrderStatusData,
    TopProduct
} from "../api/thongke";

// Component thẻ thống kê
const StatCard = ({ title, value, icon, color, secondaryText = null }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    secondaryText?: string | null;
}) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`${color} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold dark:text-white text-gray-800">{value}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{title}</p>
            {secondaryText && (
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{secondaryText}</p>
            )}
        </motion.div>
    );
};

// Component biểu đồ với tiêu đề
const ChartCard = ({ title, children, className = "" }: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700 ${className}`}
        >
            <h3 className="text-lg font-semibold mb-4 dark:text-white text-gray-800">{title}</h3>
            {children}
        </motion.div>
    );
};

// Định dạng số tiền VND
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

// Custom Tooltip cho biểu đồ
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
                {payload.map((item: any, index: number) => (
                    <p key={index} style={{ color: item.color }} className="text-sm">
                        {item.name}: {item.name.includes("doanh") || item.name.includes("revenue") || item.name.includes("profit") || item.name.includes("lợi") || item.name.includes("doanh_thu")
                            ? formatCurrency(item.value)
                            : item.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Component loading chờ dữ liệu
const LoadingIndicator = () => (
    <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const TongQuanPage = () => {
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [usersData, setUsersData] = useState<{ month: string; users: number }[]>([]);

    useEffect(() => {
        setIsClient(true);

        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Tải tất cả dữ liệu thống kê
                const [
                    statsData,
                    revenueDataResponse,
                    orderStatusDataResponse,
                    topProductsResponse,
                    usersDataResponse
                ] = await Promise.all([
                    getDashboardStats(),
                    getRevenueData(),
                    getOrderStatusData(),
                    getTopSellingProducts(5),
                    getMonthlyNewUsers()
                ]);

                setStats(statsData);
                setRevenueData(revenueDataResponse);
                setOrderStatusData(orderStatusDataResponse);
                setTopProducts(topProductsResponse);
                setUsersData(usersDataResponse);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thống kê:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const currentDate = new Date();
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const currentMonthName = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-gray-100 dark:bg-gray-900 w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
                            Tổng quan
                        </h2>
                        <p className="dark:text-whiteSecondary text-blackPrimary flex items-center text-base mt-1">
                            <span>Bảng điều khiển</span>
                            <HiOutlineChevronRight className="mx-1" />
                            <span>Tổng quan</span>
                        </p>
                    </div>
                    <div className="dark:text-whiteSecondary text-blackPrimary text-right">
                        <p className="text-lg font-semibold">{currentMonthName}, {currentYear}</p>
                        <p className="text-sm opacity-75">Cập nhật mới nhất</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Tổng đơn hàng"
                                value={stats?.totalOrders || 0}
                                icon={<HiOutlineShoppingBag className="text-white text-xl" />}
                                color="bg-blue-500"
                                secondaryText={`${stats?.pendingOrders || 0} đơn hàng đang xử lý`}
                            />
                            <StatCard
                                title="Doanh thu tháng này"
                                value={formatCurrency(stats?.thisMonthRevenue || 0)}
                                icon={<HiOutlineCurrencyDollar className="text-white text-xl" />}
                                color="bg-green-500"
                                secondaryText={`Tổng doanh thu: ${formatCurrency(stats?.totalRevenue || 0)}`}
                            />
                            <StatCard
                                title="Người dùng mới"
                                value={stats?.newUsers || 0}
                                icon={<HiOutlineUsers className="text-white text-xl" />}
                                color="bg-purple-500"
                                secondaryText={`Tổng số: ${stats?.totalUsers || 0} người dùng`}
                            />
                            <StatCard
                                title="Tỉ lệ hoàn thành"
                                value={stats?.totalOrders
                                    ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%`
                                    : "0%"}
                                icon={<HiOutlineClipboardCheck className="text-white text-xl" />}
                                color="bg-emerald-500"
                                secondaryText={`${stats?.completedOrders || 0}/${stats?.totalOrders || 0} đơn hàng`}
                            />
                        </div>

                        {/* Biểu đồ chính và thông kê */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Biểu đồ doanh thu */}
                            <ChartCard title="Doanh thu & Lợi nhuận (2023)" className="lg:col-span-2">
                                <div className="h-80">
                                    {isClient && revenueData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={revenueData}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    </linearGradient>
                                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                                                <YAxis
                                                    tickFormatter={(value) => value / 1000000 + 'M'}
                                                    tick={{ fill: '#6b7280' }}
                                                />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    name="Doanh thu"
                                                    stroke="#3b82f6"
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="profit"
                                                    name="Lợi nhuận"
                                                    stroke="#10b981"
                                                    fillOpacity={1}
                                                    fill="url(#colorProfit)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <LoadingIndicator />
                                    )}
                                </div>
                            </ChartCard>

                            {/* Biểu đồ tròn - trạng thái đơn hàng */}
                            <ChartCard title="Đơn hàng theo trạng thái">
                                <div className="h-80">
                                    {isClient && orderStatusData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={orderStatusData.filter(item => item.value > 0)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    labelLine={false}
                                                >
                                                    {orderStatusData.filter(item => item.value > 0).map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    formatter={(value, entry, index) => (
                                                        <span style={{ color: '#6b7280' }}>{value}</span>
                                                    )}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <LoadingIndicator />
                                    )}
                                </div>
                            </ChartCard>
                        </div>

                        {/* Biểu đồ phụ */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Top sản phẩm bán chạy */}
                            <ChartCard title="Top 5 sản phẩm bán chạy">
                                <div className="h-80">
                                    {isClient && topProducts.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={topProducts}
                                                layout="vertical"
                                                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                                            >
                                                <XAxis type="number" tick={{ fill: '#6b7280' }} />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={150}
                                                    tick={{ fill: '#6b7280' }}
                                                />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="sales"
                                                    name="Số lượng bán"
                                                    fill="#8b5cf6"
                                                    radius={[0, 4, 4, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <LoadingIndicator />
                                    )}
                                </div>
                            </ChartCard>

                            {/* Đăng ký người dùng */}
                            <ChartCard title="Người dùng đăng ký theo tháng">
                                <div className="h-80">
                                    {isClient && usersData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={usersData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                                                <YAxis tick={{ fill: '#6b7280' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="users"
                                                    name="Người dùng"
                                                    stroke="#f59e0b"
                                                    strokeWidth={2}
                                                    dot={{ r: 4, fill: '#f59e0b' }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <LoadingIndicator />
                                    )}
                                </div>
                            </ChartCard>
                        </div>

                        {/* Phần tổng hợp thống kê */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <ChartCard title="Tóm tắt đơn hàng">
                                <div className="space-y-4 h-full flex flex-col justify-center">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                                                <HiOutlineShoppingBag className="text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Đơn hàng chờ xác nhận</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                                            {stats?.pendingOrders || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                                                <HiOutlineClipboardCheck className="text-green-600 dark:text-green-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Đơn hàng hoàn thành</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-green-600 dark:text-green-300">
                                            {stats?.completedOrders || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full">
                                                <HiOutlineChartBar className="text-red-600 dark:text-red-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Đơn hàng bị hủy</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-red-600 dark:text-red-300">
                                            {stats?.cancelledOrders || 0}
                                        </div>
                                    </div>
                                </div>
                            </ChartCard>

                            <ChartCard title="Thông tin sản phẩm">
                                <div className="space-y-4 h-full flex flex-col justify-center">
                                    <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-full">
                                                <HiOutlineTag className="text-indigo-600 dark:text-indigo-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Tổng sản phẩm</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                                            {stats?.totalProducts || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full">
                                                <HiOutlineTag className="text-emerald-600 dark:text-emerald-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Sản phẩm còn hàng</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                                            {stats?.inStockProducts || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
                                                <HiOutlineOfficeBuilding className="text-amber-600 dark:text-amber-300" />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">Nhà cung cấp</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-amber-600 dark:text-amber-300">
                                            {stats?.totalSuppliers || 0}
                                        </div>
                                    </div>
                                </div>
                            </ChartCard>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TongQuanPage; 