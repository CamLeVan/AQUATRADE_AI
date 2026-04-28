import React, { useState, useEffect } from 'react';
import AdminLayout from './layout/AdminLayout';
import api from '../../services/api';

const MarketplaceControl = () => {
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 2840, // Mock for now or fetch if available
        pending: 0,
        flagged: 18,
        success: 1205
    });

    useEffect(() => {
        fetchPendingListings();
    }, []);

    const fetchPendingListings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/listings/pending');
            if (response.data.success) {
                setPendingListings(response.data.data);
                setStats(prev => ({ ...prev, pending: response.data.data.length }));
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chờ duyệt:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id, status, note = '') => {
        try {
            const response = await api.put(`/admin/listings/${id}/moderate`, {
                moderationStatus: status,
                moderationNote: note || (status === 'AVAILABLE' ? 'Đã phê duyệt' : 'Từ chối bởi Admin')
            });
            
            if (response.data.success) {
                // Refresh list
                fetchPendingListings();
                alert(status === 'AVAILABLE' ? 'Đã duyệt sản phẩm thành công!' : 'Đã từ chối sản phẩm.');
            }
        } catch (error) {
            console.error('Lỗi khi duyệt sản phẩm:', error);
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section: Title & Stats */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Quản Lý Chợ</h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Hệ thống giám sát giao dịch và chất lượng thủy sản AI</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#13ecc8]/10 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#006b59]">AI Live Verification: Active</span>
                        </div>
                    </div>
                    {/* Bento-style Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-5xl">list_alt</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tổng Tin Đăng</p>
                            <p className="text-3xl font-black text-slate-800">{stats.total.toLocaleString()}</p>
                            <p className="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +12% tháng này
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-5xl">pending_actions</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Chờ Duyệt</p>
                            <p className="text-3xl font-black text-slate-800">{stats.pending}</p>
                            <p className="text-xs text-amber-500 font-medium mt-2">Cần xử lý ngay</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-5xl text-red-500">gpp_maybe</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Cảnh Báo AI</p>
                            <p className="text-3xl font-black text-red-500">{stats.flagged}</p>
                            <p className="text-xs text-red-400 font-medium mt-2">Vi phạm quy định</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-5xl">handshake</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Giao Dịch Thành Công</p>
                            <p className="text-3xl font-black text-slate-800">{stats.success.toLocaleString()}</p>
                            <p className="text-xs text-[#13ecc8] font-bold mt-2">Tỷ lệ khớp lệnh 84%</p>
                        </div>
                    </div>
                </section>

                {/* Filter & Actions Panel */}
                <section className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <select className="appearance-none w-full bg-white pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#13ecc8]/20 shadow-sm outline-none cursor-pointer">
                                <option>Tất cả Danh mục</option>
                                <option>Tôm Thẻ</option>
                                <option>Cá Tra</option>
                                <option>Cua Cà Mau</option>
                                <option>Mực Lá</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <select className="appearance-none w-full bg-white pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#13ecc8]/20 shadow-sm outline-none cursor-pointer">
                                <option>Tất cả Trạng thái</option>
                                <option>Đang hiển thị</option>
                                <option>Chờ duyệt</option>
                                <option>Bị từ chối</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">filter_alt</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2.5 bg-white text-slate-600 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">Xuất báo cáo</button>
                        <button 
                            onClick={fetchPendingListings}
                            className="px-4 py-2.5 bg-[#13ecc8] text-slate-900 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95"
                        >
                            Làm mới dữ liệu
                        </button>
                    </div>
                </section>

                {/* Main Layout Grid: Table + AI Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Listings Table (Lg: 8 cols) */}
                    <section className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Danh Sách Tin Đăng Chờ Duyệt</h2>
                            <span className="text-[10px] text-slate-400 font-bold">HIỂN THỊ {pendingListings.length} KẾT QUẢ</span>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50/80">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Sản phẩm</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Người bán</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right whitespace-nowrap">Giá niêm yết</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Chất lượng AI</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center whitespace-nowrap">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td>
                                        </tr>
                                    ) : pendingListings.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Không có tin đăng nào đang chờ duyệt.</td>
                                        </tr>
                                    ) : pendingListings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                        <img 
                                                            alt={listing.title} 
                                                            className="w-full h-full object-cover" 
                                                            src="https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=200"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{listing.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{listing.species} | {listing.province}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[10px] text-cyan-600">person</span>
                                                    </div>
                                                    <p className="text-xs font-semibold text-slate-600">{listing.sellerName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="text-sm font-black text-slate-800">{listing.pricePerFish?.toLocaleString()}đ</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Giá/con (Ước tính)</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full min-w-[100px] flex flex-col gap-1.5">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-[#00cfa8]">
                                                        <span>AI Verified</span>
                                                        <span>95%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#13ecc8]" style={{ width: '95%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleModerate(listing.id, 'AVAILABLE')}
                                                        className="p-2 bg-[#13ecc8]/10 text-[#00cfa8] rounded-lg hover:bg-[#13ecc8] hover:text-white transition-all shadow-sm" 
                                                        title="Duyệt"
                                                    >
                                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const reason = prompt('Nhập lý do từ chối:');
                                                            if (reason) handleModerate(listing.id, 'REJECTED', reason);
                                                        }}
                                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                                                        title="Từ chối"
                                                    >
                                                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* AI Insight Panel (Lg: 4 cols) */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Market Health Card */}
                        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#13ecc8]/20 rounded-full blur-3xl"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#13ecc8] mb-4">Market Health AI</h3>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="flex-1">
                                    <p className="text-2xl font-black">Ổn Định</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Dựa trên 1.2k chỉ số</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-[#13ecc8]/20 flex items-center justify-center relative bg-slate-800/50 backdrop-blur-sm shadow-[0_0_15px_rgba(19,236,200,0.2)]">
                                    <span className="text-sm font-bold text-[#13ecc8]">92%</span>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle className="text-[#13ecc8]" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="14" strokeWidth="4"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-3 relative z-10">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-400 uppercase tracking-tighter">Độ chính xác AI</span>
                                    <span className="text-[#13ecc8]">99.4%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#13ecc8]" style={{ width: '99.4%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Accuracy Trends */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6">Phân Tích Xu Hướng</h3>
                            <div className="space-y-6">
                                <div className="flex items-end gap-1.5 h-32 px-2">
                                    <div className="flex-1 bg-[#13ecc8]/20 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[40%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8]/40 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[60%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8]/30 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[50%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8]/60 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[80%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8]/50 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[70%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8]/90 hover:bg-[#13ecc8] transition-colors rounded-t-sm h-[95%] cursor-pointer"></div>
                                    <div className="flex-1 bg-[#13ecc8] rounded-t-sm h-[100%] cursor-pointer shadow-[0_0_10px_rgba(19,236,200,0.5)]"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khám phá mới</p>
                                        <p className="text-2xl font-black text-slate-800">+242</p>
                                    </div>
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Gian lận đã chặn</p>
                                        <p className="text-2xl font-black text-red-600">89</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Tooltip */}
                        <div className="bg-white/80 p-5 rounded-xl border border-[#13ecc8]/30 shadow-lg shadow-[#13ecc8]/5 flex gap-4 items-start relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#13ecc8]/10 rounded-bl-full"></div>
                            <div className="p-2 bg-[#13ecc8]/10 rounded-lg shrink-0">
                                <span className="material-symbols-outlined text-[#00cfa8] text-xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-slate-800 tracking-tight">Gợi ý từ AI</p>
                                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">Phát hiện 12 tin đăng có dấu hiệu đầu cơ giá Tôm Thẻ tại khu vực Sóc Trăng. Khuyến nghị kiểm tra thủ công.</p>
                                <button className="text-[10px] font-black text-[#00cfa8] uppercase tracking-widest mt-3 hover:underline">Chi tiết báo cáo &rarr;</button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Footer Specific for this page inside main body */}
                <footer className="w-full border-t border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4 rounded-xl shadow-sm mt-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">© 2024 Aqua Crystal AI Logistics. Precision Hydrosphere.</p>
                        <div className="flex gap-4">
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-teal-500 transition-colors">Terms of Service</button>
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-teal-500 transition-colors">Privacy</button>
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-teal-500 transition-colors">Support</button>
                        </div>
                    </div>
                </footer>
            </div>
        </AdminLayout>
    );
};

export default MarketplaceControl;
