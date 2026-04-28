import React, { useState, useEffect } from 'react';
import AdminLayout from './layout/AdminLayout';

const AdminDashboard = () => {
    const [user, setUser] = useState({ fullName: '', role: '' });
    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        setUser(storedUser);
    }, []);

    const isAdmin = user.role === 'ADMIN';

    return (
        <AdminLayout>
            <div className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Highly Visible Role Banner */}
                <div className={`w-full py-4 px-6 rounded-2xl mb-8 flex items-center justify-between border-2 shadow-2xl ${
                    isAdmin 
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
                            {/* Admin Stats */}
                            <StatCard title="Tổng doanh thu" value="$1,284,000" trend="+12.5%" icon="payments" color="teal" />
                            <StatCard title="Người dùng hoạt động" value="42.5k" trend="+4.2%" icon="person_play" color="cyan" />
                            <StatCard title="Tranh chấp mở" value="18" trend="-2" icon="gavel" color="red" />
                            <StatCard title="Độ chính xác AI" value="99.98%" trend="Stable" icon="psychology" color="teal" />
                        </>
                    ) : (
                        <>
                            {/* Seller Stats */}
                            <StatCard title="Doanh số của tôi" value="125,000,000đ" trend="+18%" icon="trending_up" color="teal" />
                            <StatCard title="Sản phẩm đăng bán" value="42" trend="3 mới" icon="inventory_2" color="cyan" />
                            <StatCard title="Đơn hàng chờ" value="12" trend="Cần xử lý" icon="local_shipping" color="orange" />
                            <StatCard title="Đánh giá Shop" value="4.9/5" trend="98 feedback" icon="star" color="yellow" />
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
                        <div className="h-64 flex items-end gap-1 px-2">
                            {[30, 45, 35, 60, 80, 75, 90, 85, 70, 95].map((h, i) => (
                                <div key={i} className={`flex-1 bg-[#13ecc8]/${i === 9 ? '100' : '20'} rounded-t-sm h-[${h}%] hover:bg-[#13ecc8] transition-all cursor-pointer`} style={{ height: `${h}%` }}>
                                    {i === 9 && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">245</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Panel: Approvals for Admin, Alerts for Seller */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">
                            {isAdmin ? 'Phê duyệt sản phẩm' : 'Thông báo từ hệ thống'}
                        </h3>
                        <div className="flex-1 space-y-4">
                            {isAdmin ? (
                                <PendingItems />
                            ) : (
                                <SellerNotifications />
                            )}
                        </div>
                        <button className="mt-6 w-full text-[10px] font-bold uppercase tracking-widest text-cyan-600 hover:text-cyan-400 py-2 transition-colors">
                            {isAdmin ? 'Xem tất cả yêu cầu' : 'Xem tất cả thông báo'}
                        </button>
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
                        <button className="px-4 py-2 border border-slate-200 text-cyan-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm bg-white">Xuất báo cáo</button>
                    </div>
                    {isAdmin ? <UserTable /> : <SellerOrderTable />}
                </div>

                {/* Footer */}
                <footer className="w-full border-t border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4 rounded-xl shadow-sm mt-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">© 2024 Aqua Crystal AI. {isAdmin ? 'System Administrator' : 'Merchant Panel'}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <span className="material-symbols-outlined text-[#13ecc8] text-sm">shield</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Security: Tier 1 Encrypted</span>
                    </div>
                </footer>
            </div>
        </AdminLayout>
    );
};

// --- Sub-components for cleaner code ---

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

const PendingItems = () => (
    <>
        {[
            { name: 'Tôm Thẻ Sóc Trăng', ai: '98%', img: 'https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=100' },
            { name: 'Cá Tra An Giang', ai: '92%', img: 'https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=100' },
            { name: 'Mực Lá Phú Quốc', ai: '87%', img: 'https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=100' }
        ].map((item, i) => (
            <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                <img src={item.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-[#13ecc8] font-bold uppercase">AI Confidence: {item.ai}</p>
                </div>
                <div className="flex gap-1">
                    <button className="p-1 text-[#00cfa8] bg-[#13ecc8]/5 rounded"><span className="material-symbols-outlined text-sm">check_circle</span></button>
                    <button className="p-1 text-red-500 bg-red-50 rounded"><span className="material-symbols-outlined text-sm">cancel</span></button>
                </div>
            </div>
        ))}
    </>
);

const SellerNotifications = () => (
    <>
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <p className="text-xs font-bold text-orange-800 mb-1">Cảnh báo tồn kho!</p>
            <p className="text-[11px] text-orange-600">Sản phẩm "Tôm Thẻ Size 30" chỉ còn 5kg trong kho.</p>
        </div>
        <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
            <p className="text-xs font-bold text-cyan-800 mb-1">Đơn hàng mới</p>
            <p className="text-[11px] text-cyan-600">Bạn có 1 đơn hàng mới từ khách hàng Ly Thanh Long.</p>
        </div>
    </>
);

const UserTable = () => (
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
            <tr>
                <td className="px-8 py-4 text-sm font-bold">Duong Dinh</td>
                <td className="px-8 py-4 text-xs font-bold text-blue-600">SELLER</td>
                <td className="px-8 py-4 text-xs font-bold text-[#13ecc8]">Active</td>
                <td className="px-8 py-4 text-right"><button className="text-slate-400 material-symbols-outlined">more_vert</button></td>
            </tr>
        </tbody>
    </table>
);

const SellerOrderTable = () => (
    <table className="w-full text-left min-w-[800px]">
        <thead>
            <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng tiền</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Trạng thái</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            <tr>
                <td className="px-8 py-4 text-sm font-bold">#ORD-55201</td>
                <td className="px-8 py-4 text-sm font-medium">Ly Thanh Long</td>
                <td className="px-8 py-4 text-sm font-black">2.500.000đ</td>
                <td className="px-8 py-4 text-right">
                    <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 text-[10px] font-bold">CHỜ XỬ LÝ</span>
                </td>
            </tr>
        </tbody>
    </table>
);

export default AdminDashboard;
