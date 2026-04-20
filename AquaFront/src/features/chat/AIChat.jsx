import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const AIChat = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 lg:ml-64 w-full">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-primary/5 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center">
                        <h2 className="text-lg font-bold mr-4">Messages</h2>
                        <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-medium text-primary uppercase tracking-wider">AI Live Verification</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="relative text-slate-500 hover:text-primary">
                            <span className="material-icons-outlined">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 border-l border-primary/10 pl-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold">Thanh Long</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Premium Vendor</p>
                            </div>
                            <img alt="User Avatar" className="w-8 h-8 rounded-full border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtWBEoX1WKeFB-bsE4NBbd1gaWtfcmFhh9DB1WZQmjJTVTdRCcjhHilRyeeXrqM2gYcLNq7U7mwHlqLLm9fBNm0DJ_QWgG2jhtG6TbV56vkrGYhBk523kAfh3EIOIXRV3ccc6sFgVQ65al1VkVWC7OvoVhjwEeuCfi0TJQ8Ot-LDeMdPS2ehH6m04cnV5CGD-9D4v8V64F0j_-Xy-X9q9_ws6YvT5lYBV_yccTRaXdXcJqtK6bJGw0JZd4D4WQsCpat1bD7be5SaEB"/>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 overflow-hidden">
                    <div className="w-80 border-r border-primary/5 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="p-4 border-b border-primary/5">
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <span className="material-icons-outlined text-sm">search</span>
                                </span>
                                <input className="w-full bg-white dark:bg-slate-800 border-primary/5 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary/30 transition-all outline-none" placeholder="Search chats..." type="text"/>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 bg-white dark:bg-slate-800 border-r-2 border-primary flex items-start space-x-3 cursor-pointer">
                                <img alt="Supplier" className="w-12 h-12 rounded-full object-cover border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-sm font-bold truncate">Pacific Hatchery</h4>
                                        <span className="text-[10px] text-slate-400">12:45 PM</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">The health certificates for Batch #442 are ready.</p>
                                </div>
                            </div>
                            <div className="p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-start space-x-3 cursor-pointer border-b border-primary/5">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-sm font-semibold truncate">Duong Dinh</h4>
                                        <span className="text-[10px] text-slate-400">9:30 AM</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">Đã xác nhận, 200.000 hạt giống cá rô phi sẽ được vận chuyển hôm nay.</p>
                                </div>
                            </div>
                            <div className="p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-start space-x-3 cursor-pointer border-b border-primary/5">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-sm font-semibold truncate">Viet Le</h4>
                                        <span className="text-[10px] text-slate-400">Yesterday</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">Giá cá hồi con (Solmon Smolt) đã được cập nhật.</p>
                                </div>
                            </div>
                            <div className="p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-start space-x-3 cursor-pointer border-b border-primary/5">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-sm font-semibold truncate">Huynh Diep</h4>
                                        <span className="text-[10px] text-slate-400">Yesterday</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">Bạn có quan tâm đến giống Vannamei mới không?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                        <div className="h-16 px-6 border-b border-primary/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img alt="Pacific Hatchery" className="w-10 h-10 rounded-full border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">Le Van Cam</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center">
                                        <span className="material-symbols-outlined text-[12px] mr-1 text-primary">verified</span>
                                        Verified Fish Supplier
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white text-primary">
                                        <span className="material-icons-outlined text-sm">smart_toy</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-white text-blue-500">
                                        <span className="material-icons-outlined text-sm">security</span>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined">videocam</span>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-900">
                            <div className="flex justify-center">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-400 rounded-full uppercase tracking-tighter">Today</span>
                            </div>
                            <div className="flex items-end space-x-3 max-w-[80%]">
                                <img alt="Supplier" className="w-8 h-8 rounded-full shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                <div>
                                    <div className="chat-bubble-receiver p-4 text-sm shadow-sm">
                                        Chào Long! Tôi đã cập nhật số liệu thống kê giám sát sức khỏe cho lô tôm chân trắng số 442. Bạn có muốn xem lại phân tích AI mới nhất không?
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 ml-1">12:30 PM</span>
                                </div>
                            </div>
                            <div className="flex items-end space-x-3 max-w-[80%] ml-auto flex-row-reverse space-x-reverse">
                                <img alt="You" className="w-8 h-8 rounded-full shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtWBEoX1WKeFB-bsE4NBbd1gaWtfcmFhh9DB1WZQmjJTVTdRCcjhHilRyeeXrqM2gYcLNq7U7mwHlqLLm9fBNm0DJ_QWgG2jhtG6TbV56vkrGYhBk523kAfh3EIOIXRV3ccc6sFgVQ65al1VkVWC7OvoVhjwEeuCfi0TJQ8Ot-LDeMdPS2ehH6m04cnV5CGD-9D4v8V64F0j_-Xy-X9q9_ws6YvT5lYBV_yccTRaXdXcJqtK6bJGw0JZd4D4WQsCpat1bD7be5SaEB"/>
                                <div className="flex flex-col items-end">
                                    <div className="chat-bubble-sender p-4 text-sm shadow-sm font-medium">
                                        Chào anh Cam! Cảm ơn anh đã cập nhật. Tôi rất muốn xem phân tích AI mới nhất để đảm bảo giá thầu của tôi vẫn cạnh tranh trên thị trường.
                                    </div>
                                    <div className="flex items-center justify-end mt-1 mr-1">
                                        <span className="text-[10px] text-slate-400">12:32 PM</span>
                                        <span className="material-icons-outlined text-[12px] text-primary ml-1">done_all</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end space-x-3 max-w-[80%]">
                                <img alt="Supplier" className="w-8 h-8 rounded-full shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                <div>
                                    <div className="chat-bubble-receiver p-4 text-sm shadow-sm">
                                        Dưới đây là phân tích AI mới nhất cho lô tôm chân trắng số 442. Sức khỏe tổng thể được đánh giá là tốt với chỉ số 8.5/10, và giá thầu hiện tại của bạn là $0.045/con, được phân loại là OPTIMAL so với mức trung bình thị trường.
                                    </div>
                                    <div className="mt-2 bg-white p-2 rounded-xl border border-primary/10 shadow-sm max-w-[240px]">
                                        <img alt="Document Preview" className="rounded-lg mb-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold truncate">Health_Cert_442.pdf</span>
                                            <button className="text-primary"><span className="material-icons-outlined text-sm">download</span></button>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 ml-1">12:45 PM</span>
                                </div>
                            </div>
                            <div className="flex justify-center py-2">
                                <div className="flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10 max-w-md">
                                    <span className="material-icons-outlined text-primary text-sm">auto_awesome</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300">AI Price Verification: The current bid of <strong className="text-primary">$0.045</strong> is classified as <span className="text-green-500 font-bold">OPTIMAL</span> for this quality tier.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white dark:bg-slate-900 border-t border-primary/5 shrink-0">
                            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border border-primary/5">
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined">add_circle_outline</span>
                                </button>
                                <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2" placeholder="Nhập tin nhắn của bạn hoặc yêu cầu AI xác nhận giá..." type="text"/>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-icons-outlined">sentiment_satisfied</span>
                                    </button>
                                    <button className="bg-primary text-background-dark p-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center">
                                        <span className="material-icons-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-72 border-l border-primary/5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-6">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contextual Product</h3>
                            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-primary/5 mb-6">
                                <div className="relative h-40">
                                    <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="bg-primary text-background-dark text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">AI Analyzed</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-sm mb-1">White Leg Shrimp</h4>
                                    <p className="text-[11px] text-slate-400 mb-4">Batch #442 • Pacific Hatchery</p>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500">Current Bid</span>
                                            <span className="text-sm font-bold text-primary">$0.045 / PL</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500">Health Score</span>
                                            <div className="flex items-center">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full mr-2">
                                                    <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-green-500">98%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 bg-primary/10 text-primary text-[11px] font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
                                        View Full Batch Specs
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Trade Statistics</h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-primary/5">
                                    <p className="text-[10px] text-slate-400 mb-1">Market Sentiment</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">Bullish</span>
                                        <span className="material-icons-outlined text-green-500 text-sm">trending_up</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-primary/5">
                                    <p className="text-[10px] text-slate-400 mb-1">AI Recommendation</p>
                                    <p className="text-[11px] font-medium leading-relaxed">Secure inventory now. Forecast shows 4.5% supply drop in 10 days.</p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-primary/5">
                                <button className="w-full py-3 bg-primary text-background-dark font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform text-sm">
                                    Accept Bid &amp; Order
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIChat;
