import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                rememberMe
            });

            if (response.data.status === 'success') {
                const { token, refreshToken, role, userId } = response.data.data;
                
                // Lưu token và thông tin người dùng đồng bộ
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify({
                    userId: userId,
                    role: role,
                    fullName: response.data.data.fullName || (role === 'ADMIN' ? 'System Admin' : 'Aqua Seller')
                }));
                localStorage.setItem('userRole', role); // Giữ lại bản cũ để tránh lỗi các file khác chưa cập nhật
                localStorage.setItem('userId', userId);

                // Chuyển hướng theo Role
                if (role === 'SELLER' || role === 'ADMIN') {
                    navigate('/admin'); // Seller/Admin vào khu vực quản trị/đăng tin
                } else {
                    navigate('/'); // Buyer vào trang chủ mua sắm
                }
            } else {
                setError(response.data.message || 'Đăng nhập thất bại.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
            <main className="flex min-h-screen overflow-hidden">
                {/* Left Side: Hero Image Section */}
                <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img alt="Sustainable Seafood Farm" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6bScuSU-2W9KQMX6DgYhzoN7c3_2YY9DYLQEqOzaHjN6ubFWTMiO0b6B13fbxDq5dhM85zQK9IB-JAElR1sTR450_SIM6l7XWqKAOURSMcqv3phd5cyMSBE99lAg1xCVwx7PDpnaGdrWTbkCkzYc69qQXdp349Bn_jHR2KsVPQLCPcQBYCvdr3Qln1YjAqxiZYgIRSvS-e8enEJ7JcDUpP3BcE_vuDcYi4xMAxsWXkVz0zpKL2CgoBONH4tAMePI--5zzMxmMfV8"/>
                    </div>
                    <div className="absolute inset-0 teal-gradient-overlay z-10"></div>
                    <div className="relative z-20 flex flex-col justify-between p-12 text-white">
                        <div>
                            <Link to="/" className="flex items-center gap-3 mb-8 group">
                                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-white text-2xl" style={{fontVariationSettings: "'FILL' 0"}}>waves</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white uppercase tracking-tighter block group-hover:opacity-80 transition-opacity leading-none">
                                        AquaTrade <span className="text-cyan-400 font-bold text-xl">AI</span>
                                    </div>
                                    <p className="font-['Inter'] uppercase tracking-widest text-[11px] font-bold text-white/80 mt-1 leading-none">Precision Logistics</p>
                                </div>
                            </Link>
                            <h1 className="text-5xl font-bold leading-tight mb-6">Optimizing the ocean's bounty with intelligence.</h1>
                            <p className="text-lg text-primary/90 max-w-md">The world's leading AI-driven marketplace for sustainable seafood and aquaculture logistics.</p>
                        </div>
                        <div>
                            <div className="flex gap-4 items-center">
                                <div className="flex -space-x-2">
                                    <img alt="User" className="w-8 h-8 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8s5IURNxBQxTAi9fRR5RvRuFlEp2A0m7fE7vqOHhVeFxoTuNGXUVNPKX-Tp0J4N7tyDiRDjGxRFN_uVzR5QGuscC-xNj_Wyl3PYIa-pGWhW5dXIpfK4UfrLvBo3cmueTxlvuGFx5RZdvqNMkBz9F5LSKpdYoSuNEMA1hTQV25JUctZSoo1OA5ixtLPGHMhJgxeq-p3PpA7BEmk-R0j4ONNMEvrpet-KNM_zqZIZ1RRunPmttFYHotIvDuTpIkbHl5u9ymvPkOJCwK"/>
                                    <img alt="User" className="w-8 h-8 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC98EcMbEuctTRX1zXiIVhuKov9oZTpyw4n8eT7Co41JOJ5mjN3pQeGcCi5j6xtBRNrIRd9xp-8gw097KswEV6gQ8iunqDqJ9NKqRjn2Ka5oLlvXVtqzxJvjcdvH9sPNpa8dt6MYIsogW35ME1zPHZgeVGIsZsVpE2Kxgg7HCdL7vZFn1UWWZxkAsbOuM1T-R4OaJwIV_pSuwE12igdtV6Cv7L5FUcpR5mjX6L-792ovLjwhEhxHQowYKWJRBDy4gWqB6b8gqp_e4Ot"/>
                                    <img alt="User" className="w-8 h-8 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-n3GNEumfHrfBJ_5c7wm5plZXtnHqTSvWOqBo2325bGFrYf-0AFvuSpi4htNG0b0zlm8xEU14846ndecE2WXjfJoTIuH-sLBUYj-0-tmpaS8yF-za6mnZWcYF15pF_pUzGkg4FwdkNKtyITm_gxssydQ4wZ656UaUvoMBgN9K0QZ8UsH8_opKqkEZIeCHlcELOEV3jS-duI7kmogaCp9AE9VYtQ89XAjslyhH5DSnqJyPLcDVmrzi_b3Qv0UaBJkMzFFxh59e4eT_"/>
                                </div>
                                <p className="text-sm font-medium">Joined by 2,000+ global suppliers</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Side: Login Form Section */}
                <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-white dark:bg-background-dark">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center mb-12">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 0"}}>waves</span>
                                </div>
                                <div>
                                    <div className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter block group-hover:opacity-80 transition-opacity leading-none">
                                        AquaTrade <span className="text-cyan-500 font-bold text-base">AI</span>
                                    </div>
                                    <p className="font-['Inter'] uppercase tracking-widest text-[9px] font-bold text-slate-400 mt-1 leading-none">Precision Logistics</p>
                                </div>
                            </Link>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                            <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access the marketplace.</p>
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    </div>
                                    <input className="block w-full  bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" id="email" name="email" placeholder="longfpt@company.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    </div>
                                    <input className="block w-full  bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm" id="password" name="password" placeholder="••••••••" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer" id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="remember-me">
                                    Keep me logged in for 30 days
                                </label>
                            </div>

                            {/* Login Button */}
                            <button className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-background-dark bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 relative">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-background-dark text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex w-full items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Google
                            </button>
                            <button className="flex w-full items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                                <svg className="w-5 h-5" fill="#0077b5" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                </svg>
                                LinkedIn
                            </button>
                        </div>

                        {/* Registration Footer */}
                        <p className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                            New to AquaTrade? 
                            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">Create an account</Link>
                        </p>
                    </div>
                </section>
            </main>
           
        </div>
    );
};

export default Login;