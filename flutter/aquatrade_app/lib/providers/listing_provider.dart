import 'package:flutter/material.dart';
import '../data/models/listing_model.dart';
import '../data/repositories/listing_repository.dart';

enum ListingState { initial, loading, success, error }

class ListingProvider with ChangeNotifier {
  final ListingRepository _repository;

  ListingProvider(this._repository);

  List<ListingModel> _listings = [];
  List<ListingModel> get listings => _listings;

  ListingState _state = ListingState.initial;
  ListingState get state => _state;

  String _errorMessage = '';
  String get errorMessage => _errorMessage;

  Future<void> fetchListings({String? province, String? species}) async {
    _state = ListingState.loading;
    _errorMessage = '';
    notifyListeners();

    try {
      _listings = await _repository.getListings(
        province: province,
        species: species,
      );
      _state = ListingState.success;
    } catch (e) {
      _state = ListingState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<ListingModel?> fetchListingDetail(String id) async {
    try {
      return await _repository.getListingDetail(id);
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return null;
    }
  }
}
