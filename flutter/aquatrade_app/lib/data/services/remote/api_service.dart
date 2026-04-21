import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: kIsWeb ? 'http://localhost:8080/api/v1' : 'http://10.0.2.2:8080/api/v1',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      // sendTimeout: const Duration(seconds: 10), // Gây lỗi trên Web cho requests không body
      headers: {'Content-Type': 'application/json'},
    ),
  );
  final _storage = const FlutterSecureStorage();
  bool _isRefreshing = false;
  List<void Function(String?)> _refreshQueue = [];

  ApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'jwt_token');
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (e, handler) async {
        if (_shouldRefresh(e)) {
          if (_isRefreshing) {
            // Add to queue and wait
            _refreshQueue.add((newToken) {
              if (newToken != null) {
                e.requestOptions.headers['Authorization'] = 'Bearer $newToken';
                _dio.fetch<dynamic>(e.requestOptions).then(
                      (res) => handler.resolve(res),
                      onError: (err) => handler.next(err),
                    );
              } else {
                handler.next(e);
              }
            });
            return;
          }

          final refreshed = await _tryRefreshToken();
          if (refreshed) {
            final newToken = await _storage.read(key: 'jwt_token');
            e.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            
            // Retry current request
            try {
              final response = await _dio.fetch<dynamic>(e.requestOptions);
              return handler.resolve(response);
            } catch (err) {
              return handler.next(e);
            }
          }
        }
        handler.next(e);
      },
    ));
  }

  bool _shouldRefresh(DioException e) {
    final path = e.requestOptions.path;
    final isAuthPath = path.contains('/auth/login') || path.contains('/auth/refresh');
    return e.response?.statusCode == 401 && !isAuthPath;
  }

  Future<bool> _tryRefreshToken() async {
    _isRefreshing = true;

    try {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken == null || refreshToken.isEmpty) {
        _onRefreshFailed();
        return false;
      }

      final response = await _dio.post<dynamic>(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      
      final payload = response.data;
      if (payload['status'] != 'success') {
        _onRefreshFailed();
        return false;
      }
      
      final data = payload['data'];
      final newToken = data['token'] as String?;
      final newRefreshToken = data['refreshToken'] as String?;
      
      if (newToken == null || newToken.isEmpty) {
        _onRefreshFailed();
        return false;
      }

      await _storage.write(key: 'jwt_token', value: newToken);
      if (newRefreshToken != null && newRefreshToken.isNotEmpty) {
        await _storage.write(key: 'refresh_token', value: newRefreshToken);
      }

      _onRefreshSuccess(newToken);
      return true;
    } catch (_) {
      _onRefreshFailed();
      return false;
    } finally {
      _isRefreshing = false;
    }
  }

  void _onRefreshSuccess(String token) {
    for (var callback in _refreshQueue) {
      callback(token);
    }
    _refreshQueue.clear();
  }

  void _onRefreshFailed() {
    for (var callback in _refreshQueue) {
      callback(null);
    }
    _refreshQueue.clear();
  }

  String _mapError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.sendTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return 'Kết nối quá thời gian. Vui lòng thử lại.';
    }
    if (e.type == DioExceptionType.connectionError) {
      return 'Không thể kết nối đến máy chủ. Hãy kiểm tra mạng.';
    }
    if (e.type == DioExceptionType.cancel) {
      return 'Yêu cầu đã bị hủy.';
    }

    final statusCode = e.response?.statusCode;
    final responseData = e.response?.data;

    if (responseData is Map<String, dynamic>) {
      final message = responseData['message'];
      if (message is String && message.isNotEmpty) {
        return message;
      }
    }

    switch (statusCode) {
      case 400:
        return 'Dữ liệu gửi lên không hợp lệ.';
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này.';
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu.';
      case 409:
        return 'Dữ liệu bị xung đột. Vui lòng thử lại.';
      case 500:
      case 502:
      case 503:
        return 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
      default:
        return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  }

  T parseData<T>(Response response) {
    final payload = response.data;
    if (payload is! Map<String, dynamic>) {
      throw const ApiException('Phản hồi từ máy chủ không hợp lệ.');
    }
    if (payload['status'] != 'success') {
      throw ApiException(
        (payload['message'] as String?) ?? 'Yêu cầu không thành công.',
        statusCode: response.statusCode,
      );
    }
    return payload['data'] as T;
  }

  Future<Response<dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.get<dynamic>(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw ApiException(_mapError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Response<dynamic>> post(String path, {dynamic data}) async {
    try {
      return await _dio.post<dynamic>(path, data: data);
    } on DioException catch (e) {
      throw ApiException(_mapError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Response<dynamic>> put(String path, {dynamic data}) async {
    try {
      return await _dio.put<dynamic>(path, data: data);
    } on DioException catch (e) {
      throw ApiException(_mapError(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Response<dynamic>> delete(String path) async {
    try {
      return await _dio.delete<dynamic>(path);
    } on DioException catch (e) {
      throw ApiException(_mapError(e), statusCode: e.response?.statusCode);
    }
  }
}
