import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const Negotiation = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            {/* Shared Sidebar Component */}
            <Sidebar />

            <main className="lg:ml-64 w-full max-w-full p-6 h-screen pb-24 flex flex-col">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* Left Column: Product Analysis */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 h-full">
                        {/* Breadcrumbs & Title */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                                <span>Marketplace</span>
                                <span className="material-icons text-[12px]">chevron_right</span>
                                <span>Bluefin Tuna</span>
                                <span className="material-icons text-[12px]">chevron_right</span>
                                <span className="text-primary">AT-88291</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl font-bold dark:text-white">Atlantic Bluefin Tuna - Grade A+</h1>
                                    <p className="text-slate-500 text-sm mt-1">Origin: Tsukiji Select, JP | Caught: 14h ago | SKU: BFT-2024-X9</p>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs font-bold text-primary">AI ANALYSIS ACTIVE</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Image Detection Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0">
                            <div className="relative group">
                                {/* Detection Overlay Containers */}
                                <div className="absolute inset-0 z-10 p-8 pointer-events-none">
                                    {/* Detection Box 1 */}
                                    <div className="absolute top-[25%] left-[20%] w-32 h-32 border-2 border-primary rounded-lg shadow-[0_0_15px_rgba(19,236,200,0.4)] pointer-events-auto cursor-help group-hover:scale-105 transition-transform">
                                        <span className="absolute -top-6 left-0 bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Eye Clarity: 98%</span>
                                    </div>
                                    {/* Detection Box 2 */}
                                    <div className="absolute top-[45%] left-[50%] w-48 h-24 border-2 border-primary/60 rounded-lg shadow-[0_0_15px_rgba(19,236,200,0.2)] pointer-events-auto cursor-help group-hover:scale-105 transition-transform">
                                        <span className="absolute -top-6 left-0 bg-primary/80 text-background-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Gills Color: Optimal</span>
                                    </div>
                                </div>
                                <img alt="Fresh Bluefin Tuna" className="w-full h-[400px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWNwMh2L-yJZJpPYkWxJDcu1t12eXWlRE9TJdVnPM-HYH1CzcIh3Piiv1zSM4P2B7wINS7TdJWOIWCfJIq3WBzVIPYSzL7tUo2Gx5JTBwTQm2T_PNjvA9QfA_ri1_9_Jr-f3dV3N5Jv9i6IZYwksJsKGf1MvPvbkOJCtzS3B4xin3wfFaioEJ8gzo0Rnutw2w3ubHDqmo6JWwz4ZiEytT8uvgOnVNlUvde8obaEMALGjq-tCaTuRufT9kRtd6JAoy4dh2Y3MVyTxDa"/>
                                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                                    <button className="bg-background-dark/60 backdrop-blur-md text-white p-2 rounded-lg hover:bg-primary hover:text-background-dark transition-all">
                                        <span className="material-icons text-sm">zoom_in</span>
                                    </button>
                                    <button className="bg-background-dark/60 backdrop-blur-md text-white p-2 rounded-lg hover:bg-primary hover:text-background-dark transition-all">
                                        <span className="material-icons text-sm">layers</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weight</span>
                                    <span className="text-lg font-bold">242.5 kg</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quality Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-primary">9.4</span>
                                        <span className="text-xs text-slate-500">/ 10</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Est. Yield</span>
                                    <span className="text-lg font-bold">68.2%</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fat Content</span>
                                    <span className="text-lg font-bold">High (Otoro)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Analysis Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex-shrink-0">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="material-icons text-primary">insights</span>
                                    Market Price Analysis
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-xs text-slate-400">Currency: <span className="text-slate-900 dark:text-white font-medium">USD / kg</span></span>
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                            <th className="pb-3">Metric</th>
                                            <th className="pb-3">Market Avg</th>
                                            <th className="pb-3">Global High</th>
                                            <th className="pb-3 text-right">Recommended Bid</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <td className="py-4 font-medium">Standard Grade</td>
                                            <td className="py-4 text-slate-500">$32.50</td>
                                            <td className="py-4 text-slate-500">$48.00</td>
                                            <td className="py-4 text-right font-bold text-slate-700 dark:text-slate-300">$34.20</td>
                                        </tr>
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <td className="py-4 font-medium">Tsukiji Premium</td>
                                            <td className="py-4 text-slate-500">$85.00</td>
                                            <td className="py-4 text-slate-500">$112.00</td>
                                            <td className="py-4 text-right font-bold text-slate-700 dark:text-slate-300">$92.50</td>
                                        </tr>
                                        <tr className="bg-primary/5 rounded-lg">
                                            <td className="py-4 px-2 font-bold text-primary">This Asset (AI Adjusted)</td>
                                            <td className="py-4 text-slate-500">$88.20</td>
                                            <td className="py-4 text-slate-500">$105.00</td>
                                            <td className="py-4 px-2 text-right font-extrabold text-primary text-lg">$94.80</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-background-light dark:bg-slate-800/30 rounded-lg flex items-start gap-3 border border-slate-200 dark:border-slate-800">
                                <span className="material-icons text-primary text-xl">tips_and_updates</span>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                    <strong className="text-slate-900 dark:text-slate-200">AI Insight:</strong> Based on the 9.4 freshness score and current scarcity of High-Fat Otoro in the Tokyo market, a bid within <span className="font-bold text-primary">$93.50 - $96.00</span> is likely to be accepted with high priority.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Negotiation Chat */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img alt="Seller" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4uD3T6vGZzSmUCd1zcsfgYtKpVW3RO3XrWB0FDpBsarviNOn9uQUH7woh1j5_1g-SzEAWsOUCdijk2FDz_8QtCRbJsyvCIGXf0_St9c0MEydNgxmcNHXkUBlrsFanUpf6WIxIObHvflAFma3QQ8izTZeT1bFWJnOBUGRwwoIlcDh3tMzaKKOYOIoQfpWym6qkSADXS2HU5S8KJT6QxDIH2mdFJatA-4gWYPq5pjd-QEieKrdjXU7iEnGMZGK9X-os8j-KNLeLtuRa"/>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-white dark:border-slate-900 rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold dark:text-white leading-none">Hiroshi Tanaka</h4>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Verified Seller • 4.9 <span className="material-icons text-[10px] text-yellow-400">star</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-icons text-xl">videocam</span>
                                </button>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <span className="material-icons text-xl">info</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                            {/* Date Divider */}
                            <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">Today</span>
                            </div>

                            {/* Message Seller */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0">
                                    <img alt="Seller" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa-w5jrq_DdIZ3pILQwXO3ZEW3bi6oaENhi5Nd3rT61nj6HTTNgZnahKcJcuM0Roa5M5IpsSY45da0Hy6GHMjQBvFNDOh7Z2miGsgSRi-DFcdA6KoEGNaq38_pXYxNck7Weeq0_nwIAjxYMp_SPpGIG6wE-OH3lIb3F3w4Zo9JrCgY15ipFGQ3spIimqGQGGW05-Yyj-E2e6iyu2xNg754h4Eu1cAhflBErXTG3BsQ2_NdtJU7dVqtfcCvuCi_gB8Vh88keuLTmMEl"/>
                                </div>
                                <div className="flex flex-col gap-1 max-w-[80%]">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-tr-xl rounded-b-xl">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">Welcome back. The Tuna just arrived from the morning auction. The fat marbling is exceptional on this one.</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 ml-1">09:12 AM</span>
                                </div>
                            </div>

                            {/* Message Buyer (Self) */}
                            <div className="flex items-start gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                                    <span className="material-icons text-background-dark text-sm">person</span>
                                </div>
                                <div className="flex flex-col gap-1 max-w-[80%] items-end">
                                    <div className="bg-primary text-background-dark p-3 rounded-tl-xl rounded-b-xl font-medium">
                                        <p className="text-sm">I see the AI score is high. I'm looking to secure this for our weekend tasting event. What's your firmest price per kg?</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mr-1 flex items-center gap-1">09:15 AM <span className="material-icons text-[10px] text-primary">done_all</span></span>
                                </div>
                            </div>

                            {/* System/Offer Widget */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden my-2">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Incoming Counter-Offer</span>
                                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Expires in 14m</span>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-black dark:text-white">$97.50<span className="text-sm font-normal text-slate-400 ml-1">/kg</span></p>
                                            <p className="text-xs text-slate-500">Total: $23,643.75 USD</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Volume</p>
                                            <p className="text-sm font-bold">242.5 kg</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded font-bold text-xs hover:bg-slate-50 transition-colors">DECLINE</button>
                                        <button className="bg-primary text-background-dark py-2 rounded font-bold text-xs hover:shadow-lg hover:shadow-primary/20 transition-all">ACCEPT OFFER</button>
                                    </div>
                                </div>
                            </div>

                            {/* Message Seller */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0">
                                    <img alt="Seller" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrJbFwuN6pVTEufmciIr6rKtOJb8n2oI18buuccMHN7NLVIsHNIO1V9r-wSj1VDpEKzzTo5gmPbUzJmn_nEzLkDBh-rWIWqk9wMqWIJfiUCJAlmarvqhDN4jayAwJzAQrrrFKPjXR8mYOVVYx9d8QM4k-hRyFlf-61INwOHEu25oG9GkZk5yC_IHy5Vvfdqxt5Q4JXMOHyrTqYKdimRdBMJ9oXt4NU5NGSTJvSjUzMPI22CugjaTO_7iusnwx1FeFFZCX9n1B7dYmL"/>
                                </div>
                                <div className="flex flex-col gap-1 max-w-[80%]">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-tr-xl rounded-b-xl">
                                        <p className="text-sm text-slate-700 dark:text-slate-300">That's the best I can do for this quality. It's truly auction-grade. Shipping can be handled within the hour.</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 ml-1">09:18 AM</span>
                                </div>
                            </div>

                        </div>

                        {/* Chat Input Area */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex gap-2 mb-3">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary hover:bg-primary/20 transition-all">
                                    <span className="material-icons text-xs">auto_awesome</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Suggest Response</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-all">
                                    <span className="material-icons text-xs">request_quote</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Make Counter</span>
                                </button>
                            </div>
                            <div className="relative">
                                <textarea className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400 resize-none shadow-sm" placeholder="Type your message or bid..." rows="2"></textarea>
                                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                    <button className="text-slate-400 hover:text-primary"><span className="material-icons text-xl">attach_file</span></button>
                                    <button className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-md hover:scale-105 transition-transform">
                                        <span className="material-icons">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Negotiation Footer */}
            <div className="fixed bottom-0 lg:left-64 left-0 w-[calc(100%-16rem)] max-lg:w-full bg-background-dark text-white py-3 px-6 flex items-center justify-between z-[60] border-t border-slate-800">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Selected Item</span>
                        <span className="text-sm font-medium">BFT-2024-X9 (Tuna)</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-800"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Current Bid</span>
                        <span className="text-sm font-bold text-primary">$97.50/kg</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2 mr-4">
                        <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-700 flex items-center justify-center"><span className="text-[10px]">HT</span></div>
                        <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-primary/20 flex items-center justify-center text-primary"><span className="text-[10px]">ME</span></div>
                        <div className="w-8 h-8 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center text-slate-500"><span className="material-icons text-xs">add</span></div>
                    </div>
                    <button className="px-6 py-2 bg-primary text-background-dark font-bold text-sm rounded-lg hover:shadow-[0_0_20px_rgba(19,236,200,0.3)] transition-all uppercase tracking-tight">Finalize Deal</button>
                </div>
            </div>
        </div>
    );
};

export default Negotiation;
