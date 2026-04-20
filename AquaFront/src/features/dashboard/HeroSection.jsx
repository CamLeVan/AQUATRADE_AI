import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative h-64 rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent z-10"></div>
            <img alt="Aquaculture Facility" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfwq-bcGrB7cNx8dj5xnkRSOdFsVmt0L_DCMwYhXVTRj6TmgrAmwYq1ZM2PO9mrK45TW7hGWXYohPEEBAIirP7kp7nG4pTK9v-rRNAFbTYUH3GjI8eDlFXXrZk1XOWazGafWCFXVumYEDcbrJsS_nZHF3TpLQvZR_k_L-QNQbttoTacOa31yh0EzcjqpGvsuFNePW8S1l-X4NZ2aX7emOR1TxCtZzV6q-xJUTnpVc-tPIHfsqpyQJHMw4cDrO9wGDFh7Qir9X0dfis"/>
            <div className="relative z-20 h-full flex flex-col justify-center px-12">
                <span className="bg-primary text-background-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 w-fit">Market Featured</span>
                <h1 className="text-white text-4xl font-bold mb-2">Trusted Fingerling Marketplace</h1>
                <p className="text-slate-200 max-w-lg mb-6">Access AI-verified suppliers and real-time health data for premium fish seeds.</p>
                <div className="flex space-x-4">
                    <button className="bg-primary text-background-dark font-semibold px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center text-sm">
                     <Link to="/marketplace"> Browse Market</Link>
                        <span className="material-icons-outlined ml-2 text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
