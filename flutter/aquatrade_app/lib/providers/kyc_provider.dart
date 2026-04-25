import 'package:flutter/material.dart';

enum KycState { unverified, submitting, pending, verified, rejected }

class KycProvider with ChangeNotifier {
  KycState _state = KycState.unverified;
  String _errorMessage = '';

  KycState get state => _state;
  String get errorMessage => _errorMessage;

  bool get isVerified => _state == KycState.verified;

  Future<void> submitKycData(Map<String, dynamic> formData) async {
    _state = KycState.submitting;
    _errorMessage = '';
    notifyListeners();

    try {
      // TODO: Connect to actual AuthRepository/KycRepository
      await Future.delayed(const Duration(seconds: 2)); // Mock API call
      
      // Assume successful submission puts it in pending state
      _state = KycState.pending;
    } catch (e) {
      _state = KycState.unverified;
      _errorMessage = e.toString();
    } finally {
      notifyListeners();
    }
  }

  // Helper method to mock approval
  void mockApprove() {
    _state = KycState.verified;
    notifyListeners();
  }
}
