import React from 'react';
import { Link } from 'react-router-dom';

const FloatingContact = () => {
    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4">
            {/* Phone Button */}
            <Link 
                to="/contact" 
                className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center animate-wobble hover:scale-110 transition-transform group relative"
                title="Gọi ngay"
            >
                <span className="material-symbols-outlined font-icon text-xl">call</span>
                <span className="absolute right-14 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Hotline</span>
            </Link>

            {/* Zalo Button */}
            <Link 
                to="/contact" 
                className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-wobble hover:scale-110 transition-transform group relative"
                style={{ animationDelay: '0.2s' }}
                title="Chat Zalo"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-6 h-6 object-contain" />
                <span className="absolute right-14 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Zalo</span>
            </Link>

            {/* Facebook Button */}
            <Link 
                to="/contact" 
                className="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center animate-wobble hover:scale-110 transition-transform group relative"
                style={{ animationDelay: '0.4s' }}
                title="Chat Facebook"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-6 h-6 object-contain" />
                <span className="absolute right-14 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Messenger</span>
            </Link>
        </div>
    );
};

export default FloatingContact;
