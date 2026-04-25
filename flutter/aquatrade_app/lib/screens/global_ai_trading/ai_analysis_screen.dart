import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class AiAnalysisScreen extends StatelessWidget {
  final String symbol;
  const AiAnalysisScreen({super.key, required this.symbol});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'AI Analysis - $symbol',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.tune)),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Market snapshot', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Expanded(child: _Metric(label: 'Signal', value: 'Buy')),
                      SizedBox(width: 8),
                      Expanded(child: _Metric(label: 'Confidence', value: '0.78')),
                      SizedBox(width: 8),
                      Expanded(child: _Metric(label: 'Volatility', value: 'Medium')),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Trend (7D)', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  const SizedBox(height: 160, child: _LineChart()),
                  const SizedBox(height: 8),
                  Text(
                    'AI summary: momentum is positive; watch for a pullback near resistance.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Actionable insights', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          ...const [
            _InsightCard(
              title: 'Setup: Breakout',
              subtitle: 'If price holds above VWAP, consider scaling in.',
              icon: Icons.rocket_launch_outlined,
            ),
            _InsightCard(
              title: 'Risk: News event',
              subtitle: 'High-impact report in 3h; reduce leverage.',
              icon: Icons.warning_amber_rounded,
            ),
            _InsightCard(
              title: 'Alternative: Mean reversion',
              subtitle: 'If rejected, consider short-term reversal trade.',
              icon: Icons.swap_horiz,
            ),
          ],
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.auto_awesome),
            label: const Text('Run portfolio analysis'),
          ),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Text(label, style: theme.textTheme.bodySmall),
            const SizedBox(height: 6),
            Text(value, style: theme.textTheme.titleMedium),
          ],
        ),
      ),
    );
  }
}

class _LineChart extends StatelessWidget {
  const _LineChart();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _LineChartPainter(Theme.of(context).colorScheme.primary),
      child: const SizedBox.expand(),
    );
  }
}

class _LineChartPainter extends CustomPainter {
  _LineChartPainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final grid = Paint()
      ..color = color.withOpacity(0.15)
      ..strokeWidth = 1;
    for (int i = 1; i < 4; i++) {
      final y = size.height * i / 4;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), grid);
    }

    final p = Paint()
      ..color = color
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path()
      ..moveTo(0, size.height * 0.75)
      ..lineTo(size.width * 0.18, size.height * 0.6)
      ..lineTo(size.width * 0.35, size.height * 0.68)
      ..lineTo(size.width * 0.52, size.height * 0.48)
      ..lineTo(size.width * 0.78, size.height * 0.35)
      ..lineTo(size.width, size.height * 0.25);
    canvas.drawPath(path, p);
  }

  @override
  bool shouldRepaint(covariant _LineChartPainter oldDelegate) =>
      oldDelegate.color != color;
}

class _InsightCard extends StatelessWidget {
  const _InsightCard({
    required this.title,
    required this.subtitle,
    required this.icon,
  });
  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Icon(icon)),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}

