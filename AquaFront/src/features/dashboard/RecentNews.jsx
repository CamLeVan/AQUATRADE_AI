import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RecentNews = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                if (response.data.status === 'success') {
                    // Chỉ lấy những bài đã PUBLISHED
                    const publishedPosts = response.data.data.filter(p => p.status === 'PUBLISHED');
                    setPosts(publishedPosts.slice(0, 3)); // Lấy 3 bài mới nhất
                }
            } catch (error) {
                console.error('Lỗi khi tải tin tức:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="animate-pulse h-40 bg-slate-100 rounded-xl"></div>;
    if (posts.length === 0) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-icons-outlined text-[#13ecc8]">newspaper</span>
                    Tin tức & Phân tích thị trường
                </h2>
                <button className="text-sm font-bold text-[#13ecc8] hover:underline">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map(post => (
                    <Link to={`/news?id=${post.id}`} key={post.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all group">
                        <div className="h-40 overflow-hidden relative">
                            <img 
                                src={post.featuredImageUrl || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400"} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-[#13ecc8] text-slate-900 text-[10px] font-bold rounded uppercase">
                                {post.category}
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-[#13ecc8] transition-colors h-12">
                                {post.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2">
                                {post.content.replace(/[#*`]/g, '').substring(0, 100)}...
                            </p>
                            <div className="pt-2 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bởi {post.authorName || 'Admin'}</span>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    <span className="material-icons-outlined text-[12px]">visibility</span>
                                    {post.viewCount || 0}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RecentNews;
