import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

// Kiểm định chất lượng bằng AI,giao diện giám sát tự động
const AIDetection = () => {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:ml-64 w-full overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-primary/10 bg-white dark:bg-neutral-dark px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <nav className="text-sm text-slate-400">
                            <span className="hover:text-primary cursor-pointer">Nhận diện AI</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-800 dark:text-slate-100 font-medium">Kiểm tra lô hàng #AT-9421</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-background-light dark:bg-slate-800 rounded-full border border-primary/10">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-medium">Hệ thống AI Trực tuyến</span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-primary">
                            <span className="material-icons">notifications</span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
                            <div className="text-right">
                                <p className="text-xs font-bold">Ly Thanh Long</p>
                                <p className="text-[10px] text-slate-400">Quản trị viên kho</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="material-icons text-primary text-sm">
                                    <img src="" alt="" />
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Viewport Area */}
                <div className="flex-1 p-8 overflow-hidden flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Kiểm tra thị giác máy tính</h1>
                            <p className="text-slate-500 text-sm">Phân tích mật độ và kích thước cá cơm tự động</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                                <span className="material-icons text-sm">Cân chỉnh lại</span> 
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                                <span className="material-icons text-sm">Xuất báo cáo</span> 
                            </button>
                        </div>
                    </div>

                    {/* AI Detection Canvas Container */}
                    <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-dark">
                        {/* Main Image */}
                        <img alt="Small fish tray for inspection" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQfhShz-usEHKoutVaBjzlAlZpbxsqBIz_2W0OlGCoPUXiROH2z-yGAlGdx9IcwfvEyyjpglhKTOaOg-dvi7FM2hWnITGgi1jdjNM6mT3J6ZNn7ihliVVhp_LsDsD0pjnJ__zJXs-x8iWRPtZ_Qg5LvUiQk0GC46e--Qck35KcTZmiKYV62F2C_IHKnudNx2_nHJ7xPmuPbJueq1-YJ6NR8M8tk-FeNxX3xsvHX8OSvvg6PxRYjk0ZMWGgPFLJM0DAWyLje9cdbUwi"/>
                        
                        {/* Bounding Box Overlays (Simulated) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {/* Fish 1 */}
                            <rect className="stroke-primary fill-primary/10 stroke-2" height="40" rx="4" width="120" x="20%" y="30%"></rect>
                            <text className="fill-primary text-[10px] font-bold" x="20%" y="28%">Cá cơm - 99%</text>
                            {/* Fish 2 */}
                            <rect className="stroke-primary fill-primary/10 stroke-2" height="35" rx="4" width="110" x="45%" y="15%"></rect>
                            <text className="fill-primary text-[10px] font-bold" x="45%" y="13%">Cá cơm - 98%</text>
                            {/* Fish 3 */}
                            <rect className="stroke-primary fill-primary/10 stroke-2" height="45" rx="4" width="130" x="35%" y="55%"></rect>
                            <text className="fill-primary text-[10px] font-bold" x="35%" y="53%">Cá cơm - 97%</text>
                            {/* Fish 4 (Issue) */}
                            <rect className="stroke-red-500 fill-red-500/10 stroke-2" height="40" rx="4" width="100" x="70%" y="40%"></rect>
                            <text className="fill-red-500 text-[10px] font-bold" x="70%" y="38%">Tạp chất - 94%</text>
                            
                            {/* Many more generic boxes for "Tray effect" */}
                            <rect className="stroke-primary/40 fill-primary/5 stroke-1" height="30" rx="4" width="80" x="10%" y="10%"></rect>
                            <rect className="stroke-primary/40 fill-primary/5 stroke-1" height="35" rx="4" width="95" x="60%" y="70%"></rect>
                            <rect className="stroke-primary/40 fill-primary/5 stroke-1" height="40" rx="4" width="115" x="15%" y="75%"></rect>
                            <rect className="stroke-primary/40 fill-primary/5 stroke-1" height="35" rx="4" width="105" x="80%" y="20%"></rect>
                        </svg>

                        {/* Top Right Stats Overlay */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <div className="bg-white/95 dark:bg-neutral-dark/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-primary/20 min-w-[180px]">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Độ chính xác AI</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-primary">98.5%</span>
                                    <span className="text-xs text-primary mb-1 font-bold">Tốt</span>
                                </div>
                            </div>
                            <div className="bg-white/95 dark:bg-neutral-dark/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-primary/20 min-w-[180px]">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Số lượng vật thể</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-slate-800 dark:text-white">124</span>
                                    <span className="text-xs text-slate-400 mb-1 font-bold">Con</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Left Controls Overlay */}
                        <div className="absolute bottom-6 left-6 flex gap-2">
                            <div className="bg-black/40 backdrop-blur-md p-2 rounded-lg flex gap-1">
                                <button className="w-8 h-8 rounded flex items-center justify-center bg-primary text-white">
                                    <span className="material-icons text-sm">visibility</span>
                                </button>
                                <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20">
                                    <span className="material-icons text-sm">layers</span>
                                </button>
                                <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20">
                                    <span className="material-icons text-sm">zoom_in</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="bg-white dark:bg-neutral-dark p-4 rounded-xl shadow-sm border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Mã lô hàng</p>
                                <p className="text-sm font-semibold">BATCH-FISH-2024-001</p>
                            </div>
                            <div className="w-px h-8 bg-primary/10"></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Nhà cung cấp</p>
                                <p className="text-sm font-semibold">Hải sản Bình Minh</p>
                            </div>
                            <div className="w-px h-8 bg-primary/10"></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Loại sản phẩm</p>
                                <p className="text-sm font-semibold">Cá cơm trắng (Loại A)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 border-2 border-red-400 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center gap-2">
                                <span className="material-icons text-sm">report_problem</span>
                                Báo cáo vi phạm
                            </button>
                            <button className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-105 shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-icons text-sm">check_circle</span>
                                Chấp nhận đơn
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Right Metadata Panel */}
            <aside className="w-80 border-l border-primary/10 bg-white dark:bg-neutral-dark p-6 hidden xl:block">
                <h3 className="font-bold text-lg mb-6">Thông tin chi tiết</h3>
                <div className="space-y-6">
                    <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Kết quả AI</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Cá cơm đạt chuẩn</span>
                                <span className="font-bold">118 con</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Kích thước trung bình</span>
                                <span className="font-bold">6.4 cm</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Tạp chất phát hiện</span>
                                <span className="font-bold text-red-500">6 mẫu</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Màu sắc đồng nhất</span>
                                <span className="font-bold text-primary">94%</span>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-primary/10"></div>

                    <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Lịch sử lô hàng</h4>
                        <div className="relative pl-6 space-y-6">
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200"></div>
                            
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-neutral-dark"></div>
                                <p className="text-xs font-bold">Kiểm tra AI hoàn tất</p>
                                <p className="text-[10px] text-slate-400">Hôm nay, 14:20</p>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white dark:border-neutral-dark"></div>
                                <p className="text-xs font-medium text-slate-500">Đã cập cảng</p>
                                <p className="text-[10px] text-slate-400">Hôm nay, 08:45</p>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white dark:border-neutral-dark"></div>
                                <p className="text-xs font-medium text-slate-500">Khởi tạo vận đơn</p>
                                <p className="text-[10px] text-slate-400">Hôm qua, 16:30</p>
                            </div>
                        </div>
                    </section>
                    
                    <div className="mt-8 bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <div className="flex gap-3 items-center mb-2">
                            <span className="material-icons text-primary">info</span>
                            <span className="text-xs font-bold">Ghi chú AI</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Hệ thống phát hiện một lượng nhỏ tạp chất nhựa (mảnh lưới). Đề nghị kiểm tra thủ công tại khu vực góc phải phía trên của khay.
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default AIDetection;
