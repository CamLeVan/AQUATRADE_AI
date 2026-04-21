import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class ContentHubScreen extends StatelessWidget {
  const ContentHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: ScreenScaffold(
        title: 'Content Hub',
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.add)),
        ],
        body: Column(
          children: const [
            TabBar(
              tabs: [
                Tab(text: 'Articles'),
                Tab(text: 'Videos'),
                Tab(text: 'Schedule'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _ArticlesTab(),
                  _VideosTab(),
                  _ScheduleTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticlesTab extends StatelessWidget {
  const _ArticlesTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: const [
        _ContentTile(title: 'How to read momentum signals', meta: 'Draft • updated 1h ago', icon: Icons.description_outlined),
        _ContentTile(title: 'Risk sizing for systematic trading', meta: 'Published • 4.2K views', icon: Icons.article_outlined),
        _ContentTile(title: 'Event-driven volatility playbook', meta: 'Review • pending', icon: Icons.fact_check_outlined),
      ],
    );
  }
}

class _VideosTab extends StatelessWidget {
  const _VideosTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: const [
        _ContentTile(title: 'Daily market wrap (10m)', meta: 'Video • 10:12', icon: Icons.play_circle_outline),
        _ContentTile(title: 'AI signals deep dive', meta: 'Video • 06:40', icon: Icons.play_circle_outline),
      ],
    );
  }
}

class _ScheduleTab extends StatelessWidget {
  const _ScheduleTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: const [
        _ScheduleTile(day: 'Mon', task: 'Publish weekly outlook at 08:00'),
        _ScheduleTile(day: 'Wed', task: 'Live Q&A session at 20:00'),
        _ScheduleTile(day: 'Fri', task: 'Performance recap at 17:00'),
      ],
    );
  }
}

class _ContentTile extends StatelessWidget {
  const _ContentTile({required this.title, required this.meta, required this.icon});
  final String title;
  final String meta;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(meta),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}

class _ScheduleTile extends StatelessWidget {
  const _ScheduleTile({required this.day, required this.task});
  final String day;
  final String task;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Chip(label: Text(day)),
        title: Text(task),
      ),
    );
  }
}

