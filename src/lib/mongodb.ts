/**
 * MongoDB Connection Configuration
 *
 * This file will be used in Stage 2 to connect to MongoDB Atlas.
 * For Stage 1, this is just a placeholder with the connection logic ready.
 */

import { MongoClient, MongoClientOptions } from 'mongodb';
import { logger } from '@/lib/logger';

const uri = process.env.MONGODB_URI || "";
// Optimized connection options for serverless/Next.js
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maintain limit on connections
  serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
  socketTimeoutMS: 45000, // Close idle sockets
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable to preserve the MongoDB connection
// across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // Prevents build crash, fails fast when actually used
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not defined in environment variables")
  );
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the MongoClient
    // is not constantly recreated across hot reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, create a new MongoClient
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export the clientPromise for use in API routes
export default clientPromise;

/**
 * Helper function to get the database instance
 * Usage in API routes:
 *
 * import { getDatabase } from '@/lib/mongodb';
 * const db = await getDatabase();
 * const users = db.collection('users');
 */
export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  try {
    const client = await clientPromise;
    // Empty .db() uses database from URI - allows env-based switching
    return client.db();
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw new Error(`Failed to connect to database: ${(error as Error).message}`);
  }
}

/**
 * NOTE: MongoDB connection will be established in Stage 2
 * For now, this file serves as the configuration template.
 *
 * To use in Stage 2:
 * 1. Install mongodb package: npm install mongodb
 * 2. Update .env.local with your MongoDB Atlas connection string
 * 3. Import and use in API routes
 */
