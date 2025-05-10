/*import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { KhoCreateDto, KhoDto } from '../types/kho';

const EditKho = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<KhoCreateDto>({
    tenKho: '',
    diaChi: '',
    soDienThoai:'',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data: KhoDto = await getKhoById(id);
          setFormData({
            tenKho: data.tenKho,
            diaChi: data.diaChi,
            soDienThoai: data.soDienThoai,
          });
        } catch (err) {
          console.error(err);
          setMessage('❌ Không tìm thấy kho!');
        }
      })();
    }
  }, [id, getKhoById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (id) {
        await updateKho(id, formData);
        setMessage('✅ Cập nhật kho thành công!');
        // navigate('/kho'); // Bỏ comment nếu muốn redirect sau khi cập nhật
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Chỉnh sửa kho</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên kho</label>
            <input
              name="tenKho"
              value={formData.tenKho}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Địa chỉ</label>
            <input
              name="diaChi"
              value={formData.diaChi}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật kho'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditKho;
*/