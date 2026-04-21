import '../models/wallet_model.dart';
import '../services/remote/api_service.dart';

class WalletRepository {
  final ApiService _api;

  WalletRepository(this._api);

  Future<WalletModel> getMyWallet() async {
    final response = await _api.get('/users/me/wallet');
    final data = _api.parseData<Map<String, dynamic>>(response);
    return WalletModel.fromJson(data);
  }

  Future<void> deposit(double amount, String method) async {
    final response = await _api.post('/users/me/wallet/deposit', data: {
      'amount': amount,
      'paymentMethod': method,
    });
    _api.parseData<dynamic>(response);
  }
}
