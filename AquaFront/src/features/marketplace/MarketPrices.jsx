import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const MarketPrices = () => {
    return (
        <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen flex font-['Inter']">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
                {/* TopNavBar (Fixed Top) */}
                <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 px-8 bg-white/70 backdrop-blur-md border-b border-cyan-500/10 z-40 flex justify-between items-center transition-all">
                    <div className="flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="w-full bg-surface-container border-none outline-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary transition-all bg-slate-100 dark:bg-slate-800" placeholder="Tìm kiếm thị trường, mã cá..." type="text"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 hover:bg-cyan-500/5 rounded-full transition-colors active:scale-95">
                                <span className="material-symbols-outlined font-icon">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse bg-red-500"></span>
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-cyan-500/5 rounded-full transition-colors active:scale-95">
                                <span className="material-symbols-outlined font-icon">account_balance_wallet</span>
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-cyan-500/5 rounded-full transition-colors active:scale-95">
                                <span className="material-symbols-outlined font-icon">settings</span>
                            </button>
                        </div>
                        <div className="h-8 w-px bg-cyan-500/10 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800 leading-none">Ly Thanh Long</p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Pro Member</p>
                            </div>
                            <img alt="User profile" className="w-9 h-9 rounded-full border border-primary/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWo-WhP6WNn2yjfo1AwJ1ldE53Td1usrbjgi1prDCgh-gtrkM7YEXfKKHcXbBWPIEcE6R6iRVEbmEtrf75cmghjYNsnKv5BmXzd8pHx010Gcl17HDPfS0DzMbAQkXKi3A8HYdMQ9pgB2sYhZDui1w7KcVB-LDMh4fZhsF47nfiZRgGpvJOr1XK-dRJ6pKXFHWfYXkPoGV_2yIzqtw3ANQu2C98kJAmSZp9YncAcvCVi_RB3T0l58JNwcRRcT2r5CN3xKvb7S7aZT_M"/>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 pt-16 flex flex-col">
                    <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                        {/* Page Title & Header Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Market Feed</span>
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Thị Trường Giá Thủy Sản Toàn Cầu</h2>
                                <p className="text-sm text-slate-500">Cập nhật lần cuối: <span className="font-mono">14:24:02 (GMT+7)</span> • 12 tháng 1, 2026</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-sm">download</span> Xuất Báo Cáo
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-all">
                                    <span className="material-symbols-outlined text-sm font-bold">add</span> Đặt Lệnh Mới
                                </button>
                            </div>
                        </div>

                        {/* Bento Grid: Analytics & Trends */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Chart Card */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">trending_up</span> Biểu đồ xu hướng giá
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase tracking-widest">7 Ngày</button>
                                        <button className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 rounded-full uppercase tracking-widest transition-colors">1 Tháng</button>
                                        <button className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 rounded-full uppercase tracking-widest transition-colors">1 Năm</button>
                                    </div>
                                </div>
                                {/* Chart Placeholder */}
                                <div className="h-64 relative overflow-hidden rounded-lg bg-slate-50 flex items-end px-4">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                        <span className="material-symbols-outlined scale-[5]">analytics</span>
                                    </div>
                                    <div className="w-full h-full flex items-end gap-4 pt-10 pb-2">
                                        {/* Visual Bars Simulation */}
                                        <div className="flex-1 bg-primary/20 rounded-t h-[40%] hover:bg-primary/40 transition-all cursor-pointer relative group">
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$4.20</div>
                                        </div>
                                        <div className="flex-1 bg-primary/40 rounded-t h-[65%] hover:bg-primary transition-all cursor-pointer relative group"></div>
                                        <div className="flex-1 bg-primary/20 rounded-t h-[55%] hover:bg-primary/40 transition-all cursor-pointer relative group"></div>
                                        <div className="flex-1 bg-primary/30 rounded-t h-[80%] hover:bg-primary transition-all cursor-pointer relative group"></div>
                                        <div className="flex-1 bg-primary/20 rounded-t h-[45%] hover:bg-primary/40 transition-all cursor-pointer relative group"></div>
                                        <div className="flex-1 bg-primary/60 rounded-t h-[95%] hover:bg-primary transition-all cursor-pointer relative group"></div>
                                        <div className="flex-1 bg-primary rounded-t h-[85%] relative group"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-primary/5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Cá Tra</span>
                                        <span className="text-lg font-bold text-slate-800">+12.5%</span>
                                    </div>
                                    <div className="flex flex-col items-center border-x border-primary/5">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Tôm Thẻ</span>
                                        <span className="text-lg font-bold text-slate-800">-2.4%</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Cá Hồi</span>
                                        <span className="text-lg font-bold text-slate-800">+5.1%</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Market Analysis Card */}
                            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group flex flex-col justify-between h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                                            <h3 className="font-bold uppercase tracking-widest text-xs">AI Market Analysis</h3>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 border border-primary/30 rounded text-primary">High Confidence</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Dự báo 7 ngày</p>
                                            <p className="text-sm font-medium leading-relaxed">Nhu cầu tại EU tăng mạnh do chuẩn bị lễ hội. Giá cá hồi Na Uy dự kiến tăng <span className="text-primary font-bold">15-20%</span>.</p>
                                        </div>
                                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-red-400 text-xs">warning</span>
                                                <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Cảnh báo biến động</p>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed text-slate-200">Thời tiết xấu tại Mekong có thể làm giảm sản lượng Tôm Thẻ, gây khan hiếm cục bộ.</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest relative z-10">
                                    Xem phân tích chi tiết <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className="bg-white border border-primary/10 rounded-xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-lg">filter_alt</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Bộ lọc nhanh</span>
                            </div>
                            <div className="hidden sm:block h-6 w-px bg-primary/10"></div>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                                <select className="bg-slate-50 border border-slate-200 text-[12px] font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary whitespace-nowrap min-w-[150px]">
                                    <option>Loại thủy sản: Tất cả</option>
                                    <option>Cá</option>
                                    <option>Tôm</option>
                                    <option>Nhuyễn thể</option>
                                </select>
                                <select className="bg-slate-50 border border-slate-200 text-[12px] font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary whitespace-nowrap min-w-[150px]">
                                    <option>Khu vực: Toàn cầu</option>
                                    <option>Việt Nam</option>
                                    <option>Thái Lan</option>
                                    <option>Na Uy</option>
                                </select>
                                <select className="bg-slate-50 border border-slate-200 text-[12px] font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary whitespace-nowrap min-w-[150px]">
                                    <option>Chất lượng: A-Grade</option>
                                    <option>Premium</option>
                                    <option>Standard</option>
                                </select>
                            </div>
                            <div className="ml-auto hidden md:flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                                    <span className="text-[10px] font-bold uppercase text-slate-500">View:</span>
                                    <button className="material-symbols-outlined text-primary text-lg">grid_view</button>
                                    <button className="material-symbols-outlined text-slate-400 text-lg transition-colors hover:text-primary">list</button>
                                </div>
                            </div>
                        </div>

                        {/* Live Price Table */}
                        <div className="bg-white border border-primary/10 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-slate-50 border-b border-primary/10">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Tên Loại</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Giá hiện tại (USD/kg)</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Thay đổi 24h</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Dự báo AI</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">AI Health Score</th>
                                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Khu vực</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                    <img className="w-full h-full object-cover" alt="Cá Tra" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsTMHOf8I0wrIGqgqEqyUSO2fWXf0kFmZYzzKNwqjD3l5svXgVyuM6K7GgaEGWy9waovLQRFXTCCQeHcoMVyZJdbV2Mmz_VcfmYdmeSFFv2DkXdWxaGxpO1GYyjJl-NbQkkVBqqc-TgTTTOlUKhvegSew1Gxa4dPHRPxu2obCsccGWOCfyjEAMjT3cXwpKv0LAma8FQAwmbbhWF-aEvC52AVL7KE_5Zn0wGJV6g2juRtv0G9sNCwGV86RTqM0tjbQJY2G383ZgQtch"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Cá Tra (Pangasius)</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">ID: AQ-P-042</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-800">$4.25</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-[#13ecc8]">
                                                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                                                <span className="text-xs font-bold">+2.4%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#13ecc8]/10 text-[#00bda0] uppercase tracking-wider">Dự báo: Tăng</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-16 sm:w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#13ecc8] w-[88%]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">88/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-medium text-slate-600">ĐBSCL, VN</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="material-symbols-outlined text-slate-300 hover:text-[#13ecc8] transition-colors">more_vert</button>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                    <img className="w-full h-full object-cover" alt="Tôm Thẻ" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_JQckwOULGLrBixS0rjB0kxksHoN_K7N8OYpNwRgr506tZBg2BtKYpLoZE9qg1OUiRmi2H7vP35A2jvp_hqsh8neFN41yFjX9adGubZ9fsPNn0YBMyYm3wurv-y6KYjmT56QtMqXQFlVj5eEiqKY0IQZLYm_7QW1M4Nm6b32TSP1VY_QCIgbdX1EG3dOSyFaNFia0h0ujj5kP-Dlhf4dkyExjx1nMXpFxL-ybUJ3aTGB7Fo2nNNpTupjScaMXMXG6dnNKGG21n7N6"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Tôm Thẻ Chân Trắng</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">ID: AQ-S-109</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-800">$12.80</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-red-500">
                                                <span className="material-symbols-outlined text-sm font-bold">trending_down</span>
                                                <span className="text-xs font-bold">-0.8%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-100 text-red-600 uppercase tracking-wider">Dự báo: Giảm</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-16 sm:w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#13ecc8] w-[94%]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">94/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-medium text-slate-600">Surat Thani, TH</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="material-symbols-outlined text-slate-300 hover:text-[#13ecc8] transition-colors">more_vert</button>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                    <img className="w-full h-full object-cover" alt="Cá Hồi" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbJqAp74c77OLgvhu2Jt-tnAb7wVhI5fV-KZ0rDWR5FIjuO5cg84vykWGVIxWie_DByoBoYjowju6ngtkfVf6kE3CuaK7VymQqHIVbrEwqLCAu5_XSNAbCZPQy-16oCOLFrnpeedq9eh59PJ52d-VSUh4IiaXL0ObDQ3larhc6W5nYuVrO9qSO6-_648MEYxTCDC6mVGJ29gt_p4GVpI4G0vJv01_xwrvJrwDT7GMq-2UitVvDb02c5JsWyOk2m6H6rpIM6ofULnRU"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Cá Hồi (Atlantic Salmon)</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">ID: AQ-L-231</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-800">$18.50</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-[#13ecc8]">
                                                <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                                                <span className="text-xs font-bold">+5.2%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#13ecc8]/10 text-[#00bda0] uppercase tracking-wider">Dự báo: Tăng</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-16 sm:w-20 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-[76%]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">76/100</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-medium text-slate-600">Bergen, NO</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="material-symbols-outlined text-slate-300 hover:text-[#13ecc8] transition-colors">more_vert</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-white shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hiển thị 3 trong tổng số 124 loại</span>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                <button className="w-8 h-8 rounded-lg bg-primary text-slate-900 font-bold text-[11px]">1</button>
                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors text-[11px] font-bold">2</button>
                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors text-[11px] font-bold">3</button>
                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                            </div>
                        </div>

                        {/* Regional Heatmap Section Placeholder */}
                        <div className="bg-white border border-primary/10 rounded-xl p-6 shadow-sm overflow-hidden">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">public</span> Mật độ cung ứng toàn cầu
                                </h3>
                                <div className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">Cập nhật theo tọa độ GPS</div>
                            </div>
                            <div className="aspect-[21/9] bg-slate-50 rounded-lg relative overflow-hidden flex items-center justify-center group border border-slate-100">
                                <div className="absolute inset-0 opacity-40 mix-blend-multiply">
                                    <img className="w-full h-full object-cover" alt="World Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA03dWObONzpfY4g25rK2j8VwunENrXy1YZkRMu-1_OTeP19xuLqR66qsvkPjTq7h0Cyp4QDn8C9qQfbaaFW_Ya7send6BY5spj97n2ypkBCkbWO69U_I_gL6ldf1pekrfe_gi4iKzxAQMawsK8jK00Op7ZsdMeOlaDjoz80w87HGUguPGxPnv6g-eFi2BPLt6fSGo9cVzALPyOkHLCEgrF4lcYtS0ut9nJcoMMX5SyyaOuJj-UA3rB6UXGZyL8O4D7Tc-5UMrtAAL3"/>
                                </div>
                                <div className="relative z-10 flex flex-col items-center text-center max-w-sm p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl transform transition-transform group-hover:scale-105">
                                    <span className="material-symbols-outlined text-[40px] text-primary mb-3 drop-shadow-sm">map</span>
                                    <h4 className="text-sm font-extrabold text-slate-800 mb-2">Bản đồ nhiệt cung ứng</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-[250px]">Kích hoạt chế độ "Supply View" để xem chi tiết lượng hàng tồn kho và lộ trình vận chuyển.</p>
                                    <button className="mt-5 w-full py-2.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors shadow-md">
                                        Mở bản đồ đầy đủ
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MarketPrices;
