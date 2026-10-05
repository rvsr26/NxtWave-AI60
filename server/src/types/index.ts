export interface IProjectPassport {
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
  isSimulated?: boolean;
}

export interface IRegistration {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: '2027';
  interest: string;
  referralCode: string;
  referredBy?: string;
  campus?: string;
  source: string;
  passportId?: string;
  registeredAt: string;
  status?: string;
  isSimulated?: boolean;
  isQualified?: boolean;
}

export interface IReferral {
  id: string;
  referrerCode: string;
  referreeEmail: string;
  referreeName?: string;
  referreeCollege?: string;
  registrationId: string;
  createdAt: string;
  verifiedAt?: string;
  isSimulated?: boolean;
  isVerified?: boolean;
}

export interface IReferralProfile {
  name: string;
  college: string;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICampus {
  id: string;
  name: string;
  code: string;
  registrations: number;
  yesterdayRegistrations: number;
  captains: number;
  isSimulated?: boolean;
}

export interface ICampusCaptain {
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

export interface IAnalyticsEvent {
  id: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  source?: string;
  campus?: string;
  referralCode?: string;
}

export interface IExperiment {
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
  action: 'KILL' | 'ITERATE' | 'CONTINUE' | 'SCALE';
  decisionReason: string;
  isSimulated: boolean;
  autopsy?: {
    whatHappened: string;
    possibleInterpretation: string;
    whatToTestNext: string;
  };
}

export interface IDecisionLog {
  id: string;
  observation: string;
  decision: string;
  reason: string;
  frameworkAction: 'KILL' | 'ITERATE' | 'CONTINUE' | 'SCALE';
  status: 'testing' | 'implemented' | 'rejected' | 'monitoring';
  createdAt: string;
  impact?: string;
  isSimulated?: boolean;
}
