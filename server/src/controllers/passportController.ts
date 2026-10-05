import type { Request, Response, NextFunction } from 'express';
import { ProjectPassportModel } from '../models/ProjectPassport.js';
import { createAndSavePassport } from '../services/passportAiService.js';

export async function generatePassport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { branch, experience, interest, domain, goal } = req.body;

    if (!interest) {
      res.status(400).json({ success: false, message: 'Technology interest is required.' });
      return;
    }
    if (!experience) {
      res.status(400).json({ success: false, message: 'Skill level is required.' });
      return;
    }
    if (!goal || !goal.trim()) {
      res.status(400).json({ success: false, message: 'Project or career goal is required.' });
      return;
    }

    const passport = await createAndSavePassport({
      branch: branch || 'Computer Science',
      experience,
      interest,
      domain: domain || interest,
      goal: goal.trim(),
    });

    res.status(201).json({
      success: true,
      passport,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPassports(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const passports = await ProjectPassportModel.find().sort({ createdAt: -1 }).limit(100).lean();
    res.status(200).json({
      success: true,
      count: passports.length,
      passports,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPassportById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const passport = await ProjectPassportModel.findOne({ id }).lean();
    if (!passport) {
      res.status(404).json({ success: false, message: 'Passport not found' });
      return;
    }
    res.status(200).json({ success: true, passport });
  } catch (error) {
    next(error);
  }
}
