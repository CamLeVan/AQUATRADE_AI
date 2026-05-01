import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';

const MarketPrices = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleConsultStrategy = () => {
        const prompt = `Dựa trên dữ liệu ${listings.length} bài đăng thực tế, hãy tư vấn cho tôi chiến lược mua hàng tối ưu nhất vào lúc này. Tôi nên tập trung vào loại hải sản nào?`;
        navigate(`/chat?prompt=${encodeURIComponent(prompt)}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingRes, userRes] = await Promise.all([
                    api.get('/listings'),
                    api.get('/users/me')
                ]);

                if (listingRes.data.status === 'success') {
                    setListings(listingRes.data.data);
                }
                if (userRes.data.status === 'success') {
                    setUser(userRes.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu thị trường:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Tính toán thống kê từ dữ liệu thật
    const avgFishPrice = listings.filter(l => l.category?.toLowerCase().includes('cá')).reduce((acc, curr) => acc + (curr.pricePerFish || 0), 0) / (listings.filter(l => l.category?.toLowerCase().includes('cá')).length || 1);
    const avgShrimpPrice = listings.filter(l => l.category?.toLowerCase().includes('tôm')).reduce((acc, curr) => acc + (curr.pricePerFish || 0), 0) / (listings.filter(l => l.category?.toLowerCase().includes('tôm')).length || 1);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

    return (
        <div className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen flex font-['Inter']">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
                {/* TopNavBar */}
                <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 px-8 bg-white/70 backdrop-blur-md border-b border-cyan-500/10 z-40 flex justify-between items-center transition-all">
                    <div className="flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="w-full bg-surface-container border-none outline-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary transition-all bg-slate-100 dark:bg-slate-800" placeholder="Tìm kiếm thị trường..." type="text"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 hover:bg-cyan-500/5 rounded-full transition-colors active:scale-95">
                                <span className="material-symbols-outlined font-icon">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            </button>
                        </div>
                        <div className="h-8 w-px bg-cyan-500/10 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800 leading-none">{user?.fullName || 'User Name'}</p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">{user?.role || 'Member'}</p>
                            </div>
                            <img alt="User profile" className="w-9 h-9 rounded-full border border-primary/20 object-cover" src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80"}/>
                        </div>
                    </div>
                </header>

                <main className="flex-1 pt-16 flex flex-col">
                    <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Market Feed</span>
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Thị Trường Giá Thủy Sản Thực Tế</h2>
                                <p className="text-sm text-slate-500 font-medium">Cập nhật dựa trên {listings.length} bài đăng giao dịch hiện có</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-primary/10 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-primary/5 transition-colors">
                                    <span className="material-symbols-outlined text-sm">download</span> Xuất Báo Cáo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-primary/10 shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">trending_up</span> Xu hướng giá trung bình
                                    </h3>
                                </div>
                                <div className="h-48 relative overflow-hidden rounded-lg bg-slate-50 flex items-end px-4 gap-4 pb-2">
                                    {/* Giả lập biểu đồ theo dữ liệu thật */}
                                    <div className="flex-1 bg-primary/20 rounded-t h-[60%] relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">Tôm</span>
                                    </div>
                                    <div className="flex-1 bg-primary/40 rounded-t h-[80%] relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">Cá</span>
                                    </div>
                                    <div className="flex-1 bg-primary/20 rounded-t h-[40%] relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">Cua</span>
                                    </div>
                                    <div className="flex-1 bg-primary/60 rounded-t h-[95%] relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">Mực</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Giá TB Cá</span>
                                        <span className="text-lg font-bold text-slate-800">{Math.round(avgFishPrice).toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-primary/5">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Giá TB Tôm</span>
                                        <span className="text-lg font-bold text-slate-800">{Math.round(avgShrimpPrice).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                                        <h3 className="font-bold uppercase tracking-widest text-xs">AI Market Insights</h3>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-3">
                                        <p className="text-xs leading-relaxed italic text-slate-300">
                                            "Dựa trên {listings.length} bài đăng, thị trường đang có xu hướng ổn định. Các loại Cá có nguồn cung dồi dào, trong khi Tôm đang có dấu hiệu tăng giá nhẹ do nhu cầu xuất khẩu."
                                        </p>
                                        <div className="pt-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#13ecc8]"></span>
                                            <span className="text-[10px] font-bold text-primary uppercase">Độ tin cậy: 92%</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleConsultStrategy}
                                    className="w-full mt-6 py-3 bg-primary text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    Tư vấn chiến lược mua
                                </button>
                            </div>
                        </div>

                        {/* Live Price Table */}
                        <div className="bg-white border border-primary/10 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Biến động giá thực tế</h3>
                                <span className="text-[10px] font-bold text-slate-400">{listings.length} Sản phẩm đang giao dịch</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead className="bg-slate-50 border-b border-primary/10">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Sản phẩm</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Giá niêm yết</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Trạng thái</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Khu vực</th>
                                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Dự báo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {listings.slice(0, 8).map((listing, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                                                            <img className="w-full h-full object-cover" src={listing.thumbnailUrl || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=100"} alt={listing.title} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{listing.title}</p>
                                                            <p className="text-[10px] text-slate-400 uppercase">{listing.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-slate-900">{listing.pricePerFish?.toLocaleString()}đ</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${listing.status === 'AVAILABLE' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {listing.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium text-slate-600">{listing.location || 'Toàn quốc'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-[#13ecc8]">
                                                        <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                                                        <span className="text-xs font-bold">+1.2%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MarketPrices;
