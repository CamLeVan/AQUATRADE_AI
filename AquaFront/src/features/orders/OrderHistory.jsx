import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const OrderHistory = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col lg:ml-64 w-full overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-8">
                        <div>
                            <h1 className="text-2xl font-bold">Order History &amp; Evidence</h1>
                            <p className="text-sm text-slate-500">124 Verified Transactions this month</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                     
                                Export History
                            </button>
                            <button className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                                <span className="material-icons text-slate-500">notifications_none</span>
                            </button>
                        </div>
                    </header>

                    {/* Filters & Search */}
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                
                                <input className="w-full  bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Search Transaction ID, Product or Vendor..." type="text"/>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-medium">
                                    <option>Last 30 Days</option>
                                    <option>Last 3 Months</option>
                                    <option>Year 2023</option>
                                </select>
                                <select className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-medium">
                                    <option>All Status</option>
                                    <option>Confirmed</option>
                                    <option>Pending</option>
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white transition-all text-sm font-medium">
                                    <span className="material-icons text-sm">filter_list</span>
                                    More Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
                            {/* Transaction Card 1 */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300">
                                {/* Evidence Thumbnail */}
                                <div className="relative w-full md:w-56 h-40 flex-shrink-0">
                                    <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2zM6wJcYBErcbPk78f9fvYt5OuvzyVQOolEMJqgBH9ekQrcIdVE6ydPTYtGdYAQQFxZu5AoHKZd9eHvqWnu5LYx43Bmtg8mNXjuazfIBNA9GHisBiA54AVUC-XfO3rIcQRhiqkUZmzp9EO0ZF_aaGrAau8r5-RHTNlA1N4xOgDmIvNL2MtTLjf84r2bNR8DjXBJyQ2pVM14sC2YMR2JtM9fFb-_uTiX2PS0lcwof39r95MRy256NW6QfPGJd_5pwT8c2xzlyn7rai"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 rounded-lg">
                                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                            <span className="material-icons text-[12px]">verified</span>
                                            AI Verified
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-primary/90 text-slate-900 px-2 py-1 rounded text-[10px] font-bold">
                                        99.8% Match
                                    </div>
                                </div>
                                {/* Data Grid */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Transaction ID</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">#AQ-88291</p>
                                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full text-[10px] font-bold">CONFIRMED</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Product &amp; Weight</p>
                                        <p className="font-medium">Bluefin Tuna (Grade A)</p>
                                        <p className="text-sm text-slate-500">142.5 kg</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Date &amp; Time</p>
                                        <p className="font-medium">Oct 24, 2023</p>
                                        <p className="text-sm text-slate-500">14:20 PM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Total Amount</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">$12,400.00</p>
                                        <p className="text-xs text-slate-400">Escrow Secured</p>
                                    </div>
                                </div>
                                {/* Action Menu */}
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">visibility</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Evidence</span>
                                    </button>
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">receipt_long</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Receipt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Transaction Card 2 */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300">
                                <div className="relative w-full md:w-56 h-40 flex-shrink-0">
                                    <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH_MZUsdQnWaHvRNPiTT--HjeIH4K80MOOa4aceQHNFCJI4fzvr62UXx8mBpSHNFd6OtzJtUQTZfKsKfzOgMTSNsjdtAKqBAK9hVjeMFOnjoSh1okj33_ImaxZjc1NWLg-HFMYPa_041gILKGT7eoH5nDWpdiYZlG1SQc3DvAjaOc6uhrtZHPwryEtHM9f-jC4R259daCbXh_eELuU_dNZvT-rLIIn5a6EQOI2IXNVrCFq2ZLOz79BhNQ34pATiuhF_C6ez_6cI8Yi"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 rounded-lg">
                                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                            <span className="material-icons text-[12px]">verified</span>
                                            AI Verified
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-primary/90 text-slate-900 px-2 py-1 rounded text-[10px] font-bold">
                                        97.4% Match
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Transaction ID</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">#AQ-87944</p>
                                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full text-[10px] font-bold">CONFIRMED</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Product &amp; Weight</p>
                                        <p className="font-medium">Tiger Prawns (Frozen)</p>
                                        <p className="text-sm text-slate-500">500.0 kg</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Date &amp; Time</p>
                                        <p className="font-medium">Oct 22, 2023</p>
                                        <p className="text-sm text-slate-500">09:15 AM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Total Amount</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">$8,750.00</p>
                                        <p className="text-xs text-slate-400">Paid</p>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">visibility</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Evidence</span>
                                    </button>
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">receipt_long</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Receipt</span>
                                    </button>
                                </div>
                            </div>

                            {/* Transaction Card 3 */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300">
                                <div className="relative w-full md:w-56 h-40 flex-shrink-0">
                                    <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD55_Kgen6WRhpLwrF2IOsIVjlchVICurgAvEy1A59aREGgBszSx_HZzONvv9PyIVEn0SmHhkKS3bpbBhIIfLRVVRE6TgJMd3L01C4kCP7ekV4TQqBun3jLa3BoHa1nRFIb9wsjFyBqI5Cc8Hek7-l8ivnzZNriaH_LGGvCMe5zZHJGvo8jJOlp8O-eNCp9O40-Cpb_S0G3cDt7HPx6uIqD7cUmwWo0iUr6QjkrZQbZnZD9KdHWDOmYSoIiAreQpNqYMy8J616VAorr"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 rounded-lg">
                                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                            <span className="material-icons text-[12px]">verified</span>
                                            AI Verified
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-primary/90 text-slate-900 px-2 py-1 rounded text-[10px] font-bold">
                                        99.1% Match
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Transaction ID</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">#AQ-87602</p>
                                        <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full text-[10px] font-bold">CONFIRMED</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Product &amp; Weight</p>
                                        <p className="font-medium">Atlantic Salmon</p>
                                        <p className="text-sm text-slate-500">210.0 kg</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Date &amp; Time</p>
                                        <p className="font-medium">Oct 19, 2023</p>
                                        <p className="text-sm text-slate-500">11:45 AM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Total Amount</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">$5,620.00</p>
                                        <p className="text-xs text-slate-400">Escrow Secured</p>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">visibility</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Evidence</span>
                                    </button>
                                    <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all text-slate-600 group">
                                        {/* <span className="material-icons text-xl group-hover:scale-110 transition-transform">receipt_long</span> */}
                                        <span className="block text-[10px] font-bold mt-0.5">Receipt</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Pagination-like controls */}
                        <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 pb-12">
                            <p className="text-sm text-slate-500">Showing 1 to 3 of 124 transactions</p>
                            <div className="flex gap-2">
                           
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white transition-all">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white transition-all">3</button>
                                <span className="px-2 self-end pb-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white transition-all">42</button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Insights Sidebar */}
                <aside className="w-80 bg-white dark:bg-background-dark border-l border-slate-200 dark:border-slate-800 p-6 hidden xl:block">
                    <h3 className="text-lg font-bold mb-6">AI Evidence Log</h3>
                    <div className="space-y-6">
                        {/* Trust Stat Card */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Network Average Match</p>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold">98.4%</span>
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[98.4%]"></div>
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-tighter">Recent Verification Events</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-1 bg-primary rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-semibold">Image Hash Generated</p>
                                        <p className="text-xs text-slate-400">Transaction #AQ-88291</p>
                                        <p className="text-[10px] text-slate-500 mt-1">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-semibold">Metadata Validated</p>
                                        <p className="text-xs text-slate-400">Vendor: OceanPurity Ltd.</p>
                                        <p className="text-[10px] text-slate-500 mt-1">15 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-semibold">GPS Coordinates Confirmed</p>
                                        <p className="text-xs text-slate-400">Port of Tokyo, JP</p>
                                        <p className="text-[10px] text-slate-500 mt-1">1 hour ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ad/CTA */}
                        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Upgrade Account</p>
                                <h5 className="text-lg font-bold mb-2 leading-snug">Get Real-time GPS Fleet Tracking</h5>
                                <p className="text-xs text-slate-400 mb-6">Trace your seafood from catch to delivery with blockchain proof.</p>
                                <button className="w-full bg-primary text-slate-900 font-bold py-2 rounded-lg text-sm">View Plans</button>
                            </div>
                            {/* Abstract Background Pattern */}
                            <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                                <span className="material-icons text-[120px]">tsunami</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default OrderHistory;
