import 'package:flutter/material.dart';

import 'screen_scaffold.dart';
import '../../data/models/listing_model.dart';
import 'package:intl/intl.dart';
import 'ai_analysis_screen.dart';
import 'create_order_screen.dart';

class AssetDetailScreen extends StatefulWidget {
  final ListingModel listing;
  const AssetDetailScreen({super.key, required this.listing});

  @override
  State<AssetDetailScreen> createState() => _AssetDetailScreenState();
}

class _AssetDetailScreenState extends State<AssetDetailScreen> {
  bool _watching = false;
  int _qty = 5;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Asset Detail',
      actions: [
        IconButton(
          onPressed: () => setState(() => _watching = !_watching),
          icon: Icon(_watching ? Icons.star : Icons.star_border),
        ),
        IconButton(onPressed: () {}, icon: const Icon(Icons.share_outlined)),
      ],
      bottom: Container(
        padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          border: Border(top: BorderSide(color: theme.dividerColor)),
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.chat_bubble_outline),
                label: const Text('Discuss'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => CreateOrderScreen(initialListingId: widget.listing.id),
                    ),
                  );
                },
                icon: const Icon(Icons.shopping_cart_outlined),
                label: const Text('Trade'),
              ),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: theme.colorScheme.primaryContainer,
                        child: const Icon(Icons.set_meal),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.listing.title, style: theme.textTheme.titleLarge),
                            Text(widget.listing.sellerName, style: theme.textTheme.bodySmall),
                          ],
                        ),
                      ),
                      Chip(
                        label: Text(widget.listing.category.toString().split('.').last),
                        backgroundColor: Colors.blue.withOpacity(0.15),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(widget.listing.pricePerFish), style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 12),
                  const SizedBox(height: 150, child: _MiniChart()),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Order size', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  IconButton(
                    onPressed: _qty > 1 ? () => setState(() => _qty--) : null,
                    icon: const Icon(Icons.remove_circle_outline),
                  ),
                  Expanded(
                    child: Center(
                      child: Text('$_qty shares', style: theme.textTheme.titleLarge),
                    ),
                  ),
                  IconButton(
                    onPressed: () => setState(() => _qty++),
                    icon: const Icon(Icons.add_circle_outline),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Key stats', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          _StatsGrid(listing: widget.listing),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => AiAnalysisScreen(symbol: widget.listing.title),
                ),
              );
            },
            icon: const Icon(Icons.psychology),
            label: const Text('Phân tích AI'),
            style: FilledButton.styleFrom(
              backgroundColor: Colors.purple,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniChart extends StatelessWidget {
  const _MiniChart();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _MiniChartPainter(Theme.of(context).colorScheme.primary),
      child: const SizedBox.expand(),
    );
  }
}

class _MiniChartPainter extends CustomPainter {
  _MiniChartPainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = color
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;
    final path = Path()
      ..moveTo(0, size.height * 0.7)
      ..lineTo(size.width * 0.2, size.height * 0.55)
      ..lineTo(size.width * 0.45, size.height * 0.65)
      ..lineTo(size.width * 0.7, size.height * 0.4)
      ..lineTo(size.width, size.height * 0.5);
    canvas.drawPath(path, p);
  }

  @override
  bool shouldRepaint(covariant _MiniChartPainter oldDelegate) =>
      oldDelegate.color != color;
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.listing});
  final ListingModel listing;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(child: _Stat(label: 'Species', value: listing.species)),
                Expanded(child: _Stat(label: 'Province', value: listing.province)),
              ],
            ),
            const Divider(height: 16),
            Row(
              children: [
                Expanded(child: _Stat(label: 'Available', value: '${listing.availableQuantity}')),
                Expanded(child: _Stat(label: 'Est. Quantity', value: '${listing.estimatedQuantity}')),
              ],
            ),
            const SizedBox(height: 6),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'AI note: sentiment is improving; risk increases around earnings.',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: theme.textTheme.bodySmall),
          const SizedBox(height: 4),
          Text(value, style: theme.textTheme.titleSmall),
        ],
      ),
    );
  }
}

