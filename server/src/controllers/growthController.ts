import type { Request, Response, NextFunction } from 'express';
import {
  getGrowthOverview,
  getFunnelData,
  getSourceAttribution,
} from '../services/growthService.js';
import { CampusModel } from '../models/Campus.js';
import { ReferralModel } from '../models/Referral.js';

export async function getOverview(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getGrowthOverview();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getFunnel(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const funnel = await getFunnelData();
    res.status(200).json({
      success: true,
      simulationNotice: 'Stages 1, 4, 6, 7, 8 include planning projections. Stages 2, 3, 5 are MongoDB-backed.',
      funnel,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSources(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sources = await getSourceAttribution();
    res.status(200).json({ success: true, sources });
  } catch (error) {
    next(error);
  }
}

export async function getReferralMetrics(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [total, verified] = await Promise.all([
      ReferralModel.countDocuments(),
      ReferralModel.countDocuments({ isVerified: true }),
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalReferrals: total,
        verifiedReferrals: verified,
        verificationRate: total > 0 ? `${((verified / total) * 100).toFixed(1)}%` : '0%',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCampusMetrics(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const campuses = await CampusModel.find().sort({ registrations: -1 }).lean();
    const totalCampuses = campuses.length;
    const totalCampusRegistrations = campuses.reduce((acc, c) => acc + (c.registrations || 0), 0);

    res.status(200).json({
      success: true,
      campuses,
      totals: {
        totalCampuses,
        totalCampusRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
}
