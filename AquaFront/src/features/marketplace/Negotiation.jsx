import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';

const Negotiation = () => {
    const [searchParams] = useSearchParams();
    const listingId = searchParams.get('id');
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchListing = async () => {
            if (!listingId) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/listings/${listingId}`);
                if (response.data.status === 'success') {
                    setListing(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin thương thảo:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [listingId]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
    
    if (!listing) return (
        <div className="flex h-screen items-center justify-center bg-white flex-col gap-4">
            <span className="material-symbols-outlined text-6xl text-slate-300">chat_error</span>
            <p className="font-bold text-slate-500 text-lg uppercase tracking-widest">Không tìm thấy sản phẩm để thương thảo!</p>
            <Link to="/marketplace" className="px-6 py-2 bg-primary text-white rounded-lg font-bold uppercase text-xs">Quay lại Chợ</Link>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Sidebar />

            <main className="lg:ml-64 w-full max-w-full p-6 h-screen pb-24 flex flex-col">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* Left Column: Product Analysis */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
                        {/* Breadcrumbs & Title */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                                <span>Marketplace</span>
                                <span className="material-icons text-[12px]">chevron_right</span>
                                <span>{listing.species}</span>
                                <span className="material-icons text-[12px]">chevron_right</span>
                                <span className="text-primary">AQ-{listing.id.substring(0,8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl font-bold dark:text-white">{listing.title}</h1>
                                    <p className="text-slate-500 text-sm mt-1">Khu vực: {listing.province} | Nguồn gốc: Việt Nam | SKU: {listing.id.substring(0,8).toUpperCase()}</p>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs font-bold text-primary uppercase">Phân tích AI đang bật</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Image Detection Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0">
                            <div className="relative group h-[400px]">
                                <img alt={listing.title} className="w-full h-full object-cover" src={listing.thumbnailUrl || "https://muoibienseafood.com/wp-content/uploads/2024/11/Phan-biet-tom-the-va-tom-su.jpg.webp"}/>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all pointer-events-none"></div>
                                <div className="absolute top-4 left-4 bg-primary text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">AI Scan Ready</div>
                            </div>
                            <div className="p-6 grid grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sản lượng dự kiến</span>
                                    <span className="text-lg font-bold">{listing.estimatedQuantity?.toLocaleString()} con</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chỉ số sức khỏe</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-primary">{listing.aiHealthScore || 9.4}</span>
                                        <span className="text-xs text-slate-500">/ 10</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kích cỡ</span>
                                    <span className="text-lg font-bold">{listing.sizeMin}-{listing.sizeMax} cm</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Xác thực AI</span>
                                    <span className="text-lg font-bold text-emerald-500">100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Analysis Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-shrink-0">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="material-icons text-primary">insights</span>
                                    Phân tích Giá thị trường
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-xs text-slate-400">Đơn vị: <span className="text-slate-900 dark:text-white font-medium">VNĐ / con</span></span>
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                            <th className="pb-3">Phân hạng</th>
                                            <th className="pb-3">Giá sàn</th>
                                            <th className="pb-3">Giá trần</th>
                                            <th className="pb-3 text-right">Giá đề xuất (Bid)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <td className="py-4 font-medium">Trung bình khu vực</td>
                                            <td className="py-4 text-slate-500">{(listing.pricePerFish * 0.9).toLocaleString()}đ</td>
                                            <td className="py-4 text-slate-500">{(listing.pricePerFish * 1.1).toLocaleString()}đ</td>
                                            <td className="py-4 text-right font-bold text-slate-700 dark:text-slate-300">{listing.pricePerFish?.toLocaleString()}đ</td>
                                        </tr>
                                        <tr className="bg-primary/5 rounded-lg">
                                            <td className="py-4 px-2 font-bold text-primary">Sản phẩm này (AI Adjusted)</td>
                                            <td className="py-4 text-slate-500">{(listing.pricePerFish * 0.95).toLocaleString()}đ</td>
                                            <td className="py-4 text-slate-500">{(listing.pricePerFish * 1.05).toLocaleString()}đ</td>
                                            <td className="py-4 px-2 text-right font-extrabold text-primary text-lg">{listing.pricePerFish?.toLocaleString()}đ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-background-light dark:bg-slate-800/30 rounded-lg flex items-start gap-3 border border-slate-200 dark:border-slate-800">
                                <span className="material-icons text-primary text-xl">tips_and_updates</span>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    <strong className="text-slate-900 dark:text-slate-200">Gợi ý AI:</strong> Dựa trên chất lượng {listing.species} loại A và độ tươi mới 9.4/10, mức giá <span className="font-bold text-primary">{listing.pricePerFish?.toLocaleString()}đ</span> là cực kỳ cạnh tranh. Bạn nên chốt đơn sớm để đảm bảo nguồn hàng.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Negotiation Chat */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-400">storefront</span>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold dark:text-white leading-none">{listing.sellerName || 'Nhà cung cấp AquaTrade'}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Verified Seller • 4.9 <span className="material-icons text-[10px] text-yellow-400">star</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-icons text-xl">videocam</span>
                                </button>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-icons text-xl">info</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                            <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">Bắt đầu trò chuyện</span>
                            </div>

                            {/* Message Seller */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                                    <span className="material-icons text-slate-400 text-xs">person</span>
                                </div>
                                <div className="flex flex-col gap-1 max-w-[80%]">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-tr-xl rounded-b-xl">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">Chào bạn! Tôi là {listing.sellerName || 'người bán'}. Lô {listing.species} này rất đẹp, bạn cần bao nhiêu con?</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 ml-1">Vừa xong</span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex gap-2 mb-3">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary hover:bg-primary/20 transition-all">
                                    <span className="material-icons text-xs">auto_awesome</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">AI Gợi ý</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-all">
                                    <span className="material-icons text-xs">request_quote</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Mặc cả giá</span>
                                </button>
                            </div>
                            <div className="relative">
                                <textarea 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm outline-none" 
                                    placeholder="Nhập tin nhắn..." 
                                    rows="2"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                    <button className="text-slate-400 hover:text-primary"><span className="material-icons text-xl">attach_file</span></button>
                                    <button className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-md hover:scale-105 transition-transform">
                                        <span className="material-icons">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Negotiation Footer */}
            <div className="fixed bottom-0 lg:left-64 left-0 w-[calc(100%-16rem)] max-lg:w-full bg-background-dark text-white py-3 px-6 flex items-center justify-between z-[60] border-t border-slate-800">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sản phẩm đang chọn</span>
                        <span className="text-sm font-medium">{listing.title}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Giá niêm yết</span>
                        <span className="text-sm font-bold text-primary">{listing.pricePerFish?.toLocaleString()}đ/con</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2 bg-primary text-background-dark font-bold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(19,236,200,0.3)] transition-all uppercase tracking-tight">Chốt đơn ngay</button>
                </div>
            </div>
        </div>
    );
};

export default Negotiation;
