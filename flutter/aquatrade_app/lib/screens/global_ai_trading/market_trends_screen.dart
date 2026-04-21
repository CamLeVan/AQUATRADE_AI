import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class MarketTrendsScreen extends StatefulWidget {
  const MarketTrendsScreen({super.key});

  @override
  State<MarketTrendsScreen> createState() => _MarketTrendsScreenState();
}

class _MarketTrendsScreenState extends State<MarketTrendsScreen> {
  int _tab = 0; // 0 movers, 1 sectors, 2 heatmap

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Market Trends',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.refresh)),
      ],
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: SegmentedButton<int>(
              segments: const [
                ButtonSegment(value: 0, label: Text('Movers'), icon: Icon(Icons.trending_up)),
                ButtonSegment(value: 1, label: Text('Sectors'), icon: Icon(Icons.category_outlined)),
                ButtonSegment(value: 2, label: Text('Heatmap'), icon: Icon(Icons.grid_view)),
              ],
              selected: {_tab},
              onSelectionChanged: (s) => setState(() => _tab = s.first),
            ),
          ),
          Expanded(
            child: switch (_tab) {
              0 => _buildMovers(theme),
              1 => _buildSectors(theme),
              _ => _buildHeatmap(theme),
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMovers(ThemeData theme) {
    final rows = const [
      _Mover(symbol: 'NVDA', change: 4.2, price: 912.30),
      _Mover(symbol: 'TSLA', change: -2.1, price: 176.10),
      _Mover(symbol: 'BTC', change: 1.6, price: 66210.00),
      _Mover(symbol: 'EURUSD', change: 0.4, price: 1.0842),
    ];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Intraday trend', style: theme.textTheme.titleMedium),
                const SizedBox(height: 12),
                const SizedBox(height: 150, child: _SparklinePanel()),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text('Top movers', style: theme.textTheme.titleMedium),
        const SizedBox(height: 8),
        for (final r in rows) _MoverTile(mover: r),
      ],
    );
  }

  Widget _buildSectors(ThemeData theme) {
    final sectors = const [
      _Sector(name: 'AI & Semis', strength: 0.82),
      _Sector(name: 'Energy', strength: 0.56),
      _Sector(name: 'Healthcare', strength: 0.43),
      _Sector(name: 'Fintech', strength: 0.61),
    ];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Sector strength', style: theme.textTheme.titleMedium),
        const SizedBox(height: 8),
        for (final s in sectors) _SectorTile(sector: s),
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.auto_graph),
          label: const Text('Generate sector report'),
        ),
      ],
    );
  }

  Widget _buildHeatmap(ThemeData theme) {
    final tiles = const [
      _HeatTile(label: 'AAPL', score: 0.35),
      _HeatTile(label: 'MSFT', score: 0.62),
      _HeatTile(label: 'AMZN', score: -0.25),
      _HeatTile(label: 'GOOG', score: 0.10),
      _HeatTile(label: 'META', score: 0.48),
      _HeatTile(label: 'TSLA', score: -0.55),
    ];
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Heatmap (signal score)', style: theme.textTheme.titleMedium),
          const SizedBox(height: 12),
          Expanded(
            child: GridView.count(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              children: [
                for (final t in tiles) _HeatmapTile(tile: t),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SparklinePanel extends StatelessWidget {
  const _SparklinePanel();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _SparklinePainter(Theme.of(context).colorScheme.primary),
      child: const SizedBox.expand(),
    );
  }
}

class _SparklinePainter extends CustomPainter {
  _SparklinePainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = color
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;
    final path = Path()
      ..moveTo(0, size.height * 0.75)
      ..lineTo(size.width * 0.2, size.height * 0.55)
      ..lineTo(size.width * 0.4, size.height * 0.62)
      ..lineTo(size.width * 0.6, size.height * 0.42)
      ..lineTo(size.width * 0.8, size.height * 0.38)
      ..lineTo(size.width, size.height * 0.28);
    canvas.drawPath(path, p);
  }

  @override
  bool shouldRepaint(covariant _SparklinePainter oldDelegate) =>
      oldDelegate.color != color;
}

class _Mover {
  const _Mover({required this.symbol, required this.change, required this.price});
  final String symbol;
  final double change;
  final double price;
}

class _MoverTile extends StatelessWidget {
  const _MoverTile({required this.mover});
  final _Mover mover;

  @override
  Widget build(BuildContext context) {
    final up = mover.change >= 0;
    final color = up ? Colors.green : Colors.red;
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Text(mover.symbol.substring(0, 1))),
        title: Text(mover.symbol),
        subtitle: Text('Last: ${mover.price.toStringAsFixed(2)}'),
        trailing: Text(
          '${up ? '+' : ''}${mover.change.toStringAsFixed(1)}%',
          style: TextStyle(color: color, fontWeight: FontWeight.w600),
        ),
        onTap: () {},
      ),
    );
  }
}

class _Sector {
  const _Sector({required this.name, required this.strength});
  final String name;
  final double strength;
}

class _SectorTile extends StatelessWidget {
  const _SectorTile({required this.sector});
  final _Sector sector;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(child: Text(sector.name)),
            SizedBox(
              width: 160,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: LinearProgressIndicator(value: sector.strength, minHeight: 10),
              ),
            ),
            const SizedBox(width: 12),
            Text('${(sector.strength * 100).round()}%'),
          ],
        ),
      ),
    );
  }
}

class _HeatTile {
  const _HeatTile({required this.label, required this.score});
  final String label;
  final double score;
}

class _HeatmapTile extends StatelessWidget {
  const _HeatmapTile({required this.tile});
  final _HeatTile tile;

  @override
  Widget build(BuildContext context) {
    final base = tile.score >= 0 ? Colors.green : Colors.red;
    final shade = base.withOpacity((tile.score.abs().clamp(0, 1) * 0.75) + 0.15);
    return InkWell(
      onTap: () {},
      child: Container(
        decoration: BoxDecoration(
          color: shade,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(tile.label, style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 6),
              Text('${tile.score >= 0 ? '+' : ''}${(tile.score * 100).round()}'),
            ],
          ),
        ),
      ),
    );
  }
}

