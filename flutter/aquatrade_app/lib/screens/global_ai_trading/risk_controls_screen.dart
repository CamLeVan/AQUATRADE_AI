import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class RiskControlsScreen extends StatefulWidget {
  const RiskControlsScreen({super.key});

  @override
  State<RiskControlsScreen> createState() => _RiskControlsScreenState();
}

class _RiskControlsScreenState extends State<RiskControlsScreen> {
  double _maxDailyLoss = 500;
  double _maxPosition = 2500;
  bool _blockHighLeverage = true;
  bool _autoKillSwitch = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Risk Controls',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.shield_outlined)),
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
                  Text('Account limits', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  Text('Max daily loss: \$${_maxDailyLoss.round()}'),
                  Slider(
                    value: _maxDailyLoss,
                    min: 100,
                    max: 2000,
                    divisions: 19,
                    label: '\$${_maxDailyLoss.round()}',
                    onChanged: (v) => setState(() => _maxDailyLoss = v),
                  ),
                  const SizedBox(height: 8),
                  Text('Max position size: \$${_maxPosition.round()}'),
                  Slider(
                    value: _maxPosition,
                    min: 500,
                    max: 20000,
                    divisions: 39,
                    label: '\$${_maxPosition.round()}',
                    onChanged: (v) => setState(() => _maxPosition = v),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  value: _blockHighLeverage,
                  onChanged: (v) => setState(() => _blockHighLeverage = v),
                  title: const Text('Block high leverage'),
                  subtitle: const Text('Restrict orders above 2x leverage'),
                  secondary: const Icon(Icons.block_outlined),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _autoKillSwitch,
                  onChanged: (v) => setState(() => _autoKillSwitch = v),
                  title: const Text('Auto kill switch'),
                  subtitle: const Text('Auto-close positions if limits breached'),
                  secondary: const Icon(Icons.power_settings_new),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Risk controls saved (demo).')),
              );
            },
            icon: const Icon(Icons.save_outlined),
            label: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

