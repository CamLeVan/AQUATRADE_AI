import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../providers/wallet_provider.dart';
import 'screen_scaffold.dart';

class WalletFundingScreen extends StatefulWidget {
  const WalletFundingScreen({super.key});

  @override
  State<WalletFundingScreen> createState() => _WalletFundingScreenState();
}

class _WalletFundingScreenState extends State<WalletFundingScreen> {
  final _amount = TextEditingController(text: '500');
  int _method = 0; // 0 VNPAY, 1 BANK, 2 MOMO
  bool _save = true;
  static const _paymentMethods = ['VNPAY', 'BANK_TRANSFER', 'MOMO'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WalletProvider>().fetchWallet();
    });
  }

  @override
  void dispose() {
    _amount.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Wallet Funding',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Wallet balance', style: theme.textTheme.bodySmall),
                  const SizedBox(height: 6),
                  Consumer<WalletProvider>(
                    builder: (context, provider, _) {
                      if (provider.isLoading && provider.wallet == null) {
                        return const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        );
                      }
                      final balance = provider.wallet?.balance ?? 0.0;
                      return Text(
                        '₫${NumberFormat("#,###").format(balance)}',
                        style: theme.textTheme.headlineSmall,
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Text('Amount', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _amount,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.payments_outlined),
                      border: OutlineInputBorder(),
                      suffixText: 'USD',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    children: [
                      ActionChip(label: const Text('\$100'), onPressed: () => _amount.text = '100'),
                      ActionChip(label: const Text('\$250'), onPressed: () => _amount.text = '250'),
                      ActionChip(label: const Text('\$500'), onPressed: () => _amount.text = '500'),
                      ActionChip(label: const Text('\$1000'), onPressed: () => _amount.text = '1000'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Funding method', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          _MethodTile(
            selected: _method == 0,
            icon: Icons.credit_card,
            title: 'Card',
            subtitle: 'Instant confirmation',
            onTap: () => setState(() => _method = 0),
          ),
          _MethodTile(
            selected: _method == 1,
            icon: Icons.account_balance_outlined,
            title: 'Bank transfer',
            subtitle: '1–2 business days',
            onTap: () => setState(() => _method = 1),
          ),
          _MethodTile(
            selected: _method == 2,
            icon: Icons.currency_bitcoin,
            title: 'Crypto deposit',
            subtitle: 'BTC / ETH / USDT',
            onTap: () => setState(() => _method = 2),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            value: _save,
            onChanged: (v) => setState(() => _save = v),
            title: const Text('Save method'),
            subtitle: const Text('For faster funding next time'),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: _submit,
            icon: const Icon(Icons.lock_outline),
            label: const Text('Continue'),
          ),
        ],
      ),
    );
  }

  Future<void> _submit() async {
    FocusManager.instance.primaryFocus?.unfocus();
    final messenger = ScaffoldMessenger.of(context);
    final amount = double.tryParse(_amount.text.trim());
    if (amount == null || amount <= 0) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Số tiền nạp không hợp lệ.')),
      );
      return;
    }

    try {
      await context.read<WalletProvider>().deposit(
            amount: amount,
            paymentMethod: _paymentMethods[_method],
          );
      messenger.showSnackBar(
        const SnackBar(content: Text('Nạp tiền thành công.')),
      );
    } catch (e) {
      messenger.showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }
}

class _MethodTile extends StatelessWidget {
  const _MethodTile({
    required this.selected,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final bool selected;
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: Radio<bool>(value: true, groupValue: selected, onChanged: (_) => onTap()),
        onTap: onTap,
      ),
    );
  }
}

