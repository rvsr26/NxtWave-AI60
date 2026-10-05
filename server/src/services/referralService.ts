import { RegistrationModel } from '../models/Registration.js';
import { ReferralModel } from '../models/Referral.js';
import type { IReferral } from '../types/index.js';

export function generateReferralCode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
  return clean ? `${clean}60` : `STUDENT${Math.floor(10 + Math.random() * 90)}60`;
}

export async function validateReferral(
  name: string,
  email: string,
  referredBy?: string
): Promise<{ valid: boolean; error?: string }> {
  if (!referredBy) return { valid: true };

  const cleanReferredBy = referredBy.trim().toUpperCase();
  const selfCode = generateReferralCode(name);

  // 1. Direct code equality check
  if (cleanReferredBy === selfCode) {
    return { valid: false, error: 'Self-referral detected. You cannot use your own referral code.' };
  }

  // 2. Name-based referral code prefix match (e.g. name "Vishnu Demo" trying to use "VISHNU60")
  const nameFirstWord = name.trim().split(/\s+/)[0]?.toUpperCase().replace(/[^A-Z]/g, '') || '';
  if (nameFirstWord.length >= 3 && cleanReferredBy.startsWith(nameFirstWord)) {
    return { valid: false, error: 'Self-referral detected: Your name matches the referral code identity.' };
  }

  // 3. Referrer email match check in existing Registrations
  const referrerReg = await RegistrationModel.findOne({ referralCode: cleanReferredBy }).lean();
  if (referrerReg) {
    if (referrerReg.email.toLowerCase() === email.trim().toLowerCase()) {
      return { valid: false, error: 'Self-referral detected: Referrer email matches registrant email.' };
    }
  }

  return { valid: true };
}

export async function recordVerifiedReferral(
  referrerCode: string,
  referreeEmail: string,
  registrationId: string,
  referreeName?: string,
  referreeCollege?: string,
  isSimulated = false
): Promise<IReferral | null> {
  const cleanCode = referrerCode.trim().toUpperCase();
  const normalizedEmail = referreeEmail.trim().toLowerCase();

  // Check if duplicate referral already recorded for this pair
  const existing = await ReferralModel.findOne({
    referrerCode: cleanCode,
    referreeEmail: normalizedEmail,
  });

  if (existing) {
    return existing;
  }

  const newRef: IReferral = {
    id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    referrerCode: cleanCode,
    referreeEmail: normalizedEmail,
    referreeName: referreeName?.trim(),
    referreeCollege: referreeCollege?.trim(),
    registrationId,
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    isVerified: true,
    isSimulated,
  };

  const created = await ReferralModel.create(newRef);
  return created;
}

export async function getReferrerStats(referralCode: string): Promise<{
  referralCode: string;
  verifiedCount: number;
  isRewardEligible: boolean;
  rewardThreshold: number;
}> {
  const cleanCode = referralCode.trim().toUpperCase();
  const verifiedCount = await ReferralModel.countDocuments({
    referrerCode: cleanCode,
    isVerified: true,
  });

  return {
    referralCode: cleanCode,
    verifiedCount,
    isRewardEligible: verifiedCount >= 2,
    rewardThreshold: 2,
  };
}
