import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mimirs-well';

// Helper to mask password in connection string for logging
function maskConnectionString(uri: string): string {
  try {
    const url = new URL(uri);
    if (url.password) {
      url.password = '***';
    }
    return url.toString();
  } catch {
    // If URL parsing fails, try regex approach
    return uri.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1***$3');
  }
}

// Log MongoDB configuration on module load
const maskedUri = maskConnectionString(MONGODB_URI);
console.log('[MongoDB] Module loaded');
console.log('[MongoDB] Connection URI:', maskedUri);
console.log('[MongoDB] MONGODB_URI env var set:', !!process.env.MONGODB_URI);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const maskedUri = maskConnectionString(MONGODB_URI);
  
  console.log('[MongoDB] Connection attempt initiated');
  console.log('[MongoDB] Connection URI:', maskedUri);
  console.log('[MongoDB] Environment:', process.env.NODE_ENV || 'development');
  console.log('[MongoDB] Current connection state:', mongoose.connection.readyState);
  console.log('[MongoDB] Cached connection exists:', !!cached.conn);

  // Connection state codes: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  console.log('[MongoDB] Connection state:', stateMap[mongoose.connection.readyState] || 'unknown');

  if (cached.conn) {
    console.log('[MongoDB] Using existing cached connection');
    console.log('[MongoDB] Connection ready state:', stateMap[mongoose.connection.readyState] || 'unknown');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('[MongoDB] Creating new connection promise...');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('[MongoDB] ✅ Connection established successfully!');
        console.log('[MongoDB] Database name:', mongoose.connection.name);
        console.log('[MongoDB] Host:', mongoose.connection.host);
        console.log('[MongoDB] Port:', mongoose.connection.port);
        console.log('[MongoDB] Ready state:', stateMap[mongoose.connection.readyState] || 'unknown');
        return mongoose;
      })
      .catch((error) => {
        console.error('[MongoDB] ❌ Connection failed!');
        console.error('[MongoDB] Error details:', error.message);
        console.error('[MongoDB] Connection URI used:', maskedUri);
        throw error;
      });
  } else {
    console.log('[MongoDB] Waiting for existing connection promise...');
  }

  try {
    cached.conn = await cached.promise;
    console.log('[MongoDB] ✅ Connection promise resolved successfully');
    console.log('[MongoDB] Final ready state:', stateMap[mongoose.connection.readyState] || 'unknown');
  } catch (e) {
    console.error('[MongoDB] ❌ Connection promise rejected');
    console.error('[MongoDB] Error:', e instanceof Error ? e.message : String(e));
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
