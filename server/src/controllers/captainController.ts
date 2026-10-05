import type { Request, Response, NextFunction } from 'express';
import { CampusCaptainModel } from '../models/CampusCaptain.js';
import { CampusModel } from '../models/Campus.js';
import type { ICampusCaptain } from '../types/index.js';

export async function getCaptains(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const captains = await CampusCaptainModel.find().sort({ registrations: -1 }).lean();
    res.status(200).json({
      success: true,
      count: captains.length,
      captains,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCaptainById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const captain = await CampusCaptainModel.findOne({ id }).lean();
    if (!captain) {
      res.status(404).json({ success: false, message: 'Campus Captain not found.' });
      return;
    }
    res.status(200).json({ success: true, captain });
  } catch (error) {
    next(error);
  }
}

export async function createCaptain(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, college, whatsapp, campusCode } = req.body;

    if (!name || !email || !college || !campusCode) {
      res.status(400).json({
        success: false,
        message: 'Name, email, college, and campus code are required.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCampusCode = campusCode.trim().toUpperCase();

    const existing = await CampusCaptainModel.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'A Campus Captain with this email is already registered.',
      });
      return;
    }

    const newCaptain: ICampusCaptain = {
      id: `cap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      whatsapp: whatsapp ? whatsapp.trim() : '',
      campusCode: cleanCampusCode,
      registrations: 0,
      createdAt: new Date().toISOString(),
      isSimulated: false,
    };

    const created = await CampusCaptainModel.create(newCaptain);

    // Increment captain count on campus
    await CampusModel.updateOne(
      { code: cleanCampusCode },
      { $inc: { captains: 1 } }
    );

    res.status(201).json({
      success: true,
      captain: created,
    });
  } catch (error) {
    next(error);
  }
}
