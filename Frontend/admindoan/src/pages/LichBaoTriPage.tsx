import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlinePencil, HiOutlineSave, HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import { getLichBaoTriByDonHangId, updateLichBaoTri, deleteLichBaoTri } from '../api/lichbaotri';
import { LichBaoTriDto } from '../types/lichBaoTri';
import { Sidebar } from '../components';

const LichBaoTriPage: React.FC = () => {
    const { donHangId } = useParams<{ donHangId: string }>();
    const navigate = useNavigate();
    const [lichBaoTris, setLichBaoTris] = useState<LichBaoTriDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<'Đã thông báo' | 'Chưa thông báo'>('Chưa thông báo');
    const [loadingAction, setLoadingAction] = useState<{ [id: string]: boolean }>({});

    const fetchLichBaoTri = async () => {
        if (!donHangId) return;

        setLoading(true);
        try {
            const data = await getLichBaoTriByDonHangId(donHangId);
            console.log('Lịch bảo trì:', data);

            // Sort by date (ngayBaoTri) in ascending order
            const sortedData = [...data].sort((a, b) =>
                new Date(a.ngayBaoTri).getTime() - new Date(b.ngayBaoTri).getTime()
            );

            setLichBaoTris(sortedData || []);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu lịch bảo trì:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLichBaoTri();
    }, [donHangId]);

    const handleBackClick = () => {
        navigate(-1); // Quay lại trang trước
    };

    const startEdit = (id: string, currentStatus: 'Đã thông báo' | 'Chưa thông báo') => {
        setEditingId(id);
        setEditValue(currentStatus);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('Chưa thông báo');
    };

    const saveStatusChange = async (id: string) => {
        if (!editingId) return;

        // Kiểm tra giá trị trước khi gửi
        if (!editValue || (editValue !== 'Đã thông báo' && editValue !== 'Chưa thông báo')) {
            console.error('Giá trị trạng thái không hợp lệ:', editValue);
            alert('Trạng thái không hợp lệ. Vui lòng thử lại!');
            return;
        }

        console.log('Đang cập nhật trạng thái:', id, 'với giá trị:', editValue);
        setLoadingAction(prev => ({ ...prev, [id]: true }));

        try {
            // Tìm đối tượng lịch bảo trì cần cập nhật
            const lichBaoTri = lichBaoTris.find(lb => lb.id === id);
            if (!lichBaoTri) {
                throw new Error('Không tìm thấy lịch bảo trì');
            }

            // Tạo bản sao và cập nhật trạng thái
            const updatedLichBaoTri = {
                ...lichBaoTri,
                trangThai: editValue
            };

            console.log('Cập nhật toàn bộ đối tượng:', updatedLichBaoTri);

            // Gửi toàn bộ đối tượng lên API
            await updateLichBaoTri(id, updatedLichBaoTri);

            // Cập nhật state
            setLichBaoTris(prev => prev.map(item =>
                item.id === id ? { ...item, trangThai: editValue } : item
            ));

            setEditingId(null);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
        } finally {
            setLoadingAction(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa lịch bảo trì này?')) return;

        setLoadingAction(prev => ({ ...prev, [id]: true }));
        try {
            await deleteLichBaoTri(id);

            // Cập nhật state
            setLichBaoTris(prev => prev.filter(item => item.id !== id));

        } catch (error) {
            console.error('Lỗi khi xóa lịch bảo trì:', error);
            alert('Không thể xóa lịch bảo trì. Vui lòng thử lại!');
        } finally {
            setLoadingAction(prev => ({ ...prev, [id]: false }));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đã thông báo':
                return 'text-green-400';
            case 'Chưa thông báo':
                return 'text-yellow-400';
            default:
                return 'text-white';
        }
    };

    const getLoaiBaoTriColor = (loai: string) => {
        switch (loai) {
            case 'Bảo hành':
                return 'text-blue-400';
            case 'Bảo trì':
                return 'text-purple-400';
            case 'Sữa chữa':
                return 'text-red-400';
            default:
                return 'text-white';
        }
    };

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full p-6 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBackClick}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
                    >
                        <HiOutlineArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Lịch Bảo Trì</h1>
                </div>

                {loading ? (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md text-white">
                        Đang tải dữ liệu lịch bảo trì...
                    </div>
                ) : lichBaoTris.length === 0 ? (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md text-white">
                        Không có lịch bảo trì nào cho đơn hàng này.
                    </div>
                ) : (
                    <div className="bg-[#23272F] p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full min-w-full text-white">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-3">Sản phẩm</th>
                                    <th className="text-left p-3">Ngày bảo trì</th>
                                    <th className="text-left p-3">Loại bảo trì</th>
                                    <th className="text-left p-3">Trạng thái</th>
                                    <th className="text-left p-3">Nguồn phát sinh</th>
                                    <th className="text-left p-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lichBaoTris.map((lich) => (
                                    <tr key={lich.id} className="border-b border-gray-700 hover:bg-[#2A2F37]">
                                        <td className="p-3">{lich.tenSanPham || 'Không xác định'}</td>
                                        <td className="p-3">
                                            {new Date(lich.ngayBaoTri).toLocaleDateString("vi-VN", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </td>
                                        <td className={`p-3 ${getLoaiBaoTriColor(lich.loaiBaoTri)}`}>
                                            {lich.loaiBaoTri}
                                        </td>
                                        <td className="p-3">
                                            {editingId === lich.id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="bg-[#181A20] border border-gray-700 rounded px-2 py-1 text-white"
                                                        value={editValue}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            console.log('Selected value:', value);
                                                            // Kiểm tra giá trị chặt chẽ
                                                            if (value === 'Đã thông báo' || value === 'Chưa thông báo') {
                                                                setEditValue(value);
                                                            } else {
                                                                console.error('Giá trị không hợp lệ:', value);
                                                                // Mặc định về "Chưa thông báo" nếu có lỗi
                                                                setEditValue('Chưa thông báo');
                                                            }
                                                        }}
                                                    >
                                                        <option value="Đã thông báo">Đã thông báo</option>
                                                        <option value="Chưa thông báo">Chưa thông báo</option>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            // Kiểm tra xem giá trị có hợp lệ không
                                                            if (editValue !== 'Đã thông báo' && editValue !== 'Chưa thông báo') {
                                                                console.error('Giá trị không hợp lệ trước khi lưu:', editValue);
                                                                alert('Giá trị không hợp lệ!');
                                                                return;
                                                            }
                                                            saveStatusChange(lich.id);
                                                        }}
                                                        className="p-1 text-green-400 hover:text-green-300"
                                                        disabled={loadingAction[lich.id]}
                                                    >
                                                        {loadingAction[lich.id] ? '...' : <HiOutlineCheck size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-1 text-red-400 hover:text-red-300"
                                                    >
                                                        <HiOutlineX size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={getStatusColor(lich.trangThai)}>
                                                    {lich.trangThai}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">{lich.nguonPhatSinh}</td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEdit(lich.id, lich.trangThai)}
                                                    className="p-2 bg-blue-900 hover:bg-blue-800 rounded text-blue-300"
                                                    disabled={editingId === lich.id}
                                                >
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lich.id)}
                                                    className="p-2 bg-red-900 hover:bg-red-800 rounded text-red-300"
                                                    disabled={!!loadingAction[lich.id]}
                                                >
                                                    {loadingAction[lich.id] ? '...' : <HiOutlineTrash size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LichBaoTriPage; 