import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './db/mongodb.js';
import { seedDatabase } from './scripts/seed.js';
import { CampusModel } from './models/Campus.js';

async function bootstrap() {
  console.log('[Server] Initializing AI60 Growth OS Backend...');

  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Check if baseline data exists, auto-seed if clean database
    const campusCount = await CampusModel.countDocuments();
    if (campusCount === 0) {
      console.log('[Server] Database is empty, seeding baseline simulation data...');
      await seedDatabase();
    }

    // 3. Start Express server
    const app = createApp();
    const server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`[Server] AI60 Growth OS Backend running on http://0.0.0.0:${env.PORT}`);
      console.log(`[Server] Health check available at http://0.0.0.0:${env.PORT}/api/health`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Closed remaining connections.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server Error] Bootstrapping failed:', (error as Error).message);
    process.exit(1);
  }
}

bootstrap();
