import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../../providers/wallet_provider.dart';
import '../../providers/order_provider.dart';
import 'screen_scaffold.dart';

class PortfolioDashboardScreen extends StatefulWidget {
  const PortfolioDashboardScreen({super.key});

  @override
  State<PortfolioDashboardScreen> createState() => _PortfolioDashboardScreenState();
}

class _PortfolioDashboardScreenState extends State<PortfolioDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WalletProvider>().fetchWallet();
      context.read<OrderProvider>().fetchMyOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat("#,###");

    return ScreenScaffold(
      title: 'Portfolio Dashboard',
      actions: [
        IconButton(
          onPressed: () {
            context.read<WalletProvider>().fetchWallet();
            context.read<OrderProvider>().fetchMyOrders();
          },
          icon: const Icon(Icons.refresh),
        ),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Consumer<WalletProvider>(
            builder: (context, walletProv, _) {
              final balance = walletProv.wallet?.balance ?? 0.0;
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Total equity', style: theme.textTheme.bodySmall),
                      const SizedBox(height: 6),
                      Text(
                        '₫${currencyFormat.format(balance)}',
                        style: theme.textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 10),
                      const Row(
                        children: [
                          Expanded(child: _Pill(label: 'Day P/L', value: '+₫0')),
                          SizedBox(width: 8),
                          Expanded(child: _Pill(label: 'Exposure', value: '100%')),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Text('Recent Orders', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Consumer<OrderProvider>(
            builder: (context, orderProv, _) {
              if (orderProv.isLoading) {
                return const Center(child: CircularProgressIndicator());
              }
              if (orderProv.orders.isEmpty) {
                return const Card(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('Chưa có giao dịch nào.'),
                  ),
                );
              }
              return Column(
                children: orderProv.orders
                    .take(5)
                    .map((order) => _OrderTile(
                          title: order.listingTitle,
                          amount: order.totalPrice,
                          status: order.status.name,
                        ))
                    .toList(),
              );
            },
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.analytics_outlined),
            label: const Text('View Full Analytics'),
          ),
        ],
      ),
    );
  }
}

class _OrderTile extends StatelessWidget {
  const _OrderTile({required this.title, required this.amount, required this.status});
  final String title;
  final double amount;
  final String status;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.shopping_bag_outlined)),
        title: Text(title),
        subtitle: Text(status),
        trailing: Text(
          '₫${NumberFormat("#,###").format(amount)}',
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent),
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
        child: Column(
          children: [
            Text(label, style: theme.textTheme.bodySmall),
            const SizedBox(height: 4),
            Text(value, style: theme.textTheme.titleSmall),
          ],
        ),
      ),
    );
  }
}

class _AllocationRow extends StatelessWidget {
  const _AllocationRow({required this.label, required this.value});
  final String label;
  final double value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(child: Text(label)),
          SizedBox(
            width: 160,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(value: value, minHeight: 10),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(width: 48, child: Text('${(value * 100).round()}%')),
        ],
      ),
    );
  }
}

class _PositionTile extends StatelessWidget {
  const _PositionTile({required this.symbol, required this.qty, required this.pnl});
  final String symbol;
  final String qty;
  final String pnl;

  @override
  Widget build(BuildContext context) {
    final up = pnl.startsWith('+');
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Text(symbol.substring(0, 1))),
        title: Text(symbol),
        subtitle: Text('Qty: $qty'),
        trailing: Text(
          pnl,
          style: TextStyle(color: up ? Colors.green : Colors.red),
        ),
        onTap: () {},
      ),
    );
  }
}

