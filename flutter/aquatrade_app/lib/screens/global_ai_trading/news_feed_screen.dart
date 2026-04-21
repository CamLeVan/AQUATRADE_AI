import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/post_provider.dart';
import 'screen_scaffold.dart';

class NewsFeedScreen extends StatefulWidget {
  const NewsFeedScreen({super.key});

  @override
  State<NewsFeedScreen> createState() => _NewsFeedScreenState();
}

class _NewsFeedScreenState extends State<NewsFeedScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PostProvider>().fetchPosts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'News Feed',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.tune)),
      ],
      body: Consumer<PostProvider>(
        builder: (context, postProvider, _) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: ListTile(
                leading: const Icon(Icons.search),
                title: const Text('Search topics, tickers, macro events'),
                trailing: FilledButton.tonal(
                  onPressed: postProvider.fetchPosts,
                  child: const Text('Refresh'),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text('Top stories', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            if (postProvider.isLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: Center(child: CircularProgressIndicator()),
              ),
            if (postProvider.error.isNotEmpty)
              Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(postProvider.error),
                ),
              ),
            if (!postProvider.isLoading &&
                postProvider.error.isEmpty &&
                postProvider.posts.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text('Chưa có bài viết nào.'),
                ),
              ),
            ...postProvider.posts.map(
              (post) => _StoryCard(
                title: post.title,
                subtitle:
                    '${post.category ?? 'General'} • ${post.author ?? 'Unknown'} • ${post.viewCount ?? 0} views',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StoryCard extends StatelessWidget {
  const _StoryCard({required this.title, required this.subtitle});
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.newspaper_outlined)),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}

