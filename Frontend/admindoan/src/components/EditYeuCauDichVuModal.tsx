// import { useState, useEffect } from 'react';
// import { Dialog } from '@headlessui/react';
// import { YeuCauDichVuDto } from '../types/yeucaudichvu';
// import { useYeuCauDichVu } from '../contexts/YeuCauDichVuContext';

// interface EditYeuCauDichVuModalProps {
//     open: boolean;
//     onClose: () => void;
//     yeuCau: YeuCauDichVuDto;
//     onSuccess: () => void;
// }

// const EditYeuCauDichVuModal = ({ open, onClose, yeuCau, onSuccess }: EditYeuCauDichVuModalProps) => {
//     const { updateChiPhi, updateMoTa, updateTrangThai } = useYeuCauDichVu();
//     const [chiPhi, setChiPhi] = useState(yeuCau.chiPhiYeuCau);
//     const [moTa, setMoTa] = useState(yeuCau.moTa || '');
//     const [trangThai, setTrangThai] = useState(yeuCau.trangThaiYeuCau);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         if (yeuCau) {
//             setChiPhi(yeuCau.chiPhiYeuCau);
//             setMoTa(yeuCau.moTa || '');
//             setTrangThai(yeuCau.trangThaiYeuCau);
//         }
//     }, [yeuCau]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             // Cập nhật chi phí
//             await updateChiPhi(yeuCau.id, chiPhi);

//             // Cập nhật mô tả
//             await updateMoTa(yeuCau.id, moTa);

//             // Cập nhật trạng thái
//             await updateTrangThai(yeuCau.id, trangThai);

//             onSuccess();
//         } catch (err) {
//             setError('Có lỗi xảy ra khi cập nhật yêu cầu dịch vụ');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} className="relative z-50">
//             <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//             <div className="fixed inset-0 flex items-center justify-center p-4">
//                 <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-6">
//                     <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                         Chỉnh sửa yêu cầu dịch vụ
//                     </Dialog.Title>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 Chi phí
//                             </label>
//                             <input
//                                 type="number"
//                                 value={chiPhi}
//                                 onChange={(e) => setChiPhi(Number(e.target.value))}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 Mô tả
//                             </label>
//                             <textarea
//                                 value={moTa}
//                                 onChange={(e) => setMoTa(e.target.value)}
//                                 rows={4}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 Trạng thái
//                             </label>
//                             <select
//                                 value={trangThai}
//                                 onChange={(e) => setTrangThai(e.target.value)}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             >
//                                 <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
//                                 <option value="Đã xác nhận">Đã xác nhận</option>
//                                 <option value="Hoàn thành">Hoàn thành</option>
//                                 <option value="Đã hủy">Đã hủy</option>
//                             </select>
//                         </div>

//                         {error && (
//                             <div className="text-red-500 text-sm">{error}</div>
//                         )}

//                         <div className="mt-6 flex justify-end space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                             >
//                                 {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
//                             </button>
//                         </div>
//                     </form>
//                 </Dialog.Panel>
//             </div>
//         </Dialog>
//     );
// };

// export default EditYeuCauDichVuModal; 