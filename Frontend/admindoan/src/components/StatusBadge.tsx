import React from 'react';
import {
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineCheck,
    HiOutlineXCircle,
    HiOutlineExclamationCircle
} from "react-icons/hi";

export type StatusType =
    | "Đang chờ xác nhận"
    | "Đã xác nhận"
    | "Hoàn thành"
    | "Đã hủy";

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
    const getStatusConfig = (status: StatusType) => {
        switch (status) {
            case "Đang chờ xác nhận":
                return {
                    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
                    textColor: "text-yellow-800 dark:text-yellow-300",
                    icon: <HiOutlineClock className="w-4 h-4" />
                };
            case "Đã xác nhận":
                return {
                    bgColor: "bg-blue-100 dark:bg-blue-900/30",
                    textColor: "text-blue-800 dark:text-blue-300",
                    icon: <HiOutlineCheckCircle className="w-4 h-4" />
                };
            case "Hoàn thành":
                return {
                    bgColor: "bg-green-100 dark:bg-green-900/30",
                    textColor: "text-green-800 dark:text-green-300",
                    icon: <HiOutlineCheck className="w-4 h-4" />
                };
            case "Đã hủy":
                return {
                    bgColor: "bg-red-100 dark:bg-red-900/30",
                    textColor: "text-red-800 dark:text-red-300",
                    icon: <HiOutlineXCircle className="w-4 h-4" />
                };
            default:
                return {
                    bgColor: "bg-gray-100 dark:bg-gray-900/30",
                    textColor: "text-gray-800 dark:text-gray-300",
                    icon: <HiOutlineExclamationCircle className="w-4 h-4" />
                };
        }
    };

    const { bgColor, textColor, icon } = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}>
            {icon}
            {status}
        </span>
    );
};

export default StatusBadge; 