import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:provider/provider.dart';
import 'package:aquatrade_app/screens/global_ai_trading/create_listing_screen.dart';
import 'package:aquatrade_app/providers/listing_provider.dart';
import 'package:aquatrade_app/data/models/listing_model.dart';

class MockListingProvider extends Mock implements ListingProvider {
  @override
  Future<void> createListing(ListingModel? listing) {
    return super.noSuchMethod(
      Invocation.method(#createListing, [listing]),
      returnValue: Future<void>.value(),
      returnValueForMissingStub: Future<void>.value(),
    );
  }
}

void main() {
  late MockListingProvider mockProvider;

  setUp(() {
    mockProvider = MockListingProvider();
  });

  Widget createWidgetUnderTest() {
    return MaterialApp(
      home: ChangeNotifierProvider<ListingProvider>.value(
        value: mockProvider,
        child: const CreateListingScreen(),
      ),
    );
  }

  testWidgets('CreateListingScreen validation and submission test', (WidgetTester tester) async {
    await tester.pumpWidget(createWidgetUnderTest());

    // Enter valid data
    await tester.enterText(find.byType(TextFormField).at(0), 'Cá Tra'); // Title
    await tester.enterText(find.byType(TextFormField).at(1), 'Tra'); // Species
    await tester.enterText(find.byType(TextFormField).at(2), '50000'); // Price
    await tester.enterText(find.byType(TextFormField).at(3), '100'); // Quantity
    
    await tester.pumpAndSettle();

    // Tap the publish button
    final publishButton = find.text('Publish to Marketplace');
    expect(publishButton, findsOneWidget);
    
    await tester.ensureVisible(publishButton);
    await tester.tap(publishButton);
    
    // Wait for the async operation and the SnackBar to appear
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    // Verify createListing was called exactly once
    verify(mockProvider.createListing(any)).called(1);
    
    // Verify success snackbar appears
    expect(find.text('Đăng bán thành công!'), findsOneWidget);
  });
}
