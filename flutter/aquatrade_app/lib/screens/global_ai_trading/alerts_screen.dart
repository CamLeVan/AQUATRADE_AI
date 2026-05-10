import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  bool _priceAlerts = true;
  bool _riskAlerts = true;
  bool _newsAlerts = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Alerts',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.add_alert_outlined)),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Subscriptions', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  value: _priceAlerts,
                  onChanged: (v) => setState(() => _priceAlerts = v),
                  title: const Text('Price alerts'),
                  subtitle: const Text('Crossing levels, breakouts, spikes'),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _riskAlerts,
                  onChanged: (v) => setState(() => _riskAlerts = v),
                  title: const Text('Risk alerts'),
                  subtitle: const Text('Margin, drawdown, exposure'),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _newsAlerts,
                  onChanged: (v) => setState(() => _newsAlerts = v),
                  title: const Text('News alerts'),
                  subtitle: const Text('Breaking news on your watchlist'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text('Recent alerts', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          ...const [
            _AlertTile(
              title: 'AAPL touched 212.00',
              subtitle: 'Price level alert • 2m ago',
              icon: Icons.show_chart,
            ),
            _AlertTile(
              title: 'Exposure exceeded 60%',
              subtitle: 'Risk alert • 15m ago',
              icon: Icons.warning_amber_rounded,
            ),
            _AlertTile(
              title: 'NVDA earnings in 1 day',
              subtitle: 'Event reminder • 3h ago',
              icon: Icons.event_outlined,
            ),
          ],
        ],
      ),
    );
  }
}

class _AlertTile extends StatelessWidget {
  const _AlertTile({required this.title, required this.subtitle, required this.icon});
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

