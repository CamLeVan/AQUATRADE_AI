import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const Settings = () => {
    return (
        <div className="bg-surface text-on-surface font-display min-h-screen flex overflow-hidden antialiased">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-y-auto min-h-screen">
                {/* TopNavBar */}
                <header className="flex justify-between items-center px-8 w-full z-40 bg-white/70 backdrop-blur-md h-16 border-b border-cyan-500/10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800">Settings</h2>
                        <div className="h-4 w-[1px] bg-slate-200"></div>
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Account Control Center</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-icon">search</span>
                            <input className="bg-surface-container border-none rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="Search settings..." type="text" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-50 transition-colors">
                                <span className="material-symbols-outlined font-icon">notifications</span>
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-50 transition-colors">
                                <span className="material-symbols-outlined font-icon">help</span>
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-50 transition-colors">
                                <span className="material-symbols-outlined font-icon">settings</span>
                            </button>
                            <div className="ml-2 w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                                <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFIxm6GN6105AAjEclvwhjE8kEA5gU5_hiwf_wJjfMd7DN9NoMbsNFemgLdc9LnshIGGo-gH9ih7uwwWiSa1fA5fkaB06t5JHUsqI5BaXa_v_4Hi3pHJLiGgsVDlsG0HHFN2JTIaP69GjBvpuGuN3AC0jsR0kvnKKZK3SVVh9VmiEI6p4ZVaPVhYBmnN9axLb6kIbVSfkGVYobsdLv7KMFe_1GpQ1dBrZkSZvrvtjk2c_sszK6EBPxohlAu-O-11eY8nehTe6c8JUx" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 min-h-screen">
                    <div className="max-w-6xl mx-auto p-12 space-y-12">
                        {/* Section: Profile */}
                        <section className="scroll-mt-24" id="profile">
                            <div className="flex items-baseline justify-between mb-6">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">General Information</span>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Hồ sơ cá nhân</h3>
                                </div>
                                <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline transition-all">Edit Profile</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Profile Card */}
                                <div className="md:col-span-1 bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-8 flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface p-1">
                                            <img alt="User Avatar" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGDqj9EBeQWN4VGW9qxYCnKTdE9BNx8tpKDXRhK5mCVciulSeEALTPxKsdqD3UrhTZ0DX1vcUeAMyK83umR7NRB-8bstHB95qa_X87jx8x8Re1sZDivaDZISNGSLuFN17_XRSaQfz7HbffkLah_uDLz-39sl41b3K7SRJP1DSd0DYtgOUyFDPfbOW7-46brsWdB_RE6aVKRYZ7V6dkraHVD91aoHFEDEN7q3o8l1HdJNb3Zs89MpNywmaMChCpbseZrKeyCXKmgNlF" />
                                        </div>
                                        <button className="absolute bottom-1 right-1 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white active:scale-90 transition-transform">
                                            <span className="material-symbols-outlined text-sm font-icon">photo_camera</span>
                                        </button>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800">Ly Thanh Long</h4>
                                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-1">Quản trị viên Logistics</p>
                                    <div className="mt-6 w-full pt-6 border-t border-primary/5 flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-medium">Status</span>
                                            <span className="flex items-center gap-1.5 text-primary font-bold">
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400 font-medium">Member Since</span>
                                            <span className="text-slate-700 font-bold">Jan 2026</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Details Card */}
                                <div className="md:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                        <div>
                                            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2">Tên người dùng</label>
                                            <p className="text-sm font-semibold text-slate-800 bg-surface-container py-3 px-4 rounded-lg border border-transparent focus-within:border-primary transition-colors">ThanhLong.Aqua</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2">Email doanh nghiệp</label>
                                            <p className="text-sm font-semibold text-slate-800 bg-surface-container py-3 px-4 rounded-lg border border-transparent">longly@aquatrade.ai</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2">Vai trò</label>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-primary/10 text-on-primary-container text-[11px] font-bold rounded-full border border-primary/20">Người bán</span>
                                                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded-full border border-slate-200">Nhà cung cấp</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2">Số điện thoại</label>
                                            <p className="text-sm font-semibold text-slate-800 bg-surface-container py-3 px-4 rounded-lg border border-transparent">+84 901 234 567</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Security */}
                        <section className="scroll-mt-24" id="security">
                            <div className="flex items-baseline justify-between mb-6">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">Account Protection</span>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Bảo mật</h3>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Password & 2FA */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-6 flex items-center justify-between group hover:bg-surface-container transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined font-icon">lock_reset</span>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800">Đổi mật khẩu</h5>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Thay đổi mật khẩu đăng nhập của bạn thường xuyên</p>
                                            </div>
                                        </div>
                                        <button className="bg-primary/10 text-on-primary-container p-2 rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                                            <span className="material-symbols-outlined text-lg font-icon">arrow_forward</span>
                                        </button>
                                    </div>
                                    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-6 flex items-center justify-between group hover:bg-surface-container transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined font-icon" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-800">Xác thực 2 lớp (2FA)</h5>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Thêm một lớp bảo mật cho tài khoản của bạn</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Đã bật</span>
                                            <div className="w-10 h-5 bg-primary rounded-full relative">
                                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Login History */}
                                <div className="lg:col-span-1 bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-6">
                                    <h5 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-4">Lịch sử đăng nhập</h5>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-primary text-sm mt-1 font-icon">laptop_mac</span>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-800">macOS - Chrome</p>
                                                <p className="text-[10px] text-slate-400">TP. Đà Nẵng • Đang hoạt động</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-slate-400 text-sm mt-1 font-icon">smartphone</span>
                                            <div>
                                                <p className="text-[12px] font-bold text-slate-800">iPhone 14 Pro Max- App</p>
                                                <p className="text-[10px] text-slate-400">Đà Nẵng • 2 giờ trước</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Xem tất cả</button>
                                </div>
                            </div>
                        </section>

                        {/* Section: AI Notifications */}
                        <section className="scroll-mt-24" id="notifications">
                            <div className="flex items-baseline justify-between mb-6">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">Intelligent Insights</span>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Cài đặt thông báo AI</h3>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline divide-y divide-primary/5">
                                {/* Notification Item 1 */}
                                <div className="p-6 flex items-center justify-between hover:bg-surface-container transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-error-container/50 flex items-center justify-center text-error">
                                            <span className="material-symbols-outlined font-icon">report</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800">AI phát hiện lô hàng kém chất lượng</h5>
                                            <p className="text-[11px] text-slate-500 max-w-md">Tự động gửi cảnh báo khẩn cấp khi các cảm biến sinh học phát hiện bất thường trong container.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                {/* Notification Item 2 */}
                                <div className="p-6 flex items-center justify-between hover:bg-surface-container transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-tertiary-container/50 flex items-center justify-center text-tertiary">
                                            <span className="material-symbols-outlined font-icon">trending_up</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800">Cảnh báo biến động giá thị trường</h5>
                                            <p className="text-[11px] text-slate-500 max-w-md">AI phân tích dữ liệu toàn cầu để dự báo và thông báo khi giá sản phẩm thay đổi quá 5%.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                {/* Notification Item 3 */}
                                <div className="p-6 flex items-center justify-between hover:bg-surface-container transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined font-icon">analytics</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800">Báo cáo sức khỏe kho hàng hàng tuần</h5>
                                            <p className="text-[11px] text-slate-500 max-w-md">Nhận bản tóm tắt phân tích lưu lượng kho và hiệu suất logistics vào sáng thứ Hai.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Payment Methods */}
                        <section className="scroll-mt-24" id="payment">
                            <div className="flex items-baseline justify-between mb-6">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1 block">Financial Hub</span>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-800">Phương thức thanh toán</h3>
                                </div>
                                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 transition-all">
                                    <span className="material-symbols-outlined text-sm font-icon">add</span>
                                    Thêm phương thức
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Default Wallet */}
                                <div className="relative overflow-hidden rounded-xl p-6 bg-slate-900 text-white shadow-lg border border-slate-700">
                                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
                                    <div className="flex justify-between items-start mb-10">
                                        <span className="text-[10px] font-black tracking-widest uppercase text-primary">Aqua Wallet</span>
                                        <span className="material-symbols-outlined text-primary font-icon" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 opacity-70">Balance</p>
                                        <h4 className="text-2xl font-bold tracking-tight">$42,850.00</h4>
                                    </div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <p className="text-[15px] font-bold tracking-widest">THANH LONG LY</p>
                                        <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-[8px] font-black uppercase">DEFAULT</span>
                                    </div>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-6 flex flex-col justify-between group hover:border-primary/40 transition-all">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400 text-lg font-icon">credit_card</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors font-icon">more_vert</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">Visa Corporate</p>
                                        <p className="text-xs font-mono text-slate-400">•••• •••• •••• 8842</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-primary/5 flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Expires 12/26</span>
                                    </div>
                                </div>
                                {/* Empty Slot / Add New */}
                                <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 group hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary font-icon">add</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary">Liên kết ví mới</span>
                                </div>
                            </div>
                            {/* Wallet Settings */}
                            <div className="mt-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined font-icon">bolt</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800">Thanh toán tự động với Aqua Wallet</h5>
                                            <p className="text-[11px] text-slate-500">Cho phép hệ thống tự động trừ tiền từ ví khi đến hạn thanh toán lô hàng.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Section */}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Settings;
