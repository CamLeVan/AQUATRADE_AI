import 'package:flutter/material.dart';

import 'screen_scaffold.dart';

class KycVerificationScreen extends StatefulWidget {
  const KycVerificationScreen({super.key});

  @override
  State<KycVerificationScreen> createState() => _KycVerificationScreenState();
}

class _KycVerificationScreenState extends State<KycVerificationScreen> {
  int _step = 0;
  bool _agree = false;

  @override
  Widget build(BuildContext context) {
    return ScreenScaffold(
      title: 'KYC Verification',
      body: Stepper(
        currentStep: _step,
        onStepContinue: () {
          if (_step < 2) setState(() => _step++);
        },
        onStepCancel: () {
          if (_step > 0) setState(() => _step--);
        },
        controlsBuilder: (_, details) {
          final isLast = _step == 2;
          final canFinish = _agree;
          return Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Row(
              children: [
                FilledButton(
                  onPressed: isLast && !canFinish ? null : details.onStepContinue,
                  child: Text(isLast ? 'Finish' : 'Continue'),
                ),
                const SizedBox(width: 12),
                TextButton(onPressed: details.onStepCancel, child: const Text('Back')),
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text('Identity'),
            isActive: _step >= 0,
            content: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.badge_outlined),
                  title: Text('Government ID'),
                  subtitle: Text('Upload photo (demo)'),
                ),
                ListTile(
                  leading: Icon(Icons.face_outlined),
                  title: Text('Selfie check'),
                  subtitle: Text('Liveness verification (demo)'),
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Address'),
            isActive: _step >= 1,
            content: Column(
              children: const [
                ListTile(
                  leading: Icon(Icons.home_outlined),
                  title: Text('Proof of address'),
                  subtitle: Text('Utility bill / bank statement (demo)'),
                ),
              ],
            ),
          ),
          Step(
            title: const Text('Consent'),
            isActive: _step >= 2,
            content: Column(
              children: [
                const Card(
                  child: ListTile(
                    leading: Icon(Icons.lock_outline),
                    title: Text('Privacy & data usage'),
                    subtitle: Text('We store verification results securely.'),
                  ),
                ),
                CheckboxListTile(
                  value: _agree,
                  onChanged: (v) => setState(() => _agree = v ?? false),
                  controlAffinity: ListTileControlAffinity.leading,
                  title: const Text('I agree to the verification terms'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

