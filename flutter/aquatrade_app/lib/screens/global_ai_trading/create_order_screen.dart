import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/order_provider.dart';
import 'screen_scaffold.dart';
import 'risk_controls_screen.dart';

class CreateOrderScreen extends StatefulWidget {
  const CreateOrderScreen({super.key, this.initialListingId});

  final String? initialListingId;

  @override
  State<CreateOrderScreen> createState() => _CreateOrderScreenState();
}

class _CreateOrderScreenState extends State<CreateOrderScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _listingId;
  final _qty = TextEditingController(text: '1');
  final _shippingAddress = TextEditingController();

  @override
  void initState() {
    super.initState();
    _listingId = TextEditingController(text: widget.initialListingId ?? '');
  }

  @override
  void dispose() {
    _listingId.dispose();
    _qty.dispose();
    _shippingAddress.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScreenScaffold(
      title: 'Create Order',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Create backend order', style: TextStyle(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _listingId,
                      decoration: const InputDecoration(
                        labelText: 'Listing ID',
                        prefixIcon: Icon(Icons.confirmation_number_outlined),
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => (v ?? '').trim().isEmpty ? 'Listing ID is required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _qty,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Quantity',
                        prefixIcon: Icon(Icons.numbers_outlined),
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) {
                        final value = int.tryParse((v ?? '').trim());
                        if (value == null || value <= 0) return 'Quantity must be > 0';
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _shippingAddress,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        labelText: 'Shipping address',
                        prefixIcon: Icon(Icons.location_on_outlined),
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) => (v ?? '').trim().isEmpty ? 'Shipping address is required' : null,
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        onPressed: _submit,
                        icon: const Icon(Icons.shopping_cart_checkout),
                        label: const Text('Submit order'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          const _HintCard(),
        ],
      ),
    );
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    FocusManager.instance.primaryFocus?.unfocus();
    final messenger = ScaffoldMessenger.of(context);
    final orderProvider = context.read<OrderProvider>();

    try {
      await orderProvider.createOrder(
            _listingId.text.trim(),
            _shippingAddress.text.trim(),
            int.parse(_qty.text.trim()),
          );
      final order = orderProvider.currentOrder;
      messenger.showSnackBar(
        SnackBar(
          content: Text(
            order != null
                ? 'Tạo đơn thành công. Order ID: ${order.id}'
                : 'Tạo đơn thành công.',
          ),
        ),
      );
    } catch (e) {
      messenger.showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }
}

class _HintCard extends StatelessWidget {
  const _HintCard();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const RiskControlsScreen()),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              const Icon(Icons.lightbulb_outline),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Tip: use Risk Controls to set max loss and position limits before trading.',
                  style: theme.textTheme.bodyMedium,
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}

