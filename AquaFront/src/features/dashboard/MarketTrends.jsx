import React from 'react';

const MarketTrends = () => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Market Trends (Last 30 Days)</h2>
                <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-primary/10">
                    <button className="px-3 py-1 text-xs font-medium bg-primary text-background-dark rounded-md">Price</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-primary">Volume</button>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-primary/5 h-80 relative overflow-hidden">
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-end space-x-2 h-full w-full pb-8 border-b border-l border-slate-100 dark:border-slate-700 relative">
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[40%] transition-all"></div>
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[45%] transition-all"></div>
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[38%] transition-all"></div>
                        <div className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t h-[55%] transition-all"></div>
                        <div className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t h-[65%] transition-all"></div>
                        <div className="flex-1 bg-primary/40 hover:bg-primary/60 rounded-t h-[60%] transition-all"></div>
                        <div className="flex-1 bg-primary/50 hover:bg-primary text-primary h-[85%] transition-all relative group">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Peak: $0.052
                            </div>
                        </div>
                        <div className="flex-1 bg-primary/40 hover:bg-primary/60 rounded-t h-[75%] transition-all"></div>
                        <div className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t h-[80%] transition-all"></div>
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[70%] transition-all"></div>
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[65%] transition-all"></div>
                        <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[68%] transition-all"></div>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M0,70 Q10,60 20,65 T40,50 T60,30 T80,35 T100,20" fill="none" stroke="#13ecc8" strokeWidth="2"></path>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-medium px-4">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarketTrends;
