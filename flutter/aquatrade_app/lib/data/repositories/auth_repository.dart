import '../services/remote/api_service.dart';
import '../models/auth_model.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiService _api;

  AuthRepository(this._api);

  Future<AuthResponse> login(String email, String password) async {
    final response = await _api.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final data = _api.parseData<Map<String, dynamic>>(response);
    return AuthResponse.fromJson(data);
  }

  Future<AuthResponse> register({
    required String fullName,
    required String email,
    required String password,
    required Role role,
    String? companyName,
  }) async {
    final response = await _api.post('/auth/register', data: {
      'fullName': fullName,
      'email': email,
      'password': password,
      'role': role.name,
      if (companyName != null && companyName.isNotEmpty) 'companyName': companyName,
    });
    final data = _api.parseData<Map<String, dynamic>>(response);
    return AuthResponse.fromJson(data);
  }

  Future<AuthResponse> refreshToken(String refreshToken) async {
    final response = await _api.post('/auth/refresh', data: {
      'refreshToken': refreshToken,
    });
    final data = _api.parseData<Map<String, dynamic>>(response);
    return AuthResponse.fromJson(data);
  }

  Future<void> logout() async {
    await _api.post('/auth/logout');
  }

  Future<UserModel> getCurrentUser() async {
    final response = await _api.get('/users/me');
    final data = _api.parseData<Map<String, dynamic>>(response);
    return UserModel.fromJson(data);
  }
}
