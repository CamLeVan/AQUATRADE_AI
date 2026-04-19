import React from 'react';

const MarketSidebar = () => {
    return (
        <aside className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-primary/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white">Market Price AI</h3>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase tracking-tighter">Live Feed</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                                <span className="material-icons-outlined text-blue-500 text-sm">water_drop</span>
                            </div>
                            <span className="text-sm font-medium">Shrimp PL</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">$0.045</p>
                            <p className="text-[10px] text-green-500 flex items-center justify-end">
                                <span className="material-icons-outlined text-[10px]">trending_up</span> 1.2%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3">
                                <span className="material-icons-outlined text-emerald-500 text-sm">set_meal</span>
                            </div>
                            <span className="text-sm font-medium">Tilapia Seeds</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">$0.120</p>
                            <p className="text-[10px] text-slate-400 flex items-center justify-end">
                                <span className="material-icons-outlined text-[10px]">trending_flat</span> 0.0%
                            </p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-2 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
                    View Detailed Trends
                </button>
            </div>
            <div className="bg-gradient-to-br from-primary to-[#0bd4b4] p-6 rounded-xl shadow-lg shadow-primary/20 text-background-dark">
                <div className="flex items-center mb-3">
                    <span className="material-icons-outlined mr-2">auto_awesome</span>
                    <h4 className="font-bold text-sm">AI Stock Alert</h4>
                </div>
                <p className="text-xs font-medium opacity-90 mb-4 leading-relaxed">
                    Market analysis suggests a 15% price surge for Salmon smolt in the next 14 days. 
                </p>
                <button className="bg-background-dark text-white w-full py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                    Restock Now
                </button>
            </div>
        </aside>
    );
};

export default MarketSidebar;
