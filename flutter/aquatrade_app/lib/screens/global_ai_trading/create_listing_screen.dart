import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/listing_provider.dart';
import '../../data/models/listing_model.dart';
import 'screen_scaffold.dart';

class CreateListingScreen extends StatefulWidget {
  const CreateListingScreen({super.key});

  @override
  State<CreateListingScreen> createState() => _CreateListingScreenState();
}

class _CreateListingScreenState extends State<CreateListingScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _titleController = TextEditingController();
  final _speciesController = TextEditingController();
  final _priceController = TextEditingController();
  final _quantityController = TextEditingController();
  
  String _selectedCategory = 'THỦY SẢN';
  String _selectedProvince = 'Cà Mau';
  
  final List<String> _categories = ['THỦY SẢN', 'HẢI SẢN', 'CÁ GIỐNG', 'THỨC ĂN'];
  final List<String> _provinces = ['Cà Mau', 'Bạc Liêu', 'Kiên Giang', 'Tiền Giang', 'Khánh Hòa', 'Quảng Ninh'];

  bool _isAIVerifying = false;

  @override
  void dispose() {
    _titleController.dispose();
    _speciesController.dispose();
    _priceController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return ScreenScaffold(
      title: 'Post New Listing',
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Product Information', style: theme.textTheme.titleMedium),
            const SizedBox(height: 16),
            
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Listing Title',
                hintText: 'e.g. Cá Tra xuất khẩu chất lượng cao',
                border: OutlineInputBorder(),
              ),
              validator: (v) => (v ?? '').isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                    items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                    onChanged: (v) => setState(() => _selectedCategory = v!),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _speciesController,
                    decoration: const InputDecoration(labelText: 'Species', border: OutlineInputBorder()),
                    validator: (v) => (v ?? '').isEmpty ? 'Required' : null,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            DropdownButtonFormField<String>(
              value: _selectedProvince,
              decoration: const InputDecoration(labelText: 'Origin Province', border: OutlineInputBorder()),
              items: _provinces.map((p) => DropdownMenuItem(value: p, child: Text(p))).toList(),
              onChanged: (v) => setState(() => _selectedProvince = v!),
            ),
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Price per Unit (₫)',
                      border: OutlineInputBorder(),
                    ),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Vui lòng nhập giá';
                      final price = double.tryParse(v);
                      if (price == null || price <= 0) return 'Giá phải lớn hơn 0';
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Total Quantity',
                      border: OutlineInputBorder(),
                    ),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Vui lòng nhập số lượng';
                      final qty = int.tryParse(v);
                      if (qty == null || qty <= 0) return 'Số lượng phải lớn hơn 0';
                      return null;
                    },
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            Text('Professional AI Verification', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            Card(
              color: theme.colorScheme.primaryContainer.withAlpha(50),
              child: ListTile(
                leading: Icon(Icons.psychology, color: theme.colorScheme.primary),
                title: const Text('AI Health & Quality Score'),
                subtitle: const Text('Our AI will analyze your product images to guarantee quality to buyers.'),
                trailing: _isAIVerifying 
                  ? const CircularProgressIndicator()
                  : TextButton(
                      onPressed: () {
                        setState(() => _isAIVerifying = true);
                        Future.delayed(const Duration(seconds: 2), () {
                          if (mounted) setState(() => _isAIVerifying = false);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('AI Analysis: Grade A+ (Premium)')),
                          );
                        });
                      }, 
                      child: const Text('Verify Now')
                    ),
              ),
            ),
            
            const SizedBox(height: 32),
            FilledButton.icon(
              onPressed: _submit,
              icon: const Icon(Icons.cloud_upload_outlined),
              label: const Text('Publish to Marketplace'),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    
    final provider = context.read<ListingProvider>();
    
    try {
      final listing = ListingModel(
        id: '', // Will be generated by backend
        title: _titleController.text,
        category: ListingCategory.values.firstWhere(
            (e) => e.toString().contains(_selectedCategory), 
            orElse: () => ListingCategory.KHAC),
        species: _speciesController.text,
        province: _selectedProvince,
        sizeMin: 1.0, 
        sizeMax: 5.0,
        pricePerFish: double.tryParse(_priceController.text) ?? 0.0,
        estimatedQuantity: int.tryParse(_quantityController.text) ?? 0,
        availableQuantity: int.tryParse(_quantityController.text) ?? 0,
        thumbnailUrl: 'https://via.placeholder.com/150',
        status: ListingStatus.PENDING_REVIEW,
        sellerName: 'Unknown', // In real app, get from AuthProvider
        aiVerified: true,
        aiHealthScore: 95,
        qualityLabel: 'A+',
        isFavorite: false,
        createdAt: DateTime.now(),
      );

      await provider.createListing(listing);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đăng bán thành công!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Đăng bán thất bại: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}
