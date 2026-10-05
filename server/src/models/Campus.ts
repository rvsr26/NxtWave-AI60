import mongoose, { Schema } from 'mongoose';
import type { ICampus } from '../types/index.js';

const CampusSchema = new Schema<ICampus>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    registrations: { type: Number, default: 0 },
    yesterdayRegistrations: { type: Number, default: 0 },
    captains: { type: Number, default: 0 },
    isSimulated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const CampusModel = mongoose.model<ICampus>('Campus', CampusSchema);
