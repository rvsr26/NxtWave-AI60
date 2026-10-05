import type { Request, Response, NextFunction } from 'express';
import { RegistrationModel } from '../models/Registration.js';
import { CampusModel } from '../models/Campus.js';
import { CampusCaptainModel } from '../models/CampusCaptain.js';
import { ProjectPassportModel } from '../models/ProjectPassport.js';
import { ReferralModel } from '../models/Referral.js';
import { AnalyticsEventModel } from '../models/AnalyticsEvent.js';
import { ExperimentModel } from '../models/Experiment.js';
import { DecisionLogModel } from '../models/DecisionLog.js';
import { seedDatabase } from '../scripts/seed.js';

export async function getAdminOverview(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [
      registrations,
      campuses,
      captains,
      passports,
      referrals,
      experiments,
      decisions,
    ] = await Promise.all([
      RegistrationModel.find().sort({ createdAt: -1 }).lean(),
      CampusModel.find().sort({ registrations: -1 }).lean(),
      CampusCaptainModel.find().sort({ registrations: -1 }).lean(),
      ProjectPassportModel.find().sort({ createdAt: -1 }).lean(),
      ReferralModel.find().sort({ createdAt: -1 }).lean(),
      ExperimentModel.find().sort({ number: 1 }).lean(),
      DecisionLogModel.find().sort({ createdAt: -1 }).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        registrations,
        campuses,
        captains,
        passports,
        referrals,
        experiments,
        decisions,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function runSeed(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Demo and simulation data seeded successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function clearSimulated(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Promise.all([
      RegistrationModel.deleteMany({ isSimulated: true }),
      CampusModel.deleteMany({ isSimulated: true }),
      CampusCaptainModel.deleteMany({ isSimulated: true }),
      ReferralModel.deleteMany({ isSimulated: true }),
      ProjectPassportModel.deleteMany({ isSimulated: true }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Simulated demo records successfully cleared.',
    });
  } catch (error) {
    next(error);
  }
}

export async function clearAll(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await Promise.all([
      RegistrationModel.deleteMany({}),
      CampusModel.deleteMany({}),
      CampusCaptainModel.deleteMany({}),
      ReferralModel.deleteMany({}),
      ProjectPassportModel.deleteMany({}),
      AnalyticsEventModel.deleteMany({}),
    ]);

    res.status(200).json({
      success: true,
      message: 'All collections successfully cleared.',
    });
  } catch (error) {
    next(error);
  }
}
