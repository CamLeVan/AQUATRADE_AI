import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../data/models/order_model.dart';
import '../../providers/order_provider.dart';
import 'screen_scaffold.dart';

class TradeTicketsScreen extends StatefulWidget {
  const TradeTicketsScreen({super.key});

  @override
  State<TradeTicketsScreen> createState() => _TradeTicketsScreenState();
}

class _TradeTicketsScreenState extends State<TradeTicketsScreen> {
  final _orderIdController = TextEditingController();
  final _disputeReasonController = TextEditingController();
  final _reviewController = TextEditingController();
  int _rating = 5;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().fetchMyOrders();
    });
  }

  @override
  void dispose() {
    _orderIdController.dispose();
    _disputeReasonController.dispose();
    _reviewController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScreenScaffold(
      title: 'Trade Tickets',
      actions: [
        IconButton(
          onPressed: _loadOrder,
          icon: const Icon(Icons.refresh),
        ),
      ],
      body: Consumer<OrderProvider>(
        builder: (context, provider, _) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextField(
              controller: _orderIdController,
              decoration: InputDecoration(
                labelText: 'Order ID',
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: _loadOrder,
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (provider.isLoading) const Center(child: CircularProgressIndicator()),
            if (provider.error.isNotEmpty)
              Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(provider.error),
                ),
              ),
            if (provider.currentOrder != null) ...[
              _OrderInfoCard(order: provider.currentOrder!),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: () => _completeOrder(provider.currentOrder!.id),
                child: const Text('Complete order'),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Submit review',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<int>(
                        initialValue: _rating,
                        decoration: const InputDecoration(
                          labelText: 'Rating',
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: 1, child: Text('1')),
                          DropdownMenuItem(value: 2, child: Text('2')),
                          DropdownMenuItem(value: 3, child: Text('3')),
                          DropdownMenuItem(value: 4, child: Text('4')),
                          DropdownMenuItem(value: 5, child: Text('5')),
                        ],
                        onChanged: (v) => setState(() => _rating = v ?? 5),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _reviewController,
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'Comment',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      OutlinedButton(
                        onPressed: () => _submitReview(provider.currentOrder!.id),
                        child: const Text('Send review'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Raise dispute',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _disputeReasonController,
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'Reason',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 8),
                      OutlinedButton(
                        onPressed: () => _raiseDispute(provider.currentOrder!.id),
                        child: const Text('Submit dispute'),
                      ),
                    ],
                  ),
                ),
              ),
              if (provider.latestDispute != null)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(
                    'Dispute mới nhất: ${provider.latestDispute!.id} (${provider.latestDispute!.status})',
                  ),
                ),
            ],
            const SizedBox(height: 12),
            const Text(
              'My Orders',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            if (provider.orders.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text('Chưa có order nào.'),
                ),
              ),
            ...provider.orders.map(
              (order) => Card(
                child: ListTile(
                  title: Text(order.listingTitle),
                  subtitle: Text('ID: ${order.id} • ${order.status.name}'),
                  trailing: Text('Qty: ${order.finalQuantity}'),
                  onTap: () {
                    _orderIdController.text = order.id;
                    context.read<OrderProvider>().fetchOrderById(order.id);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _loadOrder() async {
    final orderId = _orderIdController.text.trim();
    if (orderId.isEmpty) return;
    await context.read<OrderProvider>().fetchOrderById(orderId);
  }

  Future<void> _completeOrder(String orderId) async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      await context.read<OrderProvider>().confirmCompletion(orderId);
      messenger.showSnackBar(
        const SnackBar(content: Text('Đã complete order.')),
      );
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  Future<void> _submitReview(String orderId) async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      await context.read<OrderProvider>().submitReview(
            orderId: orderId,
            rating: _rating,
            comment: _reviewController.text.trim(),
          );
      messenger.showSnackBar(
        const SnackBar(content: Text('Đã gửi review.')),
      );
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  Future<void> _raiseDispute(String orderId) async {
    final messenger = ScaffoldMessenger.of(context);
    final reason = _disputeReasonController.text.trim();
    if (reason.isEmpty) {
      messenger.showSnackBar(
        const SnackBar(content: Text('Vui lòng nhập lý do khiếu nại.')),
      );
      return;
    }
    try {
      await context.read<OrderProvider>().raiseDispute(
            orderId: orderId,
            reason: reason,
          );
      messenger.showSnackBar(
        const SnackBar(content: Text('Đã gửi khiếu nại.')),
      );
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }
}

class _OrderInfoCard extends StatelessWidget {
  const _OrderInfoCard({required this.order});

  final OrderModel order;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Order ID: ${order.id}', style: const TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('Listing: ${order.listingTitle}'),
            Text('Buyer: ${order.buyerName}'),
            Text('Seller: ${order.sellerName}'),
            Text('Quantity: ${order.finalQuantity}'),
            Text('Total: ${order.totalPrice}'),
            Text('Status: ${order.status.name}'),
          ],
        ),
      ),
    );
  }
}

