import 'package:flutter/material.dart';
import '../data/models/dispute_model.dart';
import '../data/models/order_model.dart';
import '../data/repositories/order_repository.dart';

class OrderProvider with ChangeNotifier {
  final OrderRepository _repo;
  OrderProvider(this._repo);

  List<OrderModel> _orders = [];
  OrderModel? _currentOrder;
  DisputeModel? _latestDispute;
  bool _isLoading = false;
  String _error = '';

  List<OrderModel> get orders => _orders;
  OrderModel? get currentOrder => _currentOrder;
  DisputeModel? get latestDispute => _latestDispute;
  bool get isLoading => _isLoading;
  String get error => _error;

  Future<void> fetchOrderById(String orderId) async {
    _isLoading = true;
    _error = '';
    notifyListeners();
    try {
      _currentOrder = await _repo.getOrderDetail(orderId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMyOrders() async {
    _isLoading = true;
    _error = '';
    notifyListeners();
    try {
      _orders = await _repo.getMyOrders();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createOrder(String listingId, String address, int quantity) async {
    _isLoading = true;
    _error = '';
    notifyListeners();
    try {
      _currentOrder = await _repo.createOrder(listingId, address, quantity);
      _orders.insert(0, _currentOrder!);
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> confirmCompletion(String orderId) async {
    try {
      await _repo.completeOrder(orderId);
      _currentOrder = await _repo.getOrderDetail(orderId);
    } catch (e) {
      _error = e.toString();
      rethrow;
    }
    notifyListeners();
  }

  Future<void> submitReview({
    required String orderId,
    required int rating,
    String? comment,
  }) async {
    try {
      await _repo.submitReview(
        orderId: orderId,
        rating: rating,
        comment: comment,
      );
    } catch (e) {
      _error = e.toString();
      rethrow;
    }
    notifyListeners();
  }

  Future<void> raiseDispute({
    required String orderId,
    required String reason,
  }) async {
    try {
      _latestDispute = await _repo.createDispute(
        orderId: orderId,
        reason: reason,
      );
    } catch (e) {
      _error = e.toString();
      rethrow;
    }
    notifyListeners();
  }
}
