import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../data/models/auth_model.dart';
import 'global_ai_trading/marketplace_screen.dart';
import 'global_ai_trading/portfolio_dashboard_screen.dart';
import 'global_ai_trading/wallet_funding_screen.dart';
import 'global_ai_trading/settings_screen.dart';
import 'global_ai_trading/news_feed_screen.dart';
import 'global_ai_trading/create_listing_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const MarketplaceScreen(),
    const PortfolioDashboardScreen(),
    const NewsFeedScreen(),
    const WalletFundingScreen(),
    const SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final bool isSeller = auth.currentUser?.role == Role.SELLER;

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.store_outlined),
            selectedIcon: Icon(Icons.store),
            label: 'Market',
          ),
          NavigationDestination(
            icon: Icon(Icons.pie_chart_outline),
            selectedIcon: Icon(Icons.pie_chart),
            label: 'Portfolio',
          ),
          NavigationDestination(
            icon: Icon(Icons.newspaper_outlined),
            selectedIcon: Icon(Icons.newspaper),
            label: 'News',
          ),
          NavigationDestination(
            icon: Icon(Icons.wallet_outlined),
            selectedIcon: Icon(Icons.wallet),
            label: 'Wallet',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
      // Hiển thị nút đăng bán chỉ dành cho Seller và khi đang ở tab Market
      floatingActionButton: (isSeller && _selectedIndex == 0)
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const CreateListingScreen()),
                );
              },
              icon: const Icon(Icons.add),
              label: const Text('Post Sale'),
            )
          : null,
    );
  }
}
