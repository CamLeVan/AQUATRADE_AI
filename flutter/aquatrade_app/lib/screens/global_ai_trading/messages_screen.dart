import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final _controller = TextEditingController();
  final _messages = <_Msg>[
    const _Msg(text: 'Can you summarize today’s market regime?', mine: false),
    const _Msg(text: 'Momentum is positive; volatility is moderate.', mine: true),
    const _Msg(text: 'Any key risks to watch?', mine: false),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ScreenScaffold(
      title: 'Messages',
      actions: [
        IconButton(onPressed: () {}, icon: const Icon(Icons.search)),
      ],
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (context, i) => _Bubble(msg: _messages[i]),
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              border: Border(top: BorderSide(color: theme.dividerColor)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _send(),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _send,
                  child: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add(_Msg(text: text, mine: true));
      _controller.clear();
    });
  }
}

class _Msg {
  const _Msg({required this.text, required this.mine});
  final String text;
  final bool mine;
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.msg});
  final _Msg msg;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final bg = msg.mine ? scheme.primaryContainer : scheme.surfaceContainerHighest;
    return Align(
      alignment: msg.mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.all(12),
        constraints: const BoxConstraints(maxWidth: 320),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(msg.text),
      ),
    );
  }
}

