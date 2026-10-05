import type { Request, Response, NextFunction } from 'express';
import { RegistrationModel } from '../models/Registration.js';
import { CampusModel } from '../models/Campus.js';
import { CampusCaptainModel } from '../models/CampusCaptain.js';
import { generateReferralCode, validateReferral, recordVerifiedReferral } from '../services/referralService.js';
import type { IRegistration } from '../types/index.js';

export async function createRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, college, branch, interest, referredBy, campus, source, passportId } = req.body;

    // 1. Validation
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Full Name is required.' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ success: false, message: 'College Email is required.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }
    if (!college || !college.trim()) {
      res.status(400).json({ success: false, message: 'College name is required.' });
      return;
    }
    if (!branch || !branch.trim()) {
      res.status(400).json({ success: false, message: 'Engineering branch is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Duplicate Check
    const existing = await RegistrationModel.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      });
      return;
    }

    // 3. Referral Validation (Anti-fraud)
    if (referredBy) {
      const refCheck = await validateReferral(name, normalizedEmail, referredBy);
      if (!refCheck.valid) {
        res.status(400).json({
          success: false,
          message: refCheck.error || 'Invalid referral attribution.',
        });
        return;
      }
    }

    // 4. Generate clean self referral code
    const selfReferralCode = generateReferralCode(name);

    // 5. Construct document
    const newReg: IRegistration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      branch: branch.trim(),
      graduationYear: '2027',
      interest: interest || 'Web',
      referralCode: selfReferralCode,
      referredBy: referredBy ? referredBy.trim().toUpperCase() : undefined,
      campus: campus ? campus.trim().toUpperCase() : undefined,
      source: source || 'direct',
      passportId: passportId || undefined,
      registeredAt: new Date().toISOString(),
      status: 'registered',
      isSimulated: false,
      isQualified: true,
    };

    const saved = await RegistrationModel.create(newReg);

    // 6. Referral attribution tracking & verification
    if (newReg.referredBy) {
      await recordVerifiedReferral(
        newReg.referredBy,
        newReg.email,
        saved.id,
        newReg.name,
        newReg.college,
        Boolean(req.body.isSimulated)
      );
    }

    // 7. Update Campus metrics if campus attribution is present
    if (newReg.campus) {
      const campusUpper = newReg.campus.trim().toUpperCase();
      await CampusModel.updateOne(
        { $or: [{ code: campusUpper }, { code: `${campusUpper}60` }] },
        { $inc: { registrations: 1 } }
      );
      await CampusCaptainModel.updateOne(
        { $or: [{ campusCode: campusUpper }, { campusCode: `${campusUpper}60` }] },
        { $inc: { registrations: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration: saved,
      registrationId: saved.id,
      referralCode: saved.referralCode,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRegistrations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { includeSimulated } = req.query;
    const filter = includeSimulated === 'true' ? {} : { isSimulated: false };
    const registrations = await RegistrationModel.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkEmailAvailability(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const email = (req.query.email as string)?.trim().toLowerCase();
    if (!email) {
      res.status(400).json({ success: false, message: 'Email query parameter is required.' });
      return;
    }

    const exists = await RegistrationModel.exists({ email });
    res.status(200).json({
      success: true,
      available: !exists,
    });
  } catch (error) {
    next(error);
  }
}
