import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('id');
    const quantity = parseInt(searchParams.get('qty') || '1');

    const [items, setItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('235 Huỳnh Lắm, Ngũ Hành Sơn, TP. Đà Nẵng');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let checkoutItems = [];
                // 1. Nếu có productId trong URL (Luồng Mua ngay)
                if (productId) {
                    const prodRes = await api.get(`/listings/${productId}`);
                    if (prodRes.data.status === 'success') {
                        checkoutItems = [{
                            ...prodRes.data.data,
                            quantity: quantity
                        }];
                    }
                } else {
                    // 2. Nếu không có ID trong URL, đọc từ Giỏ hàng riêng của User này
                    const userData = JSON.parse(localStorage.getItem('user'));
                    const cartKey = userData?.userId ? `cart_${userData.userId}` : 'cart_guest';
                    
                    // Dọn dẹp dữ liệu rác nếu lỡ có
                    localStorage.removeItem('cart_undefined');
                    localStorage.removeItem('cart_null');
                    
                    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                    checkoutItems = cart;
                }
                setItems(checkoutItems);

                // 3. Lấy thông tin người dùng
                const userRes = await api.get('/users/me');
                if (userRes.data.status === 'success') {
                    setUser(userRes.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu thanh toán:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId, quantity]);

    const handleUpdateQuantity = (idx, newQty) => {
        if (newQty < 1) return;
        const newItems = [...items];
        newItems[idx].quantity = newQty;
        setItems(newItems);
        
        // Cập nhật lại localStorage nếu là mua từ giỏ hàng
        if (!productId) {
            const userData = JSON.parse(localStorage.getItem('user'));
            const cartKey = userData?.userId ? `cart_${userData.userId}` : 'cart_guest';
            localStorage.setItem(cartKey, JSON.stringify(newItems));
        }
    };

    const handleRemoveItem = (idx) => {
        const newItems = items.filter((_, i) => i !== idx);
        setItems(newItems);
        
        // Cập nhật lại localStorage nếu là mua từ giỏ hàng
        if (!productId) {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    const cartKey = userData?.userId ? `cart_${userData.userId}` : 'cart_guest';
            localStorage.setItem(cartKey, JSON.stringify(newItems));
        }
    };

    const handlePlaceOrder = async () => {
        if (items.length === 0 || !user) return;
        
        if (user.role === 'ADMIN') {
            notify.error('Tài khoản Admin không có quyền thực hiện đặt hàng. Vui lòng sử dụng tài khoản Buyer hoặc Seller.');
            return;
        }

        const subtotal = items.reduce((sum, item) => sum + (item.pricePerFish || item.price) * item.quantity, 0);
        const shippingFee = 50000;
        const totalAmount = subtotal + shippingFee + 25000;

        if (user.walletBalance < totalAmount) {
            notify.error(`Số dư ví không đủ! Bạn cần ${(totalAmount).toLocaleString()}đ nhưng hiện chỉ có ${(user.walletBalance).toLocaleString()}đ.`);
            return;
        }

        setProcessing(true);
        try {
            // MVP: Đặt từng đơn cho từng sản phẩm trong checkout (hoặc bạn có thể gộp tùy Backend)
            // Ở đây tôi xử lý cho sản phẩm đầu tiên hoặc loop nếu cần.
            const mainItem = items[0];
            const response = await api.post('/orders', {
                listingId: mainItem.id,
                quantity: mainItem.quantity,
                shippingAddress: address
            });

            if (response.data.status === 'success') {
                // Xóa sản phẩm đã mua khỏi giỏ hàng
                if (!productId) {
                            const userData = JSON.parse(localStorage.getItem('user'));
                    const cartKey = userData?.userId ? `cart_${userData.userId}` : 'cart_guest';
                    localStorage.removeItem(cartKey);
                }
                notify.success('Đặt hàng thành công!');
                navigate('/orders');
            }
        } catch (error) {
            notify.error(error.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
    if (items.length === 0) return (
        <div className="bg-surface text-on-surface antialiased flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-6xl text-slate-300">shopping_cart_off</span>
                <p className="font-bold text-slate-500">Giỏ hàng của bạn đang trống!</p>
                <Link to="/marketplace" className="px-6 py-2 bg-primary text-white rounded-full font-bold uppercase text-xs">Đi mua sắm ngay</Link>
            </main>
        </div>
    );

    const subtotal = items.reduce((sum, item) => sum + (item.pricePerFish || item.price || 0) * item.quantity, 0);
    const shippingFee = 50000;
    const aiFee = 25000;
    const total = subtotal + shippingFee + aiFee;

    return (
        <div className="bg-surface text-on-surface antialiased overflow-hidden font-display flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden relative">
                <header className="flex items-center justify-between px-8 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md h-16 border-b border-cyan-500/5 sticky top-0">
                    <div className="flex items-center gap-4">
                        <span className="text-xs tracking-widest uppercase font-bold text-on-surface-variant/60">Procurement / Checkout</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-surface p-8 pb-0">
                    <div className="max-w-7xl mx-auto mb-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline uppercase">Thanh Toán Đơn Hàng</h2>
                            <p className="text-sm text-on-surface-variant tracking-wide mt-1">Hệ thống giao dịch bảo mật AquaTrade Escrow</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-8 space-y-6">
                                <section className="bg-surface-bright rounded-xl shadow-sm border border-outline p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm font-icon">local_shipping</span>
                                        </span>
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Thông Tin Giao Hàng</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Người Nhận</label>
                                            <input className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium outline-none" type="text" defaultValue={user?.fullName} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Số Điện Thoại</label>
                                            <input className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium outline-none" type="text" defaultValue={user?.phoneNumber || '090xxxxxxx'} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Địa Chỉ Nhận Hàng</label>
                                            <div className="relative">
                                                <input 
                                                    className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm font-medium pr-10 outline-none" 
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    type="text" 
                                                />
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-primary text-sm font-icon">location_on</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-surface-bright rounded-xl shadow-sm border border-outline p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm font-icon">payments</span>
                                        </span>
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Hình Thức Thanh Toán</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between border-2 border-primary ring-4 ring-primary/5">
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-primary font-icon">account_balance_wallet</span>
                                                <div>
                                                    <p className="text-sm font-bold uppercase">Aqua Wallet Balance</p>
                                                    <p className="text-[10px] text-primary/80 tracking-widest uppercase">Verified Priority Transfer</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{user?.walletBalance?.toLocaleString()}đ</p>
                                                <p className="text-[10px] text-slate-400">SỐ DƯ KHẢ DỤNG</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="lg:col-span-4 lg:sticky lg:top-24">
                                <div className="bg-surface-bright rounded-xl shadow-lg border border-primary/10 overflow-hidden">
                                    <div className="p-6 bg-slate-900 text-white">
                                        <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                            Tóm tắt đơn hàng ({items.length} mặt hàng)
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="max-h-60 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 group">
                                                    <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-slate-100">
                                                        <img className="w-full h-full object-cover" alt={item.title} src={item.thumbnailUrl || item.imageUrl || "https://muoibienseafood.com/wp-content/uploads/2024/11/Phan-biet-tom-the-va-tom-su.jpg.webp"} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-slate-800 uppercase truncate mb-1">{item.title}</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                                                <button 
                                                                    onClick={() => handleUpdateQuantity(idx, item.quantity - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined text-xs">remove</span>
                                                                </button>
                                                                <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                                                                <button 
                                                                    onClick={() => handleUpdateQuantity(idx, item.quantity + 1)}
                                                                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-all"
                                                                >
                                                                    <span className="material-symbols-outlined text-xs">add</span>
                                                                </button>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleRemoveItem(idx)}
                                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-slate-800">{((item.pricePerFish || item.price) * item.quantity).toLocaleString()}đ</p>
                                                        <p className="text-[9px] text-slate-400">{(item.pricePerFish || item.price)?.toLocaleString()}đ/con</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-px bg-primary/5"></div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 uppercase tracking-wider">Tạm tính</span>
                                                <span className="font-medium">{subtotal.toLocaleString()}đ</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500 uppercase tracking-wider">Phí vận chuyển</span>
                                                <span className="font-medium">{shippingFee.toLocaleString()}đ</span>
                                            </div>
                                            <div className="flex justify-between text-xs items-center">
                                                <span className="text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] font-icon">auto_awesome</span>
                                                    AI Verification
                                                </span>
                                                <span className="font-medium text-primary">{aiFee.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-primary/10">
                                            <div className="flex justify-between items-baseline mb-6">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Tổng thanh toán</span>
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter">{total.toLocaleString()}đ</span>
                                            </div>
                                            <button 
                                                onClick={handlePlaceOrder}
                                                disabled={processing}
                                                className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-black py-4 rounded-lg uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
                                            >
                                                {processing ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
                                            </button>
                                            <p className="text-[9px] text-center text-slate-400 mt-4 leading-relaxed px-4">
                                                Tiền sẽ được khóa trong hệ thống Escrow và chỉ chuyển cho người bán khi bạn xác nhận đã nhận hàng thành công.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 rounded-xl bg-cyan-50 border border-cyan-100 flex gap-4">
                                    <span className="material-symbols-outlined text-cyan-500 text-xl font-icon" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Smart-Contract Secured</p>
                                        <p className="text-[10px] text-cyan-700/70">Số tiền được bảo vệ bởi AquaTrade AI cho đến khi lô hàng được bàn giao an toàn.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="flex flex-col md:flex-row justify-between items-center w-full py-8 mt-12 border-t border-cyan-500/5 bg-slate-50 dark:bg-slate-900 font-sans text-[11px] tracking-widest uppercase text-slate-400">
                        <div className="mb-4 md:mb-0">
                            <span className="font-bold text-slate-500 mr-2">AQUATRADE AI</span>
                            © 2024 Laboratory Precision Logistics.
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
