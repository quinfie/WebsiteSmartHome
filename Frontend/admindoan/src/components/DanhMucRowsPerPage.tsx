import { useDanhMuc } from '../contexts/DanhMucContexts';

const DanhMucRowsPerPage = () => {
    const { paginationInfo, setPageSize } = useDanhMuc();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
    };

    return (
        <div className="flex gap-2 items-center">
            <p className="dark:text-whiteSecondary text-blackPrimary text-lg font-normal">Số dòng một trang:</p>
            <select
                className="w-24 h-8 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer hover:border-gray-500"
                name="rows"
                id="rows"
                value={paginationInfo.pageSize}
                onChange={handleChange}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
            <span className="ml-2 text-sm dark:text-gray-400 text-gray-600">
                Tổng số: {paginationInfo.totalItems} danh mục
            </span>
        </div>
    );
};

export default DanhMucRowsPerPage; 