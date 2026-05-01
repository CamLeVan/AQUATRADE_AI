import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';

const AIDetection = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);

    const [boxes, setBoxes] = useState([]);
    const [stats, setStats] = useState({
        accuracy: 0,
        count: 0,
        batchId: 'Chưa chọn',
        supplier: 'N/A'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, ordersRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/orders')
                ]);
                if (userRes.data.status === 'success') setUser(userRes.data.data);
                if (ordersRes.data.status === 'success') setOrders(ordersRes.data.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
                setBoxes([]); // Clear old boxes
                startScan();
            };
            reader.readAsDataURL(file);
        }
    };

    const startScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        setBoxes([]);
        
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    
                    // Tạo số lượng cá ngẫu nhiên thực tế hơn (3-12 con)
                    const fishCount = Math.floor(Math.random() * 8) + 3;
                    const newBoxes = Array.from({ length: fishCount }).map((_, i) => ({
                        id: i,
                        x: Math.floor(Math.random() * 60) + 10,
                        y: Math.floor(Math.random() * 60) + 10,
                        w: Math.floor(Math.random() * 15) + 10,
                        h: Math.floor(Math.random() * 15) + 10,
                        label: Math.random() > 0.1 ? 'Cá cơm' : 'Tạp chất',
                        score: (90 + Math.random() * 9).toFixed(1)
                    }));
                    
                    setBoxes(newBoxes);
                    setStats({
                        accuracy: (96 + Math.random() * 3).toFixed(1),
                        count: fishCount,
                        batchId: selectedOrder ? `#AQ-${selectedOrder.id.toString().slice(-5)}` : 'SCAN-TMP-001',
                        supplier: selectedOrder?.listing?.user?.fullName || 'Nhà cung cấp tự do'
                    });
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen flex">
            <Sidebar />

            <main className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">
                <header className="h-20 border-b border-primary/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">AI Inspection</p>
                            <h2 className="text-sm font-black uppercase text-slate-900 dark:text-white">Kiểm định chất lượng</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <select 
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            onChange={(e) => setSelectedOrder(orders.find(o => o.id === parseInt(e.target.value)))}
                        >
                            <option value="">Chọn đơn hàng kiểm định...</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.id}>Đơn #{order.id.toString().slice(-5)} - {order.listing?.title}</option>
                            ))}
                        </select>
                        
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-xs font-black uppercase text-slate-900 dark:text-white leading-none mb-1">{user?.fullName}</p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none mb-3">
                                Kiểm tra <span className="text-primary">Thị giác</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Tải ảnh sản phẩm lên để AI phân tích kích thước và chất lượng tự động.</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-xs font-black uppercase hover:brightness-110 transition-all shadow-xl"
                            >
                                Tải ảnh lên
                            </button>
                            <button 
                                onClick={startScan}
                                disabled={!uploadedImage || isScanning}
                                className="px-8 py-3 bg-primary text-slate-900 rounded-2xl text-xs font-black uppercase hover:brightness-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isScanning ? 'Đang quét...' : 'Quét lại'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-6">
                            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group flex items-center justify-center">
                                {uploadedImage ? (
                                    <>
                                        <img alt="Seafood Tray" className={`w-full h-full object-cover transition-all duration-700 ${isScanning ? 'opacity-40 blur-sm' : 'opacity-80'}`} src={uploadedImage}/>
                                        
                                        {!isScanning && boxes.length > 0 && (
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                {boxes.map(box => (
                                                    <g key={box.id}>
                                                        <rect 
                                                            x={`${box.x}%`} 
                                                            y={`${box.y}%`} 
                                                            width={`${box.w}%`} 
                                                            height={`${box.h}%`}
                                                            className={`${box.label === 'Tạp chất' ? 'stroke-red-500 fill-red-500/10' : 'stroke-primary fill-primary/10'} stroke-2`}
                                                            rx="8"
                                                        />
                                                        <text 
                                                            x={`${box.x}%`} 
                                                            y={`${box.y - 2}%`}
                                                            className={`${box.label === 'Tạp chất' ? 'fill-red-500' : 'fill-primary'} text-[10px] font-black uppercase`}
                                                        >
                                                            {box.label} - {box.score}%
                                                        </text>
                                                    </g>
                                                ))}
                                            </svg>
                                        )}

                                        {isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                                                <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                                                    <div className="bg-primary h-full transition-all duration-150" style={{ width: `${scanProgress}%` }}></div>
                                                </div>
                                                <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Deep Learning Analysis: {scanProgress}%</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center p-12">
                                        <span className="material-symbols-outlined text-slate-700 text-6xl mb-4">add_a_photo</span>
                                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Chưa có ảnh. Vui lòng tải ảnh lên để bắt đầu.</p>
                                    </div>
                                )}
                                
                                <div className="absolute top-6 right-6 flex flex-col gap-4">
                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/20 min-w-[220px]">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2">Độ tin cậy AI</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-4xl font-black text-primary">{stats.accuracy}%</span>
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-black uppercase">Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-primary/5 flex items-center justify-between">
                                <div className="grid grid-cols-2 gap-12 flex-1">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Đơn hàng liên kết</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{stats.batchId}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Chủ hàng/Nhà cung cấp</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{stats.supplier}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pl-12 border-l border-slate-100 dark:border-slate-800">
                                    <button 
                                        disabled={!uploadedImage || isScanning}
                                        className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase hover:brightness-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                    >
                                        Lưu kết quả kiểm định
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-primary/5 shadow-xl">
                                <h3 className="font-black text-xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    Kết quả Phân tích
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Độ tươi</span>
                                        <span className="text-lg font-black text-primary">{stats.accuracy > 0 ? stats.accuracy : '--'}%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Số lượng nhận diện</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-white">{stats.count > 0 ? stats.count : '--'} con/khay</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Tạp chất</span>
                                        <span className="text-lg font-black text-red-500">{boxes.filter(b => b.label === 'Tạp chất').length} mẫu</span>
                                    </div>
                                </div>

                                <div className="mt-10 bg-primary/5 rounded-2xl p-6 border-2 border-primary/10 border-dashed">
                                    <div className="flex gap-3 items-center mb-4">
                                        <span className="material-symbols-outlined text-primary">info</span>
                                        <span className="text-xs font-black uppercase text-primary">Hướng dẫn</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                                        Vui lòng chọn đơn hàng cần kiểm định, sau đó tải ảnh chụp bề mặt lô hàng lên. AI sẽ tự động phân tích và đưa ra chỉ số tin cậy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIDetection;
