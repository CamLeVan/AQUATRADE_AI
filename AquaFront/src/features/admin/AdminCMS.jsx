import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

const AdminCMS = () => {
    return (
        <AdminLayout>
            <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-1 block">Hệ thống quản trị</span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Quản Lý Nội Dung & Thông Tin (CMS)</h2>
                    </div>
                    <Link to="/admin/postings" className="bg-[#13ecc8] hover:opacity-90 text-slate-900 px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                        Post and Update Fish
                    </Link>
                </div>

                {/* Quick Stats Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 hover:border-[#13ecc8]/40 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-600">
                                <span className="material-symbols-outlined">article</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-500/10 px-2 py-1 rounded">Live</span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng bài viết xuất bản</p>
                        <p className="text-3xl font-black text-slate-900">1,284</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 hover:border-[#13ecc8]/40 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2 py-1 rounded">Pending</span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Đang chờ duyệt</p>
                        <p className="text-3xl font-black text-slate-900">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 hover:border-[#13ecc8]/40 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-[#13ecc8]/10 rounded-lg flex items-center justify-center text-[#00cfa8]">
                                <span className="material-symbols-outlined">query_stats</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#00cfa8] font-bold text-xs">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                <span>+4.2%</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Chỉ số tương tác (AI Score)</p>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black text-slate-900">8.9</p>
                            <p className="text-slate-400 text-xs mb-1 font-bold">/ 10</p>
                        </div>
                    </div>
                </section>

                {/* Content Editor & Drag-Drop */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Editor Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Biên tập nội dung mới</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Tiêu đề bài viết</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#13ecc8]/30 focus:border-[#13ecc8] rounded-lg px-4 py-3 text-sm font-medium transition-all" placeholder="VD: Phân tích xu hướng thị trường AquaTrade Quý 3..." type="text"/>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Chuyên mục</label>
                                        <div className="relative">
                                            <select className="appearance-none w-full bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#13ecc8]/30 focus:border-[#13ecc8] rounded-lg px-4 py-3 text-sm transition-all font-medium cursor-pointer">
                                                <option>Market Updates</option>
                                                <option>Technical Guides</option>
                                                <option>Industry News</option>
                                            </select>
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="flex items-center cursor-pointer gap-3 mb-3">
                                            <div className="relative">
                                                <input defaultChecked className="sr-only peer" type="checkbox"/>
                                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#13ecc8]"></div>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Hiển thị ngay (Publish Now)</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Trình soạn thảo văn bản</label>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#13ecc8]/30 focus-within:border-[#13ecc8] transition-all">
                                        <div className="bg-slate-50 px-4 py-2 flex items-center gap-4 border-b border-slate-200 flex-wrap">
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span class="material-symbols-outlined text-lg">format_italic</span></button>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_underlined</span></button>
                                            <div className="w-px h-4 bg-slate-300"></div>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_list_numbered</span></button>
                                            <div className="w-px h-4 bg-slate-300"></div>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
                                            <button className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">image</span></button>
                                        </div>
                                        <textarea className="w-full bg-white border-none focus:ring-0 outline-none px-4 py-4 text-sm leading-relaxed min-h-[300px] resize-y" placeholder="Bắt đầu viết nội dung tại đây..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Content (Featured Image) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ảnh tiêu biểu (Featured)</h3>
                            <div className="border-2 border-dashed border-[#13ecc8]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-[#13ecc8] transition-colors cursor-pointer bg-[#13ecc8]/5 min-h-[200px]">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#00cfa8] mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 mb-1">Click to upload or drag</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                            
                            <div className="mt-8 flex-1">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Gợi ý từ AI</h4>
                                <div className="p-4 bg-[#13ecc8]/5 rounded-lg border border-[#13ecc8]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-[#00cfa8] text-sm animate-pulse" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#006b59]">AI Recommendation</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">"Dựa trên tiêu đề, hãy sử dụng hình ảnh có màu xanh ngọc chủ đạo để tăng tỷ lệ click lên 15%."</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <button className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors active:scale-95 mb-3">Lưu bản nháp</button>
                                <button className="w-full bg-[#13ecc8] text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#13ecc8]/20 active:scale-95 transition-transform hover:opacity-90">Xuất bản ngay</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Management Table */}
                <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Quản lý danh sách bài viết</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-[#00cfa8] transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                            <button className="p-2 text-slate-400 hover:text-[#00cfa8] transition-colors"><span className="material-symbols-outlined">sort</span></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Bài viết</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Chuyên mục</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Lượt xem</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right whitespace-nowrap">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                <img alt="Post thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMJUHSaIuf-5913hbVCbWCrn_a8ZBLOpaRm0Ju3WtE74a4EkDCyLo2H-Vqtx8tom0yKNgq_7ev-uboIegcRcAPEaTZDzjOizoIwfcEZkf011Gex2Z2dBSCO5fI7NTSLvOK-jtwljvd36UZbUE3OwyXLQAqjUsrP7TX5Szd0Q_Nlyk_BWZLu4B_M8mzl3l9X5tE3Sj5DBkonxVabX0L4XrUTdei3b1IMXO3oitRq2TiwOeyw6Yjx4jRsE2V6pvoD6IgdqMfgN-FPNEo"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#00cfa8] transition-colors">Tiềm năng xuất khẩu thủy sản 2024</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Cập nhật 2 giờ trước • Bởi Admin</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">Market Updates</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)] animate-pulse"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00cfa8]">Published</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-700">12,402</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-[#00cfa8] hover:bg-[#13ecc8]/10 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                <img alt="Post thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjrDW4LqssluQsh-t5DYckZ6UbmsJeicuTtPK5xL6sPiRmBbP0_gvfzpwAqaie-w3X86C5vLeuEX8EXaTzxiKbdnxkBfsX3I3LWvH2txmjdbmz9wq9c1q-QkQBr0TgedKziE7Jmv6ywrwy3TLJGxyXCGQSlxklRfjSoAeJU1AoNwZn_zi-Nikk-wPQvF3gP1bxQLqPiVFU67pvSjyFsb3Z4ZUm-uhr3t6ZrHpQYcNkw-AGT_YNax2Yt8MzzTU9it_i1xlBuXtjaDrq"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#00cfa8] transition-colors">Công nghệ lọc nước tuần hoàn RAS</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Cập nhật 1 ngày trước • Bởi Admin</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">Tech Guides</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Draft</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-700">0</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-[#00cfa8] hover:bg-[#13ecc8]/10 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                <img alt="Post thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC9nerqIql7_PDlcF6mxvszQ4D7UT7GJAdGlaWJ_5iHgPVR6_V3xWcF1vC37F_pnxm7BrQydY9-Ej2wm3vGKCEbDbUA7HPPBhBnPPiSTkg7MLa6fs3x8Qa_wH6uxAFirogYfrnW8etemtcB7IW9ITYzQqQUVkJs_LTyfj418cARhav7ADKyMwZjHhUotkxLGS6CWNu_pN5b5hcDq_rdnILgHtj6OnW3KLqd7vseTVUnRVmDBPBWd6DdugSJHhvNK9pp0kIfCNirvtq"/>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#00cfa8] transition-colors">Báo cáo AI trong Logistic Thủy sản</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Cập nhật 3 ngày trước • Bởi AI-Bot</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">Industry News</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)] animate-pulse"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00cfa8]">Published</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-700">8,912</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-[#00cfa8] hover:bg-[#13ecc8]/10 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị <span className="text-slate-700">3</span> trong <span className="text-slate-700">1,284</span> bài viết</p>
                        <div className="flex gap-1.5">
                            <button className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-[#13ecc8] hover:text-[#00cfa8] shadow-sm transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
                            <button className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-[#13ecc8] hover:text-[#00cfa8] shadow-sm transition-all text-xs font-bold">2</button>
                            <button className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-[#13ecc8] hover:text-[#00cfa8] shadow-sm transition-all text-xs font-bold">3</button>
                            <button className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-[#13ecc8] hover:text-[#00cfa8] shadow-sm transition-all"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                </section>

                {/* Footer Specific for this page inside main body */}
                <footer className="w-full border-t border-slate-200 bg-white flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4 rounded-xl shadow-sm mt-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">© 2024 Aqua Crystal AI CMS.</p>
                        <div className="flex gap-4">
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-teal-500 transition-colors">Documentation</button>
                            <button className="text-[11px] font-bold tracking-wider uppercase text-slate-400 hover:text-teal-500 transition-colors">Support</button>
                        </div>
                    </div>
                </footer>
            </div>
        </AdminLayout>
    );
};

export default AdminCMS;
