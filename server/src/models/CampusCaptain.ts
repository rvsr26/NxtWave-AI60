import mongoose, { Schema } from 'mongoose';
import type { ICampusCaptain } from '../types/index.js';

const CampusCaptainSchema = new Schema<ICampusCaptain>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    college: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: '' },
    campusCode: { type: String, required: true, uppercase: true, trim: true, index: true },
    registrations: { type: Number, default: 0 },
    createdAt: { type: String, required: true },
    isSimulated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const CampusCaptainModel = mongoose.model<ICampusCaptain>('CampusCaptain', CampusCaptainSchema);
