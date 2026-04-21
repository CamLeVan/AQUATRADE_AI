import '../models/listing_model.dart';
import '../services/remote/api_service.dart';
import '../services/local/local_service.dart';

class ListingRepository {
  final ApiService _apiService;
  final LocalService _localService;

  ListingRepository(this._apiService, this._localService);

  Future<List<ListingModel>> getListings({
    String? province,
    String? species,
    bool forceRefresh = false,
  }) async {
    // 1. Try to get from local if not forcing refresh
    if (!forceRefresh) {
      final cachedJson = await _localService.getCachedListings();
      if (cachedJson.isNotEmpty) {
        // Return cached data immediately (UI will be fast)
        // Note: In a real app, you might still want to trigger a background fetch
        return cachedJson.map((json) => ListingModel.fromJson(json)).toList();
      }
    }

    // 2. Fetch from Remote
    final response = await _apiService.get(
      '/listings',
      queryParameters: {
        if (province != null && province.isNotEmpty) 'province': province,
        if (species != null && species.isNotEmpty) 'species': species,
      },
    );
    final List<dynamic> data = _apiService.parseData<List<dynamic>>(response);
    final listings = data.map((json) => ListingModel.fromJson(json)).toList();

    // 3. Save to Local for next time
    await _localService.saveListings(listings.map((e) => e.toJson()).toList());

    return listings;
  }

  Future<ListingModel> getListingDetail(String id) async {
    final response = await _apiService.get('/listings/$id');
    final data = _apiService.parseData<Map<String, dynamic>>(response);
    return ListingModel.fromJson(data);
  }

  Future<ListingModel> createListing(ListingModel listing) async {
    try {
      final response = await _apiService.post('/listings', data: listing.toJson());
      if (response.data['status'] == 'success') {
        return ListingModel.fromJson(response.data['data']);
      } else {
        throw Exception(response.data['message'] ?? 'Failed to create listing');
      }
    } catch (e) {
      rethrow;
    }
  }
}
