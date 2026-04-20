import React from 'react';
import AdminLayout from '../layout/AdminLayout';

const AdminCMSEditor = () => {
    return (
        <AdminLayout>
            <div className="max-w-[1400px] mx-auto p-8 flex flex-col lg:flex-row gap-8">
                {/* Editor Section */}
                <div className="flex-1 space-y-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                        <div>
                            <span className="font-['Inter'] uppercase tracking-widest text-[12px] text-[#00cfa8] font-semibold">Workspace</span>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight mt-1">Tạo Bài Viết Mới</h2>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-2.5 rounded-lg border border-[#13ecc8]/20 bg-[#13ecc8]/5 text-[#006b59] text-xs font-bold uppercase tracking-wider hover:bg-[#13ecc8]/10 transition-all">Lưu bản nháp</button>
                            <button className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm bg-white">Xem trước</button>
                            <button className="px-8 py-2.5 rounded-lg bg-[#13ecc8] text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-90 transition-all active:scale-95">Đăng ngay</button>
                        </div>
                    </div>
                    
                    {/* Input Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 flex flex-col">
                        <input className="w-full border-none focus:ring-0 outline-none text-2xl font-bold p-6 placeholder:text-slate-300" placeholder="Nhập tiêu đề bài viết tại đây..." type="text"/>
                        
                        {/* Rich Text Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-y border-slate-100 bg-slate-50/50">
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">format_bold</span></button>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">format_italic</span></button>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">format_underlined</span></button>
                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">format_list_bulleted</span></button>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">format_list_numbered</span></button>
                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">link</span></button>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">image</span></button>
                            <button className="p-2 hover:bg-[#13ecc8]/10 hover:text-[#00cfa8] rounded transition-colors text-slate-600"><span className="material-symbols-outlined font-bold text-lg">video_library</span></button>
                            
                            <div className="ml-auto flex items-center gap-2 mt-2 sm:mt-0">
                                <span className="text-[10px] uppercase tracking-widest text-[#00cfa8] font-bold">Auto-saved 2m ago</span>
                            </div>
                        </div>
                        
                        {/* Content Area */}
                        <textarea className="w-full h-[500px] border-none focus:ring-0 outline-none p-8 text-slate-700 leading-relaxed resize-none" placeholder="Bắt đầu viết nội dung chuyên sâu về thị trường thủy sản của bạn..."></textarea>
                    </div>

                    {/* Media Upload Section */}
                    <div className="bg-white rounded-xl border-2 border-dashed border-[#13ecc8]/30 p-12 text-center group cursor-pointer hover:bg-[#13ecc8]/5 transition-all">
                        <div className="w-16 h-16 bg-[#13ecc8]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#00cfa8] text-3xl">cloud_upload</span>
                        </div>
                        <h3 className="text-slate-800 font-bold text-lg">Tải lên hình ảnh hoặc video lô hàng</h3>
                        <p className="text-slate-500 text-sm mt-1">Kéo và thả tệp tại đây hoặc nhấp để chọn từ máy tính</p>
                        
                        <div className="mt-8 flex justify-center gap-4 flex-wrap">
                            <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group/img">
                                <img className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" alt="preview1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBidPNCRYcjpadW2D451DsJyXAqeNDlX6MGufR2CRYtXE3EZPq71AbPL0lncXF0H-cunfaPKy1XB6wZCh0OKwzhbQ4O9B3XqgvwIK96IIJobE8Z4XqyZlZwc2mfAYWWv3crZuxQQ2MgoUeZaL3o-k3IHyHk6uoHWi2ZaO9cEHxsMP_DW4ONOBAwSpStNLjBE1iIkXLUcvho0jsP4PoETMOp0gNCGTDEIUhcBEtYGqNby6TLlBDlL0Y-Z9_RG10hedMQ1rJpGCqQ2lWO"/>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white/40 opacity-100 group-hover/img:opacity-0 transition-opacity">PREVIEW</span>
                            </div>
                            <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group/img">
                                <img className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" alt="preview2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoIYRPHUL5iMqwTtdON5is7YKwZPpoZbRCatEqq-TRkJS5YaOJVjfgR7jgtYJ4NILz_hELEF3Jc7JK3EIOwypzA4o5Px5Eg_k52-Z7QpgJkC5S9LT8uDdbFsrQrWcvZsol9zG1BIl4dL9jusMXSoyEMiHK3ViVZKTFZSvkn9RQVT9W8kMQ9L_sHX1HLjZOc75olRNqtFiIbN_dHGZJ1E18UbsodiVz-XiGqHD5OQTNt7zHeecl5_sTfuZQiabfRN3f6LsyhtPMxzX-"/>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800 bg-white/40 opacity-100 group-hover/img:opacity-0 transition-opacity">PREVIEW</span>
                            </div>
                            <div className="w-24 h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-slate-300">add</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar / AI Assistant */}
                <aside className="w-full lg:w-[320px] space-y-6">
                    {/* AI Quality Score Card */}
                    <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ecc8]/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#13ecc8]">AI Quality Score</span>
                                <span className="material-symbols-outlined text-[#13ecc8]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-black">84</span>
                                <span className="text-[#13ecc8] text-sm font-bold mb-2">/100</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mb-6 overflow-hidden">
                                <div className="bg-[#13ecc8] h-full rounded-full" style={{ width: '84%' }}></div>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">Nội dung của bạn rất chuyên nghiệp. AI gợi ý thêm các số liệu về biến động giá gần đây.</p>
                        </div>
                    </div>

                    {/* Keywords Assistant */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Gợi ý từ khóa</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-[#13ecc8]/10 text-[#006b59] text-[11px] font-bold rounded-full border border-[#13ecc8]/20 hover:bg-[#13ecc8]/20 transition-colors cursor-pointer">#ThủySảnViệt</span>
                            <span className="px-3 py-1.5 bg-[#13ecc8]/10 text-[#006b59] text-[11px] font-bold rounded-full border border-[#13ecc8]/20 hover:bg-[#13ecc8]/20 transition-colors cursor-pointer">#LogisticsAI</span>
                            <span className="px-3 py-1.5 bg-[#13ecc8]/10 text-[#006b59] text-[11px] font-bold rounded-full border border-[#13ecc8]/20 hover:bg-[#13ecc8]/20 transition-colors cursor-pointer">#GiáTômHômNay</span>
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-500 hover:text-slate-700 text-[11px] font-bold rounded-full border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">+ Thêm từ khóa</span>
                        </div>
                    </div>

                    {/* Data Freshness Check */}
                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Độ tươi mới dữ liệu</h4>
                            <span className="w-2 h-2 bg-[#13ecc8] rounded-full animate-pulse shadow-[0_0_8px_rgba(19,236,200,0.6)]"></span>
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[#00cfa8] text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-800">Giá xuất khẩu EU</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Cập nhật 15 phút trước</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-amber-500 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-800">Sản lượng Mekong</p>
                                    <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Dữ liệu từ 24h trước. Cần đối soát.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Widget */}
                    <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-100 shadow-sm relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <span className="material-symbols-outlined text-[100px] text-cyan-600">help</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[11px] font-bold text-cyan-600 mb-2 uppercase tracking-widest">Cần hỗ trợ?</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">Sử dụng phím tắt <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-sm text-[10px] mx-1 text-slate-800 font-mono">Ctrl + J</kbd> để gọi AI trợ giúp viết tiếp.</p>
                        </div>
                    </div>
                </aside>
            </div>
            
            {/* Footer Specific for this page inside main body */}
            <footer className="w-full border-t border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4 mt-8">
                <span className="font-['Inter'] text-[11px] text-slate-400 font-bold uppercase tracking-wider">© 2024 AquaTrade AI. Laboratory Grade Content.</span>
                <div className="flex gap-6">
                    <button className="font-['Inter'] text-[11px] text-slate-400 font-bold uppercase tracking-wider hover:text-cyan-500 transition-colors">Legal</button>
                    <button className="font-['Inter'] text-[11px] text-slate-400 font-bold uppercase tracking-wider hover:text-cyan-500 transition-colors">Privacy Policy</button>
                    <button className="font-['Inter'] text-[11px] text-slate-400 font-bold uppercase tracking-wider hover:text-cyan-500 transition-colors">Support</button>
                </div>
            </footer>
        </AdminLayout>
    );
};

export default AdminCMSEditor;
