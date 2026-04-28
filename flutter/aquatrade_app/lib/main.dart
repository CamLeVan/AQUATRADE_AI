import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Services & Repositories
import 'data/services/remote/api_service.dart';
import 'data/repositories/listing_repository.dart';
import 'data/repositories/auth_repository.dart';
import 'data/repositories/order_repository.dart';
import 'data/repositories/wallet_repository.dart';
import 'data/repositories/post_repository.dart';

// Providers
import 'providers/listing_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/order_provider.dart';
import 'providers/wallet_provider.dart';
import 'providers/post_provider.dart';
import 'providers/ai_provider.dart';
import 'providers/kyc_provider.dart';

import 'screens/root_screen.dart';

import 'data/services/local/local_service.dart';

import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() {
  if (!kIsWeb && (Platform.isWindows || Platform.isLinux)) {
    // Initialize FFI for Desktop
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }

  final apiService = ApiService();
  final localService = LocalService();

  final authRepository = AuthRepository(apiService);
  final listingRepository = ListingRepository(apiService, localService);
  final orderRepository = OrderRepository(apiService, localService);
  final walletRepository = WalletRepository(apiService);
  final postRepository = PostRepository(apiService, localService);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authRepository)..restoreSession(),
        ),
        ChangeNotifierProvider(create: (_) => ListingProvider(listingRepository)),
        ChangeNotifierProvider(create: (_) => OrderProvider(orderRepository)),
        ChangeNotifierProvider(create: (_) => WalletProvider(walletRepository)),
        ChangeNotifierProvider(create: (_) => PostProvider(postRepository)),
        ChangeNotifierProvider(create: (_) => AiProvider()),
        ChangeNotifierProvider(create: (_) => KycProvider()),
      ],
      child: const AquaTradeApp(),
    ),
  );
}

class AquaTradeApp extends StatelessWidget {
  const AquaTradeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AquaTrade AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
        ),
        useMaterial3: true,
        cardTheme: const CardThemeData(
          surfaceTintColor: Colors.white,
          elevation: 2,
        ),
      ),
      home: const RootScreen(), 
    );
  }
}

