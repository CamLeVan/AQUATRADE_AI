import React from 'react';

const RecentTransactions = () => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <button className="text-sm font-semibold text-primary hover:underline">View All History</button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-primary/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-primary/5">
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        <tr className="hover:bg-primary/5 transition-colors group">
                            <td className="px-6 py-4 font-medium text-sm">#TRX-88210</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                                        <span className="material-icons-outlined text-primary text-sm">water_drop</span>
                                    </div>
                                    <span className="text-sm">Vannamei Shrimp PL</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">Oct 24, 2024</td>
                            <td className="px-6 py-4 text-sm font-bold">$12,450.00</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Completed
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors group">
                            <td className="px-6 py-4 font-medium text-sm">#TRX-88195</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                        <span className="material-icons-outlined text-blue-500 text-sm">set_meal</span>
                                    </div>
                                    <span className="text-sm">Nile Tilapia Seeds</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">Oct 23, 2024</td>
                            <td className="px-6 py-4 text-sm font-bold">$8,200.00</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>
                                    Processing
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors group">
                            <td className="px-6 py-4 font-medium text-sm">#TRX-88188</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3">
                                        <span className="material-icons-outlined text-slate-500 text-sm">inventory</span>
                                    </div>
                                    <span className="text-sm">Salmon Smolt Batch B</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">Oct 22, 2024</td>
                            <td className="px-6 py-4 text-sm font-bold">$4,500.00</td>
                            <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1.5"></span>
                                    Pending
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default RecentTransactions;
