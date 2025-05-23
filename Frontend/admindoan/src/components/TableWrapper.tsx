import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineX,
    HiOutlineChevronRight,
    HiOutlineClipboardCheck
} from 'react-icons/hi';
import { AiOutlineExport } from 'react-icons/ai';
import { Pagination } from './';
import { RowsPerPage } from './';
import { motion } from 'framer-motion';

interface StatCard {
    title: string;
    value: number | string;
    icon: ReactNode;
    color: string;
}

interface FilterField {
    name: string;
    label: string;
    type: 'select' | 'date' | 'text' | 'number';
    options?: { value: string; label: string }[];
    value: any;
}

interface TableWrapperProps {
    title: string;
    subtitle?: string;
    addButtonLink?: string;
    addButtonLabel?: string;
    onSearch: (keyword: string) => void;
    searchPlaceholder?: string;
    onSort?: (sortOption: string) => void;
    sortOptions?: { value: string; label: string }[];
    currentSortOption?: string;
    children: ReactNode;
    statCards?: StatCard[];
    contextType?: 'sanpham' | 'donhang' | 'nguoidung';
    itemLabel?: string;
    filters?: {
        fields: FilterField[];
        onFilterChange: (name: string, value: any) => void;
        onApplyFilters: () => void;
        onResetFilters: () => void;
    };
    isLoading?: boolean;
    hasData?: boolean;
    emptyStateMessage?: string;
    onResetFilters?: () => void;
    hideExportButton?: boolean;
    customHeader?: ReactNode;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    title,
    subtitle,
    addButtonLink,
    addButtonLabel = 'Thêm mới',
    onSearch,
    searchPlaceholder = 'Tìm kiếm...',
    onSort,
    sortOptions,
    currentSortOption = '',
    children,
    statCards,
    contextType = 'sanpham',
    itemLabel = 'sản phẩm',
    filters,
    isLoading,
    hasData,
    emptyStateMessage = 'Không có dữ liệu',
    onResetFilters,
    hideExportButton,
    customHeader
}) => {
    const [keyword, setKeyword] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(keyword);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(keyword);
        }
    };

    return (
        <div className="h-auto w-full">
            {/* Header section with gradient background */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-8 px-8 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{title}</h2>
                            {subtitle && (
                                <p className="opacity-80 flex items-center text-sm">
                                    <span>Bảng điều khiển</span>{" "}
                                    <HiOutlineChevronRight className="mx-2" />{" "}
                                    <span>{subtitle}</span>
                                </p>
                            )}
                        </div>
                        {customHeader}
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            {statCards && statCards.length > 0 && (
                <div className="px-8 -mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{card.title}</p>
                                        <h3 className="text-2xl font-bold mt-1 dark:text-white">{card.value}</h3>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-full`}>
                                        {card.icon}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="py-6 px-8">
                {/* Action buttons row */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="flex gap-2">
                        {addButtonLink && (
                            <Link
                                to={addButtonLink}
                                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-2 rounded-md shadow-md flex items-center justify-center gap-x-1 transition-all duration-200"
                            >
                                <HiOutlinePlus className="text-white" />
                                <span className="font-medium">{addButtonLabel}</span>
                            </Link>
                        )}

                        {!hideExportButton && (
                            <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-x-2 transition-all duration-200">
                                <AiOutlineExport className="text-gray-600 dark:text-gray-300" />
                                <span className="text-gray-700 dark:text-gray-200 font-medium">Xuất</span>
                            </button>
                        )}
                    </div>

                    {/* Filter toggle button */}
                    {filters && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${showFilters
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                                } transition-all duration-200`}
                        >
                            <HiOutlineFilter />
                            <span>Bộ lọc</span>
                            {filters.fields.some(field => field.value !== "" && field.value !== undefined && field.value !== null) && (
                                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {filters.fields.filter(field => field.value !== "" && field.value !== undefined && field.value !== null).length}
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Filters panel */}
                {filters && showFilters && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-700 dark:text-gray-300">Bộ lọc nâng cao</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={filters.onResetFilters}
                                    className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                >
                                    Đặt lại
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    <HiOutlineX size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filters.fields.map((field, index) => (
                                <div key={index}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {field.label}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.value || ''}
                                            onChange={(e) => filters.onFilterChange(field.name, e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {field.options?.map((option, i) => (
                                                <option key={i} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === 'date' ? (
                                        <input
                                            type="date"
                                            id={field.name}
                                            name={field.name}
                                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                            onChange={(e) => filters.onFilterChange(field.name, e.target.value ? new Date(e.target.value) : undefined)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            value={field.value || ''}
                                            onChange={(e) => filters.onFilterChange(field.name, e.target.value)}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={filters.onApplyFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and sort row */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <form onSubmit={handleSearch} className="relative">
                        <HiOutlineSearch className="text-gray-400 text-lg absolute top-1/2 left-3 transform -translate-y-1/2" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-64 h-10 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder={searchPlaceholder}
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <HiOutlineSearch className="text-white" />
                        </button>
                    </form>

                    {onSort && sortOptions && (
                        <div>
                            <select
                                className="w-60 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                onChange={(e) => onSort(e.target.value)}
                                value={currentSortOption}
                            >
                                <option value="">Sắp xếp theo</option>
                                {sortOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {children}
                </div>

                {/* Empty state */}
                {!isLoading && !hasData && (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-4 border border-gray-200 dark:border-gray-700">
                        <HiOutlineClipboardCheck className="mx-auto text-gray-400 text-5xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{emptyStateMessage}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Không tìm thấy dữ liệu phù hợp với điều kiện lọc của bạn.
                        </p>
                        {onResetFilters && (
                            <button
                                onClick={onResetFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination controls */}
                <div className="flex justify-between items-center py-6 flex-wrap gap-4">
                    <RowsPerPage contextType={contextType} itemLabel={itemLabel} showTotal={false} />
                    <Pagination contextType={contextType} />
                </div>
            </div>
        </div>
    );
};

export default TableWrapper; 