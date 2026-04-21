import '../models/order_model.dart';
import '../models/dispute_model.dart';
import '../services/remote/api_service.dart';
import '../services/local/local_service.dart';

class OrderRepository {
  final ApiService _api;
  final LocalService _local;

  OrderRepository(this._api, this._local);

  Future<List<OrderModel>> getMyOrders({bool forceRefresh = false}) async {
    if (!forceRefresh) {
      final cached = await _local.getCachedOrders();
      if (cached.isNotEmpty) {
        return cached.map(OrderModel.fromJson).toList();
      }
    }

    final response = await _api.get('/orders/my');
    final data = _api.parseData<List<dynamic>>(response);
    final orders = data
        .whereType<Map<String, dynamic>>()
        .map(OrderModel.fromJson)
        .toList();

    await _local.saveOrders(orders.map((o) => o.toJson()).toList());
    return orders;
  }

  Future<OrderModel> getOrderDetail(String id) async {
    final response = await _api.get('/orders/$id');
    final data = _api.parseData<Map<String, dynamic>>(response);
    return OrderModel.fromJson(data);
  }

  Future<OrderModel> createOrder(String listingId, String address, int quantity) async {
    final response = await _api.post('/orders', data: {
      'listingId': listingId,
      'shippingAddress': address,
      'quantity': quantity,
    });
    final data = _api.parseData<Map<String, dynamic>>(response);
    return OrderModel.fromJson(data);
  }

  Future<void> completeOrder(String id) async {
    final response = await _api.post('/orders/$id/complete');
    _api.parseData<dynamic>(response);
  }

  Future<void> submitReview({
    required String orderId,
    required int rating,
    String? comment,
  }) async {
    final response = await _api.post('/orders/$orderId/reviews', data: {
      'rating': rating,
      'comment': comment,
    });
    _api.parseData<dynamic>(response);
  }

  Future<DisputeModel> createDispute({
    required String orderId,
    required String reason,
  }) async {
    final response = await _api.post('/orders/$orderId/disputes', data: {
      'reason': reason,
    });
    final data = _api.parseData<Map<String, dynamic>>(response);
    return DisputeModel.fromJson(data);
  }
}
