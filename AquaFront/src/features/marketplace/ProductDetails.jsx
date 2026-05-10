import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const ProductDetails = () => {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const response = await api.get(`/listings/${productId}`);
                if (response.data.status === 'success') {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            notify.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            return;
        }

        const cartKey = `cart_${user.userId}`;
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.pricePerFish,
            quantity: quantity,
            thumbnailUrl: product.thumbnailUrl
        };
        // Lấy giỏ hàng riêng của User này
        let existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingItemIndex = existingCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // Nếu có rồi thì cộng dồn số lượng
            existingCart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu chưa có thì mới thêm mới
            existingCart.push(cartItem);
        }

        localStorage.setItem(cartKey, JSON.stringify(existingCart));
        notify.success(`Đã thêm ${quantity} con ${product.title} vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        // Chuyển sang trang checkout kèm thông tin
        navigate(`/checkout?id=${product.id}&qty=${quantity}`);
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
    if (!product) return <div className="flex h-screen items-center justify-center bg-white font-bold text-slate-500">Không tìm thấy sản phẩm!</div>;

    const totalPrice = (product.pricePerFish || 0) * quantity;

    return (
        <div className="bg-surface text-on-surface antialiased flex min-h-screen">
            <Sidebar />
            <main className="lg:ml-64 flex-1 min-h-screen flex flex-col">
                <header className="sticky top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-[#13ecc8]/10 flex justify-between items-center px-8 h-16">
                    <div className="flex items-center gap-8">
                        <nav className="flex gap-6">
                            <Link className="text-[#13ecc8] border-b-2 border-[#13ecc8] pb-1 font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Fresh Catch</Link>
                            <Link className="text-slate-600 hover:text-[#13ecc8] transition-all font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Wholesale</Link>
                            <Link className="text-slate-600 hover:text-[#13ecc8] transition-all font-['Inter'] text-sm font-medium tracking-wide uppercase" to="#">Global Hub</Link>
                        </nav>
                    </div>
                </header>

                <div className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <section className="bg-surface-container-lowest rounded-xl p-4 overflow-hidden shadow-sm border border-primary/5">
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden group">
                                <img
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    src={product.thumbnailUrl || "https://muoibienseafood.com/wp-content/uploads/2024/11/Phan-biet-tom-the-va-tom-su.jpg.webp"}
                                />
                                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Live AI Feed
                                    </span>
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase">Batch: {product.id.substring(0, 8)}</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">AI Verified Quality</span>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="material-icons-outlined text-sm">location_on</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">{product.province}, Việt Nam</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">{product.title}</h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <p className="text-primary font-black text-2xl">{product.pricePerFish?.toLocaleString()}đ <span className="text-sm font-medium text-slate-500">/con</span></p>
                                    <div className="hidden md:block h-6 w-px bg-primary/10"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Người bán: {product.sellerName || 'Cửa hàng AquaTrade'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-primary/5">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-2">
                                    <span className="material-icons-outlined text-primary">description</span>
                                    Thông số kỹ thuật
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Loài</span>
                                        <span className="text-sm font-bold text-slate-800">{product.species || 'Tôm thẻ'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Số lượng còn</span>
                                        <span className="text-sm font-bold text-slate-800">{product.availableQuantity?.toLocaleString()} con</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-primary/5">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Nguồn gốc</span>
                                        <span className="text-sm font-bold text-slate-800">{product.province}</span>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-surface-container rounded-xl p-6 shadow-sm border border-primary/10 relative overflow-hidden">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-primary mb-6 flex items-center gap-2 relative z-10">
                                    <span className="material-icons-outlined text-primary">verified</span>
                                    Báo cáo Phân tích AI
                                </h3>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-surface-container-lowest p-3 rounded-lg border border-primary/5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-slate-800">{product.aiHealthScore || 98}</span>
                                            <span className="text-[10px] font-bold text-primary">%</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-[11px] leading-relaxed text-slate-600 italic relative z-10">
                                    "Hệ thống AI đánh giá mẫu hàng này có tỷ lệ sống cao, hình thái khỏe mạnh và phản xạ tốt với môi trường."
                                </p>
                            </section>
                        </div>

                        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-primary/5">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Mô tả sản phẩm</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                                <p>{product.description || 'Sản phẩm hải sản chất lượng cao, đã qua quy trình kiểm định nghiêm ngặt của AquaTrade AI. Đảm bảo chất lượng tươi sống và an toàn sinh học cho bà con nông dân và nhà phân phối.'}</p>
                            </div>
                        </section>
                    </div>

                    <div className="col-span-12 lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-lg border border-primary/10">
                                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Đặt hàng ngay</h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Số lượng mua (con)</label>
                                        <div className="flex items-center justify-between bg-surface-container rounded-xl p-1 shadow-inner">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary rounded-lg transition-all disabled:opacity-30"
                                                disabled={quantity <= 1}
                                            >
                                                <span className="material-icons-outlined text-lg">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val)) setQuantity(Math.min(product.availableQuantity, Math.max(1, val)));
                                                }}
                                                className="w-full bg-transparent text-center text-xl font-black text-slate-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(q => Math.min(product.availableQuantity, q + 1))}
                                                className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white hover:text-primary-dark rounded-lg transition-all disabled:opacity-30"
                                                disabled={quantity >= product.availableQuantity}
                                            >
                                                <span className="material-icons-outlined text-lg">add</span>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {[10, 20, 50, 100].map(amt => (
                                                <button
                                                    key={amt}
                                                    onClick={() => setQuantity(q => Math.min(product.availableQuantity, q + amt))}
                                                    className="flex-1 py-1.5 text-[10px] font-black bg-slate-100 hover:bg-primary/10 text-slate-500 hover:text-primary rounded-md transition-all border border-slate-200/50"
                                                >
                                                    +{amt}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2 italic text-right font-bold uppercase tracking-tighter">Tối đa: {product.availableQuantity?.toLocaleString()} con</p>
                                    </div>
                                    <div className="space-y-2 py-4 border-t border-primary/5">
                                        <div className="flex justify-between items-end pt-2">
                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Tổng cộng</span>
                                            <span className="text-2xl font-black text-primary">{totalPrice.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN' ? (
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-[10px] font-bold uppercase text-center leading-relaxed">
                                                Tài khoản Admin không có quyền thực hiện giao dịch mua bán.
                                            </div>
                                        ) : JSON.parse(localStorage.getItem('user'))?.userId === product.sellerId ? (
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-[10px] font-bold uppercase text-center leading-relaxed">
                                                Bạn là người đăng bài này. Bạn không thể tự mua sản phẩm của chính mình.
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined">shopping_basket</span>
                                                    Thêm vào giỏ
                                                </button>
                                                <button
                                                    onClick={handleBuyNow}
                                                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-lg uppercase tracking-widest text-sm hover:bg-slate-900 transition-all"
                                                >
                                                    Mua ngay
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
};

export default ProductDetails;
