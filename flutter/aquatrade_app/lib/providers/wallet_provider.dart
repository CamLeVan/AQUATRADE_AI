import 'package:flutter/material.dart';
import '../data/models/wallet_model.dart';
import '../data/repositories/wallet_repository.dart';

class WalletProvider with ChangeNotifier {
  final WalletRepository _repo;
  WalletProvider(this._repo);

  WalletModel? _wallet;
  bool _isLoading = false;
  String _errorMessage = '';

  WalletModel? get wallet => _wallet;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  Future<void> fetchWallet() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();
    try {
      _wallet = await _repo.getMyWallet();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deposit({
    required double amount,
    required String paymentMethod,
  }) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();
    try {
      await _repo.deposit(amount, paymentMethod);
      await fetchWallet();
    } catch (e) {
      _errorMessage = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
