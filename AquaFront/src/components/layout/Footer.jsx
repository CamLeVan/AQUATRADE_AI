import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-8 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                <div className="space-y-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-icons-outlined text-white text-lg">waves</span>
                        </div>
                        <span className="ml-3 font-bold text-xl tracking-tight text-slate-900 dark:text-white">AquaTrade <span className="text-primary">AI</span></span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                        Empowering the global seafood trade with cutting-edge AI integration. Our mission is to ensure quality, transparency, and efficiency through neural network intelligence in aquaculture.
                    </p>
                </div>

                <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Platform</h4>
                    <ul className="space-y-4">
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Marketplace</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">AI Detection</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Insights</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">API Documentation</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Support</h4>
                    <ul className="space-y-4">
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Help Center</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Safety &amp; Standards</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Terms of Service</a></li>
                        <li><a className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Contact</h4>
                    <div className="space-y-4">
                        <a className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" href="mailto:support@aquatrade.ai">
                            <span className="material-icons-outlined text-sm mr-2">email</span>
                            support@aquatrade.ai
                        </a>
                        <div className="flex items-center space-x-4 pt-2">
                            <a className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all" href="#">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </a>
                            <a className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all" href="#">
                                <span className="material-symbols-outlined text-lg">share</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-slate-400 text-[11px] font-medium uppercase tracking-widest">
                    © 2026 AquaTrade AI Technologies. All Rights Reserved.
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center text-slate-400 text-xs font-medium cursor-pointer hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-sm mr-1">language</span>
                        <span>English (US)</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-xs font-medium cursor-pointer hover:text-primary transition-colors">
                        <span>USD ($)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
