import { useState  } from 'react';
import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

// Hàm chuẩn hóa văn bản tiếng Việt
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim();
}

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);


  const predefinedResponses: { [key: string]: string } = {
    'Sản phẩm có giảm giá không': 'Hiện tại chúng tôi đang có khuyến mãi 20% cho các sản phẩm SmartHome.',
    'Thời gian bảo hành là bao lâu': 'Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất (thường từ 6 đến 24 tháng).',
    'Tôi muốn đặt lịch bảo trì': 'Bạn vui lòng cung cấp mã đơn hàng để đặt lịch bảo trì nhé.',
    'Có hỗ trợ giao hàng không': 'Chúng tôi hiện tại chỉ có thể hỗ trợ giao hàng tận nhà với cước phí 30.000đ.',
    'Làm thế nào để xem còn hàng không': 'Trước khi vào xem sản phẩm sẽ có dòng chữ "hết hàng" nếu như sản phẩm đã hết hàng.',
    'Website có uy tín và đảm bảo thông tin khách hàng không': 'Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng.',
    'Tôi bị lỗi kỹ thuật sau khi lắp đặt thì làm gì': 'Liên hệ ngay với CSKH hoặc gửi yêu cầu hỗ trợ kỹ thuật qua trang "Lịch bảo trì".',
    'Sản phẩm có hướng dẫn sử dụng không': 'Có. Sản phẩm đi kèm sách hướng dẫn.',
    'Mua hàng có được tích điểm không': 'Có. Khách hàng đăng nhập khi mua hàng sẽ được tích điểm và nhận ưu đãi thành viên.',
    'Có hỗ trợ lắp đặt thiết bị tại nhà không': 'Có. Chúng tôi cung cấp dịch vụ lắp đặt cho một số khu vực.',
    'Website có khuyến mãi hoặc mã giảm giá không': 'Có. Bạn có thể theo dõi các chương trình khuyến mãi trên trang chủ.',
    'Tôi có thể mua sản phẩm số lượng lớn được không': 'Có. Liên hệ với bộ phận kinh doanh để nhận báo giá.',
    'Làm sao để biết sản phẩm còn hàng không': 'Tình trạng tồn kho được hiển thị trực tiếp trên trang sản phẩm.',
    'Có thể đổi/trả sản phẩm sau khi mua không': 'Có. Bạn được đổi/trả trong vòng 7 ngày nếu sản phẩm bị lỗi kỹ thuật hoặc giao sai.',
    'Tôi muốn thay đổi địa chỉ nhận hàng thì làm sao': 'Liên hệ với CSKH nếu đơn hàng chưa giao đi.',
    'Tôi có thể hủy đơn hàng sau khi đặt không': 'Có thể, nếu đơn hàng chưa được giao. Hãy liên hệ sớm.',
    'Bao lâu thì tôi nhận được hàng': 'Thời gian giao hàng từ 2 – 5 ngày làm việc.',
    'Kiểm tra đơn hàng như thế nào': 'Vào mục "Đơn hàng của tôi" để xem chi tiết.',
    'Những phương thức thanh toán nào được chấp nhận': 'Bạn có thể thanh toán bằng COD, hoặc thẻ tín dụng.',
    'Website có hỗ trợ thanh toán khi nhận hàng không': 'Có, hỗ trợ toàn quốc.',
    'Tôi có cần đăng ký tài khoản để mua hàng không': 'Có, giúp bạn theo dõi đơn hàng dễ dàng hơn.',
  };
  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');

    const normalizedInput = normalizeText(userMessage);

    // So khớp 2 chiều giữa câu hỏi người dùng và key mẫu
    const matchedEntry = Object.entries(predefinedResponses).find(([key]) => {
      const normalizedKey = normalizeText(key);
      return normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput);
    });

    if (matchedEntry) {
      const [, response] = matchedEntry;
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/chat', { messages: newMessages });
      const assistantReply = res.data.reply || 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
          aria-label="Open Chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 shadow-lg rounded-lg bg-white border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-2 bg-green-600 text-white font-bold">
            <span>ChatBox SmartHome</span>
            <button onClick={() => setIsOpen(false)} className="text-white font-bold px-2">×</button>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gray-100 text-right' : 'bg-green-50 text-left'}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Đang trả lời...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="flex border-t">
            <input
              className="flex-1 px-2 py-1 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập câu hỏi..."
            />
            
            <button
              className="bg-green-600 text-white px-3 text-sm"
              onClick={handleSend}
            >
              Gửi
            </button>
            
          </div>
          
        </div>
      )}
    </div>
  );
}
