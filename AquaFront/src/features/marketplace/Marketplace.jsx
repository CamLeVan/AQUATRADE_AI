import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await api.get('/listings');
                setListings(response.data.data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    return (
        <div className="bg-background text-on-background antialiased min-h-screen">
            <Sidebar />

            <main className="ml-64 min-h-screen flex flex-col relative">
                <header className="fixed top-0 right-0 w-[calc(100%-256px)] z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-teal-500/10 flex justify-between items-center px-8 h-16 font-['Inter'] antialiased text-sm tracking-tight">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs focus:ring-1 focus:ring-teal-500/50 transition-all outline-none" placeholder="Tìm kiếm sản phẩm..." type="text"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-slate-500">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                <div className="pt-24 pb-12 px-8 flex-1">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-100 mb-2">Chợ Thủy Sản - Marketplace</h2>
                        <p className="text-slate-500 text-sm">Duyệt các lô hàng chất lượng cao được xác thực bởi AI</p>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listings.length > 0 ? listings.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm hover:shadow-md transition-all group">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                            src={item.thumbnailUrl || 'https://via.placeholder.com/400x300?text=AquaTrade'}
                                        />
                                        {item.aiVerified && (
                                            <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">AI Verified</div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{item.title}</h3>
                                        </div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">location_on</span> {item.province}
                                        </p>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chủng loại</span>
                                                <span className="text-[11px] font-bold text-teal-500">{item.species}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kích cỡ</span>
                                                <span className="text-[11px] font-bold text-slate-600">{item.sizeMin} - {item.sizeMax} cm</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                {(item.pricePerFish || 0).toLocaleString()} đ
                                                <span className="text-xs font-normal text-slate-400">/con</span>
                                            </span>
                                            <div className="flex gap-2">
                                                <Link to="/negotiation" className="w-9 h-9 flex items-center justify-center border border-teal-500/20 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">chat</span>
                                                </Link>
                                                <Link to={`/productdetail?id=${item.id}`} className="px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors">Chi tiết</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center text-slate-400 italic">
                                    Hiện chưa có sản phẩm nào đang được rao bán.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="w-full border-t border-teal-500/5 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center px-8 py-12 mt-auto">
                    <div className="mb-6 md:mb-0">
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-2 uppercase tracking-tighter">AquaTrade <span className="text-teal-500">AI</span></div>
                        <p className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase">© 2026 AquaTrade AI. The Precision Hydrosphere.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Marketplace;
