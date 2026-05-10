import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/listings');
                if (response.data.status === 'success') {
                    // Hiển thị 4 sản phẩm mới nhất
                    setProducts(response.data.data.slice(0, 4));
                }
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm nổi bật:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        alert(`Đã thêm ${product.title} vào giỏ hàng!`);
    };

    const handleViewDetail = (id) => {
        navigate(`/productdetail?id=${id}`);
    };

    if (loading) return <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse"><div className="h-64 bg-slate-100 rounded-xl"></div><div className="h-64 bg-slate-100 rounded-xl"></div></div>;

    return (
        <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">stars</span>
                    Sản phẩm nổi bật
                </h2>
                <div className="flex space-x-2">
                    <button onClick={() => navigate('/marketplace')} className="text-sm font-bold text-primary hover:underline">Xem tất cả</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => handleViewDetail(product.id)}>
                        <div className="relative rounded-lg overflow-hidden mb-4 aspect-[16/9]">
                            <img 
                                alt={product.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                src={product.thumbnailUrl || "https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&q=80&w=400"}
                            />
                            <span className="absolute top-2 right-2 bg-primary/90 text-[10px] font-bold px-2 py-1 rounded-md text-slate-900">
                                {product.aiHealthScore ? `${product.aiHealthScore}% Health` : '95% Health'}
                            </span>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{product.title}</h3>
                                <p className="text-xs text-slate-400">{product.sellerName || 'AquaTrade Verified'} • {product.province}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary text-lg">{product.pricePerFish?.toLocaleString()}đ</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                            <div className="flex space-x-3 text-xs text-slate-500">
                                <span className="flex items-center font-medium">
                                    <span className="material-icons-outlined text-sm mr-1">inventory</span> 
                                    {product.availableQuantity?.toLocaleString()} con
                                </span>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                }}
                                className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <span className="material-icons-outlined text-sm">add_shopping_cart</span>
                                <span className="text-[10px] font-bold uppercase">Mua</span>
                            </button>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-slate-400 italic">Chưa có sản phẩm nào được duyệt.</div>
                )}
            </div>
        </div>
    );
};

export default FeaturedProducts;
