import 'package:flutter/material.dart';

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
      appBar: AppBar(title: Text(title), actions: actions),
      floatingActionButton: fab,
      bottomNavigationBar: bottom,
      body: SafeArea(child: body),
    );
  }
}

