import mongoose from 'mongoose';
import { env } from '../config/env.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  if (!env.MONGO_URI) {
    console.error('[Database] Connection failed: MONGO_URI is missing');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error('[Database] MongoDB connection error:', (error as Error).message);
    throw error;
  }
}

export function getDatabaseStatus(): 'connected' | 'connecting' | 'disconnecting' | 'disconnected' {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
