import type { Request, Response, NextFunction } from 'express';
import { ExperimentModel } from '../models/Experiment.js';

export async function getExperiments(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const experiments = await ExperimentModel.find().sort({ number: 1 }).lean();
    res.status(200).json({
      success: true,
      count: experiments.length,
      experiments,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExperiment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { action, status, decisionReason } = req.body;

    const updated = await ExperimentModel.findOneAndUpdate(
      { id },
      { $set: { action, status, decisionReason } },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Experiment not found.' });
      return;
    }

    res.status(200).json({ success: true, experiment: updated });
  } catch (error) {
    next(error);
  }
}
