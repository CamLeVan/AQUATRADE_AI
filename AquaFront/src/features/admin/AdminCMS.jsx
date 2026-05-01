import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import api from '../../services/api';

const AdminCMS = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState("Hãy nhập tiêu đề để nhận gợi ý từ AI...");
    const [editingPost, setEditingPost] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'MARKETING',
        content: '',
        status: 'PUBLISHED',
        featuredImageUrl: ''
    });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/posts');
            if (response.data.status === 'success') {
                setPosts(response.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải bài viết:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Logic gợi ý AI đơn giản dựa trên từ khóa
        if (name === 'title' && value.length > 5) {
            const val = value.toLowerCase();
            if (val.includes('tôm')) {
                setAiSuggestion("AI khuyên bạn nên dùng ảnh cận cảnh tôm tươi để tăng 25% tỷ lệ tương tác.");
            } else if (val.includes('cá')) {
                setAiSuggestion("Các bài viết về Cá giống thường hiệu quả hơn khi đính kèm biểu đồ tăng trưởng.");
            } else if (val.includes('giá') || val.includes('thị trường')) {
                setAiSuggestion("Người dùng quan tâm đến bảng giá. Hãy sử dụng bảng dữ liệu trong nội dung.");
            } else {
                setAiSuggestion("AI đang phân tích tiêu đề của bạn để đưa ra phong cách hình ảnh phù hợp...");
            }
        }
    };

    const handleOptimizeTitle = () => {
        if (!formData.title) return;
        const optimized = " AquaTrade Phân Tích: " + formData.title + " (Cập nhật 2024)";
        setFormData(prev => ({ ...prev, title: optimized }));
        setAiSuggestion("Tiêu đề đã được AI tối ưu hóa để chuẩn SEO và thu hút click hơn!");
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Hiển thị preview ngay lập tức
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);

            // Tải ảnh lên backend
            const uploadData = new FormData();
            uploadData.append('file', file);
            try {
                const res = await api.post('/files/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data.status === 'success') {
                    setFormData(prev => ({ ...prev, featuredImageUrl: res.data.data }));
                }
            } catch (error) {
                alert('Lỗi khi tải ảnh lên!');
            }
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            category: post.category,
            content: post.content,
            status: post.status,
            featuredImageUrl: post.featuredImageUrl
        });
        setImagePreview(post.featuredImageUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const response = await api.delete(`/posts/${id}`);
                if (response.data.status === 'success') {
                    alert('Xóa bài viết thành công!');
                    fetchPosts();
                }
            } catch (error) {
                alert('Lỗi khi xóa: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingPost) {
                response = await api.put(`/posts/${editingPost.id}`, formData);
            } else {
                response = await api.post('/posts', {
                    ...formData,
                    author: 'Admin'
                });
            }

            if (response.data.status === 'success') {
                alert(editingPost ? 'Cập nhật thành công!' : 'Đăng bài thành công!');
                setFormData({ title: '', category: 'MARKETING', content: '', status: 'PUBLISHED', featuredImageUrl: '' });
                setImagePreview(null);
                setEditingPost(null);
                fetchPosts();
            }
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };
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
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    {editingPost ? 'Chỉnh sửa bài viết' : 'Biên tập nội dung mới'}
                                </h3>
                                {editingPost && (
                                    <button 
                                        onClick={() => {
                                            setEditingPost(null);
                                            setFormData({ title: '', category: 'MARKETING', content: '', status: 'PUBLISHED', featuredImageUrl: '' });
                                            setImagePreview(null);
                                        }}
                                        className="text-[10px] font-bold text-red-500 uppercase hover:underline"
                                    >
                                        Hủy chỉnh sửa
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Tiêu đề bài viết</label>
                                        <button 
                                            type="button"
                                            onClick={handleOptimizeTitle}
                                            className="text-[9px] font-black text-[#00cfa8] uppercase flex items-center gap-1 hover:underline"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                                            Tối ưu tiêu đề với AI
                                        </button>
                                    </div>
                                    <input 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#13ecc8]/30 focus:border-[#13ecc8] rounded-lg px-4 py-3 text-sm font-medium transition-all" 
                                        placeholder="VD: Phân tích xu hướng thị trường AquaTrade Quý 3..." 
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Chuyên mục</label>
                                        <div className="relative">
                                            <select 
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="appearance-none w-full bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#13ecc8]/30 focus:border-[#13ecc8] rounded-lg px-4 py-3 text-sm transition-all font-medium cursor-pointer"
                                            >
                                                <option value="MARKETING">Market Updates</option>
                                                <option value="TECH">Technical Guides</option>
                                                <option value="NEWS">Industry News</option>
                                            </select>
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="flex items-center cursor-pointer gap-3 mb-3">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox"
                                                    checked={formData.status === 'PUBLISHED'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'PUBLISHED' : 'DRAFT' }))}
                                                    className="sr-only peer" 
                                                />
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
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_underlined</span></button>
                                            <div className="w-px h-4 bg-slate-300"></div>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">format_list_numbered</span></button>
                                            <div className="w-px h-4 bg-slate-300"></div>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
                                            <button type="button" className="p-1 text-slate-600 hover:text-[#13ecc8] transition-colors"><span className="material-symbols-outlined text-lg">image</span></button>
                                        </div>
                                        <textarea 
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border-none focus:ring-0 outline-none px-4 py-4 text-sm leading-relaxed min-h-[300px] resize-y" 
                                            placeholder="Bắt đầu viết nội dung tại đây..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        type="submit"
                                        className={`flex-1 ${editingPost ? 'bg-blue-500' : 'bg-[#13ecc8]'} text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform hover:opacity-90`}
                                    >
                                        {editingPost ? 'Cập nhật bài viết' : 'Xuất bản ngay'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Content (Featured Image) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ảnh tiêu biểu (Featured)</h3>
                            <div 
                                onClick={handleImageClick}
                                className="relative border-2 border-dashed border-[#13ecc8]/30 rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:border-[#13ecc8] transition-colors cursor-pointer bg-[#13ecc8]/5 min-h-[200px] overflow-hidden"
                            >
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#00cfa8] mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 mb-1">Click to upload or drag</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">PNG, JPG, WEBP up to 5MB</p>
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-8 flex-1">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Gợi ý từ AI</h4>
                                <div className="p-4 bg-[#13ecc8]/5 rounded-lg border border-[#13ecc8]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-[#00cfa8] text-sm animate-pulse" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#006b59]">AI Recommendation</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">"{aiSuggestion}"</p>
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
                                {posts.map(post => (
                                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                    <img alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src={post.featuredImageUrl || "https://via.placeholder.com/150"}/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#00cfa8] transition-colors">{post.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">Bởi {post.author} • {post.viewCount || 0} lượt xem</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">{post.category}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${post.status === 'PUBLISHED' ? 'bg-[#13ecc8] shadow-[0_0_8px_rgba(19,236,200,0.6)] animate-pulse' : 'bg-amber-400'}`}></div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${post.status === 'PUBLISHED' ? 'text-[#00cfa8]' : 'text-amber-500'}`}>{post.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-slate-700">{post.viewCount?.toLocaleString() || 0}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEditPost(post)}
                                                    className="p-1.5 text-slate-400 hover:text-[#00cfa8] hover:bg-[#13ecc8]/10 rounded-lg transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-10 text-center text-slate-400 text-sm italic">Chưa có bài viết nào trong hệ thống.</td>
                                    </tr>
                                )}
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
