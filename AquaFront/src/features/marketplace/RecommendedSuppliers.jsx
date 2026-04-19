import React from 'react';

const RecommendedSuppliers = () => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Recommended Suppliers</h2>
                    <p className="text-xs text-slate-400 mt-1">Based on your recent search for shrimp larvae</p>
                </div>
                <div className="flex space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                        <span className="material-icons-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                        <span className="material-icons-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
            <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-4">
                <div className="min-w-[280px] bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all flex-shrink-0">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                            <span className="material-icons-outlined text-primary">verified_user</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">OceanSeed Bio</h4>
                            <div className="flex text-amber-400">
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs text-slate-300">star</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Specializing in high-health SPF Vannamei Broodstock and larvae.</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Norway • Hatchery</span>
                        <button className="text-primary text-xs font-bold hover:underline">View Profile</button>
                    </div>
                </div>
                <div className="min-w-[280px] bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all flex-shrink-0">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                            <span className="material-icons-outlined text-primary">tsunami</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">AquaGen Tech</h4>
                            <div className="flex text-amber-400">
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Leading provider of genetic solutions for global aquaculture species.</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Singapore • Lab</span>
                        <button className="text-primary text-xs font-bold hover:underline">View Profile</button>
                    </div>
                </div>
                <div className="min-w-[280px] bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all flex-shrink-0">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                            <span className="material-icons-outlined text-primary">eco</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">BlueNature Hatch</h4>
                            <div className="flex text-amber-400">
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs text-slate-300">star_half</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Organic certified Tilapia seeds with 99% survival rate guarantee.</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Brazil • EcoFarm</span>
                        <button className="text-primary text-xs font-bold hover:underline">View Profile</button>
                    </div>
                </div>
                <div className="min-w-[280px] bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all flex-shrink-0">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                            <span className="material-icons-outlined text-primary">water</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Delta Aqua Seeds</h4>
                            <div className="flex text-amber-400">
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                                <span className="material-icons-outlined text-xs">star</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Pioneering recirculating aquaculture systems for premium seeds.</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Vietnam • RAS</span>
                        <button className="text-primary text-xs font-bold hover:underline">View Profile</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecommendedSuppliers;
