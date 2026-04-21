import 'package:flutter/material.dart';

import 'admin_console_screen.dart';
import 'ai_analysis_screen.dart';
import 'alerts_screen.dart';
import 'asset_detail_screen.dart';
import 'content_hub_screen.dart';
import 'create_order_screen.dart';
import 'exchange_screen.dart';
import 'kyc_verification_screen.dart';
import 'login_screen.dart';
import 'market_trends_screen.dart';
import 'messages_screen.dart';
import 'news_feed_screen.dart';
import 'onboarding_flow_screen.dart';
import 'portfolio_dashboard_screen.dart';
import 'register_screen.dart';
import 'risk_controls_screen.dart';
import 'settings_screen.dart';
import 'trade_tickets_screen.dart';
import 'user_directory_screen.dart';
import 'wallet_funding_screen.dart';

class ScreenCatalogScreen extends StatelessWidget {
  const ScreenCatalogScreen({super.key});

  static const groups = <_CatalogGroup>[
    _CatalogGroup(
      'Trading',
      [
        _CatalogItem('Exchange', ExchangeScreen.new),
        _CatalogItem('Asset Detail', AssetDetailScreen.new),
        _CatalogItem('Create Order', CreateOrderScreen.new),
        _CatalogItem('Trade Tickets', TradeTicketsScreen.new),
        _CatalogItem('Wallet Funding', WalletFundingScreen.new),
      ],
    ),
    _CatalogGroup(
      'Market Intelligence',
      [
        _CatalogItem('AI Analysis', AiAnalysisScreen.new),
        _CatalogItem('Market Trends', MarketTrendsScreen.new),
        _CatalogItem('Alerts', AlertsScreen.new),
        _CatalogItem('News Feed', NewsFeedScreen.new),
        _CatalogItem('Content Hub', ContentHubScreen.new),
      ],
    ),
    _CatalogGroup(
      'Portfolio & Risk',
      [
        _CatalogItem('Portfolio Dashboard', PortfolioDashboardScreen.new),
        _CatalogItem('Risk Controls', RiskControlsScreen.new),
      ],
    ),
    _CatalogGroup(
      'Operations',
      [
        _CatalogItem('Messages', MessagesScreen.new),
        _CatalogItem('User Directory', UserDirectoryScreen.new),
        _CatalogItem('Admin Console', AdminConsoleScreen.new),
        _CatalogItem('Settings', SettingsScreen.new),
      ],
    ),
    _CatalogGroup(
      'Account & Access',
      [
        _CatalogItem('Login', LoginScreen.new),
        _CatalogItem('Register', RegisterScreen.new),
        _CatalogItem('KYC Verification', KycVerificationScreen.new),
        _CatalogItem('Onboarding Flow', OnboardingFlowScreen.new),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Global AI Trading'),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 8),
        children: [
          for (final group in groups) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Text(
                group.title,
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            Card(
              margin: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                children: [
                  for (int i = 0; i < group.items.length; i++) ...[
                    ListTile(
                      title: Text(group.items[i].title),
                      subtitle: const Text('Tap to open'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => group.items[i].builder(),
                        ),
                      ),
                    ),
                    if (i < group.items.length - 1) const Divider(height: 1),
                  ],
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _CatalogGroup {
  const _CatalogGroup(this.title, this.items);
  final String title;
  final List<_CatalogItem> items;
}

class _CatalogItem {
  const _CatalogItem(this.title, this.builder);
  final String title;
  final Widget Function() builder;
}

