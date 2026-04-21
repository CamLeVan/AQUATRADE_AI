import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import 'screen_scaffold.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  bool _biometrics = true;
  bool _analytics = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().fetchCurrentUser();
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScreenScaffold(
      title: 'Settings',
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Consumer<AuthProvider>(
            builder: (context, auth, _) {
              final user = auth.currentUser;
              return Card(
                child: ListTile(
                  leading: const Icon(Icons.person_outline),
                  title: Text(user?.fullName.isNotEmpty == true ? user!.fullName : 'Account'),
                  subtitle: Text(user?.email ?? 'Profile, security, sessions'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
              );
            },
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  value: _darkMode,
                  onChanged: (v) => setState(() => _darkMode = v),
                  title: const Text('Dark mode'),
                  secondary: const Icon(Icons.dark_mode_outlined),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _biometrics,
                  onChanged: (v) => setState(() => _biometrics = v),
                  title: const Text('Biometric unlock'),
                  secondary: const Icon(Icons.fingerprint),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  value: _analytics,
                  onChanged: (v) => setState(() => _analytics = v),
                  title: const Text('Share analytics'),
                  subtitle: const Text('Help improve product quality'),
                  secondary: const Icon(Icons.query_stats_outlined),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.notifications_none),
                  title: Text('Notifications'),
                  trailing: Icon(Icons.chevron_right),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.language),
                  title: Text('Language & region'),
                  trailing: Icon(Icons.chevron_right),
                ),
                Divider(height: 1),
                ListTile(
                  leading: Icon(Icons.info_outline),
                  title: Text('About'),
                  trailing: Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          FilledButton.tonalIcon(
            onPressed: () async {
              final authProvider = context.read<AuthProvider>();
              final messenger = ScaffoldMessenger.of(context);
              await authProvider.logout();
              if (!mounted) return;
              messenger.showSnackBar(
                const SnackBar(content: Text('Đã đăng xuất.')),
              );
            },
            icon: const Icon(Icons.logout),
            label: const Text('Sign out'),
          ),
        ],
      ),
    );
  }
}

