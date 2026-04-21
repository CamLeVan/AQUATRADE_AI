enum OrderStatus { 
  PENDING, 
  ESCROW_LOCKED, 
  IN_VIDEO_CALL, 
  COUNTING_AI, 
  COMPLETED, 
  DISPUTED, 
  CANCELLED 
}

class DigitalProofSummary {
  final String id;
  final int aiFishCount;
  final double confidenceScore;
  final String aiImageUrl;
  final String proofHash;
  final DateTime createdAt;

  DigitalProofSummary({
    required this.id,
    required this.aiFishCount,
    required this.confidenceScore,
    required this.aiImageUrl,
    required this.proofHash,
    required this.createdAt,
  });

  factory DigitalProofSummary.fromJson(Map<String, dynamic> json) {
    return DigitalProofSummary(
      id: json['id'] ?? '',
      aiFishCount: json['aiFishCount'] ?? 0,
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble() ?? 0.0,
      aiImageUrl: json['aiImageUrl'] ?? '',
      proofHash: json['proofHash'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}

class OrderModel {
  final String id;
  final String listingTitle;
  final String buyerName;
  final String sellerName;
  final double unitPriceAtPurchase;
  final int finalQuantity;
  final double totalPrice;
  final String shippingAddress;
  final OrderStatus status;
  final DateTime createdAt;
  final DigitalProofSummary? digitalProof;

  OrderModel({
    required this.id,
    required this.listingTitle,
    required this.buyerName,
    required this.sellerName,
    required this.unitPriceAtPurchase,
    required this.finalQuantity,
    required this.totalPrice,
    required this.shippingAddress,
    required this.status,
    required this.createdAt,
    this.digitalProof,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] ?? '',
      listingTitle: json['listingTitle'] ?? '',
      buyerName: json['buyerName'] ?? '',
      sellerName: json['sellerName'] ?? '',
      unitPriceAtPurchase: (json['unitPriceAtPurchase'] as num?)?.toDouble() ?? 0.0,
      finalQuantity: json['finalQuantity'] ?? 0,
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
      shippingAddress: json['shippingAddress'] ?? '',
      status: OrderStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => OrderStatus.PENDING,
      ),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      digitalProof: json['digitalProof'] != null ? DigitalProofSummary.fromJson(json['digitalProof']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'listingTitle': listingTitle,
      'buyerName': buyerName,
      'sellerName': sellerName,
      'unitPriceAtPurchase': unitPriceAtPurchase,
      'finalQuantity': finalQuantity,
      'totalPrice': totalPrice,
      'shippingAddress': shippingAddress,
      'status': status.name,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

extension DigitalProofToJson on DigitalProofSummary {
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'aiFishCount': aiFishCount,
      'confidenceScore': confidenceScore,
      'aiImageUrl': aiImageUrl,
      'proofHash': proofHash,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
