import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../data/repositories/auth_repository.dart';
import '../data/models/auth_model.dart';
import '../data/models/user_model.dart';

class AuthProvider with ChangeNotifier {
  final AuthRepository _repo;
  final _storage = const FlutterSecureStorage();

  AuthProvider(this._repo);

  AuthResponse? _auth;
  UserModel? _currentUser;
  bool _isLoading = false;
  String _errorMessage = '';

  bool get isAuthenticated => _auth != null || _currentUser != null;
  bool get isLoading => _isLoading;
  AuthResponse? get auth => _auth;
  UserModel? get currentUser => _currentUser;
  String get errorMessage => _errorMessage;

  Future<void> restoreSession() async {
    final token = await _storage.read(key: 'jwt_token');
    if (token == null || token.isEmpty) return;
    try {
      await fetchCurrentUser();
    } catch (_) {
      await _storage.delete(key: 'jwt_token');
      await _storage.delete(key: 'refresh_token');
    }
  }

  Future<bool> login(String email, String password, {bool rememberMe = true}) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _auth = await _repo.login(email, password);
      await _storage.write(key: 'jwt_token', value: _auth!.token);
      if (_auth!.refreshToken != null && _auth!.refreshToken!.isNotEmpty) {
        await _storage.write(key: 'refresh_token', value: _auth!.refreshToken!);
      }
      if (!rememberMe) {
        await _storage.delete(key: 'refresh_token');
      }
      await fetchCurrentUser(silent: true);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    required Role role,
    String? companyName,
  }) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _auth = await _repo.register(
        fullName: fullName,
        email: email,
        password: password,
        role: role,
        companyName: companyName,
      );
      await _storage.write(key: 'jwt_token', value: _auth!.token);
      if (_auth!.refreshToken != null && _auth!.refreshToken!.isNotEmpty) {
        await _storage.write(key: 'refresh_token', value: _auth!.refreshToken!);
      }
      await fetchCurrentUser(silent: true);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> refreshAuthToken() async {
    final refreshToken = await _storage.read(key: 'refresh_token');
    if (refreshToken == null || refreshToken.isEmpty) {
      throw Exception('Bạn cần đăng nhập lại.');
    }
    final refreshed = await _repo.refreshToken(refreshToken);
    _auth = refreshed;
    await _storage.write(key: 'jwt_token', value: refreshed.token);
    if (refreshed.refreshToken != null && refreshed.refreshToken!.isNotEmpty) {
      await _storage.write(key: 'refresh_token', value: refreshed.refreshToken!);
    }
    notifyListeners();
  }

  Future<void> fetchCurrentUser({bool silent = false}) async {
    if (!silent) {
      _isLoading = true;
      _errorMessage = '';
      notifyListeners();
    }
    try {
      _currentUser = await _repo.getCurrentUser();
    } catch (e) {
      _errorMessage = e.toString();
      rethrow;
    } finally {
      if (!silent) {
        _isLoading = false;
        notifyListeners();
      }
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    try {
      await _repo.logout();
    } catch (_) {
      // Vẫn xóa local token để tránh giữ phiên lỗi.
    }
    await _storage.delete(key: 'jwt_token');
    await _storage.delete(key: 'refresh_token');
    _auth = null;
    _currentUser = null;
    _isLoading = false;
    notifyListeners();
  }
}
