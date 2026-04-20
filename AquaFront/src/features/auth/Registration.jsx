import React from 'react';
import { Link } from 'react-router-dom';

const Registration = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
            <div className="flex min-h-screen">
                {/* Left Panel: Visual/Brand (Visible on large screens) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark">
                    <img alt="Scientist monitoring fish health with tablet" className="absolute inset-0 w-full h-full object-cover opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGHXvIxGJtdVfIupAmU9no8I9z0X0gi4C1_jrH-r3XMLO-eDiu9A7vNBKrlksq2XbPKM7zxc2OJyXEYWTjuexOaVp-nPnHfo65njUeWY_Yn7hJA0A_20tf56IiaAI5q-pOCPnxNllErQUh8f0inhkzmHZmzGiyHnjihT8bvfgHtsXWucYuqLiKZAU_TKhONQt0JFKHDE0JXnMKQNiMH9Yyr3N_oRz9vKWK0lU0U5L3NfWXfswxa7p9GF7KVnY4KxgExqn-C9STU-Ln"/>
                    <div className="absolute inset-0 bg-gradient-to-tr from-background-dark via-background-dark/40 to-transparent"></div>
                    <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                        <div>
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-white text-2xl" style={{fontVariationSettings: "'FILL' 0"}}>waves</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white uppercase tracking-tighter block group-hover:opacity-80 transition-opacity leading-none">
                                        AquaTrade <span className="text-cyan-400 font-bold text-xl">AI</span>
                                    </div>
                                    <p className="font-['Inter'] uppercase tracking-widest text-[11px] font-bold text-white/80 mt-1 leading-none">Precision Logistics</p>
                                </div>
                            </Link>
                        </div>
                        <div className="max-w-md">
                            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                                The future of seafood trade, powered by intelligence.
                            </h1>
                            <p className="text-slate-300 text-lg">
                                Join thousands of seafood professionals using AI-driven analytics to optimize health, yield, and global market positioning.
                            </p>
                            <div className="mt-12 flex flex-col gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <span className="material-icons text-primary">analytics</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Real-time Analytics</h4>
                                        <p className="text-slate-400 text-sm">Monitor aquatic health and market trends instantly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <span className="material-icons text-primary">verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Secure Marketplace</h4>
                                        <p className="text-slate-400 text-sm">Verified buyers and sellers for trusted global trade.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm">
                            © 2024 AquaTrade AI Technologies. All rights reserved.
                        </div>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
                    <div className="w-full max-w-md">
                    
                        <div className="lg:hidden flex items-center mb-10">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 0"}}>waves</span>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter block group-hover:opacity-80 transition-opacity leading-none">
                                        AquaTrade <span className="text-cyan-500 font-bold text-base">AI</span>
                                    </div>
                                    <p className="font-['Inter'] uppercase tracking-widest text-[9px] font-bold text-slate-400 mt-1 leading-none">Precision Logistics</p>
                                </div>
                            </Link>
                        </div>
                        
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-slate-500 dark:text-slate-400">Join our global seafood ecosystem today.</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-2 mb-10">
                            <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                            <div className="h-1.5 flex-1 bg-primary/20 rounded-full dark:bg-primary/10"></div>
                            <div className="h-1.5 flex-1 bg-primary/20 rounded-full dark:bg-primary/10"></div>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                    <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white form-input-focus placeholder:text-slate-400" placeholder="Thanh Long" type="text" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                                    <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white form-input-focus placeholder:text-slate-400" placeholder="FPT Software" type="text" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Email</label>
                                <div className="relative">
                                    <input className="w-full  rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white form-input-focus placeholder:text-slate-400" placeholder="long27fpt@company.com" type="email" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">User Role</label>
                                <div className="relative">
                                    <select defaultValue="" className="w-full px-4 py-3 appearance-none rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white form-input-focus cursor-pointer">
                                        <option disabled value="">Select your role</option>
                                        <option value="buyer">Buyer / Distributor</option>
                                        <option value="seller">Seller / Producer</option>
                                        <option value="investor">Investor / Analyst</option>
                                    </select>
                                    <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <div className="relative">
                                    <input className="w-full rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white form-input-focus placeholder:text-slate-400" placeholder="••••••••" type="password" />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" type="button">
                                        <span className="material-icons text-lg">visibility_off</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400">Must be at least 8 characters with a symbol.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center h-5">
                                    <input className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary" type="checkbox" />
                                </div>
                                <label className="text-sm text-slate-500 dark:text-slate-400 leading-tight">
                                    I agree to the <Link to="/" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                                </label>
                            </div>
                            <button className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
                                <span>Create Account</span>
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-500 dark:text-slate-400">
                                Already have an account? 
                                <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign In</Link>
                            </p>
                        </div>
                        
                        <div className="mt-8 flex justify-center gap-6">
                            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"></path></svg>
                            </button>
                            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
