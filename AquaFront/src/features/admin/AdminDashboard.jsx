import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const AdminDashboard = () => {
    const [user, setUser] = useState({ fullName: '', role: '' });
    const [pendingListings, setPendingListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedListing, setSelectedListing] = useState(null);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalUsers: 0,
        openDisputes: 0,
        aiAccuracy: 99.98,
        activeListings: 0
    });
    const [sellerStats, setSellerStats] = useState({
        totalSales: 0,
        totalListings: 0,
        pendingOrders: 0,
        shopRating: 4.9
    });
    const [sellerOrders, setSellerOrders] = useState([]);
    const [pendingDeposits, setPendingDeposits] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser(storedUser);

        if (storedUser.role === 'ADMIN') {
            fetchPendingListings();
            fetchUsers();
            fetchStats();
            fetchPendingDeposits();
            fetchPendingOrders();
        } else if (storedUser.role === 'SELLER') {
            fetchSellerStats(storedUser.userId);
            fetchSellerOrders();
        }
    }, []);

    const fetchPendingDeposits = async () => {
        try {
            const response = await api.get('/users/me/wallet/admin/pending');
            if (response.data.status === 'success') {
                setPendingDeposits(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch pending deposits", error);
        }
    };

    const handleApproveDeposit = async (id) => {
        const confirmed = await notify.confirm('Xác nhận?', 'Bạn có chắc chắn muốn duyệt yêu cầu nạp tiền này?');
        if (!confirmed) return;
        try {
            const response = await api.post(`/users/me/wallet/admin/approve/${id}`);
            if (response.data.status === 'success') {
                notify.success('Thành công!');
                fetchPendingDeposits();
                fetchStats();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRejectDeposit = async (id) => {
        const reason = prompt('Lý do từ chối:');
        if (!reason) return;
        try {
            const response = await api.post(`/users/me/wallet/admin/reject/${id}`);
            if (response.data.status === 'success') {
                alert('Đã từ chối yêu cầu nạp tiền.');
                fetchPendingDeposits();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchSellerOrders = async () => {
        try {
            const response = await api.get('/orders/seller');
            if (response.data.status === 'success') {
                setSellerOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch seller orders", error);
        }
    };

    const fetchPendingOrders = async () => {
        try {
            const response = await api.get('/orders/all');
            if (response.data.status === 'success') {
                // Hiển thị đơn hàng đang chờ duyệt HOẶC đang trong quá trình vận chuyển HOẶC chờ giải ngân
                const shippingStatuses = ['ESCROW_LOCKED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'READY_TO_PAYOUT'];
                setPendingOrders(response.data.data.filter(o => shippingStatuses.includes(o.status)));
            }
        } catch (error) {
            console.error("Failed to fetch pending orders", error);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await api.put(`/orders/${orderId}/status?status=${newStatus}`);
            if (response.data.status === 'success') {
                notify.success('Cập nhật trạng thái thành công!');
                if (user.role === 'ADMIN') fetchPendingOrders();
                else fetchSellerOrders();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleApproveOrder = async (orderId, currentQty) => {
        const finalQty = prompt("Xác nhận số lượng cá giống thực tế (Admin duyệt):", currentQty);
        if (finalQty === null) return;

        try {
            const response = await api.post(`/orders/${orderId}/review?finalQuantity=${finalQty}`);
            if (response.data.status === 'success') {
                alert('Đã phê duyệt số lượng đơn hàng thành công!');
                fetchPendingOrders();
                fetchStats();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRespondDispute = async (orderId) => {
        const comment = prompt("Nhập phản hồi cho khiếu nại này:");
        if (!comment) return;

        try {
            const response = await api.post(`/orders/${orderId}/respond-dispute?comment=${encodeURIComponent(comment)}`);
            if (response.data.status === 'success') {
                notify.success('Đã gửi phản hồi thành công!');
                if (user.role === 'ADMIN') fetchPendingOrders();
                else fetchSellerOrders();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleApprovePayout = async (orderId) => {
        if (!window.confirm("Xác nhận giải ngân tiền cho Người bán? Hành động này không thể hoàn tác.")) return;

        try {
            const response = await api.post(`/orders/${orderId}/approve-payout`);
            if (response.data.status === 'success') {
                notify.success('Đã giải ngân tiền thành công!');
                fetchPendingOrders();
                fetchStats();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRefundOrder = async (orderId) => {
        const confirmed = await notify.confirm(
            'Xác nhận hoàn tiền?',
            'Bạn có chắc chắn muốn phê duyệt hoàn tiền (90%) cho đơn hàng này? Thao tác này không thể hoàn tác.',
            'warning'
        );
        if (!confirmed) return;

        try {
            const response = await api.post(`/orders/${orderId}/refund`);
            if (response.data.status === 'success') {
                notify.success('Đã hoàn tiền thành công!');
                if (user.role === 'ADMIN') fetchPendingOrders();
                else fetchSellerOrders();
                fetchStats();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            if (response.data.status === 'success') {
                console.log("Admin Stats Received:", response.data.data);
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        }
    };

    const fetchSellerStats = async (sellerId) => {
        try {
            const response = await api.get(`/seller/${sellerId}/stats`);
            if (response.data.status === 'success') {
                console.log("Seller Stats Received:", response.data.data);
                setSellerStats(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch seller stats", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            if (response.data.status === 'success') {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchPendingListings = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/listings/pending');
            if (response.data.status === 'success') {
                setPendingListings(response.data.data.slice(0, 3));
            }
        } catch (error) {
            console.error("Failed to fetch pending listings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId, isActive) => {
        try {
            const response = await api.put(`/admin/users/${userId}/status`, {
                newStatus: isActive ? 'INACTIVE' : 'ACTIVE'
            });
            if (response.data.status === 'success') {
                alert(isActive ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
                fetchUsers();
                fetchStats(); // Cập nhật lại con số tổng quan
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleModerate = async (id, status) => {
        let note = '';
        if (status === 'REJECTED') {
            note = prompt('Lý do từ chối sản phẩm này:');
            if (!note) return;
        }

        try {
            const response = await api.put(`/admin/listings/${id}/moderate`, {
                moderationStatus: status,
                moderationNote: note
            });
            if (response.data.status === 'success') {
                alert(status === 'AVAILABLE' ? 'Đã phê duyệt sản phẩm!' : 'Đã từ chối sản phẩm.');
                setSelectedListing(null);
                fetchPendingListings();
                fetchStats(); // Cập nhật lại con số tổng quan (ví dụ: số sản phẩm đang bán)
            }
        } catch (error) {
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    const isAdmin = user.role === 'ADMIN';

    return (
        <AdminLayout>
            <div className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Highly Visible Role Banner */}
                <div className={`w-full py-4 px-6 rounded-2xl mb-8 flex items-center justify-between border-2 shadow-2xl ${isAdmin
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-700'
                    : 'bg-orange-500/10 border-orange-500/30 text-orange-700'
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isAdmin ? 'bg-cyan-500 text-white' : 'bg-orange-500 text-white'}`}>
                            <span className="material-symbols-outlined text-2xl font-icon">
                                {isAdmin ? 'shield_person' : 'store'}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Quyền hạn hiện tại</p>
                            <h2 className="text-xl font-black uppercase tracking-tighter">
                                {isAdmin ? 'Hệ thống Quản trị viên (Admin)' : 'Cổng thông tin Người bán (Seller)'}
                            </h2>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-current opacity-40">
                        <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Live Session Active</span>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            {isAdmin ? 'Tổng quan hệ thống' : 'Bảng điều khiển Người bán'}
                            <span className="text-[#13ecc8] font-bold text-sm ml-2 bg-[#13ecc8]/10 px-2 py-0.5 rounded">
                                {isAdmin ? 'Precision Hydrosphere v2.4' : 'Seller Hub v1.0'}
                            </span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {isAdmin ? 'Real-time logistics and AI verification telemetry.' : 'Theo dõi hiệu quả kinh doanh và quản lý đơn hàng của bạn.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#13ecc8]/10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                {isAdmin ? 'Server Health: 99.9%' : 'Shop Status: Online'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isAdmin ? (
                        <>
                            <StatCard title="Tổng doanh thu" value={`${(stats?.totalRevenue || 0).toLocaleString()}đ`} trend="+12.5%" icon="payments" color="teal" />
                            <StatCard title="Người dùng hệ thống" value={(stats?.totalUsers || 0).toLocaleString()} trend="+4.2%" icon="person_play" color="cyan" />
                            <StatCard title="Tranh chấp mở" value={(stats?.openDisputes || 0).toString()} trend={(stats?.openDisputes || 0) > 5 ? "Cần xử lý" : "Ổn định"} icon="gavel" color={(stats?.openDisputes || 0) > 5 ? "red" : "teal"} />
                            <StatCard title="Sản phẩm đang bán" value={(stats?.activeListings || 0).toLocaleString()} trend="Live" icon="inventory_2" color="teal" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Doanh số của tôi" value={`${(sellerStats?.totalSales || 0).toLocaleString()}đ`} trend="+18%" icon="trending_up" color="teal" />
                            <StatCard title="Sản phẩm đăng bán" value={(sellerStats?.totalListings || 0).toString()} trend="Live" icon="inventory_2" color="cyan" />
                            <StatCard title="Đơn hàng của tôi" value={(sellerStats?.pendingOrders || 0).toString()} trend="Cần xử lý" icon="local_shipping" color="orange" />
                            <StatCard title="Đánh giá Shop" value={`${sellerStats?.shopRating || 0}/5`} trend="98 feedback" icon="star" color="yellow" />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                                    {isAdmin ? 'Giao dịch toàn hệ thống (30 ngày)' : 'Biểu đồ tăng trưởng doanh số'}
                                </h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Dữ liệu phân tích thời gian thực</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end gap-1 px-2 relative">
                            {stats.dailyStats && stats.dailyStats.length > 0 ? (() => {
                                const maxVal = Math.max(...stats.dailyStats.map(s => s.value), 1);
                                return stats.dailyStats.map((s, i) => {
                                    const heightPercent = (s.value / maxVal) * 100;
                                    const isLast = i === stats.dailyStats.length - 1;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 relative group bg-[#13ecc8]/${isLast ? '100' : '20'} rounded-t-sm hover:bg-[#13ecc8] transition-all cursor-pointer`}
                                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                            title={`${s.date}: ${s.value} đơn hàng`}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {s.value} đơn
                                            </div>
                                            {isLast && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                    {s.value}
                                                </div>
                                            )}
                                        </div>
                                    );
                                });
                            })() : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs italic">
                                    Đang khởi tạo dữ liệu biểu đồ...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Panel: Approvals for Admin, Alerts for Seller */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">
                            {isAdmin ? 'Phê duyệt sản phẩm' : 'Thông báo từ hệ thống'}
                        </h3>
                        <div className="flex-1 space-y-4">
                            {isAdmin ? (
                                <div className="space-y-4">
                                    {isLoading ? (
                                        <p className="text-xs text-slate-400 animate-pulse">Đang tải danh sách chờ...</p>
                                    ) : pendingListings.length > 0 ? (
                                        pendingListings.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group"
                                                onClick={() => setSelectedListing(item)}
                                            >
                                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-cyan-600 transition-colors">{item?.title}</p>
                                                    <p className="text-[10px] text-[#13ecc8] font-bold uppercase">Price: {(item?.price || 0).toLocaleString()}đ</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleModerate(item.id, 'AVAILABLE'); }}
                                                        className="p-1 text-[#00cfa8] bg-[#13ecc8]/5 hover:bg-[#13ecc8]/20 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleModerate(item.id, 'REJECTED'); }}
                                                        className="p-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">inventory</span>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Không có sản phẩm chờ duyệt</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <SellerNotifications stats={sellerStats} />
                            )}
                        </div>
                        <Link to={isAdmin ? "/admin/marketplace" : "#"} className="mt-6 w-full text-center text-[10px] font-bold uppercase tracking-widest text-cyan-600 hover:text-cyan-400 py-2 transition-colors border-t border-slate-50 pt-4">
                            {isAdmin ? 'Quản lý Marketplace' : 'Xem tất cả thông báo'}
                        </Link>
                    </div>
                </div>

                {/* Bottom Table: User Management for Admin, My Orders for Seller */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                                {isAdmin ? 'Quản lý người dùng' : 'Đơn hàng mới nhất của bạn'}
                            </h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                                {isAdmin ? 'Danh sách người dùng mới đăng ký' : 'Theo dõi trạng thái các giao dịch đang diễn ra'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link to="/admin/users" className="px-4 py-2 border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/5 transition-colors shadow-sm bg-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                Xem tất cả
                            </Link>
                            <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm bg-white">Xuất báo cáo</button>
                        </div>
                    </div>
                    {isAdmin ? <UserTable users={users} onToggleStatus={handleToggleUserStatus} /> : <SellerOrderTable orders={sellerOrders} onUpdateStatus={handleUpdateStatus} onRespondDispute={handleRespondDispute} onRefund={handleRefundOrder} />}
                </div>

                {isAdmin && (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto mb-10">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight text-orange-600">Phê duyệt nạp tiền (Ví)</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Xác nhận các giao dịch nạp tiền từ người dùng và người bán</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded animate-pulse">
                                    {pendingDeposits.length} YÊU CẦU CHỜ DUYỆT
                                </span>
                            </div>
                        </div>
                        <DepositTable deposits={pendingDeposits} onApprove={handleApproveDeposit} onReject={handleRejectDeposit} />
                    </div>
                )}

                {isAdmin && (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto mb-10">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-[#f0fdfa]">
                            <div>
                                <h3 className="text-lg font-bold text-cyan-800 tracking-tight">Phê duyệt bằng chứng AI (Đơn hàng)</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Xác nhận số lượng thực tế để giải ngân dòng tiền</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                                    {pendingOrders.length} ĐƠN HÀNG CHỜ DUYỆT
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <OrderApprovalTable
                                orders={pendingOrders}
                                onApprove={handleApproveOrder}
                                onUpdateStatus={handleUpdateStatus}
                                onRefund={handleRefundOrder}
                                onApprovePayout={handleApprovePayout}
                            />
                        </div>
                    </div>
                )}

                {/* Product Detail Modal */}
                {selectedListing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="relative h-64 bg-slate-100">
                                <img src={selectedListing.imageUrl || 'https://via.placeholder.com/600x400'} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedListing(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{selectedListing.title}</h3>
                                    <p className="text-sm font-medium opacity-80">Đăng bởi: {selectedListing.sellerName || 'Người bán ẩn danh'}</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Giá bán</p>
                                        <p className="text-lg font-bold text-cyan-600">{(selectedListing?.price || 0).toLocaleString()}đ</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Danh mục</p>
                                        <p className="text-lg font-bold text-slate-800">{selectedListing.category || 'Hải sản'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Số lượng</p>
                                        <p className="text-lg font-bold text-slate-800">{selectedListing.quantity || 1} {selectedListing.unit || 'kg'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mô tả sản phẩm</p>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 italic">
                                        "{selectedListing.description || 'Không có mô tả chi tiết cho sản phẩm này.'}"
                                    </p>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => handleModerate(selectedListing.id, 'REJECTED')}
                                        className="flex-1 py-4 bg-red-50 text-red-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                                    >
                                        Từ chối đăng tải
                                    </button>
                                    <button
                                        onClick={() => handleModerate(selectedListing.id, 'AVAILABLE')}
                                        className="flex-[2] py-4 bg-[#13ecc8] text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:brightness-110 shadow-lg shadow-[#13ecc8]/20 transition-all active:scale-95"
                                    >
                                        Phê duyệt ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

// --- Sub-components ---

const StatCard = ({ title, value, trend, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`bg-${color}-500/10 p-2 rounded-lg text-${color}-500`}>
                <span className="material-symbols-outlined font-icon">{icon}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs font-bold text-${color}-500 flex items-center`}>
                <span className="material-symbols-outlined text-sm font-bold">{trend.startsWith('+') ? 'trending_up' : 'info'}</span> {trend}
            </span>
            <span className="text-[10px] text-slate-400">cập nhật 2m ago</span>
        </div>
    </div>
);

const SellerNotifications = ({ stats }) => (
    <>
        {stats?.pendingOrders > 0 ? (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl animate-pulse">
                <p className="text-xs font-bold text-orange-800 mb-1">Đơn hàng mới!</p>
                <p className="text-[11px] text-orange-600">Bạn đang có {stats.pendingOrders} đơn hàng đang chờ xử lý và giao hàng.</p>
            </div>
        ) : (
            <div className="p-4 bg-[#13ecc8]/5 border border-[#13ecc8]/10 rounded-xl">
                <p className="text-xs font-bold text-cyan-800 mb-1">Hệ thống ổn định</p>
                <p className="text-[11px] text-cyan-600">Chưa có thông báo mới. Chúc bạn một ngày kinh doanh thuận lợi!</p>
            </div>
        )}
        <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
            <p className="text-xs font-bold text-cyan-800 mb-1">Mẹo kinh doanh</p>
            <p className="text-[11px] text-cyan-600">Cập nhật hình ảnh sản phẩm rõ nét giúp tăng tỉ lệ chốt đơn lên 30%.</p>
        </div>
    </>
);

const UserTable = ({ users, onToggleStatus }) => (
    <table className="w-full text-left min-w-[800px]">
        <thead>
            <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Profile</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? users.slice(0, 5).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#13ecc8]/10 flex items-center justify-center text-[#00cfa8] font-bold text-xs uppercase">
                                {u.fullName ? u.fullName.substring(0, 2) : '??'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{u.fullName || 'No Name'}</p>
                                <p className="text-[11px] text-slate-400">{u.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                            u.role === 'SELLER' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {u.role}
                        </span>
                    </td>
                    <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-[#13ecc8]' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold text-slate-600">
                                {u.status === 'ACTIVE' ? 'Active' : u.status}
                            </span>
                        </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                        <button
                            onClick={() => onToggleStatus(u.id, u.status === 'ACTIVE')}
                            className={`p-2 rounded-lg transition-colors ${u.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-[#13ecc8] hover:bg-[#13ecc8]/5'}`}
                            title={u.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {u.status === 'ACTIVE' ? 'block' : 'check_circle'}
                            </span>
                        </button>
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="4" className="px-8 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Không có dữ liệu người dùng</td>
                </tr>
            )}
        </tbody>
    </table>
);

const SellerOrderTable = ({ orders, onUpdateStatus, onRespondDispute, onRefund }) => (
    <table className="w-full text-left min-w-[800px]">
        <thead>
            <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng tiền</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Trạng thái</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold">#{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-4 text-sm font-medium">{order.buyerName}</td>
                    <td className="px-8 py-4 text-sm text-slate-600 font-medium">{order.listingTitle}</td>
                    <td className="px-8 py-4 text-sm font-black text-cyan-600">
                        {(order.totalPrice || 0).toLocaleString()}đ
                        {order.status === 'DISPUTED' && (
                            <div className="mt-2 p-2 bg-rose-50 rounded border border-rose-100 text-[10px] font-bold text-rose-700">
                                Lý do: {order.disputeReason}
                            </div>
                        )}
                        {order.sellerResponse && (
                            <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-100 text-[10px] font-bold text-blue-700">
                                Phản hồi: {order.sellerResponse}
                            </div>
                        )}
                    </td>
                    <td className="px-8 py-4 text-right">
                        <select
                            className={`bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase p-1.5 outline-none focus:ring-1 focus:ring-cyan-500 ${order.status === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                            disabled={order.status === 'COMPLETED'}
                        >
                            <option value="ESCROW_LOCKED">Đã nhận đơn</option>
                            <option value="PREPARING">Đang chuẩn bị</option>
                            <option value="SHIPPING">Đang giao hàng</option>
                            <option value="DELIVERED">Xác nhận đã giao tới khách</option>
                            <option value="READY_TO_PAYOUT">Chờ Admin duyệt chi</option>
                            <option value="DISPUTED" disabled>Đang khiếu nại</option>
                            <option value="CANCELLED" disabled>Đã hoàn tiền</option>
                        </select>
                        {order.status === 'DISPUTED' && (
                            <div className="flex gap-1 mt-2 justify-end">
                                <button
                                    onClick={() => onRespondDispute(order.id)}
                                    className="px-2 py-1 bg-amber-500 text-white text-[8px] font-black uppercase rounded hover:brightness-110"
                                >
                                    Phản hồi
                                </button>
                                <button
                                    onClick={() => onRefund(order.id)}
                                    className="px-2 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded hover:brightness-110"
                                >
                                    Hoàn tiền
                                </button>
                            </div>
                        )}
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Bạn chưa có đơn hàng nào
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

const DepositTable = ({ deposits, onApprove, onReject }) => (
    <table className="w-full text-left min-w-[800px]">
        <thead>
            <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Giao dịch</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Phương thức</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày yêu cầu</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {deposits.length > 0 ? deposits.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                        <p className="text-sm font-bold text-slate-800">#{d.id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">NẠP TIỀN VÀO VÍ</p>
                    </td>
                    <td className="px-8 py-4">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {d.paymentMethod}
                        </span>
                    </td>
                    <td className="px-8 py-4">
                        <p className="text-sm font-black text-emerald-600">{(d.amount || 0).toLocaleString()}đ</p>
                    </td>
                    <td className="px-8 py-4 text-xs text-slate-500 font-medium">
                        {d.createdAt ? new Date(d.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => onReject(d.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-100 transition-colors uppercase"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => onApprove(d.id)}
                                className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-colors uppercase shadow-sm"
                            >
                                Duyệt ngay
                            </button>
                        </div>
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                        Không có yêu cầu nạp tiền nào đang chờ xử lý
                    </td>
                </tr>
            )}
        </tbody>
    </table>
);

const OrderApprovalTable = ({ orders, onApprove, onUpdateStatus, onRefund, onApprovePayout }) => (
    <table className="w-full text-left min-w-[800px]">
        <thead>
            <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mua / Bán</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Số lượng (AI)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {orders.length > 0 ? orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold">#{o.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-4">
                        <p className="text-sm font-bold text-slate-800">{o.buyerName}</p>
                        <p className="text-[10px] text-slate-400">→ {o.sellerName}</p>
                    </td>
                    <td className="px-8 py-4">
                        <span className="text-sm font-black text-cyan-600">{o.finalQuantity} con</span>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase mt-1">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            AI Verified
                        </div>
                        {o.status === 'DISPUTED' && (
                            <div className="mt-2 p-2 bg-rose-50 rounded border border-rose-100 text-[10px] font-bold text-rose-700">
                                Lý do: {o.disputeReason}
                            </div>
                        )}
                        {o.sellerResponse && (
                            <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-100 text-[10px] font-bold text-blue-700">
                                Phản hồi: {o.sellerResponse}
                            </div>
                        )}
                    </td>
                    <td className="px-8 py-4">
                        <select
                            className={`bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase p-1 outline-none ${o.status === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={o.status}
                            onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                            disabled={o.status === 'COMPLETED'}
                        >
                            <option value="ESCROW_LOCKED">Chờ duyệt</option>
                            <option value="PREPARING">Đang chuẩn bị</option>
                            <option value="SHIPPING">Đang giao hàng</option>
                            <option value="DELIVERED">Xác nhận đã giao tới khách</option>
                            <option value="READY_TO_PAYOUT">Chờ giải ngân</option>
                            <option value="DISPUTED">Đang khiếu nại</option>
                            <option value="CANCELLED">Đã hoàn tiền</option>
                        </select>
                    </td>
                    <td className="px-8 py-4 text-right">
                        {o.status === 'ESCROW_LOCKED' ? (
                            <button
                                onClick={() => onApprove(o.id, o.finalQuantity)}
                                className="bg-cyan-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                            >
                                Duyệt số lượng
                            </button>
                        ) : o.status === 'DISPUTED' ? (
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => onRefund(o.id)}
                                    className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110"
                                >
                                    Duyệt Hoàn Tiền (90%)
                                </button>
                            </div>
                        ) : o.status === 'READY_TO_PAYOUT' ? (
                            <button
                                onClick={() => onApprovePayout(o.id)}
                                className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                            >
                                Duyệt Giải Ngân
                            </button>
                        ) : (
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest">
                                Đã duyệt số lượng
                            </span>
                        )}
                    </td>
                </tr>
            )) : (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Không có đơn hàng chờ duyệt</td>
                </tr>
            )}
        </tbody>
    </table>
);

export default AdminDashboard;
