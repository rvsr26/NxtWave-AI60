import type { Request, Response, NextFunction } from 'express';
import { DecisionLogModel } from '../models/DecisionLog.js';
import type { IDecisionLog } from '../types/index.js';

export async function getDecisions(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const decisions = await DecisionLogModel.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      count: decisions.length,
      decisions,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDecision(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { observation, decision, reason, frameworkAction, impact, status } = req.body;

    if (!observation || !decision || !reason || !frameworkAction) {
      res.status(400).json({
        success: false,
        message: 'Observation, decision, reason, and frameworkAction are required.',
      });
      return;
    }

    const newLog: IDecisionLog = {
      id: `dl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      observation: observation.trim(),
      decision: decision.trim(),
      reason: reason.trim(),
      frameworkAction,
      status: status || 'implemented',
      createdAt: new Date().toISOString(),
      impact: impact || undefined,
      isSimulated: false,
    };

    const created = await DecisionLogModel.create(newLog);
    res.status(201).json({ success: true, decision: created });
  } catch (error) {
    next(error);
  }
}
