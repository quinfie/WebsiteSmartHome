import React from 'react';
import { UserEvent } from "../../types/calendar";

interface MaintenanceEventModalProps {
    event: UserEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

const MaintenanceEventModal: React.FC<MaintenanceEventModalProps> = ({
    event,
    isOpen,
    onClose
}) => {
    if (!isOpen || !event) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('hoàn thành') || lowerStatus.includes('đã xác nhận')) {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (lowerStatus.includes('hủy')) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-[#182233] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[#243447]">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                {event.type === 'maintenance' ? (
                                    <i className="fas fa-tools text-blue-600"></i>
                                ) : (
                                    <i className="fas fa-wrench text-orange-600"></i>
                                )}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-white">
                                    {event.type === 'maintenance' ? 'Chi tiết bảo trì' : 'Chi tiết dịch vụ'}
                                </h3>
                                <div className="mt-4 space-y-3">
                                    {event.productName && (
                                        <div>
                                            <label className="text-sm text-gray-400">Sản phẩm</label>
                                            <p className="text-white font-medium">{event.productName}</p>
                                        </div>
                                    )}

                                    {event.type === 'maintenance' ? (
                                        <div>
                                            <label className="text-sm text-gray-400">Loại bảo trì</label>
                                            <p className="text-white font-medium">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                                    {event.maintenanceType}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-sm text-gray-400">Loại dịch vụ</label>
                                            <p className="text-white font-medium">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                                                    {event.serviceType}
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-gray-400">
                                            {event.type === 'maintenance' ? 'Ngày bảo trì' : 'Ngày hẹn'}
                                        </label>
                                        <p className="text-white font-medium">{formatDate(event.date)}</p>
                                    </div>

                                    {event.description && (
                                        <div>
                                            <label className="text-sm text-gray-400">Mô tả</label>
                                            <p className="text-white font-medium">{event.description}</p>
                                        </div>
                                    )}

                                    {event.cost !== undefined && (
                                        <div>
                                            <label className="text-sm text-gray-400">Chi phí</label>
                                            <p className="text-white font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(event.cost)}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-gray-400">Trạng thái</label>
                                        <p className="text-white font-medium">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </p>
                                    </div>

                                    {event.customerName && (
                                        <div>
                                            <label className="text-sm text-gray-400">Khách hàng</label>
                                            <p className="text-white font-medium">{event.customerName}</p>
                                            {event.customerEmail && (
                                                <p className="text-sm text-gray-400">{event.customerEmail}</p>
                                            )}
                                            {event.customerPhone && (
                                                <p className="text-sm text-gray-400">{event.customerPhone}</p>
                                            )}
                                            {event.customerAddress && (
                                                <p className="text-sm text-gray-400">{event.customerAddress}</p>
                                            )}
                                        </div>
                                    )}

                                    {event.orderCode && (
                                        <div>
                                            <label className="text-sm text-gray-400">Mã đơn hàng</label>
                                            <p className="text-white font-medium">{event.orderCode}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#1b2a3b] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceEventModal; 