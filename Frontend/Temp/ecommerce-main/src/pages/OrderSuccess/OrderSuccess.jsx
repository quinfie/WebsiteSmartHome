import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="container my-10 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-3xl font-bold mb-4 text-green-700">Đặt hàng thành công!</h2>
      <p className="mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.</p>
      <Link
        to="/orders"
        className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Xem đơn hàng của bạn
      </Link>
    </div>
  );
}