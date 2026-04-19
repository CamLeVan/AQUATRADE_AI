import React, { useState } from 'react';
import AdminLayout from './layout/AdminLayout';

const UserManagement = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                            <span className="text-3xl font-extrabold text-slate-900">12,480</span>
                            <span className="text-[11px] text-[#00cfa8] font-bold">+5%</span>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#13ecc8] h-full w-[85%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Active Sellers */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Sellers</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-extrabold text-slate-900">1,240</span>
                            <span className="material-symbols-outlined text-[#13ecc8] text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>store</span>
                        </div>
                        <p className="mt-4 text-[11px] text-slate-400 font-medium">9.9% of total base</p>
                    </div>

                    {/* Active Buyers */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Buyers</p>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-extrabold text-slate-900">10,800</span>
                            <span className="material-symbols-outlined text-blue-500 text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>shopping_cart</span>
                        </div>
                        <p className="mt-4 text-[11px] text-slate-400 font-medium">86.5% of total base</p>
                    </div>

                    {/* AI Technicians */}
                    <div className="bg-[#13ecc8]/10 p-6 rounded-xl border border-[#13ecc8]/20 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[11px] uppercase tracking-widest text-cyan-800 font-bold mb-1">AI Technicians</p>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-extrabold text-cyan-900">440</span>
                                <span className="material-symbols-outlined text-[#13ecc8] text-[40px] animate-[pulse_3s_ease-in-out_infinite]">neurology</span>
                            </div>
                            <p className="mt-4 text-[11px] text-cyan-800/70 font-bold">Certified Node Operators</p>
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
                                <select className="w-full bg-white border border-slate-200 outline-none rounded-lg text-sm px-4 py-2 appearance-none focus:ring-1 focus:ring-[#13ecc8] transition-all text-slate-700 font-medium cursor-pointer">
                                    <option>Vai trò (Tất cả)</option>
                                    <option>Seller</option>
                                    <option>Buyer</option>
                                    <option>Admin</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400 text-sm">expand_more</span>
                            </div>
                            <div className="relative w-full sm:min-w-[200px]">
                                <select className="w-full bg-white border border-slate-200 outline-none rounded-lg text-sm px-4 py-2 appearance-none focus:ring-1 focus:ring-[#13ecc8] transition-all text-slate-700 font-medium cursor-pointer">
                                    <option>Trạng thái (Tất cả)</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400 text-sm">expand_more</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Show:</span>
                            <select className="bg-transparent border-none text-sm font-bold text-slate-800 focus:ring-0 outline-none cursor-pointer p-0 pr-4">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
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
                                {/* Row 1: Seller */}
                                <tr className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-lg object-cover" alt="Thanh Long" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjP2AKUv160-nz_dHHwuADV2psSl3PahNHOCp6xoEmwgPUAyXjE2BvQGiPg7vJA6tSbWWWfXE3sHzlCG-v9E4PypigN9fesJGd2raqHj5XJHJ6lgD7YCRD4XQxOc5hA9PyaY69_iOIuLkeZH8V6buZAKY2_j4hbOTTvTBN3_GcMv4y9BNAVgJ8I2wmqnOeb14zobUynw3MAb8l3CmkO3PGS69ffE7Dxk7rtKX4gn1NpU49DQ2EEGgzaK8Eeodcewcmb8k-UGPyktXO"/>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Thanh Long</p>
                                                <p className="text-[11px] text-slate-400">thanhlong@aquatrade.ai</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold whitespace-nowrap">AQ-00124</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded bg-[#13ecc8]/10 text-cyan-800 text-[10px] font-bold uppercase tracking-wider">Seller</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)]"></span>
                                            <span className="text-xs font-bold text-slate-700">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">12/04/2023</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#13ecc8] transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">block</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                
                                {/* Row 2: Buyer */}
                                <tr className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-lg object-cover" alt="Duong Dinh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPJTpUTp6UI4j2gSWie0XciobRbILRF9u7wxAYmYIOQ64biGflNScjWOu9I3gRRrgtc-p4Lji8mtBb6RTKjYSpyfs3rIuNqk4n7qfWV9aOwToyjcvjD_TiaTRt1pIxVgXzNX58xGUMBmr1YvZ-2A2QBg3vTPhJNB1QtIvTzoTB1LEdo9HuFTddrhaHJ0ifI2h7tKzxj0pr1ymQ812Wzjn_ZTIIAw7IsJSuBzfc3iqLSl_OZS6Am4XbKc-51ZWnhUogmG3TIcl57_WO"/>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Duong Dinh</p>
                                                <p className="text-[11px] text-slate-400">duongdinh@buyer.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold whitespace-nowrap">AQ-04592</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Buyer</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                            <span className="text-xs font-bold text-slate-400">Offline</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">05/01/2024</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#13ecc8] transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">block</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                
                                {/* Row 3: Technician */}
                                <tr className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img className="w-10 h-10 rounded-lg object-cover" alt="Lê Van cam" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf8J05q9WoWi9VTG8KvLcntRyu9V_O264y99T8fuFDtT_zrMJO9r-6Eu2vA_4wYS06veddTLO6HyssM4ta-UDm83tAXYYorgXbbYoeXvwTYeWlRSB0voinIl15q6UXr6juh-uO8ZxsSnuEGxASji4G4q3XLB30ChVHcXLNcIUnZQhMzgbuABnBtRfIOCQD9oCDiSr9NDW0NDkU38zjIoYTGPTKTTo6DF07aKJwXnN-LhCUfz9WH9xbRrKc7LGwiTEUBvvCRQHFDk8A"/>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Lê Van cam</p>
                                                <p className="text-[11px] text-slate-400">camle@aquatech.ai</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 font-bold whitespace-nowrap">AQ-00008</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">Technician</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)] animate-pulse"></span>
                                            <span className="text-xs font-bold text-slate-700">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">20/11/2022</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#13ecc8] transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-lg">block</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Đang hiển thị <span className="text-slate-900 font-bold">1-10</span> của <span className="text-slate-900 font-bold">12,480</span></p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-400 disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-xs shadow-sm">1</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-white border border-slate-200 text-slate-600 font-medium text-xs transition-colors">2</button>
                            <button className="w-8 h-8 rounded-lg hover:bg-white border border-slate-200 text-slate-600 font-medium text-xs transition-colors">3</button>
                            <span className="text-slate-400 px-1 font-bold">...</span>
                            <button className="w-8 h-8 rounded-lg hover:bg-white border border-slate-200 text-slate-600 font-medium text-xs transition-colors">1248</button>
                            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-400">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer Specific to this page inside main body */}
                <footer className="pt-8 pb-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#13ecc8]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aqua Crystal AI v2.4.0 • Clinical Protocol Active</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#13ecc8] transition-colors">Documentation</button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#13ecc8] transition-colors">Compliance</button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#13ecc8] transition-colors">System Health</button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">© 2024 Aqua Crystal AI Logistics. All Rights Reserved.</p>
                </footer>
                {/* Add User Modal Overlay */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-[fadeIn_0.2s_ease-out]">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#13ecc8]/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-cyan-800">person_add</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Thêm Người Dùng Mới</h3>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Tạo tài khoản hệ thống</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Họ và tên *</label>
                                    <input type="text" placeholder="Nhập họ và tên đầy đủ" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#13ecc8] focus:ring-1 focus:ring-[#13ecc8] transition-all text-sm"/>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Địa chỉ Email *</label>
                                    <input type="email" placeholder="email@aquatrade.ai" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#13ecc8] focus:ring-1 focus:ring-[#13ecc8] transition-all text-sm"/>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Vai trò</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#13ecc8] focus:ring-1 focus:ring-[#13ecc8] transition-all text-sm appearance-none cursor-pointer">
                                                <option value="seller">Seller</option>
                                                <option value="buyer">Buyer</option>
                                                <option value="technician">Technician</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Trạng thái</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#13ecc8] focus:ring-1 focus:ring-[#13ecc8] transition-all text-sm appearance-none cursor-pointer">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[#13ecc8] focus:ring-[#13ecc8] transition-all cursor-pointer"/>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-[#0fc6a8] transition-colors">Gửi email kích hoạt</p>
                                            <p className="text-[11px] text-slate-500">Người dùng sẽ nhận được email hướng dẫn thiết lập mật khẩu</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm">
                                    Hủy bỏ
                                </button>
                                <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold bg-[#13ecc8] hover:bg-[#0fc6a8] text-slate-900 transition-colors text-sm shadow-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    Tạo Tài Khoản
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
