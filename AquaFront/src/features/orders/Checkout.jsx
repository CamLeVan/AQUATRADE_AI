import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const Checkout = () => {
    return (
        <div className="bg-surface text-on-surface antialiased overflow-hidden font-display flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden relative">
                {/* Top Navigation */}
                <header className="flex items-center justify-between px-8 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md h-16 border-b border-cyan-500/5 sticky top-0">
                    <div className="flex items-center gap-4">
                        <span className="text-xs tracking-widest uppercase font-bold text-on-surface-variant/60">Procurement / Checkout</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative flex items-center bg-surface-container rounded-full px-4 py-1.5 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
                            <span className="material-symbols-outlined text-slate-400 text-sm mr-2 font-icon">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-xs w-48 outline-none" placeholder="Trace batch ID..." type="text" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="material-symbols-outlined text-slate-500 hover:text-cyan-500 cursor-pointer transition-all font-icon">notifications</span>
                            <span className="material-symbols-outlined text-slate-500 hover:text-cyan-500 cursor-pointer transition-all font-icon">help_outline</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto bg-surface p-8 pb-0">
                    <div className="max-w-7xl mx-auto mb-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline uppercase">Thanh Toán Đơn Hàng</h2>
                            <p className="text-sm text-on-surface-variant tracking-wide mt-1">Laboratory Precision Logistics — Order #AQ-9428-2024</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Section: Forms */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Shipping Information */}
                                <section className="bg-surface-bright rounded-xl shadow-sm border border-outline p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm font-icon">local_shipping</span>
                                        </span>
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Thông Tin Giao Hàng</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Người Nhận</label>
                                            <input className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium outline-none" type="text" defaultValue="Lê Văn Cảm" />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Số Điện Thoại</label>
                                            <input className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium outline-none" type="text" defaultValue="+84 901 234 567" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Địa Chỉ Nhận Hàng</label>
                                            <div className="relative">
                                                <input className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium pr-10 outline-none" placeholder="235 Huỳnh Lắm, Ngũ Hành Sơn, TP. Đà Nẵng" type="text" />
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-primary text-sm font-icon">location_on</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Delivery Method */}
                                <section className="bg-surface-bright rounded-xl shadow-sm border border-outline p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm font-icon">rocket_launch</span>
                                        </span>
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Phương Thức Vận Chuyển</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="relative flex p-4 cursor-pointer rounded-xl border border-primary/20 bg-primary/5 transition-all">
                                            <input defaultChecked className="hidden" name="delivery" type="radio" />
                                            <div className="flex flex-col flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-bold uppercase tracking-tight">Express Logistics</span>
                                                    <span className="text-xs font-bold text-primary">50,000đ</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Giao hàng tươi sống trong 2 giờ. Aqua-Lock™ bảo quản nhiệt độ cực sâu.</span>
                                            </div>
                                            <div className="ml-4 flex items-center">
                                                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="relative flex p-4 cursor-pointer rounded-xl border border-outline hover:border-primary/20 hover:bg-primary/5 transition-all">
                                            <input className="hidden" name="delivery" type="radio" />
                                            <div className="flex flex-col flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-bold uppercase tracking-tight text-slate-600">Standard Delivery</span>
                                                    <span className="text-xs font-bold text-slate-400">Miễn Phí</span>
                                                </div>
                                                <span className="text-xs text-slate-500">Giao hàng trong ngày. Phù hợp cho hải sản đông lạnh hoặc đóng hộp.</span>
                                            </div>
                                            <div className="ml-4 flex items-center">
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                                            </div>
                                        </label>
                                    </div>
                                </section>

                                {/* Payment Method */}
                                <section className="bg-surface-bright rounded-xl shadow-sm border border-outline p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm font-icon">payments</span>
                                        </span>
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Hình Thức Thanh Toán</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between border-2 border-primary ring-4 ring-primary/5">
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-primary font-icon">account_balance_wallet</span>
                                                <div>
                                                    <p className="text-sm font-bold uppercase">Aqua Wallet Balance</p>
                                                    <p className="text-[10px] text-primary/80 tracking-widest uppercase">Verified Priority Transfer</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">12,500,000đ</p>
                                                <p className="text-[10px] text-slate-400">SỐ DƯ KHẢ DỤNG</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center gap-3 p-4 rounded-xl border border-outline hover:border-primary/20 hover:bg-primary/5 transition-all">
                                                <span className="material-symbols-outlined text-slate-400 font-icon">account_balance</span>
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Bank Transfer</span>
                                            </button>
                                            <button className="flex items-center justify-center gap-3 p-4 rounded-xl border border-outline hover:border-primary/20 hover:bg-primary/5 transition-all">
                                                <span className="material-symbols-outlined text-slate-400 font-icon">handshake</span>
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">COD</span>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Section: Order Summary (Sticky-ish) */}
                            <div className="lg:col-span-4 lg:sticky lg:top-24">
                                <div className="bg-surface-bright rounded-xl shadow-lg border border-primary/10 overflow-hidden">
                                    <div className="p-6 bg-slate-900 text-white">
                                        <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                            Live Order Summary
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {/* Products */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded bg-surface-container overflow-hidden shrink-0">
                                                    <img className="w-full h-full object-cover" alt="Salmon Order" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQ4eCQ5hVWfRB42Nhmxpz658kl4ds7ZATPvNFhPoLOtt9sVj7s7cEVMc_2pvZswLig4AAceCd5TQOdWxALpWSoibH5CZoz-y4VESyFSHbWm3cGlW8J5h0rxM-EIEpiI-u_Gixby-Gz1CXAAwy6ATpQDjn8qVqpVjesTULGgXoU7i9jSvPXHCHVWzQXja6YI_ZA3SEdFKhE202Ub5Dj7Nef-O3qrZU4vjInDZoFdQ4dQle8qOgyHoOvj7Eqb0xPRV-Rxv5wjF9nDTx" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 uppercase truncate">Salmon - Batch #942</p>
                                                    <p className="text-[10px] text-slate-500">2.5 KG x 450,000đ</p>
                                                </div>
                                                <p className="text-xs font-bold text-slate-800">1,125,000đ</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded bg-surface-container overflow-hidden shrink-0">
                                                    <img className="w-full h-full object-cover" alt="King Prawns Order" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1nIV9VuXI9B0K0s5MNSNvui5zixLdgj0XZaGIbY8wF5U1PlIp-MLfKKDOMK9v2JcXQ1sv7UNfys0MD4-tm2w0Hc0EnUd2GuM231EkusN2_pOxg_xuPH3hvwV5NHyQ0hjqkJAnEQCiq7pPMvioJ7e2XJZVTDWLrUFWEVHajlaHiAc2CASenVV5uQ_80Dy5XzBPwjq3muoh63ArvISOMIqcmMqHFAkdksVhfXqt-Q3F8Rl5knY3wkDyBAs2jPu4OhH6dF9isuFWP817" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 uppercase truncate">King Prawns - AquaA</p>
                                                    <p className="text-[10px] text-slate-500">5 BOX x 280,000đ</p>
                                                </div>
                                                <p className="text-xs font-bold text-slate-800">1,400,000đ</p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-primary/5"></div>
                                        {/* Financials */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 uppercase tracking-wider">Subtotal</span>
                                                <span className="font-medium">2,525,000đ</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 uppercase tracking-wider">Shipping</span>
                                                <span className="font-medium">50,000đ</span>
                                            </div>
                                            <div className="flex justify-between text-xs items-center">
                                                <span className="text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] font-icon">auto_awesome</span>
                                                    AI Verification
                                                </span>
                                                <span className="font-medium text-primary">25,000đ</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-primary/10">
                                            <div className="flex justify-between items-baseline mb-6">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Total Amount</span>
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter">2,600,000đ</span>
                                            </div>
                                            <button className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-black py-4 rounded-lg uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-primary/20">
                                                Thanh Toán Ngay
                                            </button>
                                            <p className="text-[9px] text-center text-slate-400 mt-4 leading-relaxed px-4">
                                                By placing this order, you agree to our 100% Quality Assurance Protocol & Cold Chain Logistics Terms.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Secondary Trust Card */}
                                <div className="mt-4 p-4 rounded-xl bg-cyan-50 border border-cyan-100 flex gap-4">
                                    <span className="material-symbols-outlined text-cyan-500 text-xl font-icon" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Smart-Contract Secured</p>
                                        <p className="text-[10px] text-cyan-700/70">Funds are held in escrow until the laboratory sensors confirm the delivery temperature compliance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Footer within scrollable area */}
                    <footer className="flex flex-col md:flex-row justify-between items-center w-full py-8 mt-12 border-t border-cyan-500/5 bg-slate-50 dark:bg-slate-900 font-sans text-[11px] tracking-widest uppercase text-slate-400">
                        <div className="mb-4 md:mb-0">
                            <span className="font-bold text-slate-500 mr-2">AQUATRADE AI</span>
                            © 2024 Laboratory Precision Logistics.
                        </div>
                        <div className="flex gap-8">
                            <Link className="text-slate-400 hover:text-cyan-500 hover:underline transition-all opacity-80 hover:opacity-100" to="#">Privacy Policy</Link>
                            <Link className="text-slate-400 hover:text-cyan-500 hover:underline transition-all opacity-80 hover:opacity-100" to="#">Terms of Service</Link>
                            <Link className="text-slate-400 hover:text-cyan-500 hover:underline transition-all opacity-80 hover:opacity-100" to="#">Support</Link>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
