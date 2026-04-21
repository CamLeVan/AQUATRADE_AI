enum ListingCategory { CA, TOM, CUA, KHAC }

enum ListingStatus { PENDING_REVIEW, AVAILABLE, SOLD, HIDDEN, REJECTED }

class ListingModel {
  final String id;
  final String title;
  final ListingCategory category;
  final String species;
  final String province;
  final double sizeMin;
  final double sizeMax;
  final double pricePerFish;
  final int estimatedQuantity;
  final int availableQuantity;
  final String thumbnailUrl;
  final ListingStatus status;
  final String sellerName;
  final bool aiVerified;
  final int aiHealthScore;
  final String qualityLabel;
  final bool isFavorite;
  final DateTime createdAt;

  ListingModel({
    required this.id,
    required this.title,
    required this.category,
    required this.species,
    required this.province,
    required this.sizeMin,
    required this.sizeMax,
    required this.pricePerFish,
    required this.estimatedQuantity,
    required this.availableQuantity,
    required this.thumbnailUrl,
    required this.status,
    required this.sellerName,
    required this.aiVerified,
    required this.aiHealthScore,
    required this.qualityLabel,
    required this.isFavorite,
    required this.createdAt,
  });

  factory ListingModel.fromJson(Map<String, dynamic> json) {
    return ListingModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      category: ListingCategory.values.firstWhere(
        (e) => e.toString().split('.').last == json['category'],
        orElse: () => ListingCategory.KHAC,
      ),
      species: json['species'] ?? '',
      province: json['province'] ?? '',
      sizeMin: (json['sizeMin'] as num?)?.toDouble() ?? 0.0,
      sizeMax: (json['sizeMax'] as num?)?.toDouble() ?? 0.0,
      pricePerFish: (json['pricePerFish'] as num?)?.toDouble() ?? 0.0,
      estimatedQuantity: json['estimatedQuantity'] ?? 0,
      availableQuantity: json['availableQuantity'] ?? 0,
      thumbnailUrl: json['thumbnailUrl'] ?? '',
      status: ListingStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => ListingStatus.PENDING_REVIEW,
      ),
      sellerName: json['sellerName'] ?? '',
      aiVerified: json['aiVerified'] ?? false,
      aiHealthScore: json['aiHealthScore'] ?? 0,
      qualityLabel: json['qualityLabel'] ?? '',
      isFavorite: json['isFavorite'] ?? false,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category.toString().split('.').last,
      'species': species,
      'province': province,
      'sizeMin': sizeMin,
      'sizeMax': sizeMax,
      'pricePerFish': pricePerFish,
      'estimatedQuantity': estimatedQuantity,
      'availableQuantity': availableQuantity,
      'thumbnailUrl': thumbnailUrl,
      'status': status.toString().split('.').last,
      'sellerName': sellerName,
      'aiVerified': aiVerified,
      'aiHealthScore': aiHealthScore,
      'qualityLabel': qualityLabel,
      'isFavorite': isFavorite,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
