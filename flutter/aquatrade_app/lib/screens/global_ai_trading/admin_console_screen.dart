import 'package:flutter/material.dart';

import 'screen_scaffold.dart';
import 'user_directory_screen.dart';

class AdminConsoleScreen extends StatefulWidget {
  const AdminConsoleScreen({super.key});

  @override
  State<AdminConsoleScreen> createState() => _AdminConsoleScreenState();
}

class _AdminConsoleScreenState extends State<AdminConsoleScreen> {
  bool _maintenance = false;
  bool _autoApprove = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Admin Console',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.settings_outlined)),
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
                  Text('System overview', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Expanded(child: _Kpi(label: 'Pending reviews', value: '7', icon: Icons.fact_check_outlined)),
                      SizedBox(width: 8),
                      Expanded(child: _Kpi(label: 'Incidents', value: '1', icon: Icons.report_outlined)),
                      SizedBox(width: 8),
                      Expanded(child: _Kpi(label: 'New users', value: '12', icon: Icons.person_add_alt)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Controls', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  value: _maintenance,
                  onChanged: (v) => setState(() => _maintenance = v),
                  title: const Text('Maintenance mode'),
                  subtitle: const Text('Restrict non-admin access (demo)'),
                  secondary: const Icon(Icons.build_outlined),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _autoApprove,
                  onChanged: (v) => setState(() => _autoApprove = v),
                  title: const Text('Auto-approve low-risk content'),
                  subtitle: const Text('Applies to verified accounts'),
                  secondary: const Icon(Icons.auto_awesome),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.people_alt_outlined),
                  title: const Text('User Directory'),
                  subtitle: const Text('Manage user accounts and roles'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    Navigator.of(context).push(MaterialPageRoute(builder: (_) => const UserDirectoryScreen()));
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text('Recent activity', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          ...const [
            _Log(time: '09:12', message: 'Approved strategy note: “Momentum regime”'),
            _Log(time: '08:45', message: 'Suspended user: Mia Rivera (spam reports)'),
            _Log(time: '08:10', message: 'Updated alert ruleset'),
          ],
        ],
      ),
    );
  }
}

class _Kpi extends StatelessWidget {
  const _Kpi({required this.label, required this.value, required this.icon});
  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: theme.colorScheme.primary),
            const SizedBox(height: 8),
            Text(value, style: theme.textTheme.titleLarge),
            const SizedBox(height: 2),
            Text(label, style: theme.textTheme.bodySmall, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _Log extends StatelessWidget {
  const _Log({required this.time, required this.message});
  final String time;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Chip(label: Text(time)),
        title: Text(message),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}

