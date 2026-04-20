import React from 'react';
import AdminLayout from './layout/AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            {/* Scrollable Canvas */}
            <div className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Section Title */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Tổng quan hệ thống <span className="text-[#13ecc8] font-bold text-sm ml-2 bg-[#13ecc8]/10 px-2 py-0.5 rounded">Precision Hydrosphere v2.4</span></h2>
                        <p className="text-slate-500 text-sm mt-1">Real-time logistics and AI verification telemetry.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#13ecc8]/10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Server Health: 99.9%</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#13ecc8]/10 shadow-sm">
                            <span className="material-symbols-outlined text-xs text-cyan-500">bolt</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Latency: 14ms</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards: Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-slate-900">$1,284,000</h3>
                            </div>
                            <div className="bg-[#13ecc8]/10 p-2 rounded-lg text-[#00cfa8]">
                                <span className="material-symbols-outlined font-icon">payments</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#00cfa8] flex items-center"><span className="material-symbols-outlined text-sm font-bold">trending_up</span> +12.5%</span>
                            <span className="text-[10px] text-slate-400">vs last month</span>
                        </div>
                        {/* Mock Sparkline */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#13ecc8]/10">
                            <div className="h-full bg-[#13ecc8] w-2/3"></div>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Active Users</p>
                                <h3 className="text-2xl font-bold text-slate-900">42.5k</h3>
                            </div>
                            <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500">
                                <span className="material-symbols-outlined font-icon">person_play</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-cyan-500 flex items-center"><span className="material-symbols-outlined text-sm font-bold">trending_up</span> +4.2%</span>
                            <span className="text-[10px] text-slate-400">vs last week</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500/10">
                            <div className="h-full bg-cyan-500 w-1/2"></div>
                        </div>
                    </div>

                    {/* Open Disputes */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tranh chấp mở</p>
                                <h3 className="text-2xl font-bold text-slate-900">18</h3>
                            </div>
                            <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                                <span className="material-symbols-outlined font-icon">gavel</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-red-500 flex items-center"><span className="material-symbols-outlined text-sm font-bold">trending_down</span> -2</span>
                            <span className="text-[10px] text-slate-400">active tickets</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/10">
                            <div className="h-full bg-red-500 w-1/4"></div>
                        </div>
                    </div>

                    {/* AI Accuracy */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Độ chính xác AI</p>
                                <h3 className="text-2xl font-bold text-slate-900">99.98%</h3>
                            </div>
                            <div className="bg-[#13ecc8]/10 p-2 rounded-lg text-[#00cfa8]">
                                <span className="material-symbols-outlined font-icon">psychology</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#00cfa8] flex items-center"><span className="material-symbols-outlined text-sm font-bold">check_circle</span> Stable</span>
                            <span className="text-[10px] text-slate-400">Model: Crystal-v2</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#13ecc8]/10">
                            <div className="h-full bg-[#13ecc8] w-full"></div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: AI Insights & Marketplace Approvals */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AI Insights Chart (Placeholder) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight">AI Verified Trades (Last 30 Days)</h3>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Giao dịch đã xác thực</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded bg-[#13ecc8]/10 text-[#00cfa8] text-[10px] font-bold">DAILY</button>
                                <button className="px-3 py-1 rounded hover:bg-slate-50 text-slate-500 text-[10px] font-bold">WEEKLY</button>
                            </div>
                        </div>
                        {/* Chart Graphic */}
                        <div className="h-64 flex items-end gap-1 px-2">
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[30%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[45%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[35%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[60%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[80%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[75%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[90%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[85%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8]/20 rounded-t-sm h-[70%] hover:bg-[#13ecc8] transition-colors cursor-pointer"></div>
                            <div className="flex-1 bg-[#13ecc8] rounded-t-sm h-[95%] cursor-pointer shadow-[0_0_15px_rgba(19,236,200,0.4)] relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded">245</div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Day 01</span>
                            <span>Day 15</span>
                            <span>Today</span>
                        </div>
                    </div>

                    {/* Market Approvals */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4">Phê duyệt sản phẩm</h3>
                        <div className="flex-1 space-y-4">
                            {/* Pending Item 1 */}
                            <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpT1QCMx6pTL1WfsmSNGSbCn8JK7SOiAK5e9qIRGzCTDeKGjsTjyUci6Yzq3yULTc6uVV3ieUttA72_r5V13fVoxIPjYqgCRVkSzQncdmTzYXdJgcRWZA-2cempCYBWVkKFY_0U6jqMqpxDcAR_Wh2WBeJyUEY7UCrf0LQQjttKxxmZxPxnZbuLiEOVewk857nTgKoiPWVVodnbL9jUYPNGdisDZGnmF5LA-LVUp7b1d9my4JBKV4AB7DDorNb74w7hp_gV1t5RQ6_"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">AquaPure Reserve 500ml</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-[12px] text-[#13ecc8]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">AI Confidence: 98%</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 text-[#00cfa8] bg-[#13ecc8]/5 hover:bg-[#13ecc8]/20 rounded transition-colors"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                                    <button className="p-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"><span className="material-symbols-outlined text-lg">cancel</span></button>
                                </div>
                            </div>
                            {/* Pending Item 2 */}
                            <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_eAwgiVjjIcw_xYMME2EP8hoQMCkNWf9nCX0b6HlOliX5YY3RKAXJQ5qnq34qJB-Rz84VSEPwXmR_vCTWlP9dbLO2BLL-VkpJXQIkbWtTsHORQ6kpPON-naY1PrIMrlid8VLAhNwtaGQYPAMaR9wkODlf4Ngb1J0hm6IZ8pzAHDBydjhJvtnvnnEq4dtbAvXTVrO7GTPsLcXsdYxC6lyfS9O2NDej1WFi8JUaeEUojMueJYTMH8rq5QbcFn8tF_CtVzASs2Y3PLDe"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">Crystal-H2 Industrial Bulk</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-[12px] text-[#13ecc8]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">AI Confidence: 92%</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 text-[#00cfa8] bg-[#13ecc8]/5 hover:bg-[#13ecc8]/20 rounded transition-colors"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                                    <button className="p-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"><span className="material-symbols-outlined text-lg">cancel</span></button>
                                </div>
                            </div>
                            {/* Pending Item 3 */}
                            <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVaN_sY6u9DPWTYSfwhztV1WEymFtGFto1Qvu1yBwfEng7oo_5_dOzZdK9PGU8MM4ywijc1PiUP7B7S6jjPnXH-EcEhdsD3wBL7NhTNXvoVjM9BOj50c-NinfYxpbk6V8FSp_sv1xqBnnbOOu8bm_c5ihelOrlspLHvzXzrpkMKF_pUcd7-ELwjDA64oK-vT9eTRgvaSg7F2a1AoKKhGII8eUlIDkUVe6FtF76VGWU54Xj8TjpPxH1vMRearQb9rfNAjpUD7XxpGy1"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">DeepSea Filter Module X1</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-[12px] text-[#13ecc8]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">AI Confidence: 87%</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 text-[#00cfa8] bg-[#13ecc8]/5 hover:bg-[#13ecc8]/20 rounded transition-colors"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                                    <button className="p-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"><span className="material-symbols-outlined text-lg">cancel</span></button>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 w-full text-[10px] font-bold uppercase tracking-widest text-cyan-600 hover:text-cyan-400 py-2 transition-colors">View All Pending Tasks</button>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Quản lý người dùng</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Recent user sign-ups and activity</p>
                        </div>
                        <button className="px-4 py-2 border border-slate-200 text-cyan-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm bg-white">Export CSV</button>
                    </div>
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">User Profile</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Role / Quyền</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date Joined</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#13ecc8]/10 flex items-center justify-center text-[#00cfa8] font-bold text-xs">NL</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Duong Dinh</p>
                                            <p className="text-[11px] text-slate-400">duongdinh@example.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">Seller</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-600">Active</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-500 font-medium">Oct 12, 2024</td>
                                <td className="px-8 py-4">
                                    <button className="p-2 text-slate-400 hover:text-[#13ecc8] transition-colors rounded-full hover:bg-slate-100"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#13ecc8]/10 flex items-center justify-center text-[#00cfa8] font-bold text-xs">TV</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Le Van Cam</p>
                                            <p className="text-[11px] text-slate-400">camle@domain.vn</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Buyer</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-600">Active</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-500 font-medium">Oct 11, 2024</td>
                                <td className="px-8 py-4">
                                    <button className="p-2 text-slate-400 hover:text-[#13ecc8] transition-colors rounded-full hover:bg-slate-100"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#13ecc8]/10 flex items-center justify-center text-[#00cfa8] font-bold text-xs">AH</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Ly Thanh Long</p>
                                            <p className="text-[11px] text-slate-400">longthanhnct@gmail.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-600 text-[10px] font-bold uppercase tracking-wider">Admin</span>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#ffb703]"></div>
                                        <span className="text-xs font-bold text-slate-600">On Leave</span>
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-500 font-medium">Jan 02, 2024</td>
                                <td className="px-8 py-4">
                                    <button className="p-2 text-slate-400 hover:text-[#13ecc8] transition-colors rounded-full hover:bg-slate-100"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Specific to this page inside main body */}
                <footer className="w-full border-t border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4 rounded-xl shadow-sm mt-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">© 2024 Aqua Crystal AI. Precision Hydrosphere v2.4.0</p>
                        <div className="flex gap-4">
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-cyan-500 transition-colors">Privacy Policy</button>
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-cyan-500 transition-colors">Terms of Service</button>
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-cyan-500 transition-colors">Compliance</button>
                        </div>
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

export default AdminDashboard;
