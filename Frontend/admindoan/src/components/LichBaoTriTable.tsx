import React, { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import StatusBadge from './StatusBadge';
import { LichBaoTriDto } from '../types/lichBaoTri';

interface LichBaoTriTableProps {
    schedules: LichBaoTriDto[];
    isLoading: boolean;
    onEdit: (item: LichBaoTriDto) => void;
    itemsPerPage?: number;
}

const LichBaoTriTable: React.FC<LichBaoTriTableProps> = ({
    schedules,
    isLoading,
    onEdit,
    itemsPerPage = 5
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<'all' | 'Chưa thông báo' | 'Đã thông báo'>('all');

    // Lọc dữ liệu theo trạng thái thông báo
    const filteredSchedules = schedules.filter(item => {
        if (filterStatus === 'all') return true;
        return item.trangThai === filterStatus;
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredSchedules.slice(startIndex, endIndex);

    // Xử lý chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Xử lý thông báo
    const handleNotify = (item: LichBaoTriDto) => {
        if (window.confirm('Bạn có chắc chắn muốn gửi thông báo bảo trì này? Sau khi thông báo, không thể hoàn tác.')) {
            const updatedItem: LichBaoTriDto = {
                ...item,
                trangThai: 'Đã thông báo' as const
            };
            onEdit(updatedItem);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    Lịch Bảo Trì
                </h3>
                <div className="flex items-center">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Chưa thông báo">Chưa thông báo</option>
                        <option value="Đã thông báo">Đã thông báo</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="py-2 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                Loại bảo trì
                            </th>
                            <th className="py-2 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                Ngày bảo trì
                            </th>
                            <th className="py-2 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                Trạng thái
                            </th>
                            <th className="py-2 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                Nguồn phát sinh
                            </th>
                            <th className="py-2 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 text-right">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-sm dark:text-white text-gray-700">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-sm dark:text-white text-gray-700">
                                    Không có lịch bảo trì nào.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="py-2 px-3 text-sm dark:text-white text-gray-700">
                                        {item.loaiBaoTri}
                                    </td>
                                    <td className="py-2 px-3 text-sm dark:text-white text-gray-700">
                                        {new Date(item.ngayBaoTri).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="py-2 px-3 text-sm dark:text-white text-gray-700">
                                        <StatusBadge status={item.trangThai as any} />
                                    </td>
                                    <td className="py-2 px-3 text-sm dark:text-white text-gray-700">
                                        {item.nguonPhatSinh}
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                        <button
                                            onClick={() => item.trangThai === 'Chưa thông báo' && handleNotify(item)}
                                            className={`p-1 ${item.trangThai === 'Chưa thông báo'
                                                ? 'text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 cursor-pointer'
                                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                                }`}
                                            title={item.trangThai === 'Chưa thông báo' ? 'Gửi thông báo' : 'Đã thông báo'}
                                            disabled={item.trangThai !== 'Chưa thông báo'}
                                        >
                                            <HiOutlineBell size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Compact version */}
            {!isLoading && filteredSchedules.length > 0 && (
                <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LichBaoTriTable; 