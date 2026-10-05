import type { Request, Response, NextFunction } from 'express';
import { ReferralModel } from '../models/Referral.js';
import { RegistrationModel } from '../models/Registration.js';
import { ReferralProfileModel } from '../models/ReferralProfile.js';
import { getReferrerStats, generateReferralCode } from '../services/referralService.js';

export async function getReferrals(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { includeSimulated } = req.query;
    const filter = includeSimulated === 'true' ? {} : { isSimulated: false };
    const referrals = await ReferralModel.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCodeStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const code = req.params.code as string;
    if (!code) {
      res.status(400).json({ success: false, message: 'Referral code is required.' });
      return;
    }

    const stats = await getReferrerStats(code);
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReferralLeaderboard(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const leaderboard = await ReferralModel.aggregate([
      { $match: { isVerified: true } },
      {
        $group: {
          _id: '$referrerCode',
          qualifiedReferrals: { $sum: 1 },
        },
      },
      { $sort: { qualifiedReferrals: -1 } },
      { $limit: 10 },
    ]);

    // Populate user names if available
    const enriched = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const student = await RegistrationModel.findOne({ referralCode: entry._id }).lean();
        return {
          rank: index + 1,
          name: student ? student.name : `Referrer ${entry._id}`,
          college: student ? student.college : 'Engineering Cohort',
          referralCode: entry._id,
          qualifiedReferrals: entry.qualifiedReferrals,
          reward: index === 0 ? 250 : index === 1 ? 150 : index === 2 ? 100 : undefined,
        };
      })
    );

    res.status(200).json({
      success: true,
      leaderboard: enriched,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOrUpdateReferralProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, college, referralCode } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }
    if (!college || !college.trim()) {
      res.status(400).json({ success: false, message: 'College is required.' });
      return;
    }

    const cleanName = name.trim();
    const cleanCollege = college.trim();
    const cleanCode = (referralCode || generateReferralCode(cleanName)).trim().toUpperCase();

    // Check if profile exists
    const existing = await ReferralProfileModel.findOne({ referralCode: cleanCode });
    const now = new Date().toISOString();

    let profile;
    if (existing) {
      existing.name = cleanName;
      existing.college = cleanCollege;
      existing.updatedAt = now;
      await existing.save();
      profile = existing;
    } else {
      profile = await ReferralProfileModel.create({
        name: cleanName,
        college: cleanCollege,
        referralCode: cleanCode,
        createdAt: now,
        updatedAt: now,
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        name: profile.name,
        college: profile.college,
        referralCode: profile.referralCode,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyReferrals(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const code = (req.query.code as string || req.headers['x-referral-code'] as string || '').trim().toUpperCase();
    if (!code) {
      res.status(400).json({ success: false, message: 'Referral code is required.' });
      return;
    }

    // Find all referrals where referrerCode matches
    const referrals = await ReferralModel.find({ referrerCode: code }).sort({ createdAt: -1 }).lean();

    // Filter genuine (non-simulated) referrals
    const genuineReferrals = referrals.filter(r => !r.isSimulated);

    res.status(200).json({
      success: true,
      referralCode: code,
      totalCount: referrals.length,
      genuineCount: genuineReferrals.length,
      referrals: genuineReferrals,
      allReferrals: referrals,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyReferral(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ success: false, message: 'Referral ID is required.' });
      return;
    }

    const ref = await ReferralModel.findOneAndUpdate(
      { id },
      { isVerified: true, verifiedAt: new Date().toISOString() },
      { new: true }
    );

    if (!ref) {
      res.status(404).json({ success: false, message: 'Referral not found.' });
      return;
    }

    res.status(200).json({ success: true, referral: ref });
  } catch (error) {
    next(error);
  }
}
