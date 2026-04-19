import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';
import AdminLayout from '../layout/AdminLayout';

const Postings = () => {
    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline uppercase">Post & Update Center</h2>
                        <p className="text-slate-500 mt-1 uppercase tracking-widest text-[11px] font-semibold">Live Market Feed • AI Assisted</p>
                    </div>
                </section>
                    {/* Summary Stats: Bento Grid Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Active Listings</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">42</h3>
                                <span className="text-xs font-bold text-cyan-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span> +12%
                                </span>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Pending AI Verification</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">08</h3>
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white animate-pulse"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Low Stock Alerts</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-3xl font-black text-error">03</h3>
                                <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Quick Price Update Section */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Cập nhật giá nhanh</h4>
                                <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded">LIVE MARKET FEED</span>
                            </div>
                            <div className="bg-surface-container-lowest rounded-xl border border-primary/5 shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-primary/5">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Product / Batch</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Current Price</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">24h Change</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        <tr className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="min-w-[40px] w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-primary/10">
                                                        <img alt="Tôm Thẻ" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiktXAUFb4_OwAcmvzDdJUaJKxPlXnm0q2X5SJvctsQCJtBADPqxJh32zkR9q7E8iBcLoBH_fjnOMn1ad0sK0aybERxiiyYoPqTv5dTlhlUCFwQopcS7ghdBB_QEa_VeT0NpHb4ciQSVcu69fE3BQ5g6ssIWqiLdub_iez7SLPmCSz2kBTthwN0-ZwHOc7p_8D8GDJ9bDBBpbMfkUO_AOJOfbE8W8Bcr12XmS8zHmGTRYd_LDAD0BduqXhGwnL93xpcp8Rnx5XXVV0"/>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Tôm Thẻ Chân Trắng</p>
                                                        <p className="text-[10px] font-medium text-slate-400">#AQ-S-109</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">185,000 ₫/kg</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-emerald-500 whitespace-nowrap">+2.4%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input className="w-24 px-2 py-1 text-xs border border-transparent bg-surface-container rounded focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="185,000"/>
                                                    <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                                                        <span className="material-symbols-outlined text-sm">save</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="min-w-[40px] w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-primary/10">
                                                        <img alt="Cá Tra" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUGoZ1AXyr6-0vbcHwjfKPA94_w3r9YcoYLB8qT7eOq9Mwj_Rw1f0yThw_glQDjuR4joN5B03ws1b8a2gqJQI6mWOUdJ74KIdTOPsDVNnJ3OCQE7i6byvm1E-faaSinK8lMem6YmsyvJWg4YtpXD5Gxt1sgbvLL4hiYc79jDvfD8DjR277T4sk3i1BNwNEPzm4MqwDPV2_edrTxaUyra3CjrsZpolN63BFGFTaHG8qTtc3IrRnKOztyNenxZt4FBDok8cn7ndLNrKT"/>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Cá Tra Xuất Khẩu</p>
                                                        <p className="text-[10px] font-medium text-slate-400">#AQ-P-042</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">42,000 ₫/kg</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-error whitespace-nowrap">-0.8%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input className="w-24 px-2 py-1 text-xs border border-transparent bg-surface-container rounded focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="42,000"/>
                                                    <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                                                        <span className="material-symbols-outlined text-sm">save</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="min-w-[40px] w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-primary/10">
                                                        <img alt="Mực Lá" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDShSVVSNiqAPlGd_QtpYGigLDBdJh8WYmmv-prLhjR6xqXXWkClTZEliIL_uImezcAVrsyTKd9PI7pBpiRocUnCwqW30z9WEuECXu1JwUfsEaSb_2PSCMCzh--_YvshBPzJE4V5WSrYnoJuLsps_xe-MlcBo8A0Z35wokFTvpLLxuJgPkliUuiNY-ULK-0loQ6Z3E9ziC0RGeIlkCW5A6ihP26rVPKSdYYJ3FMF-ljYCfkQVEPw0LyRuylq1b29tr86-f5srJDvOII"/>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">Mực Lá Loại 1</p>
                                                        <p className="text-[10px] font-medium text-slate-400">#AQ-M-003</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">310,000 ₫/kg</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">0.0%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <input className="w-24 px-2 py-1 text-xs border border-transparent bg-surface-container rounded focus:ring-1 focus:ring-primary outline-none" type="text" defaultValue="310,000"/>
                                                    <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                                                        <span className="material-symbols-outlined text-sm">save</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* AI Posting Form Section */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Đăng tin mới (AI Powered)</h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-primary tracking-widest">AI ACTIVE</span>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest rounded-xl border border-primary/10 shadow-lg p-6 space-y-6">
                                {/* Image Upload / Detection Area */}
                                <div className="relative aspect-video rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center group hover:bg-primary/10 transition-all cursor-pointer overflow-hidden">
                                    {/* Visual AI Overlay Mockup */}
                                    <div className="absolute inset-0 z-10 pointer-events-none p-4 opacity-80">
                                        <div className="absolute top-1/4 left-1/3 w-32 h-16 border-2 border-primary rounded shadow-[0_0_15px_rgba(19,236,200,0.5)]">
                                            <div className="bg-primary text-on-primary text-[8px] font-black px-1 py-0.5 absolute -top-4 -left-0.5 rounded-sm">GRADE A (98%)</div>
                                        </div>
                                        <div className="absolute bottom-1/4 right-1/4 w-24 h-20 border-2 border-white/40 rounded"></div>
                                    </div>
                                    <img alt="AI Scanning" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAZqX5mEXHWOJ9Y2iltC60c93dWbkZYaofCb8QjLvB1D8B0PkozZJhsgsn4AE-AKa6YQ21x0m_GVRv6DSFBrqHUJEegZrrgXonHIM2PmMZ_9uqAehpeR-o1NAtSHbda3unaRCtw6hmzDnNH23yEjmWESo90obCZ9rp8KDQAuJ0bD4uEZAMZPQsyceFf_8FnR49_2tDqTV4DwhXA6ttgHIR-2JiOXAJ03GdUeJGvhVYZiqV09HAWLzGy6fe1jmClYe3YK_feDxjSt_5"/>
                                    <div className="relative z-20 flex flex-col items-center text-center px-8">
                                        <span className="material-symbols-outlined text-4xl text-primary mb-2">add_a_photo</span>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag & drop product photo for AI scanning</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                                
                                {/* Form Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                                        <div className="relative">
                                            <input className="w-full bg-surface-container border-none rounded-lg text-sm font-bold text-slate-800 dark:text-slate-100 py-3 px-4 focus:ring-2 focus:ring-primary outline-none" type="text" defaultValue="Cá Hồi Nauy (Norwegian Salmon)"/>
                                            <span className="absolute right-3 top-3 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">AI SUGGESTED</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                                        <input className="w-full bg-surface-container border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400" placeholder="50.0" type="number"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</label>
                                        <input className="w-full bg-surface-container border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-slate-800 dark:text-slate-100" type="text" defaultValue="Norway"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                                        <select className="w-full bg-surface-container border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-slate-800 dark:text-slate-100">
                                            <option value="A">Grade A (Premium)</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Set Starting Price (₫)</label>
                                        <input className="w-full bg-surface-container border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-primary outline-none font-bold text-cyan-600 placeholder:text-cyan-600/50" placeholder="250,000" type="text"/>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Market</label>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-[10px] font-black border border-primary/20 transition-all">DOMESTIC</button>
                                        <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">EXPORT</button>
                                        <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">WHOLESALE</button>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                    Publish To Marketplace
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent History / Logs */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Lịch sử cập nhật gần đây</h4>
                            <button className="text-xs font-bold text-cyan-500 hover:underline">View All History</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="min-w-[32px] w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Batch #AQ-S-109 updated</p>
                                        <p className="text-[10px] text-slate-400">Price changed from 182k to 185k • 2 mins ago</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase hidden sm:inline">SYSTEM</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="min-w-[32px] w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Verified New Batch #AQ-C-088</p>
                                        <p className="text-[10px] text-slate-400">Species identified: Pangasius • 1 hour ago</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase hidden sm:inline">AI BOT</span>
                            </div>
                        </div>
                    </div>
                    
                    <Footer />
            </div>
            
            {/* Float FAB for New Action (Contextual) */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            </button>
        </AdminLayout>
    );
};

export default Postings;
