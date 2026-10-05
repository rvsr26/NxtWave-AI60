import mongoose, { Schema } from 'mongoose';
import type { IAnalyticsEvent } from '../types/index.js';

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    id: { type: String, required: true, unique: true },
    event: { type: String, required: true, index: true },
    properties: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    source: { type: String, default: 'direct' },
    campus: { type: String },
    referralCode: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AnalyticsEventModel = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
