import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

const SupportCenter = () => {
    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen selection:bg-primary/30 font-['Inter']">
            <Sidebar/>

            {/* Main Content Area */}
            <main className="ml-64 min-h-screen flex flex-col relative">
                {/* TopNavBar */}
                <header className="fixed top-0 right-0 w-[calc(100%-256px)] z-40 flex justify-between items-center px-8 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-cyan-500/10">
                    <div className="flex items-center gap-8">
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 hidden md:block">Support Center</h2>
                        <div className="hidden md:flex gap-6">
                            <Link className="font-sans text-[14px] tracking-tight font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/5 transition-colors duration-200" to="/marketplace">Marketplace</Link>
                            <Link className="font-sans text-[14px] tracking-tight font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/5 transition-colors duration-200" to="/admin/analytics">Analytics</Link>
                            <Link className="font-sans text-[14px] tracking-tight font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/5 transition-colors duration-200" to="/orders">Logistics</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-cyan-500/5 transition-colors duration-200">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-cyan-500/5 transition-colors duration-200">
                            <span className="material-symbols-outlined text-slate-600">help_outline</span>
                        </button>
                        <img alt="User Profile Avatar" className="w-8 h-8 rounded-full border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7DiUvv0Uun9bVxwbaEkJkuJ_kzgEPbl8whv9Tz1c27wYCExRndcjmE-p-o4a6KgZ9BBdbW9JTs2TlpTmQzHB0WNun3DqQBKQI61bq7Kjuz6Ca8g8ht1N3bMoWO-ycgNJL6miuEfio6SD_bDiPJaut8l5It8csn2v8pHNTK6UwfJzCJwDPZkG9iBhvX93Hy-CO4gGEldF-PjWC111SqOojbCroJ22RaQKSa6ylsRdAa3y_ZKXkEWaRDWdg5JbO0pVd_3uKpPiVzUes"/>
                    </div>
                </header>

                <div className="pt-16 flex-1 flex flex-col">
                    {/* Hero Section */}
                    <section className="relative h-80 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOmJvHz8AGExH8rPDCH2k5sAJjXNOQcXNKu1bNIazgfuM5eQClUNLeN3IS9xyNuC_gkckf8RazJM0oFUOZv-vLA4Dsda2SoM8axOJ-l6dXwDMCMnffAv5nVUAlV42l67mWiBy6R5BmHhqFHYo0HloH8uZ00Cgam8KfOjaI-_deEhd6ll6INMU3WAcJnD7IiE0txmMVX6aEnaK3wo6MCozhDYAqllF3xIIGwrOhXyXjFQ75a7xEZ-UeZJzYgXLRtyn0kO2hvGx3lHVN')"}}></div>
                        </div>
                        <div className="relative z-10 w-full max-w-3xl px-8 text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">How can we help you today?</h1>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">search</span>
                                </div>
                                <input className="w-full h-16 pl-14 pr-6 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-all shadow-2xl" placeholder="Search for articles, guides, or help topics..." type="text"/>
                            </div>
                        </div>
                    </section>
                    
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        {/* Help Categories Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            <div className="group p-8 bg-surface-container-lowest rounded-xl border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Account & Profile</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Manage your credentials, security settings, and personal data.</p>
                            </div>
                            <div className="group p-8 bg-surface-container-lowest rounded-xl border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Payments & Billing</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Invoices, payment methods, and subscription management.</p>
                            </div>
                            <div className="group p-8 bg-surface-container-lowest rounded-xl border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined">psychology</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">AI Tools & Reports</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Optimization guides, predictive reports, and API documentation.</p>
                            </div>
                            <div className="group p-8 bg-surface-container-lowest rounded-xl border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined">local_shipping</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Logistics & Shipping</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Tracking international cargo, customs forms, and port data.</p>
                            </div>
                        </div>

                        {/* Trending Content & Contact Asymmetric Layout */}
                        <div className="flex flex-col lg:flex-row gap-12 mb-16">
                            {/* Trending Articles */}
                            <div className="lg:w-2/3">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Trending Articles</h2>
                                    <a className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" href="#">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400">description</span>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">How AI Quality Score is calculated</h4>
                                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Analytics • 5 min read</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                    </div>
                                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400">description</span>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">Track your international shipment</h4>
                                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Logistics • 3 min read</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                    </div>
                                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400">description</span>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">Resetting your 2FA</h4>
                                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Security • 4 min read</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                    </div>
                                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/5 hover:bg-primary/5 transition-colors flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-slate-400">description</span>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">Bulk Order API Integration</h4>
                                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Developers • 8 min read</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Support Sticky Card */}
                            <div className="lg:w-1/3">
                                <div className="sticky top-8">
                                    <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                                        <h2 className="text-2xl font-bold mb-6 relative z-10">Still need help?</h2>
                                        <p className="text-slate-400 mb-8 relative z-10 text-sm leading-relaxed">Our specialized AI logistics experts are available 24/7 to assist with your global trade requirements.</p>
                                        <div className="space-y-4 relative z-10">
                                            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-primary">chat</span>
                                                    <span className="font-bold text-sm">Live Chat</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span className="text-[10px] text-emerald-500 font-bold tracking-widest">ONLINE</span>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                                <span className="material-symbols-outlined text-primary">mail</span>
                                                <span className="font-bold text-sm">Email Support</span>
                                            </button>
                                            <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg text-sm uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all">
                                                Open a Support Ticket
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Stats Bento Item */}
                                    <div className="mt-6 bg-surface-container p-6 rounded-xl border border-primary/5 flex items-center justify-around text-center">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Avg Response</p>
                                            <p className="text-lg font-bold text-slate-800">2.4m</p>
                                        </div>
                                        <div className="w-px h-8 bg-primary/10"></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Satisfaction</p>
                                            <p className="text-lg font-bold text-slate-800">99.2%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Footer/>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SupportCenter;
