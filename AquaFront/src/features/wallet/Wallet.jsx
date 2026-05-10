import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { notify } from '../../utils/toast';

const Wallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
    const [isDepositing, setIsDepositing] = useState(false);

    const [showQR, setShowQR] = useState(false);
    
    const handleNextStep = () => {
        if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 10000) {
            notify.warning('Vui lòng nhập số tiền từ 10,000đ trở lên');
            return;
        }
        setShowQR(true);
    };

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/me/wallet');
            if (response.data.status === 'success') {
                setWalletData(response.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin ví:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'TOP_UP': return 'add_circle';
            case 'ESCROW_LOCK': return 'lock';
            case 'ESCROW_RELEASE': return 'lock_open';
            case 'ORDER_PAYOUT': return 'payments';
            case 'WITHDRAW': return 'account_balance_wallet';
            case 'PLATFORM_COMMISSION': return 'account_balance';
            default: return 'swap_horiz';
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case 'TOP_UP': return 'text-emerald-500 bg-emerald-50';
            case 'ESCROW_LOCK': return 'text-amber-500 bg-amber-50';
            case 'ESCROW_RELEASE': return 'text-blue-500 bg-blue-50';
            case 'ORDER_PAYOUT': return 'text-cyan-500 bg-cyan-50';
            case 'WITHDRAW': return 'text-rose-500 bg-rose-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    const handleConfirmDeposit = async () => {
        try {
            setIsDepositing(true);
            const response = await api.post('/users/me/wallet/deposit', {
                amount: parseFloat(depositAmount),
                paymentMethod: paymentMethod
            });
            if (response.data.status === 'success') {
                notify.success('Yêu cầu nạp tiền đã được gửi thành công! Vui lòng chờ Admin phê duyệt.');
                setShowTopUpModal(false);
                setShowQR(false);
                setDepositAmount('');
                fetchWalletData();
            }
        } catch (error) {
            notify.error('Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsDepositing(false);
        }
    };

    if (loading && !walletData) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] text-slate-900 font-sans min-h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-y-auto min-h-screen relative">
                
                {/* Glossy Header */}
                <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">Trung tâm Tài chính</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quản lý dòng tiền & Thanh toán Escrow</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                            {walletData?.userLevel?.[0] || (JSON.parse(localStorage.getItem('user'))?.fullName?.[0]) || 'U'}
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-10">
                    
                    {/* Hero Section: The Aqua Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 relative">
                            {/* Glassmorphism Card */}
                            <div className="relative h-64 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-cyan-900/20 overflow-hidden group">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-1">AquaTrade Digital Wallet</p>
                                            <h2 className="text-sm font-medium opacity-60">Số dư khả dụng</h2>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            <span className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{walletData?.userLevel || 'Standard'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-5xl font-black tracking-tighter mb-2">
                                            {(walletData?.walletBalance || 0).toLocaleString()} <span className="text-xl font-medium opacity-40 uppercase">Vnd</span>
                                        </h3>
                                        <p className="text-xs font-mono opacity-50 tracking-[0.2em]">**** **** **** 8892</p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                +
                                            </div>
                                        </div>
                                        {/* PHÂN QUYỀN: Dùng dữ liệu thật từ Server để hiển thị nút nạp tiền */}
                                        {walletData?.userLevel && (walletData.userLevel.includes('BUYER') || walletData.userLevel.includes('SELLER')) ? (
                                            <button 
                                                onClick={() => { setShowTopUpModal(true); setShowQR(false); }}
                                                className="px-6 py-3 bg-[#13ecc8] text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-[#13ecc8]/20 hover:brightness-110 active:scale-95 transition-all"
                                            >
                                                Nạp thêm tiền
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 bg-slate-700/50 rounded-lg text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                CHẾ ĐỘ QUẢN TRỊ
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Watermark Logo */}
                                <div className="absolute right-8 bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="material-symbols-outlined text-[120px]">water_drop</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Panel */}
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">trending_up</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dòng tiền vào</p>
                                        <p className="text-lg font-bold text-slate-800">+ 12.500.000₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined">lock</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đang tạm giữ</p>
                                        <p className="text-lg font-bold text-slate-800">5.200.000₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mb-1">Hỗ trợ 24/7</p>
                                        <p className="text-xs text-white/70 font-medium">Bạn cần hỗ trợ giao dịch?</p>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                        <span className="material-symbols-outlined text-sm">support_agent</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-800">Lịch sử giao dịch</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Dữ liệu được bảo mật bởi AquaTrade AI</p>
                            </div>
                            <button className="px-4 py-2 text-xs font-bold text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all uppercase tracking-widest">Tải báo cáo (.PDF)</button>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Giao dịch</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID Order</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thời gian</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {walletData?.recentTransactions?.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                                                        <span className="material-symbols-outlined text-xl">{getTransactionIcon(tx.type)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{tx.type}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.paymentMethod || 'SYSTEM'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-mono text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded">
                                                    {tx.orderId ? tx.orderId.substring(0, 8).toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-xs font-bold text-slate-600">
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase">
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className={`text-sm font-black ${tx.type === 'TOP_UP' || tx.type === 'ORDER_PAYOUT' || tx.type === 'ESCROW_RELEASE' ? 'text-emerald-500' : 'text-slate-800'}`}>
                                                    {tx.type === 'TOP_UP' || tx.type === 'ORDER_PAYOUT' || tx.type === 'ESCROW_RELEASE' ? '+' : '-'} {tx.amount?.toLocaleString()}₫
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium italic">Balance: {tx.postBalance?.toLocaleString()}₫</p>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                                                    tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!walletData?.recentTransactions || walletData.recentTransactions.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">
                                                Chưa có lịch sử giao dịch
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <Footer />
                </main>

                {/* Top Up Modal */}
                {showTopUpModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight text-slate-800">
                                            {showQR ? 'Quét mã để nạp tiền' : 'Nạp tiền vào ví'}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                            {showQR ? 'Sử dụng App Ngân hàng hoặc MoMo' : 'Nhanh chóng & Bảo mật tuyệt đối'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => { setShowTopUpModal(false); setShowQR(false); }}
                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {!showQR ? (
                                    <>
                                        {/* Step 1: Selection */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[500000, 1000000, 5000000, 10000000, 20000000, 50000000].map((amount) => (
                                                <button 
                                                    key={amount}
                                                    onClick={() => setDepositAmount(amount.toString())}
                                                    className={`py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${
                                                        depositAmount === amount.toString() 
                                                        ? 'bg-slate-900 text-white shadow-lg' 
                                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {amount >= 1000000 ? `${amount/1000000}M` : `${amount/1000}K`}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                                <span className="text-slate-400 font-black text-sm uppercase tracking-widest">Vnd</span>
                                            </div>
                                            <input 
                                                type="number"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                                className="w-full pl-20 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-cyan-500/10 text-2xl font-black text-slate-800 placeholder:text-slate-200 transition-all outline-none" 
                                                placeholder="0.00" 
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Chọn phương thức</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                <button 
                                                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                                        paymentMethod === 'BANK_TRANSFER' ? 'border-cyan-500 bg-cyan-50/30' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700">
                                                            <span className="material-symbols-outlined">qr_code_2</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-black text-slate-800">VietQR / MoMo</p>
                                                            <p className="text-[10px] text-slate-400 font-bold">Tạo mã QR động tức thì</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleNextStep}
                                            className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-sm rounded-[1.5rem] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            Tiếp theo
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Step 2: Show Dynamic QR */}
                                        <div className="flex flex-col items-center space-y-6 animate-in slide-in-from-right-4 duration-300">
                                            <div className="p-4 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl relative group">
                                                <img 
                                                    src={`https://img.vietqr.io/image/MB-0777412659-compact2.png?amount=${depositAmount}&addInfo=NAP%20AQUATRADE%20${JSON.parse(localStorage.getItem('user'))?.fullName.toUpperCase()}&accountName=LY%20THANH%20LONG`}
                                                    alt="Dynamic VietQR"
                                                    className="w-64 h-64 object-contain rounded-2xl"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-[2px] transition-opacity pointer-events-none">
                                                    <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                                        Quét để thanh toán
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center space-y-2">
                                                <p className="text-2xl font-black text-slate-800">{parseInt(depositAmount).toLocaleString()}₫</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nội dung: NAP AQUATRADE {JSON.parse(localStorage.getItem('user'))?.fullName.toUpperCase()}</p>
                                            </div>

                                            <div className="w-full grid grid-cols-2 gap-4">
                                                <button 
                                                    onClick={() => setShowQR(false)}
                                                    className="py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all"
                                                >
                                                    Quay lại
                                                </button>
                                                <button 
                                                    onClick={handleConfirmDeposit}
                                                    disabled={isDepositing}
                                                    className="py-4 bg-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isDepositing ? 'Đang xử lý...' : 'Đã chuyển tiền'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
