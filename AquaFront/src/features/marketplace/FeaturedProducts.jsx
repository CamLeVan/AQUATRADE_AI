import React from 'react';

const FeaturedProducts = () => {
    return (
        <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Featured Fingerlings</h2>
                <div className="flex space-x-2">
                    <button className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-primary/10 text-slate-400 hover:text-primary">
                        <span className="material-icons-outlined">grid_view</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow group">
                    <div className="relative rounded-lg overflow-hidden mb-4 aspect-[16/9]">
                        <img alt="Vannamei Shrimp" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MkwnAzmmG-IcWpselqWlKoWXtaKTnBJMY5MAIsbo5GIQShA8Itxqw9xj5otHTmhzKZaoSr9VNx5s-UIIXs8Eq8IIY1doiRriuKdQOSHeBDcD8yRHtxA7WdLLopvLzw-KKtsRQD6M8L4AaIWek08jRs36QIhotAzfvK_5YSO6rE3u1qPJbWThRzGFqQ1Khaz9_sqpm3Fjajo06jHebcWRlpqzzkvhsPUOfP643MLpFHmYKiP5niPXlKwEm-ZR53r7nYulE0nWJRx6"/>
                        <span className="absolute top-2 right-2 bg-primary/90 text-[10px] font-bold px-2 py-1 rounded-md text-slate-900">98% Health Score</span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg">Vannamei Shrimp (PL10)</h3>
                            <p className="text-xs text-slate-400">AquaFarms Global • Indonesia</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-primary text-lg">$0.045</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                        <div className="flex space-x-3 text-xs text-slate-500">
                            <span className="flex items-center"><span className="material-icons-outlined text-sm mr-1">inventory</span> 500k+</span>
                        </div>
                        <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors">
                            <span className="material-icons-outlined text-sm">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow group">
                    <div className="relative rounded-lg overflow-hidden mb-4 aspect-[16/9]">
                        <img alt="Tilapia Fingerlings" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOImp0cw0Pq-IqaO37su4Xog6SblMyDLH_iDp90wep9QDXBXI0mX31bJyBdCQHzk8w8X0IkZEOpNwCtXZs9ZyxusiTvhOrNI_hN5pcMq-Zd2NgHSiMuFsMbI_kn-3_bXOmnlSLLNCfVIjfRxcZj7SiSxDmEg_dJMFVe11rAJt4vSeR0f0N4PuahFa5KGvghLJ7zd97JK6DlfJUO414Fvm6tAvMmhhPeoieb10TdCmZj-TVld68ll9IgQksMdYCCthATKJdJA-BZzGF"/>
                        <span className="absolute top-2 right-2 bg-primary/90 text-[10px] font-bold px-2 py-1 rounded-md text-slate-900">Elite Breed</span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg">Nile Tilapia Seeds</h3>
                            <p className="text-xs text-slate-400">Pacific Hatchery • Vietnam</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-primary text-lg">$0.120</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                        <div className="flex space-x-3 text-xs text-slate-500">
                            <span className="flex items-center"><span className="material-icons-outlined text-sm mr-1">inventory</span> 1.2M</span>
                        </div>
                        <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors">
                            <span className="material-icons-outlined text-sm">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
