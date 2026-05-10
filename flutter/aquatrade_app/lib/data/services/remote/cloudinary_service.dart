import 'dart:io';
import 'package:dio/dio.dart';

class CloudinaryService {
  static const String cloudName = 'dq5xsww9i';
  static const String apiKey = '391669862131265';
  
  // Bạn có thể thiết lập base url API để lấy signature từ backend của bạn
  // Ví dụ: https://us-central1-your-project.cloudfunctions.net/getSignature
  static const String signatureApiUrl = 'URL_CUA_BACKEND_LAY_CHU_KY'; 

  final Dio _dio = Dio();

  /// Hàm gọi backend để xin chữ ký (Signature)
  Future<Map<String, dynamic>?> _getSignature(String presetName) async {
    try {
      final response = await _dio.post(
        signatureApiUrl,
        data: {'presetName': presetName},
      );
      
      if (response.statusCode == 200) {
        return {
          'signature': response.data['signature'],
          'timestamp': response.data['timestamp'],
        };
      }
    } catch (e) {
      print('Lỗi xin chữ ký từ Backend: $e');
    }
    return null;
  }

  /// Hàm Tải Ảnh/Video lên Cloudinary sử dụng luồng Signed
  Future<String?> uploadMediaSigned(File file, String presetName) async {
    try {
      // 1. Xin chữ ký từ backend
      final authData = await _getSignature(presetName);
      if (authData == null) {
        print('Không thể lấy chữ ký, hủy upload.');
        return null;
      }

      final String signature = authData['signature'];
      final int timestamp = authData['timestamp'];
      
      // 2. Định dạng resource_type (ảnh hay video)
      final String resourceType = presetName.contains('video') ? 'video' : 'image';
      final String uploadUrl = 'https://api.cloudinary.com/v1_1/$cloudName/$resourceType/upload';

      // 3. Chuẩn bị FormData
      FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(file.path),
        'api_key': apiKey,
        'timestamp': timestamp.toString(),
        'signature': signature,
        'upload_preset': presetName, // Bắt buộc gửi lên theo chữ ký
      });

      // 4. Bắn lên Cloudinary
      Response response = await _dio.post(uploadUrl, data: formData);

      if (response.statusCode == 200) {
        return response.data['secure_url']; // Thành công, trả về URL
      }
    } catch (e) {
      if (e is DioException) {
        print("Lỗi Cloudinary: ${e.response?.data}");
      } else {
        print("Lỗi hệ thống: $e");
      }
    }
    return null;
  }
}
