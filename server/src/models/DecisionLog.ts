import mongoose, { Schema } from 'mongoose';
import type { IDecisionLog } from '../types/index.js';

const DecisionLogSchema = new Schema<IDecisionLog>(
  {
    id: { type: String, required: true, unique: true },
    observation: { type: String, required: true },
    decision: { type: String, required: true },
    reason: { type: String, required: true },
    frameworkAction: {
      type: String,
      enum: ['KILL', 'ITERATE', 'CONTINUE', 'SCALE'],
      required: true,
    },
    status: {
      type: String,
      enum: ['testing', 'implemented', 'rejected', 'monitoring'],
      default: 'implemented',
    },
    createdAt: { type: String, required: true },
    impact: { type: String },
    isSimulated: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const DecisionLogModel = mongoose.model<IDecisionLog>('DecisionLog', DecisionLogSchema);
