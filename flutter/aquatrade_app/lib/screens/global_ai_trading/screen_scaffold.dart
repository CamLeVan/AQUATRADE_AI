import 'package:flutter/material.dart';
import 'messages_screen.dart';
import 'alerts_screen.dart';

class ScreenScaffold extends StatelessWidget {
  const ScreenScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions = const [],
    this.fab,
    this.bottom,
  });

  final String title;
  final Widget body;
  final List<Widget> actions;
  final Widget? fab;
  final Widget? bottom;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          ...actions,
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AlertsScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.mail_outline),
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MessagesScreen()));
            },
          ),
        ],
      ),
      floatingActionButton: fab,
      bottomNavigationBar: bottom,
      body: SafeArea(child: body),
    );
  }
}

