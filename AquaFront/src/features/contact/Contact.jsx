import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import QR_Zalo from '../../assets/IMG_2794.JPG';

const Contact = () => {
    return (
        <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen flex overflow-hidden antialiased font-display">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-y-auto min-h-screen">
                {/* TopAppBar Shell */}
                <header className="flex items-center justify-between px-8 w-full z-40 h-16 border-b border-cyan-500/5 sticky top-0 bg-white/70 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-sm font-icon">search</span>
                            <input className="pl-10 pr-4 py-1.5 bg-surface-container border-none rounded-full text-[11px] tracking-widest focus:ring-1 focus:ring-primary/30 w-64 outline-none" placeholder="SEARCH LOGISTICS DATA..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-500 hover:text-cyan-500 transition-all">
                            <span className="material-symbols-outlined font-icon">notifications</span>
                        </button>
                        <button className="text-slate-500 hover:text-cyan-500 transition-all">
                            <span className="material-symbols-outlined font-icon">help_outline</span>
                        </button>
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20">
                            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3aauUvThGRVwF0DMiw9mZjUtUIpX2tK6YUVEeeCHnVsU67BtswnUaQdN_w2ZSejJVqXI0OgfUTuumisH26AFkJUwsrgxt305NiDWrq-r_rCZ8m-YQRKTHNIuVZozxAU694n3YMIYaigZrri9DdtteraBucEBkSbH0SVyk2xFsuFvwbydhO0bV0GpslxWusjvnTol8vWvVSe13URFq_QkrreiT2KWKHtEtd9qceIUBL8zSu5pplOIxXNHJPftiX4YIOAJkXdRJfdL5" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col">
                    <div className="flex-1 p-8 md:p-12 space-y-12 max-w-7xl mx-auto w-full">
                        {/* Hero Section */}
                        <section className="relative rounded-3xl overflow-hidden aspect-[21/9] flex items-center px-12 group">
                            <img alt="Network glowing lines" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JatxuB9GjycRh3mq3kHN2YzyFmehBCu3OZlizmCR4bb_0C8yGaVOfMuNnnGnyOi2_RuKiFRsjuksuu5eYvJUsEWO2WEXMxDg0dOQu27VLKuSh_K4QqZwHKrQUW4agUCopSQp0h4WLOi1iDAUgET0ZuGvMMYLtMBRlyQkk0pJFJewQaOgwC35mytpKzwFpIsvLP8VDjR7mpd3POdlEUSDD9P-m_WHX2q-ajN-udeFEN59poimGCnwgTmxFr5yxviBfMKKpxdZzQDj" />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
                            <div className="relative z-10 max-w-2xl">
                                <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Ecosystem Connectivity</span>
                                <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">Join the <span className="text-primary italic">AquaTrade</span> Community</h1>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">Connect with industry leaders, AI logistics experts, and precision trade partners in our exclusive digital hubs.</p>
                            </div>
                        </section>

                        {/* Community Hubs & QR Section */}
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* QR Code Central Card */}
                            <div className="lg:col-span-5 bg-surface-container-lowest p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:bg-primary/10"></div>
                                <div className="relative p-6 bg-white rounded-2xl shadow-xl border border-slate-100 mb-8 transform transition-transform group-hover:rotate-2">
                                    <img alt="QR Code" className="w-48 h-48" src={QR_Zalo} />
                                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary shadow-md">
                                        <span className="material-symbols-outlined text-lg font-icon">qr_code_2</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Scan to join our official Zalo group</h3>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">Instant updates, network alerts, and direct peer-to-peer logistics coordination.</p>
                            </div>

                            {/* Modern Community Links */}
                            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <a className="group bg-surface-container-lowest p-8 rounded-3xl border border-primary/5 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-lg" href="https://zalo.me/..." target="_blank" rel="noreferrer">
                                    <div className="w-12 h-12 rounded-xl bg-[#0068ff]/10 flex items-center justify-center text-[#0068ff] mb-12 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined font-icon">forum</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 block">Live Messaging</span>
                                        <h4 className="text-xl font-bold text-slate-800">Official Zalo</h4>
                                        <p className="text-xs text-slate-500 mt-2">Real-time support and community broadcasts.</p>
                                    </div>
                                </a>
                                <a className="group bg-slate-900 p-8 rounded-3xl border border-white/5 flex flex-col justify-between hover:bg-slate-800 transition-all hover:shadow-2xl" href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-12 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined font-icon">groups</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black tracking-widest text-primary/60 uppercase mb-1 block">Social Network</span>
                                        <h4 className="text-xl font-bold text-white">Facebook Community</h4>
                                        <p className="text-xs text-slate-400 mt-2">Exclusive discussions and strategy sharing.</p>
                                    </div>
                                </a>
                                <div className="sm:col-span-2 bg-primary/5 border border-primary/10 p-8 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ul8yvGM1cxuq9S-jqYLwe7fUX25FUbPTxUzDtNhqBIOiPEqmmpJ30urXtoqBRfVuLRGm4EfXsKl_QeyX5OYl_geJqD4FWFfwxDqTgHaLAi8k-YqvNTKowhO1kot7EpkPTwq2mDEaJLjMT7kgsJzmcTR2E8kz6N939Z5icNvrDR6VJRzzvDYxMKYjvJ-yEwSMTczaxnf-qjqg4mSyuTawWnmG3TWJ_SfHQePcPNl8QouYDS7pTFCvryjh5XFFAvnAJFxqtMEMdwzH" />
                                            <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC828XKkRyn8uniWaC8EY2pYv0UaPG70I0XANRNPlUlCJK1hL2ETDYPf-k09y262y6nWcfGWP2ieooGkhV0gisW-9Ni3HqRprrmHw86EMatQPYl-tO_Eu_PwpWaEQO83_KI2TBuJjoKnuIR3OraaUR0Vz3yxlE232sotcEVJGl8oWAOtcvLBRfxdvaPSyxwmM8h0arJ1IIm_2otw-di-WTfSySvtMbgRZany7cDzuEeJkm7UsJrZnj_NubTGB2EglD2TSIftRKnedb_" />
                                            <img alt="Member" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw_M_vJNDLUmIZphVYNauXwJK3KiPgacFZu4TGaHZlJr4bQKVLSkkDydWMVUc0PBgdpwNtgIsNJyH6fzuk5ht_6Fhzt6s4rwc40XkD486x7HvFzYUsN_T3LmpWvXuqNw4hSZzBq5RL4NwnzYWyil92xTNCJHxOfXWESiOXgAm5mVqgrf3YEV57vUz2KPLWdEoi5KTj693td2mJyK3uwP_kRSlLuxWJoTrKhdO7mzv9RPphlvogfAUOEjqcExxb6A-LHhMourJi9acP" />
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold">+12k</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">12,400+ Active Members</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Global Trade Logistics Network</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-primary animate-pulse font-icon">bolt</span>
                                </div>
                            </div>
                        </section>

                        {/* Contact Information Grid */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Direct Inquiry Channels</h2>
                                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase hidden sm:block">Laboratory Precision Support</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Support Email */}
                                <div className="bg-surface-container-low p-8 rounded-2xl group hover:bg-surface-bright transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-primary mb-6 block font-icon">alternate_email</span>
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Support Email</h5>
                                    <p className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors">longthanhnct@gmail.com</p>
                                    <p className="text-[11px] text-slate-500 mt-2">Expect a response within 2-4 precision hours.</p>
                                </div>
                                {/* Hotline */}
                                <div className="bg-surface-container-low p-8 rounded-2xl group hover:bg-surface-bright transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-primary mb-6 block font-icon">call</span>
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logistics Hotline</h5>
                                    <p className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors">+84 (0)888 354 357</p>
                                    <p className="text-[11px] text-slate-500 mt-2">Mon - Fri: 08:00 - 18:00 (GMT+7)</p>
                                </div>
                                {/* Office Address */}
                                <div className="bg-surface-container-low p-8 rounded-2xl group hover:bg-surface-bright transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-primary mb-6 block font-icon">location_on</span>
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">HQ Address</h5>
                                    <p className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">Hoa Hai,Ngu Hanh Son,TP.Da Nang</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Contact;
