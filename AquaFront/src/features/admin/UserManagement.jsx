import React, { useState, useEffect } from 'react';
import AdminLayout from './layout/AdminLayout';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const UserManagement = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form state for new user
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: 'Password123!', // Mật khẩu mặc định khi admin tạo
        role: 'BUYER'
    });

    // Filter and Pagination state
    const [filters, setFilters] = useState({ role: 'ALL', status: 'ALL' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats')
            ]);
            setUsers(usersRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu Admin:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', newUser);
            notify.success('Tạo người dùng thành công!');
            setIsAddModalOpen(false);
            setNewUser({ fullName: '', email: '', password: 'Password123!', role: 'BUYER' });
            fetchData();
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await api.put(`/admin/users/${userId}/status`, { newStatus });
            notify.success(newStatus === 'ACTIVE' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
            fetchData();
        } catch (error) {
            notify.error('Lỗi khi cập nhật trạng thái user');
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const roleMatch = filters.role === 'ALL' || user.role?.toString().toUpperCase() === filters.role.toUpperCase();
        const statusMatch = filters.status === 'ALL' || user.status?.toString().toUpperCase() === filters.status.toUpperCase();
        return roleMatch && statusMatch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <AdminLayout>
            <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">Quản Lý Người Dùng</h2>
                        <p className="text-slate-500 mt-1 uppercase tracking-widest text-[11px] font-semibold">User Management System • AI Verified</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-[#13ecc8] text-slate-900 font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm active:scale-95">
                        <span className="material-symbols-outlined">person_add</span>
                        Thêm Người Dùng Mới
                    </button>
                </section>

                {/* Statistics Grid (Bento Style) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Users</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">{stats?.totalUsers || 0}</span>
                            <span className="text-[11px] text-[#00cfa8] font-bold">+ {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24*60*60*1000)).length} today</span>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#13ecc8] h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>

                    {/* Active Sellers */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Sellers</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-extrabold text-slate-900">
                                {users.filter(u => u.role === 'SELLER' && u.status === 'ACTIVE').length}
                            </span>
                            <span className="material-symbols-outlined text-[#13ecc8] text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>store</span>
                        </div>
                        <p className="mt-4 text-[11px] text-slate-400 font-medium">Verified farming partners</p>
                    </div>

                    {/* Active Buyers */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Buyers</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-extrabold text-slate-900">
                                {users.filter(u => u.role === 'BUYER' && u.status === 'ACTIVE').length}
                            </span>
                            <span className="material-symbols-outlined text-blue-500 text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
                        </div>
                        <p className="mt-4 text-[11px] text-slate-400 font-medium">Active marketplace traders</p>
                    </div>

                    {/* AI Technicians */}
                    <div className="bg-[#13ecc8]/10 p-6 rounded-xl border border-[#13ecc8]/20 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[11px] uppercase tracking-widest text-cyan-800 font-bold mb-1">Total Listings</p>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-extrabold text-cyan-900">{stats?.activeListings || 0}</span>
                                <span className="material-symbols-outlined text-[#13ecc8] text-[40px] animate-[pulse_3s_ease-in-out_infinite]">neurology</span>
                            </div>
                            <p className="mt-4 text-[11px] text-cyan-800/70 font-bold">AI Verified Products</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                        </div>
                    </div>
                </section>

                {/* Filter and Table Section */}
                <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Filters Bar */}
                    <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
                            <div className="relative w-full sm:min-w-[200px]">
                                <select 
                                    value={filters.role}
                                    onChange={(e) => {setFilters({...filters, role: e.target.value}); setCurrentPage(1);}}
                                    className="w-full bg-white border border-slate-200 outline-none rounded-lg text-sm px-4 py-2 appearance-none focus:ring-1 focus:ring-[#13ecc8] transition-all text-slate-700 font-medium cursor-pointer"
                                >
                                    <option value="ALL">Vai trò (Tất cả)</option>
                                    <option value="SELLER">Seller</option>
                                    <option value="BUYER">Buyer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400 text-sm">expand_more</span>
                            </div>
                            <div className="relative w-full sm:min-w-[200px]">
                                <select 
                                    value={filters.status}
                                    onChange={(e) => {setFilters({...filters, status: e.target.value}); setCurrentPage(1);}}
                                    className="w-full bg-white border border-slate-200 outline-none rounded-lg text-sm px-4 py-2 appearance-none focus:ring-1 focus:ring-[#13ecc8] transition-all text-slate-700 font-medium cursor-pointer"
                                >
                                    <option value="ALL">Trạng thái (Tất cả)</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400 text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap">Người dùng</th>
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap">ID Người dùng</th>
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap">Vai trò</th>
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 whitespace-nowrap">Ngày tham gia</th>
                                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 text-right whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                    {user.avatarUrl ? (
                                                        <img className="w-full h-full object-cover" alt={user.fullName} src={user.avatarUrl}/>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-slate-400">person</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                                                    <p className="text-[11px] text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold whitespace-nowrap">
                                            {user.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                user.role?.toString().toUpperCase() === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role?.toString().toUpperCase() === 'SELLER' ? 'bg-[#13ecc8]/10 text-cyan-800' :
                                                'bg-blue-50 text-blue-700'
                                            }`}>
                                                {user.role || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    user.status === 'ACTIVE' ? 'bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)]' : 'bg-slate-300'
                                                }`}></span>
                                                <span className={`text-xs font-bold ${
                                                    user.status === 'ACTIVE' ? 'text-slate-700' : 'text-slate-400'
                                                }`}>{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                    className={`p-1.5 rounded-lg transition-all shadow-sm ${
                                                        user.status === 'ACTIVE' ? 'hover:bg-red-50 text-slate-400 hover:text-red-500' : 'hover:bg-green-50 text-slate-400 hover:text-green-500'
                                                    }`}
                                                    title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {user.status === 'ACTIVE' ? 'block' : 'check_circle'}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Đang hiển thị <span className="text-slate-900 font-bold">{(currentPage-1)*itemsPerPage + 1}-{Math.min(currentPage*itemsPerPage, filteredUsers.length)}</span> của <span className="text-slate-900 font-bold">{filteredUsers.length}</span></p>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-400 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i+1}
                                    onClick={() => setCurrentPage(i+1)}
                                    className={`w-8 h-8 rounded-lg font-bold text-xs shadow-sm transition-all ${
                                        currentPage === i+1 ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {i+1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-400 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer Specific to this page */}
                <footer className="pt-8 pb-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#13ecc8]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aqua Crystal AI v2.4.0 • Clinical Protocol Active</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">© 2024 Aqua Crystal AI Logistics. All Rights Reserved.</p>
                </footer>

                {/* Add User Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#13ecc8]/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-cyan-800">person_add</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Thêm Người Dùng Mới</h3>
                                    </div>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateUser}>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Họ và tên *</label>
                                        <input 
                                            required
                                            value={newUser.fullName}
                                            onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                                            type="text" placeholder="Nhập họ và tên" 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#13ecc8] outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Email *</label>
                                        <input 
                                            required
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                            type="email" placeholder="email@aquatrade.ai" 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#13ecc8] outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Mật khẩu *</label>
                                            <input 
                                                required
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                                type="password" 
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#13ecc8] outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Vai trò</label>
                                            <select 
                                                value={newUser.role}
                                                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#13ecc8] outline-none transition-all text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="SELLER">Seller</option>
                                                <option value="BUYER">Buyer</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm">Hủy</button>
                                    <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-[#13ecc8] hover:bg-[#0fc6a8] text-slate-900 transition-colors text-sm shadow-sm">Tạo Tài Khoản</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
export default UserManagement;
