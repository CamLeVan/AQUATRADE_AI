// // This is a basic Flutter widget test.
// //
// // To perform an interaction with a widget in your test, use the WidgetTester
// // utility in the flutter_test package. For example, you can send tap and scroll
// // gestures. You can also use WidgetTester to find child widgets in the widget
// // tree, read text, and verify that the values of widget properties are correct.
//
// import 'package:flutter_test/flutter_test.dart';
// import 'package:provider/provider.dart';
//
// import 'package:aquatrade_app/main.dart';
// import 'package:aquatrade_app/data/repositories/auth_repository.dart';
// import 'package:aquatrade_app/data/repositories/listing_repository.dart';
// import 'package:aquatrade_app/data/repositories/order_repository.dart';
// import 'package:aquatrade_app/data/repositories/post_repository.dart';
// import 'package:aquatrade_app/data/repositories/wallet_repository.dart';
// import 'package:aquatrade_app/data/services/remote/api_service.dart';
// import 'package:aquatrade_app/providers/auth_provider.dart';
// import 'package:aquatrade_app/providers/listing_provider.dart';
// import 'package:aquatrade_app/providers/order_provider.dart';
// import 'package:aquatrade_app/providers/post_provider.dart';
// import 'package:aquatrade_app/providers/wallet_provider.dart';
//
// void main() {
//   testWidgets('App launches to marketplace', (WidgetTester tester) async {
//     final apiService = ApiService();
//     await tester.pumpWidget(
//       MultiProvider(
//         providers: [
//           ChangeNotifierProvider(create: (_) => AuthProvider(AuthRepository(apiService))),
//           ChangeNotifierProvider(create: (_) => ListingProvider(ListingRepository(apiService))),
//           ChangeNotifierProvider(create: (_) => OrderProvider(OrderRepository(apiService))),
//           ChangeNotifierProvider(create: (_) => WalletProvider(WalletRepository(apiService))),
//           ChangeNotifierProvider(create: (_) => PostProvider(PostRepository(apiService))),
//         ],
//         child: const AquaTradeApp(),
//       ),
//     );
//     await tester.pump(const Duration(milliseconds: 500));
//
//     expect(find.text('AquaTrade Marketplace'), findsOneWidget);
//   });
// }
