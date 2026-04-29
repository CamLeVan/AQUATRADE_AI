import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/layout/Footer';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../services/api';

const Postings = () => {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'CA',
        species: '',
        province: '',
        sizeMin: '',
        sizeMax: '',
        pricePerFish: '',
        estimatedQuantity: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [myListings, setMyListings] = useState([]);

    const fetchMyListings = async () => {
        try {
            const response = await api.get('/listings/my-listings');
            setMyListings(response.data.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách của tôi:', error);
        }
    };

    React.useEffect(() => {
        fetchMyListings();
    }, []);

    const handleUpdatePrice = async (id, newPrice) => {
        try {
            await api.patch(`/listings/${id}/price`, { price: parseFloat(newPrice) });
            alert('Cập nhật giá thành công!');
            fetchMyListings();
        } catch (error) {
            alert('Lỗi khi cập nhật giá: ' + (error.response?.data?.message || error.message));
        }
    };

    const handlePriceChange = (id, value) => {
        setMyListings(prev => prev.map(item => 
            item.id === id ? { ...item, pricePerFish: value } : item
        ));
    };

    const handleDeleteListing = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
            try {
                await api.delete(`/listings/${id}`);
                alert('Xóa bài đăng thành công!');
                fetchMyListings();
            } catch (error) {
                alert('Lỗi khi xóa bài đăng: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert('Vui lòng chọn ảnh cho bài đăng!');
            return;
        }

        setLoading(true);
        try {
            // Bước 1: Tải ảnh lên Backend
            const uploadData = new FormData();
            uploadData.append('file', imageFile);
            
            const uploadResponse = await api.post('/files/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const realImageUrl = uploadResponse.data.data;

            // Bước 2: Đăng bài với link ảnh thật
            const response = await api.post('/listings', {
                ...formData,
                thumbnailUrl: realImageUrl,
                sizeMin: parseFloat(formData.sizeMin),
                sizeMax: parseFloat(formData.sizeMax),
                pricePerFish: parseFloat(formData.pricePerFish),
                estimatedQuantity: parseInt(formData.estimatedQuantity)
            });

            if (response.data.status === 'success') {
                alert('Đăng tin thành công! Bài đăng đang chờ Admin phê duyệt.');
                setFormData({
                    title: '',
                    category: 'CA',
                    species: '',
                    province: '',
                    sizeMin: '',
                    sizeMax: '',
                    pricePerFish: '',
                    estimatedQuantity: ''
                });
                setImagePreview(null);
                setImageFile(null);
                fetchMyListings();
            }
        } catch (error) {
            alert('Lỗi khi đăng bài: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline uppercase">Post & Update Center</h2>
                        <p className="text-slate-500 mt-1 uppercase tracking-widest text-[11px] font-semibold">Live Market Feed • AI Assisted</p>
                    </div>
                </section>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total My Listings</p>
                        <h3 className="text-3xl font-black text-slate-800">{myListings.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Status: Active</p>
                        <h3 className="text-3xl font-black text-emerald-500">{myListings.filter(i => i.status === 'AVAILABLE').length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Status: Pending</p>
                        <h3 className="text-3xl font-black text-amber-500">{myListings.filter(i => i.status === 'PENDING_REVIEW').length}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Quick Update */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Cập nhật giá nhanh</h4>
                            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">LIVE MARKET FEED</span>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Giá hiện tại (₫)</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {myListings.length > 0 ? myListings.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                        {item.thumbnailUrl ? (
                                                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-slate-400 text-sm">image</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{item.title}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase">{item.species}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="number"
                                                    value={item.pricePerFish}
                                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                    className="w-24 bg-slate-50 border-none rounded py-1 px-2 text-sm font-bold text-cyan-600 focus:ring-1 focus:ring-cyan-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                                                    item.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 
                                                    item.status === 'PENDING_REVIEW' ? 'bg-amber-50 text-amber-600' : 
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleUpdatePrice(item.id, item.pricePerFish)}
                                                        className="p-2 bg-cyan-500/10 text-cyan-600 rounded-lg hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">save</span>
                                                        <span className="text-[10px] font-bold uppercase">Lưu</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteListing(item.id)}
                                                        className="p-2 bg-rose-500/10 text-rose-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                        <span className="text-[10px] font-bold uppercase">Xóa</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm italic">
                                                Bạn chưa có bài đăng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: AI Posting Form */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">Đăng tin mới (AI Powered)</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></span>
                                <span className="text-[10px] font-bold text-[#13ecc8] tracking-widest uppercase">AI Active</span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-lg p-6 space-y-6">
                            {/* Image Upload Area */}
                            <div 
                                onClick={handleImageClick}
                                className="relative aspect-video rounded-xl border-2 border-dashed border-cyan-500/20 bg-slate-50 flex flex-col items-center justify-center group hover:bg-cyan-500/5 transition-all cursor-pointer overflow-hidden"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-center px-8 relative z-10">
                                        <span className="material-symbols-outlined text-4xl text-cyan-500 mb-2">add_a_photo</span>
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Nhấn để tải ảnh sản phẩm</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">AI sẽ tự động nhận diện chất lượng</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề bài đăng</label>
                                    <input 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-800 py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none" 
                                        type="text" 
                                        placeholder="Ví dụ: Cá Tra Xuất Khẩu Loại 1"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</label>
                                    <select 
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800"
                                    >
                                        <option value="CA">Cá giống</option>
                                        <option value="TOM">Tôm giống</option>
                                        <option value="CUA">Cua, Ghẹ</option>
                                        <option value="KHAC">Khác</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chủng loại</label>
                                    <input 
                                        name="species"
                                        value={formData.species}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800" 
                                        type="text" 
                                        placeholder="Tên loài cá/tôm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉnh thành</label>
                                    <input 
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800" 
                                        type="text" 
                                        placeholder="Nơi bán"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số lượng ước tính</label>
                                    <input 
                                        name="estimatedQuantity"
                                        value={formData.estimatedQuantity}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800" 
                                        type="number" 
                                        placeholder="Ví dụ: 5000"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kích thước Min (cm)</label>
                                    <input 
                                        name="sizeMin"
                                        value={formData.sizeMin}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800" 
                                        type="number" 
                                        step="0.1"
                                        placeholder="0.5"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kích thước Max (cm)</label>
                                    <input 
                                        name="sizeMax"
                                        value={formData.sizeMax}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800" 
                                        type="number" 
                                        step="0.1"
                                        placeholder="1.5"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá mỗi con (₫)</label>
                                    <input 
                                        name="pricePerFish"
                                        value={formData.pricePerFish}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border-none rounded-lg text-sm py-3 px-4 focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-cyan-600" 
                                        type="number" 
                                        placeholder="Ví dụ: 1200"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 bg-[#13ecc8] text-slate-900 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#13ecc8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                            >
                                <span className="material-symbols-outlined">{loading ? 'sync' : 'cloud_upload'}</span>
                                {loading ? 'Đang xử lý...' : 'Đăng bài ngay'}
                            </button>
                        </form>
                    </div>
                </div>

                <Footer />
            </div>
        </AdminLayout>
    );
};

export default Postings;
