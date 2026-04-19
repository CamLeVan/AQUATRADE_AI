import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Registration from './features/auth/Registration';
import Login from './features/auth/Login';
import AIDetection from './features/Ai/AIDetection';
import Negotiation from './features/marketplace/Negotiation';
import OrderHistory from './features/orders/OrderHistory';
import AIChat from './features/chat/AIChat';
import Inventory from './features/admin/inventory/Inventory';
import Postings from './features/admin/inventory/Postings';
import ProductDetails from './features/marketplace/ProductDetails';
import Marketplace from './features/marketplace/Marketplace';
import MarketPrices from './features/marketplace/MarketPrices';
import Wallet from './features/wallet/Wallet';
import Checkout from './features/orders/Checkout';
import Settings from './features/settings/Settings';
import Contact from './features/contact/Contact';
import AdminDashboard from './features/admin/AdminDashboard';
import UserManagement from './features/admin/UserManagement';
import MarketplaceControl from './features/admin/MarketplaceControl';
import AdminCMS from './features/admin/AdminCMS';
import AdminCMSEditor from './features/admin/inventory/AdminCMSEditor';
import Analytics from './features/admin/Analytics';
import SupportCenter from './features/support/SupportCenter';
import FloatingContact from './components/common/FloatingContact';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ai-detection" element={<AIDetection />} />
        <Route path="/negotiation" element={<Negotiation />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/productdetail" element={<ProductDetails />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/prices" element={<MarketPrices />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<SupportCenter />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/marketplace" element={<MarketplaceControl />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/postings" element={<Postings />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/cms" element={<AdminCMS />} />
        <Route path="/admin/cms/create" element={<AdminCMSEditor />} />
      </Routes>
      <FloatingContact />
    </Router>
  );
}

export default App;
