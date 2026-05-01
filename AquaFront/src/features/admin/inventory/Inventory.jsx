import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import Footer from '../../../components/layout/Footer';
import api from '../../../services/api';

const Inventory = () => {
    const [listings, setListings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedListing, setSelectedListing] = useState(null);
    const itemsPerPage = 8;

    const fetchData = async () => {
        setLoading(true);
        try {
            // Lấy thông tin user để biết role
            const userRes = await api.get('/users/me');
            const user = userRes.data.data;
            const isAdmin = user.role === 'ADMIN';

            // Chọn API phù hợp với vai trò
            const listingsPath = isAdmin ? '/admin/listings' : '/listings/my-listings';
            
            // Đối với seller, stats sẽ được tính toán từ danh sách listings trả về
            const listingsRes = await api.get(listingsPath);
            
            if (listingsRes.data.status === 'success') {
                const data = listingsRes.data.data;
                setListings(data);
                
                if (!isAdmin) {
                    // Tự tính toán stats cho seller
                    const totalKg = data.reduce((sum, l) => sum + (l.availableQuantity || 0), 0);
                    setStats({
                        totalStock: totalKg,
                        aiAccuracy: 99.8,
                        lowStockCount: data.filter(l => (l.availableQuantity || 0) < 50).length
                    });
                }
            }

            if (isAdmin) {
                const statsRes = await api.get('/admin/stats');
                if (statsRes.data.status === 'success') {
                    setStats(statsRes.data.data);
                }
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu Inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn gỡ bài đăng này khỏi hệ thống?')) {
            try {
                const response = await api.delete(`/listings/${id}`);
                if (response.data.status === 'success') {
                    alert('Đã gỡ bài đăng thành công!');
                    fetchData();
                }
            } catch (error) {
                alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const filteredListings = listings.filter(l => 
        filterCategory === 'ALL' || l.category === filterCategory
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginatedListings = filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalStock = listings.reduce((sum, l) => sum + (l.availableQuantity || 0), 0);
    const lowStockCount = listings.filter(l => (l.availableQuantity || 0) < 50).length;

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">Phân Tích Kho Hàng</h2>
                        <p className="text-slate-500 mt-1 uppercase tracking-widest text-[11px] font-semibold">Inventory Analytics • Real-time AI Tracking</p>
                    </div>
                </section>

                {/* Dashboard Stats (Overview) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">TỔNG TỒN KHO</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">{totalStock.toLocaleString()} <span className="text-sm font-medium text-slate-500">kg</span></h3>
                            <p className="text-xs text-[#13ecc8] font-bold mt-2 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">inventory_2</span> Cập nhật thời gian thực
                            </p>
                        </div>
                        <div className="bg-[#13ecc8]/10 p-4 rounded-xl">
                            <span className="material-icons-outlined text-[#13ecc8] text-3xl">inventory</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">CẢNH BÁO TỒN THẤP</p>
                            <h3 className="text-3xl font-extrabold text-slate-800">{lowStockCount} <span className="text-sm font-medium text-slate-500">Mặt hàng</span></h3>
                            <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                <span className="material-icons-outlined text-xs">warning</span> {lowStockCount > 0 ? 'Cần kiểm tra ngay' : 'Tồn kho ổn định'}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl ${lowStockCount > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
                            <span className={`material-icons-outlined text-3xl ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>priority_high</span>
                        </div>
                    </div>

                    <div className="bg-[#13ecc8]/10 p-6 rounded-xl shadow-sm border border-[#13ecc8]/20 flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] uppercase tracking-widest text-cyan-800 font-bold mb-1">CHỈ SỐ SỨC KHỎE AI</p>
                            <h3 className="text-3xl font-extrabold text-cyan-900">{stats?.aiAccuracy || 99.9}%</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
                                <p className="text-xs text-cyan-800/70 font-bold uppercase tracking-tighter">
                                    {(stats?.aiAccuracy || 0) > 95 ? 'Hệ thống vận hành tối ưu' : 'Đang giám sát hệ thống'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#13ecc8]/20 p-4 rounded-xl relative z-10">
                            <span className="material-icons-outlined text-cyan-800 text-3xl">auto_awesome</span>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
                            <span className="material-icons-outlined text-[120px] text-cyan-800">psychology</span>
                        </div>
                    </div>
                </div>

                {/* Inventory Management Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Header & Filters */}
                    <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
                        <h2 className="text-lg font-bold text-slate-800">Kho Hàng Hệ Thống</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setFilterCategory('ALL')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Tất cả
                                </button>
                                <button 
                                    onClick={() => setFilterCategory('TOM')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterCategory === 'TOM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Tôm
                                </button>
                                <button 
                                    onClick={() => setFilterCategory('CA')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterCategory === 'CA' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Cá
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Sản phẩm</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">ID Tin Đăng</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Người Bán</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right whitespace-nowrap">Số lượng (kg)</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap text-center">Trạng Thái</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center whitespace-nowrap">Ngày Đăng</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedListings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                                    {listing.thumbnailUrl ? (
                                                        <img alt={listing.title} className="w-full h-full object-cover" src={listing.thumbnailUrl}/>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                            <span className="material-icons-outlined">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{listing.title}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{listing.category} • {listing.species}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[10px] text-slate-500 font-bold">
                                            {listing.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-xs font-bold text-slate-700">{listing.sellerName || 'Anonymous'}</p>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right text-slate-800">
                                            {listing.availableQuantity?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap ${
                                                listing.status === 'AVAILABLE' ? 'bg-[#13ecc8]/10 text-cyan-800' :
                                                listing.status === 'PENDING_REVIEW' ? 'bg-orange-50 text-orange-600' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                                {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setSelectedListing(listing)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#13ecc8] transition-all" 
                                                    title="Xem chi tiết"
                                                >
                                                    <span className="material-icons-outlined text-sm">visibility</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all" 
                                                    title="Gỡ tin"
                                                >
                                                    <span className="material-icons-outlined text-sm">delete_outline</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedListings.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-slate-400 font-bold italic">Không có dữ liệu kho hàng nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer / Pagination */}
                    <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Hiển thị {paginatedListings.length} trên {filteredListings.length} mặt hàng
                        </p>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-[#13ecc8] hover:text-[#13ecc8] transition-colors disabled:opacity-30"
                            >
                                <span className="material-icons-outlined text-sm">chevron_left</span>
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i+1}
                                    onClick={() => setCurrentPage(i+1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentPage === i+1 ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {i+1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-[#13ecc8] hover:text-[#13ecc8] transition-colors disabled:opacity-30"
                            >
                                <span className="material-icons-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Detail Modal */}
                {selectedListing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="relative h-48 bg-slate-100">
                                <img src={selectedListing.thumbnailUrl || 'https://via.placeholder.com/600x400'} alt="" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setSelectedListing(null)}
                                    className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center"
                                >
                                    <span className="material-icons-outlined text-sm">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{selectedListing.title}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedListing.category} • {selectedListing.species}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Số lượng tồn</p>
                                        <p className="text-sm font-bold text-slate-800">{selectedListing.availableQuantity} kg</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Giá mỗi con</p>
                                        <p className="text-sm font-bold text-[#13ecc8]">{selectedListing.pricePerFish?.toLocaleString()} ₫</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Kích thước</p>
                                        <p className="text-sm font-bold text-slate-800">{selectedListing.sizeMin} - {selectedListing.sizeMax} cm</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Tỉnh thành</p>
                                        <p className="text-sm font-bold text-slate-800">{selectedListing.province}</p>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button 
                                        onClick={() => setSelectedListing(null)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        Đóng
                                    </button>
                                    <button 
                                        onClick={() => { handleDeleteListing(selectedListing.id); setSelectedListing(null); }}
                                        className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all"
                                    >
                                        Gỡ bài đăng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Footer/>
            </div>
        </AdminLayout>
    );
};

export default Inventory;
