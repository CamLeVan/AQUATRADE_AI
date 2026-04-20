import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const Marketplace = () => {
    return (
        <div className="bg-background text-on-background antialiased min-h-screen">
            {/* Shared Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="ml-64 min-h-screen flex flex-col relative">
                {/* TopAppBar (Floating) */}
                <header className="fixed top-0 right-0 w-[calc(100%-256px)] z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-teal-500/10 flex justify-between items-center px-8 h-16 font-['Inter'] antialiased text-sm tracking-tight">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs focus:ring-1 focus:ring-teal-500/50 transition-all outline-none" placeholder="Tìm kiếm sản phẩm, đối tác, vận đơn..." type="text"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-slate-500">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-slate-500">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </header>

                {/* Page Canvas */}
                <div className="pt-24 pb-12 px-8 flex-1">
                    {/* Header Section */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-100 mb-2">Chợ Thủy Sản - Marketplace</h2>
                        <p className="text-slate-500 text-sm">Duyệt các lô hàng chất lượng cao được xác thực bởi AI</p>
                    </div>

                    {/* Modern Filter Bar */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-teal-500/5 flex flex-wrap items-center gap-4 mb-8">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Loại sản phẩm</label>
                            <select className="w-full border-none bg-surface-container-low dark:bg-slate-800 dark:text-slate-200 rounded-lg text-xs py-2.5 outline-none focus:ring-1 focus:ring-teal-500/30">
                                <option>Tất cả sản phẩm</option>
                                <option>Tôm (Shrimp)</option>
                                <option>Cá (Fish)</option>
                                <option>Mực & Bạch Tuộc</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">Mức giá</label>
                            <select className="w-full border-none bg-surface-container-low dark:bg-slate-800 dark:text-slate-200 rounded-lg text-xs py-2.5 outline-none focus:ring-1 focus:ring-teal-500/30">
                                <option>Mọi mức giá</option>
                                <option>Dưới 100k đ/kg</option>
                                <option>100k - 500k đ/kg</option>
                                <option>Trên 500k đ/kg</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">AI Quality Score (Min 80%)</label>
                            <div className="flex items-center gap-3">
                                <input className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-teal-500" type="range"/>
                                <span className="text-[11px] font-bold text-teal-600">85%</span>
                            </div>
                        </div>
                        <div className="flex items-end h-full pt-5">
                            <button className="bg-teal-500 text-white font-bold text-xs py-2.5 px-6 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-teal-500/20">
                                Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="relative h-48 overflow-hidden">
                                <img alt="Tôm Thẻ Chân Trắng - Lô A24" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrVgbqBcQFTju3Tjhwk4J9CNZ7Xy7YkP1WzPo6u5I2WdvHegpXbmY2lrBDnpcRZCP1my-fdvNr4RNBd0S_bbC0XWSKrpp89Q90kr5ekpz_fFn_nCWnMyy_sZ0qKDR3HV5ZAnw_H_zF7nsxb5bVFPc2AHhJuk-NI1fnJ53JuWJ_KTVVoFxSFf9FmRzdQUGxiU-Hl5Pdf_JTeyJuGLrP_BhKt9Iu_V4pCPdQ1qOEAbXWm_BS-lNXr0EKfrE1R-xuVE0zrbpPNOasYnd8"/>
                                <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">AI VERIFIED</div>
                            </div>
                            <div className="p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Tôm Thẻ Chân Trắng - Lô A24</h3>
                                    <button className="text-slate-300 hover:text-teal-500 transition-colors">
                                        <span className="material-symbols-outlined text-xl">favorite</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span> Cà Mau
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Health Score</span>
                                        <span className="text-[11px] font-bold text-teal-500">98%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 h-full rounded-full" style={{width: '98%'}}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">185,000 đ<span className="text-xs font-normal text-slate-400">/kg</span></span>
                                    <div className="flex gap-2">
                                        <Link to="/negotiation" className="w-9 h-9 flex items-center justify-center border border-teal-500/20 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </Link>
                                        <Link to="/product" className="px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors">Chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="relative h-48 overflow-hidden">
                                <img alt="Cá Hồi Đại Dương" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRMgREXpmhrwI9FPM3alnnnsSBn3RoF04G7Irf0PMlbxplzU2icamdEqkSw3YeJ0BUEDTvUqS2Xnt_fqLlriguYbuhK0XX2pKmWGt8DJDqiXh84V4OpI9Ybw7GHphCUS1y0uIt8qTNp_wUd6FESlNCZEv3MGM3-puq8iPz9t_Ubk7Dh5Zj-lqXxWJ6yDR3VOtVHJ9-wfSs7bZ-MZYR0fjBD4eto65_hrZV7VMNJAIOcjejZAnrmQnNfStuWKePC_Vtl4FbroSQmIpR"/>
                                <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">PREMIUM QUALITY</div>
                            </div>
                            <div className="p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Cá Hồi Đại Dương - Nhập Khẩu</h3>
                                    <button className="text-slate-300 hover:text-teal-500 transition-colors">
                                        <span className="material-symbols-outlined text-xl">favorite</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span> Bạc Liêu
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Health Score</span>
                                        <span className="text-[11px] font-bold text-teal-500">94%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 h-full rounded-full" style={{width: '94%'}}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">420,000 đ<span className="text-xs font-normal text-slate-400">/kg</span></span>
                                    <div className="flex gap-2">
                                        <Link to="/negotiation" className="w-9 h-9 flex items-center justify-center border border-teal-500/20 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </Link>
                                        <Link to="/product" className="px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors">Chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="relative h-48 overflow-hidden">
                                <img alt="Cá Chẽm Phi Lê" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkUjglBOrponM-XpEPde-yrfW6f-tOGNi9qCPR-EaQbXaq-K2zc4kZahUN7t9BIvr7oTxf1_ypPAYw3L1NoqWQyTrvwXofNE94pHqQnhdYauwtP9Zze78BbcXRRHW4oKOEPkMmPPwfZjrFbl3skLyFnJF8w2JMS3kS233kcsEoauTGUtu5W-td8QmfGVS_FtFzpWtyLUG4IWAmtU2g8kUfQp0rhJp6J1EddJKAzas0w1Yg3kbWIRQsoKEkrbAdG21SxP7jwyEO0yO-"/>
                                <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">AI VERIFIED</div>
                            </div>
                            <div className="p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Cá Chẽm Phi Lê - Loại 1</h3>
                                    <button className="text-slate-300 hover:text-teal-500 transition-colors">
                                        <span className="material-symbols-outlined text-xl">favorite</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span> Kiên Giang
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Health Score</span>
                                        <span className="text-[11px] font-bold text-teal-500">92%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 h-full rounded-full" style={{width: '92%'}}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">210,000 đ<span className="text-xs font-normal text-slate-400">/kg</span></span>
                                    <div className="flex gap-2">
                                        <Link to="/negotiation" className="w-9 h-9 flex items-center justify-center border border-teal-500/20 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </Link>
                                        <Link to="/product" className="px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors">Chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="relative h-48 overflow-hidden">
                                <img alt="Mực Lá Đại" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvtXDqgcXou6nOcHb-tTb0mwsAK-ZjO25UosI3e7w5ioeQ84CuF2IA1rtbG3RsIDkDF9b7wcmwANFtPYfoP-9LKib1PQhwwXMfsQwffZrgzP45EfPqDpn_nH-kztt7U5dmJ674APGKBdx-5LlBPAAgvmVbl-R4rILkGsqZrUL3k3wAk5y9WNZ_KmesD_q-7Fl2SAe5LTV1bgQhvWwOwcxeAPq7ZJ-lRXnIzL1ekDS_kTqN63x5Foh24r8q_1dghKzUqJ_uFvpdkxKW"/>
                                <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">AI VERIFIED</div>
                            </div>
                            <div className="p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Mực Lá Đại - Lô B102</h3>
                                    <button className="text-slate-300 hover:text-teal-500 transition-colors">
                                        <span className="material-symbols-outlined text-xl">favorite</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span> Phú Quốc
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Health Score</span>
                                        <span className="text-[11px] font-bold text-teal-500">96%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-teal-500 h-full rounded-full" style={{width: '96%'}}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">350,000 đ<span className="text-xs font-normal text-slate-400">/kg</span></span>
                                    <div className="flex gap-2">
                                        <Link to="/negotiation" className="w-9 h-9 flex items-center justify-center border border-teal-500/20 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </Link>
                                        <Link to="/product" className="px-4 py-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors">Chi tiết</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* More Cards (Simulated scrolling content) */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm opacity-90">
                            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 animate-pulse">
                                <img alt="Tôm Update" className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8mRd3ivxGqdqE9DTU9H057LhaqZIaK-AKq4FLLDd9ru33tJ_5_kHwr_4rzHBD9V_PVopvGltz7205EVlWd8THQR89R-lqtsInLGbnjUBlyzZauXnfCybG5EwJdmz-lNxILAyKmmuCBdcF2a9fhT8lsctn2TCUIiLOIwu-cyqap5SUUBHj6Pu_lOEs-Ff7TqtU7VxoHfM8KkuWsywjuehh67Ao4qw-sKmCynjsBQgxKde8ytqAk1z_VWkwO40BZvF4k3_zrwQzs_Ly"/>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-400 mb-2 italic">Đang cập nhật lô hàng mới...</h3>
                                <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
                                <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-teal-500/5 shadow-sm opacity-90">
                            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 animate-pulse">
                                <img alt="Cá Update" className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3kryUN4fD2kSkf6Awc32__U_xU0cJicOSI2TN4tIm-yKoE8epB5eTC-dfYLHHOUk96Wff9Pln5UL8I4YwTvs9ONR46dPL1pDXvxB30D_hnkY0rRQA7iwHd9LDQLOMSQO-wiT8WdunjhjfmOBOSVS3gxeFd-JObf8-aB5tSK6wfChUTtJgK2qk8d1SvYnpI9PWJVDKV5omBdqiJ41DvIoUn9iFsOulAhTmgUA4q_lMWVWon-Fucp0f3e37jSp9SDr9BB1ApE2-ZWiW"/>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-400 mb-2 italic">Đang cập nhật lô hàng mới...</h3>
                                <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
                                <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full border-t border-teal-500/5 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center px-8 py-12 mt-auto">
                    <div className="mb-6 md:mb-0">
                        <div className="font-bold text-slate-800 dark:text-slate-100 mb-2">AquaTrade AI</div>
                        <p className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase">© 2024 AquaTrade AI. The Precision Hydrosphere.</p>
                    </div>
                    <div className="flex gap-8">
                        <Link className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase hover:text-teal-400 transition-colors" to="#">Terms of Service</Link>
                        <Link className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase hover:text-teal-400 transition-colors" to="#">Privacy Policy</Link>
                        <Link className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase hover:text-teal-400 transition-colors" to="#">Compliance</Link>
                        <Link className="font-['Inter'] text-[11px] tracking-wide text-slate-400 uppercase hover:text-teal-400 transition-colors" to="#">Contact</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Marketplace;
