import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';

const AIChat = () => {
    const [searchParams] = useSearchParams();
    const promptParam = searchParams.get('prompt');
    
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: 'Chào bạn! Tôi là chuyên gia phân tích thị trường AquaTrade. Tôi có thể giúp gì cho chiến lược kinh doanh của bạn hôm nay?', time: '12:30 PM' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                if (res.data.status === 'success') setUser(res.data.data);
            } catch (error) {}
        };
        fetchUser();
    }, []);

    // Xử lý khi có prompt từ trang khác chuyển sang
    useEffect(() => {
        if (promptParam && messages.length === 1) {
            handleSend(promptParam);
        }
    }, [promptParam]);

    const handleSend = async (text = inputValue) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Giả lập AI phản hồi sau 1.5s
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: generateAIResponse(text),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (input) => {
        const text = input.toLowerCase();
        
        if (text.includes('chiến lược mua')) {
            return `Dựa trên dữ liệu thị trường hiện tại:
1. **Cá Tra**: Giá đang ở mức thấp kỷ lục. Đây là thời điểm vàng để nhập hàng dự trữ.
2. **Tôm Thẻ**: Nhu cầu xuất khẩu tăng 15%, giá có thể tăng mạnh vào tuần tới.
3. **Lời khuyên**: Dành 60% ngân sách cho Cá Tra và 40% cho các lô Tôm Thẻ có chứng chỉ bền vững.`;
        }

        if (text.includes('cá tra')) {
            return `Về **Cá Tra**: 
- **Giá hiện tại**: Đang dao động quanh mức 28,000 - 30,000đ/kg.
- **Xu hướng**: Nguồn cung từ các hộ nuôi đang ổn định, nhưng nhu cầu từ thị trường Trung Quốc đang tăng trở lại.
- **Khuyến nghị**: Nếu bạn là người mua, hãy chốt hợp đồng dài hạn ngay bây giờ để giữ giá tốt.`;
        }

        if (text.includes('tôm')) {
            return `Phân tích thị trường **Tôm**:
- **Tôm Thẻ**: Giá size 100 con/kg đang ở mức 95,000đ. Dự báo sẽ tăng do thời tiết chuyển mùa ảnh hưởng đến sản lượng.
- **Tôm Sú**: Thị trường nội địa đang tiêu thụ mạnh.
- **Hành động**: Kiểm tra kỹ chứng chỉ ASC của nhà cung cấp trước khi đặt lệnh lớn.`;
        }

        if (text.includes('sao nữa') || text.includes('tiếp đi') || text.includes('nữa')) {
            return `Ngoài ra, bạn cũng nên chú ý đến:
- **Chi phí vận chuyển**: Đang có xu hướng giảm 5% trong tháng này, giúp biên lợi nhuận của bạn tốt hơn.
- **Đối tác mới**: Có 3 nhà cung cấp tại Bến Tre vừa cập nhật bảng giá rất cạnh tranh. Bạn có muốn tôi liệt kê danh sách không?`;
        }

        return `Tôi hiểu bạn đang quan tâm đến ${input}. Để tôi phân tích sâu hơn, bạn muốn biết về giá cả, nguồn cung hay đối tác cung cấp loại này?`;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 lg:ml-64 w-full">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-primary/5 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center">
                        <h2 className="text-lg font-bold mr-4 uppercase tracking-tighter">AI Business Intelligence</h2>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-[#13ecc8]/10 rounded-full">
                            <span className="w-2 h-2 bg-[#13ecc8] rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-[#00bda0] uppercase tracking-wider">Live Analysis</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 border-l border-primary/10 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold">{user?.fullName || 'Thanh Long'}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user?.role || 'Premium Member'}</p>
                            </div>
                            <img alt="User" className="w-9 h-9 rounded-full border border-[#13ecc8]/20 object-cover" src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"} />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse ml-auto' : ''} max-w-[85%]`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-primary/20">
                                        <span className="material-icons-outlined text-[#13ecc8] text-sm">smart_toy</span>
                                    </div>
                                )}
                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-slate-900 text-white font-medium rounded-br-none' 
                                        : 'bg-white dark:bg-slate-800 border border-primary/5 rounded-bl-none'
                                    }`}>
                                        <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>
                                    </div>
                                    <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center space-x-2 text-slate-400 italic text-xs">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-[#13ecc8] rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-[#13ecc8] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-[#13ecc8] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                                <span>AquaTrade AI đang phân tích dữ liệu...</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border-t border-primary/5">
                        <div className="max-w-4xl mx-auto flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-primary/5 shadow-inner">
                            <button className="p-3 text-slate-400 hover:text-[#13ecc8] transition-colors">
                                <span className="material-icons-outlined">attach_file</span>
                            </button>
                            <input 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none" 
                                placeholder="Nhập câu hỏi về thị trường tại đây..." 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button 
                                onClick={() => handleSend()}
                                className="bg-[#13ecc8] text-slate-900 p-3 rounded-xl hover:shadow-lg hover:shadow-[#13ecc8]/30 transition-all active:scale-95 flex items-center justify-center"
                            >
                                <span className="material-icons-outlined text-sm font-bold">send</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Right Context Sidebar */}
            <div className="w-80 border-l border-primary/5 bg-slate-50/50 dark:bg-slate-900/50 hidden xl:flex flex-col overflow-y-auto">
                <div className="p-6 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tình trạng thị trường</h3>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-[#13ecc8]/10 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase">Market Sentiment</span>
                                <span className="text-[#13ecc8] text-xs font-black">BULLISH</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#13ecc8] w-[75%]"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Gợi ý từ AI</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-slate-900 text-white rounded-xl border border-[#13ecc8]/20 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#13ecc8]/10 rounded-full blur-xl group-hover:bg-[#13ecc8]/20 transition-all"></div>
                                <p className="text-[11px] leading-relaxed relative z-10 font-medium">
                                    Dữ liệu cho thấy nhu cầu tiêu thụ tại các nhà hàng đang tăng 15% so với tuần trước.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
