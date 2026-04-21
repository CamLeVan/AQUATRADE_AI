import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class UserDirectoryScreen extends StatefulWidget {
  const UserDirectoryScreen({super.key});

  @override
  State<UserDirectoryScreen> createState() => _UserDirectoryScreenState();
}

class _UserDirectoryScreenState extends State<UserDirectoryScreen> {
  final _search = TextEditingController();
  int _role = 0; // all, analyst, trader, admin

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final roles = const ['All', 'Analyst', 'Trader', 'Admin'];
    final query = _search.text.trim().toLowerCase();
    final all = const <_User>[
      _User(name: 'Ava Chen', role: 'Analyst', status: 'Active'),
      _User(name: 'Noah Patel', role: 'Trader', status: 'Active'),
      _User(name: 'Mia Rivera', role: 'Trader', status: 'Suspended'),
      _User(name: 'Admin Ops', role: 'Admin', status: 'Active'),
    ];
    final filtered = all.where((u) {
      final roleOk = _role == 0 || u.role == roles[_role];
      final queryOk = query.isEmpty || u.name.toLowerCase().contains(query);
      return roleOk && queryOk;
    }).toList();

    return ScreenScaffold(
      title: 'User Directory',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.person_add_alt_1)),
      ],
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  const Icon(Icons.search),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _search,
                      decoration: const InputDecoration(
                        hintText: 'Search users...',
                        border: InputBorder.none,
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      _search.clear();
                      setState(() {});
                    },
                    icon: const Icon(Icons.clear),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Role', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: List.generate(
              roles.length,
              (i) => ChoiceChip(
                label: Text(roles[i]),
                selected: _role == i,
                onSelected: (_) => setState(() => _role = i),
              ),
            ),
          ),
          const SizedBox(height: 16),
          for (final u in filtered) _UserTile(user: u),
        ],
      ),
    );
  }
}

class _User {
  const _User({required this.name, required this.role, required this.status});
  final String name;
  final String role;
  final String status;
}

class _UserTile extends StatelessWidget {
  const _UserTile({required this.user});
  final _User user;

  @override
  Widget build(BuildContext context) {
    final suspended = user.status != 'Active';
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Text(user.name.substring(0, 1))),
        title: Text(user.name),
        subtitle: Text(user.role),
        trailing: Chip(
          label: Text(user.status),
          avatar: Icon(suspended ? Icons.block_outlined : Icons.check_circle_outline, size: 18),
        ),
        onTap: () {},
      ),
    );
  }
}

