import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class LocalService {
  static Database? _database;

  Future<Database?> get database async {
    if (kIsWeb) return null; // SQLite is not supported on Web out-of-the-box
    if (_database != null) return _database!;
    _database = await _initDB('aquatrade.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    // 1. Listings Table
    await db.execute('''
      CREATE TABLE listings (
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        species TEXT,
        province TEXT,
        pricePerFish REAL,
        availableQuantity INTEGER,
        thumbnailUrl TEXT,
        status TEXT,
        sellerName TEXT,
        aiVerified INTEGER,
        qualityLabel TEXT,
        isFavorite INTEGER,
        createdAt TEXT
      )
    ''');

    // 2. Orders Table
    await db.execute('''
      CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        listingTitle TEXT,
        buyerName TEXT,
        sellerName TEXT,
        unitPriceAtPurchase REAL,
        finalQuantity INTEGER,
        totalPrice REAL,
        shippingAddress TEXT,
        status TEXT,
        createdAt TEXT
      )
    ''');

    // 3. Posts Table
    await db.execute('''
      CREATE TABLE posts (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        category TEXT,
        status TEXT,
        featuredImageUrl TEXT,
        author TEXT,
        viewCount INTEGER
      )
    ''');
  }

  // --- Listings ---
  Future<void> saveListings(List<Map<String, dynamic>> maps) async {
    final db = await database;
    if (db == null) return;
    
    final batch = db.batch();
    for (var map in maps) {
      batch.insert(
        'listings', 
        {
          ...map,
          'aiVerified': map['aiVerified'] == true ? 1 : 0,
          'isFavorite': map['isFavorite'] == true ? 1 : 0,
        }, 
        conflictAlgorithm: ConflictAlgorithm.replace
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<Map<String, dynamic>>> getCachedListings() async {
    final db = await database;
    if (db == null) return [];
    
    final result = await db.query('listings', orderBy: 'createdAt DESC');
    return result.map((row) {
      final map = Map<String, dynamic>.from(row);
      map['aiVerified'] = map['aiVerified'] == 1;
      map['isFavorite'] = map['isFavorite'] == 1;
      return map;
    }).toList();
  }

  // --- Orders ---
  Future<void> saveOrders(List<Map<String, dynamic>> maps) async {
    final db = await database;
    if (db == null) return;
    
    final batch = db.batch();
    for (var map in maps) {
      batch.insert('orders', map, conflictAlgorithm: ConflictAlgorithm.replace);
    }
    await batch.commit(noResult: true);
  }

  Future<List<Map<String, dynamic>>> getCachedOrders() async {
    final db = await database;
    if (db == null) return [];
    
    return await db.query('orders', orderBy: 'createdAt DESC');
  }

  // --- Posts ---
  Future<void> savePosts(List<Map<String, dynamic>> maps) async {
    final db = await database;
    if (db == null) return;
    
    final batch = db.batch();
    for (var map in maps) {
      batch.insert('posts', map, conflictAlgorithm: ConflictAlgorithm.replace);
    }
    await batch.commit(noResult: true);
  }

  Future<List<Map<String, dynamic>>> getCachedPosts() async {
    final db = await database;
    if (db == null) return [];
    
    return await db.query('posts');
  }

  Future<void> close() async {
    final db = _database;
    if (db != null) {
      await db.close();
    }
  }
}
