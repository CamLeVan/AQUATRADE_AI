import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const checkActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: 'dashboard' },
        { path: '/prices', label: 'Market Prices', icon: 'payments' },
        { path: '/marketplace', label: 'Marketplace', icon: 'storefront' },
        { path: '/ai-detection', label: 'Analytics', icon: 'insights' },
        { path: '/orders', label: 'Logistics', icon: 'local_shipping' },
        { path: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
        { path: '/chat', label: 'AI Chat', icon: 'chat' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 border-r border-[#13ecc8]/10 bg-slate-50 dark:bg-slate-950 z-50 flex-col py-6">
            <div className="px-6 mb-10">
                <div className="flex items-center gap-3">
                    <Link to="/" className="w-8 h-8 bg-[#13ecc8] rounded-lg flex items-center justify-center shadow-lg shadow-[#13ecc8]/20 hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 0"}}>waves</span>
                    </Link>
                    <div>
                        <Link to="/" className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter block hover:opacity-80 transition-opacity leading-none">
                            AquaTrade <span className="text-[#13ecc8] font-bold text-sm">AI</span>
                        </Link>
                        <p className="font-['Inter'] uppercase tracking-widest text-[9px] font-bold text-slate-400 mt-1 leading-none">Precision Logistics</p>
                    </div>
                </div>
            </div>

            <div className="px-6 mb-8">
                <Link to="/marketplace" className="w-full py-3 px-4 bg-[#13ecc8] text-[#0a1a17] font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#13ecc8]/20 hover:brightness-110 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-lg">add</span>
                    New Order
                </Link>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const active = checkActive(item.path);
                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-6 py-3 transition-colors duration-200 font-['Inter'] text-[13px] font-bold ${
                                active 
                                ? 'text-[#13ecc8] border-r-4 border-[#13ecc8] bg-[#13ecc8]/5' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-[#13ecc8] hover:bg-[#13ecc8]/5'
                            }`}
                        >
                            <span 
                                className="material-symbols-outlined text-xl" 
                                style={active ? {fontVariationSettings: "'FILL' 1"} : {fontVariationSettings: "'FILL' 0"}}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 border-t border-[#13ecc8]/10 space-y-1">
                <Link className="flex items-center gap-3 px-6 py-3 text-slate-500 dark:text-slate-400 hover:text-[#13ecc8] hover:bg-[#13ecc8]/5 transition-colors font-['Inter'] uppercase tracking-widest text-[11px] font-bold" to="/support">
                    <span className="material-symbols-outlined text-xl">help_outline</span>
                    Support
                </Link>
                <Link className="flex items-center gap-3 px-6 py-3 text-slate-500 dark:text-slate-400 hover:text-[#13ecc8] hover:bg-[#13ecc8]/5 transition-colors font-['Inter'] uppercase tracking-widest text-[11px] font-bold" to="/login">
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Logout
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
