import type { Request, Response } from 'express';
import { getDatabaseStatus, isDbConnected } from '../db/mongodb.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const dbStatus = getDatabaseStatus();
  const isHealthy = isDbConnected();

  const responsePayload = {
    success: isHealthy,
    service: 'AI60 Growth OS API',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  };

  if (isHealthy) {
    res.status(200).json(responsePayload);
  } else {
    res.status(503).json(responsePayload);
  }
}
