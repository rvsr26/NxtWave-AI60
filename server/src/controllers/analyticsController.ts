import type { Request, Response, NextFunction } from 'express';
import { AnalyticsEventModel } from '../models/AnalyticsEvent.js';
import type { IAnalyticsEvent } from '../types/index.js';

export async function trackEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { event, properties, timestamp, sessionId, source, campus, referralCode } = req.body;

    if (!event) {
      res.status(400).json({ success: false, message: 'Event name is required.' });
      return;
    }

    const eventRecord: IAnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      event: event.trim(),
      properties: properties || {},
      timestamp: timestamp || new Date().toISOString(),
      sessionId: sessionId || 'anonymous_session',
      source: source || 'direct',
      campus,
      referralCode,
    };

    await AnalyticsEventModel.create(eventRecord);

    res.status(201).json({
      success: true,
      event: eventRecord,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || '200', 10), 1000);
    const eventType = req.query.event as string;

    const query = eventType ? { event: eventType } : {};
    const events = await AnalyticsEventModel.find(query).sort({ timestamp: -1 }).limit(limit).lean();

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
}
