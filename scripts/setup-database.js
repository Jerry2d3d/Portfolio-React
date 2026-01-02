/**
 * Database Setup Script
 *
 * Initializes MongoDB database with required indexes and collections
 * Run this once after setting up MongoDB Atlas
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envFile = fs.readFileSync(envPath, 'utf8');
  const lines = envFile.split('\n');

  for (const line of lines) {
    if (line.startsWith('MONGODB_URI=')) {
      return line.substring('MONGODB_URI='.length).trim();
    }
  }
  throw new Error('MONGODB_URI not found in .env.local');
}

async function setupDatabase() {
  const uri = loadEnv();
  const client = new MongoClient(uri);

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const db = client.db('qr-code-app');

    // Setup Users Collection
    console.log('📋 Setting up Users collection...');
    const usersCollection = db.collection('users');

    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created unique index on email field');

    // Create index on createdAt for sorting
    await usersCollection.createIndex({ createdAt: 1 });
    console.log('✅ Created index on createdAt field');

    // Setup QR Codes Collection
    console.log('\n📋 Setting up QR Codes collection...');
    const qrCodesCollection = db.collection('qrcodes');

    // Create index on userId for lookups
    await qrCodesCollection.createIndex({ userId: 1 }, { unique: true });
    console.log('✅ Created unique index on userId field');

    // Create index on isPremium for filtering premium QR codes
    await qrCodesCollection.createIndex({ isPremium: 1 });
    console.log('✅ Created index on isPremium field');

    console.log('\n🎉 Database setup complete!');
    console.log('\n📊 Database Status:');
    console.log('   Database: qr-code-app');
    console.log('   Collections ready: users, qrcodes');
    console.log('   User indexes: email (unique), createdAt');
    console.log('   QR Code indexes: userId (unique), isPremium');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

// Run setup
setupDatabase();
