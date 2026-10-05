import mongoose, { Schema } from 'mongoose';
import type { IReferral } from '../types/index.js';

const ReferralSchema = new Schema<IReferral>(
  {
    id: { type: String, required: true, unique: true },
    referrerCode: { type: String, required: true, uppercase: true, trim: true, index: true },
    referreeEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    referreeName: { type: String, trim: true },
    referreeCollege: { type: String, trim: true },
    registrationId: { type: String, required: true },
    createdAt: { type: String, required: true },
    verifiedAt: { type: String },
    isVerified: { type: Boolean, default: false },
    isSimulated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ReferralModel = mongoose.model<IReferral>('Referral', ReferralSchema);
