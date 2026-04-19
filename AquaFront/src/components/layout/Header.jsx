import React from 'react';

const Header = () => {
    return (
        <header className="h-16 bg-white/70 dark:bg-background-dark/70 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-primary/5">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-icons-outlined text-sm">search</span>
                    </span>
                    <input className="w-full bg-background-light dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 transition-all" placeholder="Search fingerlings, suppliers, or trends..." type="text"/>
                </div>
            </div>
            <div className="flex items-center space-x-6 ml-4">
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Live</span>
                </div>
                <button className="relative text-slate-500 hover:text-primary">
                    <span className="material-icons-outlined">notifications</span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="text-slate-500 hover:text-primary">
                    <span className="material-icons-outlined">mail</span>
                </button>
                <div className="flex items-center space-x-3 border-l border-primary/10 pl-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Thành Long</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Premium Vendor</p>
                    </div>
                    <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtWBEoX1WKeFB-bsE4NBbd1gaWtfcmFhh9DB1WZQmjJTVTdRCcjhHilRyeeXrqM2gYcLNq7U7mwHlqLLm9fBNm0DJ_QWgG2jhtG6TbV56vkrGYhBk523kAfh3EIOIXRV3ccc6sFgVQ65al1VkVWC7OvoVhjwEeuCfi0TJQ8Ot-LDeMdPS2ehH6m04cnV5CGD-9D4v8V64F0j_-Xy-X9q9_ws6YvT5lYBV_yccTRaXdXcJqtK6bJGw0JZd4D4WQsCpat1bD7be5SaEB"/>
                </div>
            </div>
        </header>
    );
};

export default Header;
