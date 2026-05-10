import React from 'react';
import AdminLayout from './layout/AdminLayout';
import Footer from '../../components/layout/Footer';

const Analytics = () => {
    return (
        <AdminLayout>
            <div className="p-4 md:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar">
                {/* Page Header */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">AI Analytics & Operations</h2>
                            <p className="text-slate-500 mt-2 font-['Inter'] uppercase tracking-widest text-xs">Machine Learning Driven Insights</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary-fixed-dim rounded text-[10px] font-bold uppercase tracking-widest border border-primary/20 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Live Engine
                            </span>
                            <span className="px-3 py-1 bg-surface-container-highest text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                Last Sync: 2m ago
                            </span>
                        </div>
                    </div>
                </section>

                {/* Key Performance Cards (Row 1) */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* AI Health Forecast */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container bg-primary/5 px-2 py-0.5 rounded">Bullish</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">AI Health Forecast</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black text-slate-800">92%</h3>
                            <span className="text-xs text-primary font-bold">Accuracy</span>
                        </div>
                        <div className="w-full bg-surface-container h-1 rounded-full mt-4">
                            <div className="bg-primary h-full rounded-full" style={{width: '92%'}}></div>
                        </div>
                    </div>

                    {/* Quality Consistency Score */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-tertiary-container/30 rounded-lg">
                                <span className="material-symbols-outlined text-tertiary">verified</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary bg-tertiary/5 px-2 py-0.5 rounded">+0.4 Trend</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Quality Consistency</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black text-slate-800">8.4<span className="text-lg text-slate-300">/10</span></h3>
                        </div>
                        <div className="flex gap-1 mt-4">
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-primary rounded-full"></div>
                            <div className="flex-1 h-1 bg-surface-container rounded-full"></div>
                            <div className="flex-1 h-1 bg-surface-container rounded-full"></div>
                        </div>
                    </div>

                    {/* Predictive Price Index */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary">trending_up</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded">+5% Forecast</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Predictive Price</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black text-slate-800">$12.50<span className="text-xs font-normal text-slate-400">/kg</span></h3>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-full h-8 flex items-end gap-0.5">
                                <div className="flex-1 bg-primary/10 h-[50%]"></div>
                                <div className="flex-1 bg-primary/20 h-[66%]"></div>
                                <div className="flex-1 bg-primary/30 h-[50%]"></div>
                                <div className="flex-1 bg-primary/40 h-[75%]"></div>
                                <div className="flex-1 bg-primary/50 h-[66%]"></div>
                                <div className="flex-1 bg-primary/60 h-[80%]"></div>
                                <div className="flex-1 bg-primary h-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Automated Grading Efficiency */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary-container/50 rounded-lg">
                                <span className="material-symbols-outlined text-secondary">precision_manufacturing</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">All Systems Go</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Grading Efficiency</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black text-slate-800">1,240</h3>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Batches</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-4 italic font-medium">Verifying batch #443...</p>
                    </div>
                </section>

                {/* Main Chart Section */}
                <section className="bg-surface-container-lowest p-8 rounded-xl border border-primary/10 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">7-Day Price & Volume Prediction</h3>
                            <p className="text-[11px] text-slate-400 font-['Inter'] uppercase tracking-widest">Historical Data vs ML Projections</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Historical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Forecast</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[350px] relative overflow-hidden flex items-end justify-between px-4 pb-4">
                        {/* Fake Chart Grid Lines */}
                        <div className="absolute inset-0 border-b border-primary/5 flex flex-col justify-between pointer-events-none">
                            <div className="w-full border-t border-primary/5"></div>
                            <div className="w-full border-t border-primary/5"></div>
                            <div className="w-full border-t border-primary/5"></div>
                            <div className="w-full border-t border-primary/5"></div>
                            <div className="w-full border-t border-primary/5"></div>
                        </div>
                        {/* Decorative Chart Mask */}
                        <div className="absolute inset-x-0 bottom-4 h-full flex items-end">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ecc8" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ecc8" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                {/* Historical Area */}
                                <path d="M0 350 L100 320 L200 340 L300 300 L400 310 L500 280 L500 400 L0 400 Z" fill="rgba(19, 236, 200, 0.05)"></path>
                                <path d="M0 350 L100 320 L200 340 L300 300 L400 310 L500 280" fill="none" stroke="#13ecc8" strokeDasharray="4 4" strokeOpacity="0.3" strokeWidth="2"></path>
                                {/* AI Forecast Area */}
                                <path d="M500 280 L600 240 L700 260 L800 180 L900 120 L1000 100 L1000 400 L500 400 Z" fill="url(#chartGradient)"></path>
                                <path d="M500 280 L600 240 L700 260 L800 180 L900 120 L1000 100" fill="none" stroke="#13ecc8" strokeWidth="4"></path>
                                {/* Key Points */}
                                <circle cx="500" cy="280" fill="#13ecc8" r="5" stroke="white" strokeWidth="2"></circle>
                                <circle cx="900" cy="120" fill="#13ecc8" r="4"></circle>
                            </svg>
                        </div>
                        {/* X-Axis Labels */}
                        <div className="absolute bottom-0 inset-x-0 flex justify-between px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span className="text-primary">Today</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                </section>

                {/* Secondary Panels (Row 3) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Computer Vision Quality Distribution */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm lg:col-span-1">
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-6">Computer Vision Quality</h4>
                        <div className="relative flex justify-center py-6">
                            {/* Simulated Donut Chart */}
                            <div className="w-40 h-40 rounded-full border-[12px] border-primary flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[12px] border-tertiary border-t-transparent border-r-transparent -rotate-45"></div>
                                <div className="absolute inset-0 rounded-full border-[12px] border-slate-200 border-t-transparent border-l-transparent rotate-90"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-800 leading-none">82%</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Grade A</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="text-slate-500">Grade A (Elite)</span>
                                </div>
                                <span className="text-slate-800">82.4%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                                    <span className="text-slate-500">Grade B (Standard)</span>
                                </div>
                                <span className="text-slate-800">14.1%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                    <span className="text-slate-500">Grade C (Sub)</span>
                                </div>
                                <span className="text-slate-800">3.5%</span>
                            </div>
                        </div>
                    </div>

                    {/* Real-time Anomaly Detection */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">Real-time Anomaly Detection</h4>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Clear Logs</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-error-container/20 border-l-4 border-error group hover:bg-error-container/30 transition-colors">
                                <span className="material-symbols-outlined text-error mt-1">warning</span>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold text-slate-800">Irregular growth detected</p>
                                        <span className="text-[10px] text-slate-400">Just now</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Batch #442 showing deviation in growth curve. Thermal sensors indicate +2.4°C variance.</p>
                                    <div className="mt-3 flex gap-2">
                                        <button className="px-3 py-1 bg-error text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">Flag Inspector</button>
                                        <button className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">Ignore</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container border-l-4 border-tertiary">
                                <span className="material-symbols-outlined text-tertiary mt-1">info</span>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold text-slate-800">Route Efficiency Optimization</p>
                                        <span className="text-[10px] text-slate-400">14m ago</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">AI suggested 12% faster route for Fleet Delta. Cargo temperature integrity maintained.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-primary-container/20 border-l-4 border-primary">
                                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold text-slate-800">Self-Calibration Complete</p>
                                        <span className="text-[10px] text-slate-400">1h ago</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Optical grading neural network successfully recalibrated with 0.002 loss.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Data Table */}
                <section className="bg-surface-container-lowest rounded-xl border border-primary/10 shadow-sm overflow-hidden mb-12">
                    <div className="px-8 py-6 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">Recent AI-Verified Batches</h4>
                            <p className="text-[10px] text-slate-400 font-['Inter'] uppercase tracking-widest mt-0.5">Live Verification Ledger</p>
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <span className="material-symbols-outlined text-slate-500 text-sm">filter_list</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <th className="px-8 py-4 border-b border-primary/5">Batch ID</th>
                                    <th className="px-8 py-4 border-b border-primary/5">Product Type</th>
                                    <th className="px-8 py-4 border-b border-primary/5">AI Grade</th>
                                    <th className="px-8 py-4 border-b border-primary/5">Health Score</th>
                                    <th className="px-8 py-4 border-b border-primary/5">Verification Timestamp</th>
                                    <th className="px-8 py-4 border-b border-primary/5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5 text-xs font-bold text-slate-800">#AQ-8921</td>
                                    <td className="px-8 py-5 text-xs text-slate-500">Bluefin Atlantic (Premium)</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 bg-primary/10 text-on-primary-container text-[10px] font-black rounded uppercase">Grade A+</span>
                                    </td>
                                    <td className="px-8 py-5 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{width: '98%'}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">98%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-400 tabular-nums">2024-05-20 14:22:11</td>
                                    <td className="px-8 py-5">
                                        <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">analytics</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5 text-xs font-bold text-slate-800">#AQ-8920</td>
                                    <td className="px-8 py-5 text-xs text-slate-500">Pacific Algae Extract</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 bg-primary/10 text-on-primary-container text-[10px] font-black rounded uppercase">Grade A</span>
                                    </td>
                                    <td className="px-8 py-5 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{width: '88%'}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">88%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-400 tabular-nums">2024-05-20 13:58:04</td>
                                    <td className="px-8 py-5">
                                        <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">analytics</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5 text-xs font-bold text-slate-800">#AQ-8919</td>
                                    <td className="px-8 py-5 text-xs text-slate-500">Yellowfin Harvest</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 bg-tertiary-container/30 text-tertiary text-[10px] font-black rounded uppercase">Grade B</span>
                                    </td>
                                    <td className="px-8 py-5 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-tertiary h-full" style={{width: '72%'}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">72%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-400 tabular-nums">2024-05-20 12:45:30</td>
                                    <td className="px-8 py-5">
                                        <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">analytics</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5 text-xs font-bold text-slate-800">#AQ-8918</td>
                                    <td className="px-8 py-5 text-xs text-slate-500">Arctic Krill Concentrate</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2 py-1 bg-primary/10 text-on-primary-container text-[10px] font-black rounded uppercase">Grade A</span>
                                    </td>
                                    <td className="px-8 py-5 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{width: '91%'}}></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">91%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-400 tabular-nums">2024-05-20 11:12:55</td>
                                    <td className="px-8 py-5">
                                        <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">analytics</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <Footer />
            </div>
            {/* Contextual FAB (Dashboard Action) */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            </button>
        </AdminLayout>
    );
};

export default Analytics;
