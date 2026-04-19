import React from 'react';
import AdminLayout from '../layout/AdminLayout';
import Footer from '../../../components/layout/Footer';

const Inventory = () => {
    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">Phân Tích Kho Hàng</h2>
                        <p className="text-slate-500 mt-1 uppercase tracking-widest text-[11px] font-semibold">Inventory Analytics • Real-time</p>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <button className="hover:text-cyan-500 transition-colors flex"><span className="material-icons-outlined">help_outline</span></button>
                    </div>
                </section>
                    {/* Dashboard Stats (Overview) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat Card 1 */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-primary/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">TỔNG TỒN KHO</p>
                                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">2,450 <span className="text-sm font-medium text-slate-500">kg</span></h3>
                                <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                                    <span className="material-icons-outlined text-xs">trending_up</span> +12% so với tháng trước
                                </p>
                            </div>
                            <div className="bg-primary-container p-4 rounded-xl">
                                <span className="material-icons-outlined text-primary text-3xl">inventory</span>
                            </div>
                        </div>
                        {/* Stat Card 2 */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-primary/5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">CẢNH BÁO TỒN THẤP</p>
                                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">5 <span className="text-sm font-medium text-slate-500">Mặt hàng</span></h3>
                                <p className="text-xs text-error font-medium mt-2 flex items-center gap-1">
                                    <span className="material-icons-outlined text-xs">warning</span> Cần nhập hàng ngay
                                </p>
                            </div>
                            <div className="bg-error-container p-4 rounded-xl">
                                <span className="material-icons-outlined text-error text-3xl">priority_high</span>
                            </div>
                        </div>
                        {/* Stat Card 3 */}
                        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-primary/5 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">CHỈ SỐ SỨC KHỎE AI</p>
                                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">92%</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <p className="text-xs text-on-surface-variant">Hệ thống vận hành tối ưu</p>
                                </div>
                            </div>
                            <div className="bg-primary/10 p-4 rounded-xl relative z-10">
                                <span className="material-icons-outlined text-primary text-3xl">auto_awesome</span>
                            </div>
                            {/* Decorative AI Pattern */}
                            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                                <span className="material-icons-outlined text-[120px] text-primary">psychology</span>
                            </div>
                        </div>
                    </div>
                    {/* Inventory Management Section */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                        {/* Table Header & Filters */}
                        <div className="p-6 border-b border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Kho Hàng Hiện Tại</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-surface-container p-1 rounded-lg">
                                    <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 text-primary rounded-md shadow-sm">Tất cả</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">Tôm</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">Cá</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">Đông lạnh</button>
                                    <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors">Tươi sống</button>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border border-primary/20 text-xs font-bold rounded-lg hover:bg-primary/5 transition-colors">
                                    <span className="material-icons-outlined text-sm">filter_list</span>
                                    Lọc
                                </button>
                            </div>
                        </div>
                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container/50">
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Sản phẩm</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Mã Lô</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Danh mục</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right whitespace-nowrap">Số lượng (kg)</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">Chỉ số AI</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-center whitespace-nowrap">Ngày lưu kho</th>
                                        <th className="p-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold text-right whitespace-nowrap">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10">
                                                    <img alt="Thẻ Chân Trắng" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmu7neN4A3Vd6ErlApYzSkgyP6bpNk4TGo1IJNPimhHa9wmPcxbFs_YdpRXcdEkf-PuVcXruU2lPhVh5rMK0kyO349UAtS4xOPURmT-VUMN-oQ07XybVvBv54YuwWpMvFaXMUlCdSnXuNS7vay0hdfjrTVeYQFHreYl1-lZPQ6VT7B0cjyADg7OWp_e_uNQ5caRLmQrFWioU1a7SY-D4ttsZg9ufQv5n80vAx10TJ6nMLXmPfWV89LbyzIC8HiSDDqbDgY2PMmnlLc"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Tôm Thẻ Chân Trắng</p>
                                                    <p className="text-[10px] text-slate-400">Xuất xứ: Cà Mau</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">AQ-2024-081</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-tight whitespace-nowrap">Tươi sống</span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right text-slate-800 dark:text-slate-200">850.5</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-primary">98%</span>
                                                    <span className="text-slate-400 uppercase">Tối ưu</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{width: '98%'}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">4 Ngày</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">edit</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">monitoring</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">more_vert</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10">
                                                    <img alt="Hồi Nauy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD57sRoLA2zZlAKFtRNkCXU2VgeVh107m1Vry4LxKHT0sJFzqAnhCzE268gkxMaLP0dNsIYDRAl7C2ugpmKPUNOEl7iGJURLrmukk9vyxpCaa4v2aC6TisT7n41F8RhJ0p3602XL5iv1_kR0dG7tmqvOzrsh_1imAG3Gn9T4_M9_QsNkAti12WfkirxLnuAWfSqYaZiZkr4z7BEJ6IcE2cS-NXPx6S64MsvwiI-2bO2Fq1q8eNr3d6AggZFL_cRg-QqwRhhTDJXBkfc"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Cá Hồi Nauy</p>
                                                    <p className="text-[10px] text-slate-400">Xuất xứ: Nhập khẩu</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">AQ-2024-079</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 uppercase tracking-tight whitespace-nowrap">Đông lạnh</span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right text-slate-800 dark:text-slate-200">120.0</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-primary">85%</span>
                                                    <span className="text-slate-400 uppercase">Khá</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{width: '85%'}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">12 Ngày</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">edit</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">monitoring</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">more_vert</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 3 (Alert State) */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10">
                                                    <img alt="Bạch Tuộc" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1xIFNhtg82bDMYGFuouOwH-iemiyeUyl_ErzfQl3rpOfeE8cfWd_3LF_wr4dCYiQ38lDogAvX6gHhYaRQQKRejok89YBEKkqtYfWoNK_7UHmaXRZUFYDCw0f5CK7jCd_tGUq8a7uf72MU9p9wBF7nSQ7sCEu_OZT2E_dikTvCc0lHiFDRfB1FS7wgKgNYmGhwWYHKlpODc8RnA-8Cg4uQzjA4rc6B9PwOl5-gTINnxNsA55dZUoNxz1PNH1CQZX56S-juLEHwNq2X"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Bạch Tuộc Nhúng Giấm</p>
                                                    <p className="text-[10px] text-slate-400">Xuất xứ: Kiên Giang</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">AQ-2024-095</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-tight whitespace-nowrap">Tươi sống</span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right text-error border-b-0">12.5</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-error">42%</span>
                                                    <span className="text-error uppercase">Cảnh báo</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                                    <div className="h-full bg-error" style={{width: '42%'}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">1 Ngày</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="px-3 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-lg shadow-sm hover:opacity-90 transition-all uppercase tracking-tight whitespace-nowrap">Đặt ngay</button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">more_vert</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Row 4 */}
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/10">
                                                    <img alt="Tôm Hùm" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHKd2UhBqM__Tu5ilX4by3tA0PORXIpMrqYwuMZgZEbTeb-cK5mQc4wQ1bxIdZm5AgO-XcZs80IaU-bMBciQqXT4_4Bo0zvaGOfbXT_u3n3UkUNDJGIOc2qp-wtR8I784Llp7n2zIOt1t2NrPjjweefBY3Mg0zNzJa4akoYNR6F4WHU6BI7zp_xc5AR2RyX6rPuJa_nL9FjWVNmtQEP7Hxg6hL_DE72Ni6TpRbKgfYY1wD1ZLquXL1UM8sG0cLj0cRexoIXLDSLA7B"/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Tôm Hùm Bông</p>
                                                    <p className="text-[10px] text-slate-400">Xuất xứ: Khánh Hòa</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-400">AQ-2024-102</td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-tight whitespace-nowrap">Tươi sống</span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-right text-slate-800 dark:text-slate-200">45.0</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="font-bold text-primary">95%</span>
                                                    <span className="text-slate-400 uppercase">Tối ưu</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{width: '95%'}}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">2 Ngày</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">edit</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">monitoring</span></button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"><span className="material-icons-outlined text-sm">more_vert</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Table Footer / Pagination */}
                        <div className="p-4 border-t border-primary/5 flex items-center justify-between">
                            <p className="text-[10px] text-slate-500 font-medium">Đang hiển thị 4 trên 45 mặt hàng</p>
                            <div className="flex gap-1">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-400 hover:border-primary hover:text-primary transition-colors"><span className="material-icons-outlined text-sm">chevron_left</span></button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-500 text-xs font-bold hover:bg-primary/5">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-500 text-xs font-bold hover:bg-primary/5">3</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary/10 text-slate-400 hover:border-primary hover:text-primary transition-colors"><span class="material-icons-outlined text-sm">chevron_right</span></button>
                            </div>
                        </div>
                    </div>
                    {/* Footer (Shared Component) */}
                  <Footer/>
            </div>
        </AdminLayout>
    );
};

export default Inventory;
