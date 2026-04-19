import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

const ProductDetails = () => {
    return (
        <div className="bg-surface text-on-surface antialiased flex min-h-screen">
            {/* Shared Sidebar Component */}
            <Sidebar />

            <main className="lg:ml-64 flex-1 min-h-screen flex flex-col">
                {/* TopNavBar (Shared Component) */}
                <header className="sticky top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-[#13ecc8]/10 flex justify-between items-center px-8 h-16">
                    <div className="flex items-center gap-8">
                        <nav className="flex gap-6">
                            <Link className="text-[#13ecc8] border-b-2 border-[#13ecc8] pb-1 font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Fresh Catch</Link>
                            <Link className="text-slate-600 hover:text-[#13ecc8] transition-all font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Wholesale</Link>
                            <Link className="text-slate-600 hover:text-[#13ecc8] transition-all font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Global Hub</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:flex items-center bg-surface-container rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary transition-all">
                            <span className="material-icons-outlined text-slate-400 text-sm">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder-slate-400 outline-none" placeholder="Tìm kiếm hải sản..." type="text"/>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative text-slate-600 hover:text-primary transition-colors">
                                <span className="material-icons-outlined">notifications</span>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                            <button className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                                <span className="text-xs font-bold tracking-widest uppercase">Cart (3)</span>
                                <span className="material-icons-outlined">shopping_cart</span>
                            </button>
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-primary/10">
                                <img alt="Officer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIEDrcGQTHe3sarpxgjQ2_pmblqfAyYdxq5EZdAJqaksx2TuAhSfRQNdLVt679U5zmDMYjqZq_qeq--QWmWnTD-KP5A4ELjVlAw_HnPGMw5pr2dqIobC6Xy1knOeRpKL978I6OUw5Mh8fPqAnUnb49SeOyGqaC03zbmZXdOaPIS-OP5aqtf-HssfKI6wO-JepKZKMWu"/>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Product Content Canvas */}
                <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
                    {/* Left Column: Main Product Info & Details */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Product Identity & Media */}
                        <section className="bg-surface-container-lowest rounded-xl p-4 overflow-hidden shadow-sm border border-primary/5">
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden group">
                                <img alt="Tôm Thẻ Chân Trắng - Lô A24" className="w-full h-full object-cover" src="https://muoibienseafood.com/wp-content/uploads/2024/11/Phan-biet-tom-the-va-tom-su.jpg.webp"/>
                                {/* AI Analysis Overlays (Bounding Boxes) */}
                                <div className="absolute top-[20%] left-[30%] w-[15%] h-[20%] border-2 border-primary rounded-sm bg-primary/10 pointer-events-none">
                                    <span className="absolute -top-6 left-0 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest whitespace-nowrap">ID: SH-01 (99%)</span>
                                </div>
                                <div className="absolute top-[50%] left-[60%] w-[12%] h-[18%] border-2 border-primary rounded-sm bg-primary/10 pointer-events-none">
                                    <span className="absolute -top-6 left-0 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest whitespace-nowrap">ID: SH-02 (98%)</span>
                                </div>
                                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Live AI Feed
                                    </span>
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase">Verified Batch: A24-2024</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">AI Verified Quality</span>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="material-icons-outlined text-sm">location_on</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">Cà Mau, Việt Nam</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">Tôm Thẻ Chân Trắng - Lô A24</h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <p className="text-primary font-black text-2xl">285.000đ <span className="text-sm font-medium text-slate-500">/kg</span></p>
                                    <div className="hidden md:block h-6 w-px bg-primary/10"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden">
                                            <img alt="Seller" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMnugEAnhMZltRa8fm_QqSs3kHu2bJzEAepouTrZoSiMu_m9Rj5L2ZG26DccFlgsOIq3RwNg9LQbqafCr16zrbuGe6bTFAJdLnR-_gDeFiGcLqW5WHj6pILAHIbx70HLfXX9lMTHYl6R8pIfre4o112PmXSCYRlUUD1lugZLhmk9oOvHSVTqLptUeJ1UoRRDr70-Jz0w04W7BugXWOYtOzwh7dr4tM9d8qbOc_i5H6qxCowxNrD96Srg_5v0ovnqwZ9sdprxZ7IALW"/>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Hợp tác xã Thủy sản Cà Mau</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technical Specifications & AI Report */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-primary/5">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-2">
                                    <span className="material-icons-outlined text-primary">description</span>
                                    Thông số kỹ thuật
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Kích cỡ (Size)</span>
                                        <span className="text-sm font-bold text-slate-800">30 - 40 con/kg</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Quy cách</span>
                                        <span className="text-sm font-bold text-slate-800">Thùng 5kg</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Nguồn gốc</span>
                                        <span className="text-sm font-bold text-slate-800">Đầm Dơi, Cà Mau</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Hình thức</span>
                                        <span className="text-sm font-bold text-slate-800">Nguyên con (HOSO)</span>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-surface-container rounded-xl p-6 shadow-sm border border-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <span className="material-icons-outlined text-6xl">psychology</span>
                                </div>
                                <h3 className="text-xs font-bold tracking-widest uppercase text-primary mb-6 flex items-center gap-2 relative z-10">
                                    <span className="material-icons-outlined text-primary">verified</span>
                                    Báo cáo Phân tích AI
                                </h3>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-primary/5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-slate-800">98</span>
                                            <span className="text-[10px] font-bold text-primary">%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-100 rounded-full mt-2">
                                            <div className="w-[98%] h-full bg-primary rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-primary/5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Freshness</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-slate-800">99</span>
                                            <span className="text-[10px] font-bold text-primary">%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-100 rounded-full mt-2">
                                            <div className="w-[99%] h-full bg-primary rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-[11px] leading-relaxed text-slate-600 italic relative z-10">
                                    "Mẫu tôm cho thấy sự đồng nhất về kích thước vượt trội, độ cứng vỏ hoàn hảo và không có dấu hiệu nhiễm khuẩn hữu cơ."
                                </p>
                            </section>
                        </div>

                        {/* Product Description */}
                        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-primary/5">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Mô tả sản phẩm</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                                <p>Tôm thẻ chân trắng từ Hợp tác xã Thủy sản Cà Mau được nuôi theo quy trình công nghệ cao, đảm bảo không kháng sinh và đạt chuẩn xuất khẩu. Lô hàng A24 được thu hoạch vào sáng sớm hôm nay, trải qua quy trình hạ thân nhiệt ngay lập tức để giữ độ tươi giòn tự nhiên.</p>
                                <p>Vỏ tôm mỏng, sáng bóng, thịt chắc và có vị ngọt đậm đà đặc trưng của vùng nước lợ Cà Mau. Sản phẩm cực kỳ phù hợp cho các nhà hàng cao cấp, chuỗi siêu thị hải sản hoặc các đơn vị chế biến chuyên sâu yêu cầu chất lượng đồng nhất.</p>
                                <p>Hệ thống AquaTrade AI đã quét 100% mẫu trong lô hàng này để đảm bảo mỗi kg tôm đều đạt chuẩn size 30-40, mang lại hiệu quả kinh tế cao nhất cho khách hàng Wholesale.</p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Action Card */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-lg border border-primary/10">
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Đặt hàng ngay</h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Số lượng (Thùng 5kg)</label>
                                        <div className="flex items-center justify-between bg-surface-container rounded-lg p-2">
                                            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                                                <span className="material-icons-outlined">remove</span>
                                            </button>
                                            <span className="text-lg font-bold text-slate-800">10</span>
                                            <button className="w-10 h-10 flex items-center justify-center text-primary hover:text-primary-dark transition-colors">
                                                <span className="material-icons-outlined">add</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 py-4 border-t border-primary/5">
                                        <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wide">
                                            <span>Tạm tính (50kg)</span>
                                            <span>14.250.000đ</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wide">
                                            <span>Phí vận chuyển AI</span>
                                            <span>250.000đ</span>
                                        </div>
                                        <div className="flex justify-between items-end pt-2">
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Tổng cộng</span>
                                            <span className="text-2xl font-black text-primary">14.500.000đ</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                            <span className="material-icons-outlined">shopping_basket</span>
                                            Thêm vào giỏ
                                        </button>
                                        <button className="w-full py-4 bg-slate-800 text-white font-bold rounded-lg uppercase tracking-widest text-sm hover:bg-slate-900 transition-all">
                                            Mua ngay
                                        </button>
                                    </div>
                                    <div className="pt-4 flex items-center gap-3 text-slate-400">
                                        <span className="material-icons-outlined text-primary text-sm">verified_user</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Thanh toán bảo mật bởi AquaTrade</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-primary/20 p-2 rounded-lg">
                                        <span className="material-icons-outlined text-primary">bolt</span>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Giao hàng siêu tốc</h5>
                                        <p className="text-[11px] text-slate-500 mt-1">Lô hàng này đủ điều kiện vận chuyển trong 4h tới TP.HCM bằng xe đông lạnh chuyên dụng.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer (Shared Component) */}
                <footer className="w-full py-12 px-8 mt-20 border-t border-[#13ecc8]/10 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center w-full gap-8">
                        <div className="flex flex-col gap-2">
                            <p className="font-['Inter'] text-[10px] tracking-widest uppercase text-slate-500">
                                © 2024 AquaTrade AI Laboratory. AI-Verified Seafood Logistics.
                            </p>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-8">
                            <Link className="font-['Inter'] text-[10px] tracking-widest uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors" to="#">Traceability Protocol</Link>
                            <Link className="font-['Inter'] text-[10px] tracking-widest uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors" to="#">Terms of Service</Link>
                            <Link className="font-['Inter'] text-[10px] tracking-widest uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors" to="#">Privacy</Link>
                            <Link className="font-['Inter'] text-[10px] tracking-widest uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors" to="#">Contact Laboratory</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="font-['Inter'] text-[10px] tracking-widest uppercase text-primary font-bold">System Status: Optimal</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default ProductDetails;
