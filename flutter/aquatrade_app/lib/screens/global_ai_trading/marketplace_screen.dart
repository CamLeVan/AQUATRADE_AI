import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/listing_provider.dart';
import '../../data/models/listing_model.dart';
import 'package:intl/intl.dart';
import 'create_order_screen.dart';
import 'asset_detail_screen.dart';
import 'market_trends_screen.dart';
import 'content_hub_screen.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch listings when screen starts
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ListingProvider>().fetchListings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AquaTrade Marketplace'),
        actions: [
          IconButton(
            icon: const Icon(Icons.trending_up),
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MarketTrendsScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.article_outlined),
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ContentHubScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<ListingProvider>().fetchListings(),
          ),
        ],
      ),
      body: Consumer<ListingProvider>(
        builder: (context, provider, child) {
          if (provider.state == ListingState.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.state == ListingState.error) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(provider.errorMessage),
                  ElevatedButton(
                    onPressed: () => provider.fetchListings(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (provider.listings.isEmpty) {
            return const Center(child: Text('No listings available.'));
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchListings(),
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: provider.listings.length,
              itemBuilder: (context, index) {
                final listing = provider.listings[index];
                return _ListingCard(listing: listing);
              },
            ),
          );
        },
      ),
    );
  }
}

class _ListingCard extends StatelessWidget {
  final ListingModel listing;

  const _ListingCard({required this.listing});

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: '₫');

    return Card(
      elevation: 4,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: listing.thumbnailUrl.startsWith('http')
                ? Image.network(
                    listing.thumbnailUrl,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => _buildPlaceholder(),
                  )
                : _buildPlaceholder(),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        listing.category.toString().split('.').last,
                        style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold),
                      ),
                    ),
                    if (listing.aiVerified)
                      const Row(
                        children: [
                          Icon(Icons.verified, color: Colors.green, size: 18),
                          SizedBox(width: 4),
                          Text('AI Verified', style: TextStyle(color: Colors.green, fontSize: 12)),
                        ],
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  listing.title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '${listing.species} • ${listing.province}',
                  style: TextStyle(color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      currencyFormat.format(listing.pricePerFish),
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                    ),
                    Text(
                      'Stock: ${listing.availableQuantity} con',
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                const Divider(height: 24),
                Row(
                  children: [
                    const Icon(Icons.store, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(listing.sellerName, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    const Spacer(),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => AssetDetailScreen(listing: listing),
                          ),
                        );
                      },
                      child: const Text('Xem chi tiết'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      height: 180,
      color: Colors.grey[300],
      child: const Center(child: Icon(Icons.image, size: 48, color: Colors.grey)),
    );
  }
}
