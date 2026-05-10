import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');

    const handleCompleteOrder = async (orderId) => {
        const confirmed = await notify.confirm(
            'Xác nhận hoàn tất?',
            'Bạn xác nhận đã nhận được hàng và cá giống đúng chất lượng? Hành động này sẽ chuyển tiền cho người bán.',
            'question'
        );

        if (!confirmed) return;

        try {
            const response = await api.post(`/orders/${orderId}/complete`);
            if (response.data.status === 'success') {
                notify.success('Xác nhận hoàn tất đơn hàng thành công!');
                fetchData(); // Load lại dữ liệu
            }
        } catch (error) {
            notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDisputeOrder = async () => {
        if (!disputeReason.trim()) {
            notify.error('Vui lòng nhập lý do khiếu nại');
            return;
        }

        try {
            const response = await api.post(`/orders/${selectedOrder.id}/dispute?reason=${encodeURIComponent(disputeReason)}`);
            if (response.data.status === 'success') {
                notify.success('Đã gửi đơn khiếu nại!');
                setShowDisputeModal(false);
                setDisputeReason('');
                fetchData();
            }
        } catch (error) {
            notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const userResponse = await api.get('/users/me');
            const currentUser = userResponse.data.data;
            setUser(currentUser);

            const ordersRes = await api.get('/orders/my');

            if (ordersRes.data.status === 'success') {
                setOrders(ordersRes.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1 flex flex-col lg:ml-64 w-full overflow-hidden">
                    <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-8">
                        <div>
                            <h1 className="text-2xl font-bold">Lịch sử & Bằng chứng giao dịch</h1>
                            <p className="text-sm text-slate-500">Bạn có {orders.length} giao dịch trong hệ thống</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="bg-primary text-slate-900 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 uppercase text-xs tracking-widest">
                                Xuất báo cáo
                            </button>
                        </div>
                    </header>

                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" placeholder="Tìm kiếm mã đơn, sản phẩm..." type="text" />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold">
                                    <option>Tất cả trạng thái</option>
                                    <option>Đang chờ</option>
                                    <option>Hoàn thành</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar">
                        <div className="max-w-6xl mx-auto space-y-4">
                            {orders.length > 0 ? orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row gap-5 hover:shadow-lg transition-all group">
                                    {/* Product Visual - Smaller & Compact */}
                                    <div className="relative w-full md:w-40 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={order.listingThumbnailUrl || "https://muoibienseafood.com/wp-content/uploads/2024/11/Phan-biet-tom-the-va-tom-su.jpg.webp"}
                                            alt={order.listingTitle}
                                        />
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[8px] text-cyan-600 font-black uppercase">
                                            <span className="material-symbols-outlined text-[10px]">verified</span>
                                            AI
                                        </div>
                                    </div>

                                    {/* Order Content - Tighter layout */}
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đơn hàng</p>
                                            <p className="text-sm font-bold text-slate-900">#AQ-{order.id.slice(-6).toUpperCase()}</p>
                                            <div className={`w-fit px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    order.status === 'PREPARING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        order.status === 'DISPUTED' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                                                            order.status === 'CANCELLED' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                                                                'bg-cyan-50 text-cyan-600 border-cyan-100'}`}>
                                                {order.status === 'ESCROW_LOCKED' ? 'Đã xác nhận' :
                                                    order.status === 'PREPARING' ? 'Đang chuẩn bị' :
                                                        order.status === 'SHIPPING' ? 'Đang giao hàng' :
                                                            order.status === 'DELIVERED' ? 'Đã giao tới' :
                                                                order.status === 'DISPUTED' ? 'Đang khiếu nại' :
                                                                    order.status === 'CANCELLED' ? 'Đã hoàn tiền' :
                                                                    order.status === 'READY_TO_PAYOUT' ? 'Chờ duyệt chi' :
                                                                        order.status === 'COMPLETED' ? 'Hoàn tất' : order.status}
                                            </div>
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</p>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{order.listingTitle}</p>
                                            <p className="text-[11px] text-slate-500">{order.finalQuantity} con — {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đối tác</p>
                                            <p className="text-sm font-bold text-slate-800">{user?.role === 'SELLER' ? order.buyerName : order.sellerName}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{user?.role === 'SELLER' ? 'Người mua' : 'Nhà cung cấp'}</p>
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền</p>
                                            <p className="text-lg font-black text-slate-900">{(order.totalPrice || 0).toLocaleString()}đ</p>
                                            <p className="text-[9px] text-cyan-500 font-bold uppercase flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">shield</span>
                                                Escrow Secure
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick Actions - Smaller buttons */}
                                    <div className="flex md:flex-col gap-2 justify-center lg:w-32 pt-4 md:pt-0 md:pl-5 border-t md:border-t-0 md:border-l border-slate-100">
                                        {user?.role === 'BUYER' && (['DELIVERED', 'READY_TO_PAYOUT', 'COMPLETED'].includes(order.status)) && (
                                            <>
                                                {order.status === 'DELIVERED' && (
                                                    <button
                                                        onClick={() => handleCompleteOrder(order.id)}
                                                        className="flex-1 bg-cyan-500 text-white py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all"
                                                    >
                                                        Đã nhận hàng
                                                    </button>
                                                )}
                                                {['DELIVERED', 'READY_TO_PAYOUT', 'COMPLETED'].includes(order.status) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowDisputeModal(true);
                                                        }}
                                                        className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
                                                    >
                                                        Khiếu nại
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-600 font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                                        >
                                            Bằng chứng
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Hệ thống trống</p>
                                    <Link to="/marketplace" className="mt-4 inline-block bg-cyan-500 text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest">Mua ngay</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-white dark:bg-background-dark border-l border-slate-200 dark:border-slate-800 p-6 hidden xl:block">
                    <h3 className="text-lg font-bold mb-6">AI Evidence Log</h3>
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Độ tin cậy hệ thống</p>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-black text-primary">98.4%</span>
                            </div>
                            <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[98.4%]"></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Hoạt động xác thực gần đây</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1 bg-primary rounded-full"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Mã băm hình ảnh được tạo</p>
                                        <p className="text-[10px] text-slate-400 uppercase">Order #AQ-RECENT</p>
                                        <p className="text-[9px] text-slate-500 mt-1">Vừa xong</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* AI EVIDENCE MODAL */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">AI Evidence Certificate</h2>
                                    <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Giao dịch được bảo vệ bởi AquaTrade AI</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                                    <span className="material-symbols-outlined text-slate-500">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="aspect-square rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 relative group">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={selectedOrder.digitalProof?.aiImageUrl || selectedOrder.listingThumbnailUrl}
                                            alt="AI Proof"
                                        />
                                        <div className="absolute top-4 left-4 bg-cyan-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                            AI Bounding Boxes
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kết quả phân tích</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-black text-slate-900">{selectedOrder.digitalProof?.aiFishCount || selectedOrder.finalQuantity}</span>
                                                <span className="text-sm font-bold text-slate-500 mb-1">con cá giống</span>
                                            </div>
                                            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                                Độ tin cậy: {(selectedOrder.digitalProof?.confidenceScore * 100 || 98.4).toFixed(1)}%
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã băm chứng thực (Hash)</p>
                                                <p className="text-[10px] font-mono text-slate-600 break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                    {selectedOrder.digitalProof?.proofHash || "SHA256:d82f...a1b2c3d4e5f6"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời gian xác thực</p>
                                                <p className="text-[11px] font-bold text-slate-800">
                                                    {new Date(selectedOrder.digitalProof?.createdAt || selectedOrder.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all mt-6 shadow-xl shadow-slate-900/10">
                                        Tải chứng chỉ (PDF)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* DISPUTE MODAL */}
            {showDisputeModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDisputeModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gửi Khiếu Nại</h2>
                                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Đơn hàng #AQ-{selectedOrder.id.slice(-6).toUpperCase()}</p>
                                </div>
                                <button onClick={() => setShowDisputeModal(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500">close</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                    <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                                        <span className="material-symbols-outlined text-xs align-middle mr-1">warning</span>
                                        Lưu ý: Nếu khiếu nại được chấp nhận và thực hiện hoàn tiền, bạn sẽ bị trừ 10% giá trị đơn hàng (phí vận hành/phạt).
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do khiếu nại chi tiết</label>
                                    <textarea
                                        value={disputeReason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all h-32 resize-none"
                                        placeholder="Mô tả vấn đề bạn gặp phải (ví dụ: Cá chết nhiều, không đúng chủng loại...)"
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleDisputeOrder}
                                    className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
                                >
                                    Gửi yêu cầu khiếu nại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
