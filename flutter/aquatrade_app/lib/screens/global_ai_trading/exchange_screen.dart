import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class ExchangeScreen extends StatefulWidget {
  const ExchangeScreen({super.key});

  @override
  State<ExchangeScreen> createState() => _ExchangeScreenState();
}

class _ExchangeScreenState extends State<ExchangeScreen> {
  int _market = 0;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final markets = const ['US', 'Crypto', 'FX'];
    return ScreenScaffold(
      title: 'Exchange',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.search)),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Market', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: List.generate(
              markets.length,
              (i) => ChoiceChip(
                label: Text(markets[i]),
                selected: _market == i,
                onSelected: (_) => setState(() => _market = i),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.public),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Connected venue: Global Liquidity Hub',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ),
                  FilledButton.tonal(
                    onPressed: () {},
                    child: const Text('Switch'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Quotes', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          ...const [
            _QuoteTile(symbol: 'SPY', bid: 542.10, ask: 542.12, spread: 0.02),
            _QuoteTile(symbol: 'AAPL', bid: 212.31, ask: 212.35, spread: 0.04),
            _QuoteTile(symbol: 'BTC', bid: 66210.0, ask: 66218.0, spread: 8.0),
          ],
        ],
      ),
    );
  }
}

class _QuoteTile extends StatelessWidget {
  const _QuoteTile({
    required this.symbol,
    required this.bid,
    required this.ask,
    required this.spread,
  });

  final String symbol;
  final double bid;
  final double ask;
  final double spread;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Text(symbol.substring(0, 1))),
        title: Text(symbol),
        subtitle: Text('Bid $bid • Ask $ask'),
        trailing: Chip(label: Text('Spread $spread')),
        onTap: () {},
      ),
    );
  }
}

