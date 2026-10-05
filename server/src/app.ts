import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): express.Application {
  const app = express();

  // Basic security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Allow flexibility in dev/prototype
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  const allowedOrigins = [
    env.CLIENT_URL,
    'https://nxt-wave-ai-60.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (curl, mobile health checks, server-to-server)
        if (!origin) return callback(null, true);
        
        // Exact matches
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        // Development local origin support
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }

        // Vercel deployment preview domains
        if (origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked request from origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-referral-code'],
    })
  );

  // Request size parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // API Routes
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
