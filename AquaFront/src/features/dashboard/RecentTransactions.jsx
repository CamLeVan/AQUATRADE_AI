import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecentTransactions = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my');
                if (response.data.status === 'success') {
                    setOrders(response.data.data.slice(0, 5)); // Lấy 5 đơn mới nhất
                }
            } catch (error) {
                console.error('Lỗi khi tải đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'COMPLETED':
                return { label: 'Đã hoàn tất', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' };
            case 'PREPARING':
                return { label: 'Đang chuẩn bị', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' };
            case 'SHIPPING':
                return { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' };
            case 'CANCELLED':
                return { label: 'Đã hủy', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', dot: 'bg-slate-500' };
            default:
                return { label: status, color: 'bg-slate-100 text-slate-800', dot: 'bg-slate-400' };
        }
    };

    if (loading) return <div className="animate-pulse h-40 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">receipt_long</span>
                    </div>
                    Giao dịch gần đây của bạn
                </h2>
                <Link to="/orders" className="text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-lg transition-all">Xem tất cả</Link>
            </div>
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-primary/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/80 border-b border-primary/5">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã đơn hàng</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày giao dịch</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giá trị</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {orders.map(order => {
                                const status = getStatusInfo(order.status);
                                return (
                                    <tr key={order.id} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">
                                                AQ-{order.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">category</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{order.listingTitle}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                {(order.totalPrice || 0).toLocaleString()}đ
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status.dot} animate-pulse`}></span>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">Bạn chưa có giao dịch nào gần đây.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default RecentTransactions;
