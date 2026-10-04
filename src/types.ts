// Types for the entire AI60 Growth OS application

export interface ProjectPassport {
  id: string;
  projectName: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  relevance: string;
  techStack: string[];
  workshopBuild: string;
  nextStep: string;
  resumeBullet: string;
  interviewTalkingPoint?: string;
  branch?: string;
  domain?: string;
  buildRoadmap: { time: string; task: string }[];
  whyReasons: string[];
  interest: string;
  experience: string;
  goal: string;
  generatedAt: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: '2027';
  interest: string;
  referralCode: string; // their own code
  referredBy?: string;  // code of who referred them
  campus?: string;      // campus code e.g. AMRITA60
  source: string;       // whatsapp, instagram, direct, etc.
  passportId?: string;
  registeredAt: string;
  isSimulated?: boolean;
  isQualified?: boolean; // verified unique registration
}

export interface Referral {
  id: string;
  referrerCode: string;
  referreeEmail: string;
  registrationId: string;
  createdAt: string;
  isSimulated?: boolean;
  isVerified?: boolean; // verified after complete registration
}

export interface ReferralLeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  qualifiedReferrals: number;
  reward?: number;
  isCurrentStudent?: boolean;
}

export interface CreatorExperimentEntry {
  id: string;
  creatorName: string;
  creatorCode: string; // e.g. CREATOR01, CREATOR02, CREATOR03, VISHNU26
  format: string; // 'Instagram Reel' | 'WhatsApp creative' | 'LinkedIn post' | 'X post' | 'Short video' | 'Meme'
  reach: number;
  clicks: number;
  qualifiedRegistrations: number;
  ctr: number; // Click-through rate %
  engagementRate: number; // Engagement % (10% weight)
  creativityScore: number; // 0-100 (10% weight)
  totalScore: number; // Weighted: Qualified Regs 60%, CTR 20%, Engagement 10%, Creativity 10%
  status: 'Leading' | 'Active' | 'Review';
  action: DecisionFrameworkAction; // 'SCALE' | 'ITERATE' | 'KILL'
  isWinner: boolean;
  reward: number; // ₹300 for top winner
}

// Retained for backward-compatibility if referenced
export interface PaidAdCreative {
  id: string;
  creativeName: string;
  headline: string;
  angle: string;
  spend: number;
  impressions: number;
  clicks: number;
  registrations: number;
  qualifiedRegistrations: number;
  costPerRegistration: number;
  costPerQualifiedRegistration: number;
  conversionRate: number;
  isWinner: boolean;
  status: 'Testing' | 'Scaled';
}

export interface WorkshopProjectSubmission {
  id: string;
  studentName: string;
  college: string;
  projectName: string;
  summary: string;
  functionalityScore: number; // 30%
  creativityScore: number;    // 25%
  aiUsageScore: number;       // 20%
  uxScore: number;            // 15%
  presentationScore: number;  // 10%
  totalScore: number;         // 100%
  rank?: number;
  reward?: number;
  status: 'Evaluated' | 'Under Review';
}

export interface RewardsConfig {
  creatorChallengeReward: { amount: number; condition: string };
  referralRewards: { rank: number; amount: number; condition: string }[];
  competitionRewards: { rank: number; amount: number; condition: string }[];
  evaluationCriteria: { criterion: string; weight: number; desc: string }[];
}

export interface Campus {
  id: string;
  name: string;
  code: string; // e.g. AMRITA60
  registrations: number;
  yesterdayRegistrations: number;
  captains: number;
  isSimulated?: boolean;
}

export interface CampusCaptain {
  id: string;
  name: string;
  email: string;
  college: string;
  whatsapp: string;
  campusCode: string;
  registrations: number;
  createdAt: string;
  isSimulated?: boolean;
}

export interface AnalyticsEvent {
  id: string;
  event: EventType;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
  sessionId: string;
  source?: string;
  campus?: string;
  referralCode?: string;
}

export type EventType =
  | 'landing_view'
  | 'passport_started'
  | 'passport_generated'
  | 'registration_started'
  | 'registration_completed'
  | 'referral_link_copied'
  | 'whatsapp_clicked'
  | 'referral_registration'
  | 'campus_link_clicked'
  | 'campus_captain_created'
  | 'experiment_viewed'
  | 'experiment_conversion';

export type DecisionFrameworkAction = 'KILL' | 'ITERATE' | 'CONTINUE' | 'SCALE';

export interface Experiment {
  id: string;
  number: number;
  title: string;
  hypothesis: string;
  control: {
    label: string;
    description: string;
    visitors: number;
    conversions: number;
  };
  variant: {
    label: string;
    description: string;
    visitors: number;
    conversions: number;
  };
  metric: string;
  status: 'running' | 'completed' | 'paused' | 'awaiting_data';
  resultStatus: 'Awaiting data' | 'Hypothesis to validate' | 'Illustrative simulation';
  action: DecisionFrameworkAction;
  decisionReason: string;
  isSimulated: boolean;
  autopsy?: GrowthAutopsy;
}

export interface GrowthAutopsy {
  whatHappened: string;
  possibleInterpretation: string;
  whatToTestNext: string;
}

export interface ChannelDecisionEntry {
  id: string;
  channel: string;
  plannedRegistrations: number;
  qualifiedRegistrations: number;
  cost: number;
  conversionRate: number;
  qualitySignal: string;
  decision: DecisionFrameworkAction;
  why: string;
  nextAction: string;
  isSimulated?: boolean;
}

export interface BudgetTrancheSimulation {
  campusCaptains: number;
  referrals: number;
  communities: number;
  creators: number;
  paidAds: number;
}

export interface DecisionLog {
  id: string;
  observation: string;
  decision: string;
  reason: string;
  frameworkAction: DecisionFrameworkAction;
  status: 'testing' | 'implemented' | 'rejected' | 'monitoring';
  createdAt: string;
  impact?: string;
}

export interface BudgetPhase {
  phase: number;
  amount: number;
  label: string;
  description: string;
  channel: string;
  status: 'planned' | 'active' | 'completed';
}

export interface GrowthSimulation {
  campusCaptains: number;
  registrationsPerCaptain: number;
  referralRegistrations: number;
  communityRegistrations: number;
  creatorRegistrations: number; // Student Creator Challenge
  organicSocialRegistrations: number; // Organic Social + Communities
  creatorPrizeBudget: number; // ₹300
  referralRewardBudget: number; // ₹500
  competitionRewardBudget: number; // ₹900
  // Backward compatibility aliases if needed
  paidRegistrations?: number;
  adBudget?: number;
}

export interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

export interface SourceAttribution {
  source: string;
  registrations: number;
  conversions: number;
  percentage: number;
  cac?: number;
}

export interface AssumptionCheck {
  id: string;
  assumption: string;
  expectedValue: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  validationMethod: string;
  currentStatus: string;
}

export interface AppState {
  registrations: Registration[];
  campuses: Campus[];
  captains: CampusCaptain[];
  passports: ProjectPassport[];
  events: AnalyticsEvent[];
  referrals: Referral[];
  currentPassport?: ProjectPassport;
  currentRegistration?: Registration;
  isDemo: boolean;
  urlParams: {
    ref?: string;
    campus?: string;
    src?: string;
  };
}

