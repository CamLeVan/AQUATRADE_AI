import 'package:flutter/material.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'screen_scaffold.dart';
import '../root_screen.dart';

class OnboardingFlowScreen extends StatefulWidget {
  const OnboardingFlowScreen({super.key});

  @override
  State<OnboardingFlowScreen> createState() => _OnboardingFlowScreenState();
}

class _OnboardingFlowScreenState extends State<OnboardingFlowScreen> {
  final _page = PageController();
  int _index = 0;

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Onboarding Flow',
      bottom: Padding(
        padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
        child: Row(
          children: [
            TextButton(
              onPressed: _index > 0 ? () => _page.previousPage(duration: const Duration(milliseconds: 250), curve: Curves.easeOut) : null,
              child: const Text('Back'),
            ),
            const Spacer(),
            FilledButton(
              onPressed: () async {
                if (_index < 2) {
                  _page.nextPage(duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
                } else {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.setBool('is_first_time', false);
                  if (context.mounted) {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const RootScreen()),
                    );
                  }
                }
              },
              child: Text(_index < 2 ? 'Next' : 'Finish'),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              3,
              (i) => Container(
                width: i == _index ? 20 : 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  color: i == _index ? theme.colorScheme.primary : theme.colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: PageView(
              controller: _page,
              onPageChanged: (i) => setState(() => _index = i),
              children: const [
                _OnboardPage(
                  icon: Icons.auto_awesome,
                  title: 'AI-first insights',
                  body: 'Turn market data into actionable trade ideas with explainable signals.',
                ),
                _OnboardPage(
                  icon: Icons.security,
                  title: 'Built-in risk guardrails',
                  body: 'Set drawdown limits, exposure caps, and leverage restrictions.',
                ),
                _OnboardPage(
                  icon: Icons.speed,
                  title: 'Fast execution',
                  body: 'Create orders quickly and monitor tickets in one place.',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _OnboardPage extends StatelessWidget {
  const _OnboardPage({required this.icon, required this.title, required this.body});

  final IconData icon;
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(radius: 28, child: Icon(icon, size: 28)),
                  const SizedBox(height: 12),
                  Text(title, style: theme.textTheme.titleLarge),
                  const SizedBox(height: 10),
                  Text(body, style: theme.textTheme.bodyMedium, textAlign: TextAlign.center),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

