import mongoose from "mongoose";
import { User } from "../models/User";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached = global.mongooseConnection ?? { conn: null, promise: null };
let userIndexCleanupPromise: Promise<void> | null = null;

if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not configured");
    }

    cached.promise = mongoose.connect(uri, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  if (!userIndexCleanupPromise) {
    userIndexCleanupPromise = cleanupLegacyUserIndexes().catch((error) => {
      console.warn("Unable to clean up legacy user indexes", error);
    });
  }

  await userIndexCleanupPromise;
  return cached.conn;
}

async function cleanupLegacyUserIndexes() {
  try {
    const indexes = await User.collection.indexes();
    const legacyEmailIndex = indexes.find((index) => index.name === "email_1");

    if (legacyEmailIndex) {
      await User.collection.dropIndex("email_1");
    }
  } catch (error: any) {
    if (error?.codeName === "IndexNotFound" || error?.code === 27) {
      return;
    }

    throw error;
  }
}
