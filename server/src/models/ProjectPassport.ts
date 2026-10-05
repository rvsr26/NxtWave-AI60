import mongoose, { Schema } from 'mongoose';
import type { IProjectPassport } from '../types/index.js';

const RoadmapItemSchema = new Schema(
  {
    time: { type: String, required: true },
    task: { type: String, required: true },
  },
  { _id: false }
);

const ProjectPassportSchema = new Schema<IProjectPassport>(
  {
    id: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    skills: [{ type: String }],
    relevance: { type: String },
    techStack: [{ type: String }],
    workshopBuild: { type: String },
    nextStep: { type: String },
    resumeBullet: { type: String },
    interviewTalkingPoint: { type: String },
    branch: { type: String },
    domain: { type: String },
    buildRoadmap: [RoadmapItemSchema],
    whyReasons: [{ type: String }],
    interest: { type: String, required: true },
    experience: { type: String, required: true },
    goal: { type: String, required: true },
    generatedAt: { type: String, required: true },
    isSimulated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ProjectPassportModel = mongoose.model<IProjectPassport>('ProjectPassport', ProjectPassportSchema);
