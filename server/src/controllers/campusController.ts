import type { Request, Response, NextFunction } from 'express';
import { CampusModel } from '../models/Campus.js';
import type { ICampus } from '../types/index.js';

export async function getCampuses(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const campuses = await CampusModel.find().sort({ registrations: -1 }).lean();
    res.status(200).json({
      success: true,
      count: campuses.length,
      campuses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCampusByCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const code = req.params.code as string;
    const cleanCode = code.trim().toUpperCase();
    const campus = await CampusModel.findOne({
      $or: [{ code: cleanCode }, { code: `${cleanCode}60` }],
    }).lean();
    if (!campus) {
      res.status(404).json({ success: false, message: 'Campus not found' });
      return;
    }
    res.status(200).json({ success: true, campus });
  } catch (error) {
    next(error);
  }
}

export async function createCampus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      res.status(400).json({ success: false, message: 'Campus name and code are required.' });
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await CampusModel.findOne({ code: cleanCode });
    if (existing) {
      res.status(409).json({ success: false, message: 'A campus with this code already exists.' });
      return;
    }

    const newCampus: ICampus = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      code: cleanCode,
      registrations: 0,
      yesterdayRegistrations: 0,
      captains: 0,
      isSimulated: false,
    };

    const created = await CampusModel.create(newCampus);
    res.status(201).json({ success: true, campus: created });
  } catch (error) {
    next(error);
  }
}

export async function getCampusLeaderboard(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const campuses = await CampusModel.find().sort({ registrations: -1 }).lean();
    res.status(200).json({
      success: true,
      leaderboard: campuses,
    });
  } catch (error) {
    next(error);
  }
}
