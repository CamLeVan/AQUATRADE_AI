import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const admin = {
        name: user.fullName || 'Admin',
        role: user.role || 'Administrator'
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex font-['Inter'] selection:bg-cyan-500/30">
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-cyan-500/5 bg-slate-50 dark:bg-slate-950 flex flex-col py-6 z-50">
                {/* logo */}
                <div className="px-6 mb-10">
                    <div className="flex items-center gap-3">
                        <Link to="/admin" className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>waves</span>
                        </Link>
                        <div>
                            <Link to="/admin" className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter block hover:opacity-80 transition-opacity leading-none">
                                AquaTrade <span className="text-cyan-500 font-bold text-sm">AI</span>
                            </Link>
                            <p className="font-['Inter'] uppercase tracking-widest text-[9px] font-bold text-slate-400 mt-1 leading-none">Precision Logistics</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span>View Marketplace</span>
                    </Link>
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                        <span>Overview</span>
                    </Link>

                    {/* Chỉ Admin mới thấy Quản lý User và Chợ */}
                    {user.role === 'ADMIN' && (
                        <>
                            <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/users' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/users' ? "'FILL' 1" : "'FILL' 0" }}>group</span>
                                <span>User Management</span>
                            </Link>
                            <Link to="/admin/marketplace" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/marketplace' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/marketplace' ? "'FILL' 1" : "'FILL' 0" }}>storefront</span>
                                <span>Marketplace Control</span>
                            </Link>
                        </>
                    )}

                    <Link to="/admin/inventory" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/inventory' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/inventory' ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
                        <span>Inventory</span>
                    </Link>
                    <Link to="/admin/postings" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/postings' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/postings' ? "'FILL' 1" : "'FILL' 0" }}>publish</span>
                        <span>Postings</span>
                    </Link>

                    {/* CMS và Analytics cũng chỉ cho Admin */}
                    {user.role === 'ADMIN' && (
                        <>
                            <Link to="/admin/cms" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/cms' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/cms' ? "'FILL' 1" : "'FILL' 0" }}>description</span>
                                <span>Content / CMS</span>
                            </Link>
                            <Link to="/admin/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all duration-300 hover:pl-2 ${location.pathname === '/admin/analytics' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-r-4 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:bg-cyan-500/5'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/admin/analytics' ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
                                <span>AI Analytics</span>
                            </Link>
                        </>
                    )}
                </nav>
                <div className="px-4 mt-auto space-y-4">
                    <button className="w-full bg-[#13ecc8] text-slate-900 font-bold py-3 rounded-lg shadow-sm active:scale-95 transition-transform text-[10px] tracking-widest uppercase">
                        GENERATE REPORT
                    </button>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-cyan-500 uppercase tracking-widest text-[10px] font-bold">
                            <span className="material-symbols-outlined text-sm">help_outline</span>
                            <span>Support</span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest text-[10px] font-bold rounded-lg"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-h-screen min-w-0 h-screen overflow-hidden">
                {/* TopAppBar */}
                <header className="sticky top-0 right-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-8 h-16 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-xl font-bold tracking-tight text-slate-800">Aqua Crystal Admin</span>
                        <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block"></div>
                        <nav className="hidden md:flex gap-6">
                            <button className="text-cyan-500 font-bold border-b-2 border-cyan-500 text-sm tracking-tight py-5">Dashboard</button>
                            <button className="text-slate-500 hover:text-cyan-500 text-sm tracking-tight py-5 transition-colors">Audit Log</button>
                            <button className="text-slate-500 hover:text-cyan-500 text-sm tracking-tight py-5 transition-colors">Terminal</button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="bg-slate-100 border-none outline-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-[#13ecc8]" placeholder="Search parameters..." type="text" />
                        </div>
                        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                            <button className="text-slate-500 hover:bg-cyan-500/5 p-2 rounded-full transition-colors active:scale-95 relative">
                                <span className="material-symbols-outlined font-icon">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#13ecc8] rounded-full animate-pulse"></span>
                            </button>
                            <button className="text-slate-500 hover:bg-cyan-500/5 p-2 rounded-full transition-colors active:scale-95">
                                <span className="material-symbols-outlined font-icon">history</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{admin.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{admin.role}</p>
                            </div>
                            <img alt="Admin User Profile" className="w-8 h-8 rounded-full border border-[#13ecc8]/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMt3cd--Mrs3q1AZ3WqDKWxHcvpBnpMOc_LuYvJpvIqP_dRpTXkKDqPcmIDRiDy8u_aKfdO-IVmV4G8QvUHVF781CgMLkeM3MBIBNNGSs4lKbd9gkZtIFT9t3OIwrjhQnRue9Idx2roXqe7QbUtptASYQ8fSous8dFCNrhRLZN9qR1W-NMIFJwOCUqO5Z4EYHcM03aaEMIz1l19ACQ0P0sPKOmzRFO10PVIWGYecNjHECEWNby0YPdtYR2Dn7d0LxN4UngghDNqg1" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-slate-50">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
