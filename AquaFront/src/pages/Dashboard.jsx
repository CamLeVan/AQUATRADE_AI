import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HeroSection from '../features/dashboard/HeroSection';
import FeaturedProducts from '../features/marketplace/FeaturedProducts';
import MarketSidebar from '../features/dashboard/MarketSidebar';
import MarketTrends from '../features/dashboard/MarketTrends';
import RecommendedSuppliers from '../features/marketplace/RecommendedSuppliers';
import RecentTransactions from '../features/dashboard/RecentTransactions';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-y-auto min-h-screen">
                <Header />
                <div className="p-8 space-y-12">
                    <HeroSection />
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <FeaturedProducts />
                        <MarketSidebar />
                    </div>
                    <MarketTrends />
                    <RecommendedSuppliers />
                    <RecentTransactions />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default Dashboard;
