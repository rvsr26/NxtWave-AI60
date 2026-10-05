import mongoose, { Schema } from 'mongoose';
import type { IReferralProfile } from '../types/index.js';

const ReferralProfileSchema = new Schema<IReferralProfile>(
  {
    name: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    referralCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ReferralProfileModel = mongoose.model<IReferralProfile>('ReferralProfile', ReferralProfileSchema);
