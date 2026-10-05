import mongoose, { Schema } from 'mongoose';
import type { IRegistration } from '../types/index.js';

const RegistrationSchema = new Schema<IRegistration>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    college: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    graduationYear: { type: String, default: '2027' },
    interest: { type: String, required: true },
    referralCode: { type: String, required: true, uppercase: true, trim: true, index: true },
    referredBy: { type: String, uppercase: true, trim: true, index: true },
    campus: { type: String, uppercase: true, trim: true, index: true },
    source: { type: String, default: 'direct' },
    passportId: { type: String },
    registeredAt: { type: String, required: true },
    status: { type: String, default: 'registered' },
    isSimulated: { type: Boolean, default: false },
    isQualified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const RegistrationModel = mongoose.model<IRegistration>('Registration', RegistrationSchema);
