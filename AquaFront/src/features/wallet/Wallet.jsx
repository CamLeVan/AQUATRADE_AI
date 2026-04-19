import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import myLogo from '../../assets/IMG_2793 3.jpg';
import Footer from '../../components/layout/Footer';

const Wallet = () => {
    return (
        <div className="bg-background text-on-surface font-display min-h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-y-auto min-h-screen">
                {/* TopNavBar Shell */}
                <header className="flex items-center justify-between px-8 w-full z-50 h-16 border-b border-cyan-500/5 sticky top-0 bg-white/70 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h1 className="font-sans font-semibold text-[14px] uppercase tracking-[0.2em] text-slate-800">Nạp Tiền Vào Ví - AquaTrade AI</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center bg-surface-container rounded-full px-4 py-1.5 gap-2 border border-outline-variant">
                            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-xs w-48 text-slate-600 outline-none" placeholder="Tìm giao dịch..." type="text" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="material-symbols-outlined text-slate-500 hover:text-cyan-500 transition-all font-icon">notifications</button>
                            <button className="material-symbols-outlined text-slate-500 hover:text-cyan-500 transition-all font-icon">help_outline</button>
                            <div className="h-8 w-px bg-slate-200 mx-2"></div>
                            <img alt="User Profile Avatar" className="w-8 h-8 rounded-full border border-primary/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKQSnNwe9h0UHPZlVtdmNlOrFpDUyFzxtpJSMl_5DJpzaU90rzEuxRfocV36idOl00X1G4xqHmLnfEpdXKrf8LsQSyfcuqGqw4piwS_yhEgRewpBvvaVCw5dZZFyrj6D1V72uc4ZTgffyUSx9mQhSDUflCWIfOyOgdFXLByoKAYBFIn6cIWmctrJn-YZY_XK0jNtK2olIHJB3cld76HKseakt0Z6eoEcrnVT7V9eDYfeTZCoZYY-PZHJ06udRkzKsrrBP7o3gi-4_0" />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    {/* Hero Balance & AI Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Wallet Balance Card */}
                        <div className="md:col-span-2 relative overflow-hidden bg-slate-900 rounded-xl p-8 text-white shadow-sm group">
                            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative z-10">
                                <p className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2">Số dư hiện tại</p>
                                <h2 className="text-4xl font-extrabold tracking-tight mb-6">45.250.000 <span className="text-primary font-normal text-xl">VND</span></h2>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Giao dịch 24h</p>
                                        <p className="text-sm font-semibold">+ 12.000.000 VND</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Cấp bậc ví</p>
                                        <p className="text-sm font-semibold text-primary">Kim Cương</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Deposit Tip Card */}
                        <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Gợi ý AI</span>
                                </div>
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    Dựa trên lịch sử giao dịch, bạn thường nạp tiền vào cuối tuần. Hãy nạp ngay hôm nay để nhận thêm <span className="text-cyan-600 font-bold">2% Aqua-Point</span>.
                                </p>
                            </div>
                            <button className="mt-4 text-xs font-bold text-cyan-500 uppercase tracking-wider hover:underline flex items-center gap-1">
                                Xem ưu đãi <span className="material-symbols-outlined text-sm font-icon">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Deposit Flow */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Section 1: Amount Selection */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">01</span>
                                    <h3 className="font-bold text-lg tracking-tight">Chọn số tiền nạp</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    <button className="p-4 rounded-lg border-2 border-primary bg-primary/5 text-center transition-all">
                                        <p className="text-xs text-slate-500 mb-1">Cơ bản</p>
                                        <p className="font-bold text-sm">500,000</p>
                                    </button>
                                    <button className="p-4 rounded-lg border border-primary/10 bg-surface-bright text-center hover:border-primary/40 transition-all">
                                        <p className="text-xs text-slate-500 mb-1">Phổ biến</p>
                                        <p className="font-bold text-sm">1,000,000</p>
                                    </button>
                                    <button className="p-4 rounded-lg border border-primary/10 bg-surface-bright text-center hover:border-primary/40 transition-all">
                                        <p className="text-xs text-slate-500 mb-1">Chuyên nghiệp</p>
                                        <p className="font-bold text-sm">5,000,000</p>
                                    </button>
                                    <button className="p-4 rounded-lg border border-primary/10 bg-surface-bright text-center hover:border-primary/40 transition-all">
                                        <p className="text-xs text-slate-500 mb-1">Doanh nghiệp</p>
                                        <p className="font-bold text-sm">10,000,000</p>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-bold">VND</span>
                                    </div>
                                    <input className="w-full pl-16 pr-4 py-4 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/30 text-lg font-bold placeholder:font-normal placeholder:text-slate-400 outline-none transition-all" placeholder="Nhập số tiền khác..." type="text" />
                                </div>
                            </section>

                            {/* Section 2: Payment Methods */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">02</span>
                                    <h3 className="font-bold text-lg tracking-tight">Phương thức thanh toán</h3>
                                </div>
                                <div className="space-y-3">
                                    {/* Bank Transfer */}
                                    <div className="p-5 rounded-xl border-2 border-primary bg-surface-bright shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-700 font-icon">account_balance</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold">Chuyển khoản Ngân hàng</p>
                                                    <p className="text-xs text-slate-500">Xác nhận tự động trong 1-3 phút</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-primary font-icon" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        </div>
                                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-primary/5 space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Ngân hàng</span>
                                                <span className="font-bold text-slate-800">MB BANK (MB)</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Số tài khoản</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-800">0777412659</span>
                                                    <button className="material-symbols-outlined text-sm text-cyan-500 font-icon">content_copy</button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">Chủ tài khoản</span>
                                                <span className="font-bold text-slate-800 uppercase">AQUATRADE LOGISTICS (LY THANH LONG)</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                                                <span className="text-slate-500">Nội dung nạp</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-primary">NAP AQ55201</span>
                                                    <button className="material-symbols-outlined text-sm text-cyan-500 font-icon">content_copy</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* QR Pay */}
                                    <div className="p-5 rounded-xl border border-primary/10 bg-surface-bright hover:border-primary/40 transition-all cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-700 font-icon">qr_code_2</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold">VietQR / Quét mã QR</p>
                                                    <p className="text-xs text-slate-500">Quét mã để nạp nhanh chóng</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 font-icon">radio_button_unchecked</span>
                                        </div>
                                    </div>
                                    {/* E-Wallet */}
                                    <div className="p-5 rounded-xl border border-primary/10 bg-surface-bright hover:border-primary/40 transition-all cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-700 font-icon">account_balance_wallet</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold">Ví điện tử (MoMo, ZaloPay)</p>
                                                    <p className="text-xs text-slate-500">Phí giao dịch 0%</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 font-icon">radio_button_unchecked</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                Xác nhận nạp tiền
                                <span className="material-symbols-outlined font-icon">arrow_forward</span>
                            </button>
                        </div>

                        {/* Right: QR and Summary */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 space-y-6">
                                {/* QR Display Card */}
                                <div className="bg-surface-bright border border-primary/10 rounded-2xl p-8 text-center shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Mã QR Thanh Toán</h4>
                                    <div className="relative inline-block p-4 bg-white border-2 border-primary/20 rounded-xl mb-6">
                                        <img alt="QR Code" className="w-48 h-48 opacity-90 object-cover" src={myLogo} />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-md border border-primary/10">
                                                <div className="w-full h-full bg-cyan-500 rounded flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-xs font-icon" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 px-4 mb-2">Quét mã bằng ứng dụng ngân hàng của bạn để thanh toán ngay lập tức.</p>
                                    <div className="flex items-center justify-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-sm animate-spin font-icon">sync</span>
                                        Đang chờ thanh toán...
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-surface-container rounded-xl p-6 border border-outline-variant">
                                    <div className="flex gap-4">
                                        <span className="material-symbols-outlined text-primary font-icon">info</span>
                                        <div className="text-xs text-on-surface-variant leading-relaxed">
                                            <p className="font-bold mb-1">Lưu ý quan trọng:</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Luôn điền chính xác <strong>Nội dung nạp</strong>.</li>
                                                <li>Tiền sẽ được cộng vào ví ngay sau khi hệ thống nhận được thông báo từ ngân hàng.</li>
                                                <li>Nếu quá 30 phút chưa nhận được tiền, vui lòng liên hệ bộ phận hỗ trợ.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <section className="mt-20">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="font-bold text-2xl tracking-tight mb-2">Lịch sử giao dịch gần đây</h3>
                                <p className="text-sm text-slate-500">Theo dõi trạng thái các khoản nạp của bạn</p>
                            </div>
                            <button className="text-sm font-bold text-cyan-500 hover:underline">Xem tất cả</button>
                        </div>
                        <div className="bg-surface-bright rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-primary/5">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mã giao dịch</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Phương thức</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Số tiền</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">AQ_TR_22901</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">14:20 - 20/05/2024</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-slate-400 font-icon">account_balance</span>
                                                <span className="text-sm">Vietcombank</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">5.000.000 VND</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> Success
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">AQ_TR_22895</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">09:15 - 20/05/2024</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-slate-400 font-icon">qr_code</span>
                                                <span className="text-sm">VietQR</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">1.000.000 VND</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span> Pending
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">AQ_TR_22712</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">18:45 - 19/05/2024</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm text-slate-400 font-icon">wallet</span>
                                                <span className="text-sm">MoMo</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">2.500.000 VND</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> Success
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Footer Shell */}
                    <Footer/>
                </main>
            </div>
        </div>
    );
};

export default Wallet;
