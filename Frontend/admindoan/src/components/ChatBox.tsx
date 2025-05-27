import { useState } from 'react';
import { sendMessageToChatGPT } from '../api/chatgpt';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

export default function ChatBox() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([
  { role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
]);


const predefinedResponses: { [key: string]: string } = {
  'Sản phẩm có giảm giá không': 'Hiện tại chúng tôi đang có khuyến mãi 20% cho các sản phẩm SmartHome.',
  'Thời gian bảo hành là bao lâu': 'Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất (thường từ 6 đến 24 tháng).',
  'Tôi muốn đặt lịch bảo trì': 'Bạn vui lòng cung cấp mã đơn hàng để đặt lịch bảo trì nhé.',
  'Có hỗ trợ giao hàng không':'Chúng tôi hiện tại chỉ có thể hỗ trợ giao hàng tận nhà với cước phí 30.000đ',
  'Làm thế nào để xem còn hàng không':'Trước khi vào xem sản phẩm sẽ có dòng chữ hết hàng hiện lên nếu như sản phẩm đã hết hàng. Nếu như bạn lỡ vào xem sản phẩm vẫn sẽ có nút hết hàng hiện lên gần cuối trang sản phẩm',
  'Website có uy tín và đảm bảo thông tin khách hàng không?':'Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng và tuân thủ chính sách bảo mật theo quy định pháp luật.',
  'Tôi bị lỗi kỹ thuật sau khi lắp đặt thì làm gì?':'Liên hệ ngay với CSKH hoặc gửi yêu cầu hỗ trợ kỹ thuật qua trang "Lịch bảo trì".',
  'Sản phẩm có hướng dẫn sử dụng không?' :'Có. Sản phẩm đi kèm sách hướng dẫn. Hoặc bạn có thể hỏi các nhân viên lắp đặt kĩ thuật',
  'Mua hàng có được tích điểm không?' :'Có. Khách hàng đăng nhập khi mua hàng sẽ được tích điểm và nhận ưu đãi thành viên.',
  'Có hỗ trợ lắp đặt thiết bị tại nhà không?':'Có. Chúng tôi cung cấp dịch vụ lắp đặt cho một số khu vực. Liên hệ để biết chi tiết.',
  'Website có khuyến mãi hoặc mã giảm giá không?':'Có. Bạn có thể theo dõi các chương trình khuyến mãi trên trang chủ.',
  'Tôi có thể mua sản phẩm số lượng lớn được không?':'Có. Liên hệ với bộ phận kinh doanh để nhận báo giá và chính sách chiết khấu.',
  'Làm sao để biết sản phẩm còn hàng không?':'Tình trạng tồn kho được hiển thị trực tiếp trên trang sản phẩm. Bạn cũng có thể liên hệ để xác nhận.',
  'Có thể đổi/trả sản phẩm sau khi mua không?':'Có. Bạn được đổi/trả trong vòng 7 ngày nếu sản phẩm bị lỗi kỹ thuật hoặc giao sai.',
  'Tôi muốn thay đổi địa chỉ nhận hàng thì làm sao?':'Liên hệ với CSKH để được hỗ trợ nếu đơn hàng chưa giao đi.',
  'Tôi có thể hủy đơn hàng sau khi đặt không?':'Có thể, nếu đơn hàng chưa được giao cho đơn vị vận chuyển. Hãy liên hệ bộ phận CSKH càng sớm càng tốt.',
  'Bao lâu thì tôi nhận được hàng?':'Thời gian giao hàng từ 2 – 5 ngày làm việc tùy khu vực. Khu vực nội thành thường nhanh hơn.',
  'Tôi có thể kiểm tra đơn hàng như thế nào?':'Vào mục "Đơn hàng của tôi" sẽ hiện lên tất cả đơn hàng.',
  'Những phương thức thanh toán nào được chấp nhận?':'Bạn có thể thanh toán bằng COD, hoặc thẻ tín dụng.',
  'Website có hỗ trợ thanh toán khi nhận hàng (COD) không?':'Có, chúng tôi hỗ trợ hình thức thanh toán khi nhận hàng trên toàn quốc.',  
  'Tôi có cần đăng ký tài khoản để mua hàng không?':'Có, đăng ký tài khoản giúp bạn theo dõi đơn hàng dễ dàng hơn.',
};

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input.trim();
  const newMessages = [...messages, { role: 'user', content: userMessage }];
  setMessages(newMessages);
  setInput('');

  // Kiểm tra câu hỏi có trong mẫu không
  const matchedKey = Object.keys(predefinedResponses).find(key =>
  userMessage.toLowerCase().includes(key.toLowerCase())
);

if (matchedKey) {
  setMessages([...newMessages, { role: 'assistant', content: predefinedResponses[matchedKey] }]);
} else {
    // Gọi API nếu không nằm trong câu mẫu
    try {
      const res = await axios.post('/api/chat', {
        messages: [...newMessages],
      });

      const assistantReply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Xin lỗi, tôi không thể trả lời ngay bây giờ.' }]);
    }
  }
};


    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Nút mở chatbox */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
                    aria-label="Open Chat"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chatbox chính */}
            {isOpen && (
                <div className="w-80 shadow-lg rounded-lg bg-white border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center p-2 bg-green-600 text-white font-bold">
                        <span>ChatBox SmartHome</span>
                        <button onClick={() => setIsOpen(false)} className="text-white font-bold px-2">×</button>
                    </div>
                    <div className="h-64 overflow-y-auto p-2 space-y-2">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`p-2 rounded text-sm ${msg.role === 'user' ? 'bg-gray-100 text-right' : 'bg-green-50 text-left'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="text-gray-500 text-sm">Đang trả lời...</div>}
                    </div>
                    <div className="flex border-t">
                        <input
                            className="flex-1 px-2 py-1 text-sm outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                             e.preventDefault(); // Ngăn trình duyệt reload (nếu có)
                             handleSend();       // Gọi hàm gửi tin nhắn
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
