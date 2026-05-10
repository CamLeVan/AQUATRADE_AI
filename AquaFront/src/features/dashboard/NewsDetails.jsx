import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../services/api';

const NewsDetails = () => {
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('id');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                // Giả định có API lấy 1 bài theo ID, nếu chưa có ta sẽ lọc từ danh sách
                const response = await api.get('/posts');
                if (response.data.status === 'success') {
                    const found = response.data.data.find(p => p.id === postId);
                    setPost(found);
                }
            } catch (error) {
                console.error('Lỗi khi tải chi tiết bài viết:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#13ecc8]"></div></div>;
    if (!post) return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Không tìm thấy bài viết!</div>;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex min-h-screen font-['Inter']">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <Link to="/" className="hover:text-[#13ecc8] transition-colors">Dashboard</Link>
                        <span className="material-icons-outlined text-sm">chevron_right</span>
                        <span className="text-[#13ecc8]">{post.category}</span>
                    </nav>

                    {/* Header */}
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 border-y border-slate-200 dark:border-slate-800 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Tác giả</p>
                                    <p className="text-sm font-bold">{post.authorName || 'Ban biên tập'}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Lượt xem</p>
                                <p className="text-sm font-bold flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">visibility</span>
                                    {post.viewCount?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                            src={post.featuredImageUrl || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200"} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                    </article>

                    {/* Footer */}
                    <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#13ecc8] transition-colors">
                            <span className="material-icons-outlined text-sm">arrow_back</span>
                            Quay lại Dashboard
                        </Link>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-slate-400 hover:text-blue-500">
                                <span className="material-icons-outlined text-sm">share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewsDetails;
