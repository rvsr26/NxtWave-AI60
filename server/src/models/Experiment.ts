import mongoose, { Schema } from 'mongoose';
import type { IExperiment } from '../types/index.js';

const ExperimentSchema = new Schema<IExperiment>(
  {
    id: { type: String, required: true, unique: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    hypothesis: { type: String, required: true },
    control: {
      label: { type: String, required: true },
      description: { type: String, required: true },
      visitors: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    variant: {
      label: { type: String, required: true },
      description: { type: String, required: true },
      visitors: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    metric: { type: String, required: true },
    status: {
      type: String,
      enum: ['running', 'completed', 'paused', 'awaiting_data'],
      default: 'awaiting_data',
    },
    resultStatus: {
      type: String,
      enum: ['Awaiting data', 'Hypothesis to validate', 'Illustrative simulation'],
      default: 'Awaiting data',
    },
    action: {
      type: String,
      enum: ['KILL', 'ITERATE', 'CONTINUE', 'SCALE'],
      default: 'CONTINUE',
    },
    decisionReason: { type: String, default: '' },
    isSimulated: { type: Boolean, default: true },
    autopsy: {
      whatHappened: { type: String },
      possibleInterpretation: { type: String },
      whatToTestNext: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const ExperimentModel = mongoose.model<IExperiment>('Experiment', ExperimentSchema);
