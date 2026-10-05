import { connectDB } from '../db/mongodb.js';
import { CampusModel } from '../models/Campus.js';
import { CampusCaptainModel } from '../models/CampusCaptain.js';
import { RegistrationModel } from '../models/Registration.js';
import { ReferralModel } from '../models/Referral.js';
import { ExperimentModel } from '../models/Experiment.js';
import { DecisionLogModel } from '../models/DecisionLog.js';
import type { ICampus, ICampusCaptain, IRegistration, IReferral, IExperiment, IDecisionLog } from '../types/index.js';

const DEMO_CAMPUSES: ICampus[] = [
  { id: 'c1', name: 'Amrita University', code: 'AMRITA60', registrations: 74, yesterdayRegistrations: 68, captains: 4, isSimulated: true },
  { id: 'c2', name: 'VIT University', code: 'VIT60', registrations: 61, yesterdayRegistrations: 55, captains: 3, isSimulated: true },
  { id: 'c3', name: 'SRM University', code: 'SRM60', registrations: 53, yesterdayRegistrations: 50, captains: 3, isSimulated: true },
  { id: 'c4', name: 'BITS Pilani', code: 'BITS60', registrations: 47, yesterdayRegistrations: 47, captains: 2, isSimulated: true },
  { id: 'c5', name: 'MIT Manipal', code: 'MIT60', registrations: 38, yesterdayRegistrations: 31, captains: 2, isSimulated: true },
  { id: 'c6', name: 'NIT Trichy', code: 'NIT60', registrations: 32, yesterdayRegistrations: 29, captains: 2, isSimulated: true },
  { id: 'c7', name: 'SASTRA University', code: 'SASTRA60', registrations: 21, yesterdayRegistrations: 21, captains: 1, isSimulated: true },
];

const DEMO_CAPTAINS: ICampusCaptain[] = [
  { id: 'cap1', name: 'Arjun Menon', email: 'arjun.demo@amrita.edu', college: 'Amrita University', whatsapp: '+91 98xxx xxxxx', campusCode: 'AMRITA60', registrations: 42, createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap2', name: 'Priya Sharma', email: 'priya.demo@vit.ac.in', college: 'VIT University', whatsapp: '+91 99xxx xxxxx', campusCode: 'VIT60', registrations: 31, createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap3', name: 'Rohan Verma', email: 'rohan.demo@srm.edu.in', college: 'SRM University', whatsapp: '+91 97xxx xxxxx', campusCode: 'SRM60', registrations: 28, createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap4', name: 'Divya Nair', email: 'divya.demo@bits.com', college: 'BITS Pilani', whatsapp: '+91 96xxx xxxxx', campusCode: 'BITS60', registrations: 24, createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
];

const DEMO_REGISTRATIONS: IRegistration[] = [
  { id: 'r1', name: 'Ananya Kumar', email: 'ananya.demo@gmail.com', college: 'Amrita University', branch: 'Computer Science', graduationYear: '2027', interest: 'Web', referralCode: 'ANANYA60', campus: 'AMRITA60', source: 'campus', registeredAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r2', name: 'Karthik R', email: 'karthik.demo@gmail.com', college: 'VIT University', branch: 'Information Technology', graduationYear: '2027', interest: 'Data', referralCode: 'KARTHIK60', referredBy: 'ANANYA60', campus: 'VIT60', source: 'referral', registeredAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r3', name: 'Sneha Pillai', email: 'sneha.demo@gmail.com', college: 'SRM University', branch: 'Electronics & Communication', graduationYear: '2027', interest: 'Mobile', referralCode: 'SNEHA60', campus: 'SRM60', source: 'whatsapp', registeredAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r4', name: 'Aditya Singh', email: 'aditya.demo@gmail.com', college: 'BITS Pilani', branch: 'Computer Science', graduationYear: '2027', interest: 'Developer Tools', referralCode: 'ADITYA60', campus: 'BITS60', source: 'campus', registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r5', name: 'Meera Krishnan', email: 'meera.demo@gmail.com', college: 'MIT Manipal', branch: 'Electrical & Electronics', graduationYear: '2027', interest: 'Education', referralCode: 'MEERA60', referredBy: 'KARTHIK60', campus: 'MIT60', source: 'referral', registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r6', name: 'Rahul Nath', email: 'rahul.demo@gmail.com', college: 'NIT Trichy', branch: 'Mechanical Engineering', graduationYear: '2027', interest: 'Finance', referralCode: 'RAHUL60', campus: 'NIT60', source: 'instagram', registeredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r7', name: 'Shruti Joshi', email: 'shruti.demo@gmail.com', college: 'Amrita University', branch: 'Computer Science', graduationYear: '2027', interest: 'Productivity', referralCode: 'SHRUTI60', referredBy: 'ANANYA60', campus: 'AMRITA60', source: 'referral', registeredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
];

const DEMO_REFERRALS: IReferral[] = [
  { id: 'ref1', referrerCode: 'ANANYA60', referreeEmail: 'karthik.demo@gmail.com', registrationId: 'r2', createdAt: DEMO_REGISTRATIONS[1].registeredAt, verifiedAt: DEMO_REGISTRATIONS[1].registeredAt, isSimulated: true, isVerified: true },
  { id: 'ref2', referrerCode: 'KARTHIK60', referreeEmail: 'meera.demo@gmail.com', registrationId: 'r5', createdAt: DEMO_REGISTRATIONS[4].registeredAt, verifiedAt: DEMO_REGISTRATIONS[4].registeredAt, isSimulated: true, isVerified: true },
  { id: 'ref3', referrerCode: 'ANANYA60', referreeEmail: 'shruti.demo@gmail.com', registrationId: 'r7', createdAt: DEMO_REGISTRATIONS[6].registeredAt, verifiedAt: DEMO_REGISTRATIONS[6].registeredAt, isSimulated: true, isVerified: true },
];

const DEMO_EXPERIMENTS: IExperiment[] = [
  {
    id: 'exp1',
    number: 1,
    title: 'Personalized Project Passport vs Generic Landing Page',
    hypothesis: 'Giving final-year students immediate personal project utility (the AI Project Passport) before asking for registration will significantly lower commitment friction compared to a standard workshop page.',
    control: {
      label: 'Control A — Generic Workshop Landing Page',
      description: 'Standard webinar pitch: "Free 60-Minute Workshop: Learn Generative AI. Reserve your seat now."',
      visitors: 0,
      conversions: 0,
    },
    variant: {
      label: 'Variant B — Project Passport Discovery First',
      description: 'Value-first hook: "What AI project could YOU build in 60 minutes? Get your personalized blueprint first."',
      visitors: 0,
      conversions: 0,
    },
    metric: 'Visitor-to-registration conversion rate (CVR)',
    status: 'awaiting_data',
    resultStatus: 'Awaiting data',
    action: 'CONTINUE',
    decisionReason: 'Hypothesis to validate during initial pilot batch across Amrita and VIT cohorts.',
    isSimulated: true,
  },
  {
    id: 'exp2',
    number: 2,
    title: 'Value-First CTA vs Transactional CTA',
    hypothesis: '"Build My Project in 60 Minutes" will drive higher registration intent than "Reserve My Free Workshop Seat" because it focuses on tangible creation rather than webinar attendance.',
    control: {
      label: 'Control A — Transactional Framing',
      description: 'Primary button reads: "Reserve My Free Workshop Seat"',
      visitors: 0,
      conversions: 0,
    },
    variant: {
      label: 'Variant B — Creation Framing',
      description: 'Primary button reads: "Build My Project in 60 Minutes"',
      visitors: 0,
      conversions: 0,
    },
    metric: 'CTA click-through rate & registration completion',
    status: 'awaiting_data',
    resultStatus: 'Awaiting data',
    action: 'CONTINUE',
    decisionReason: 'Hypothesis to validate. In CONTINUE status to track drop-off between CTA click and email verification without prematurely assuming winner.',
    isSimulated: true,
  },
  {
    id: 'exp3',
    number: 3,
    title: 'Campus League (Group Identity) vs Individual Leaderboard',
    hypothesis: 'Campus-level competition (college rankings) will generate higher peer-to-peer distribution than individual refer-a-friend bonuses because final-year students have strong collegiate pride.',
    control: {
      label: 'Control A — Individual Ambassador Ranks',
      description: 'Personal leaderboard showing top 10 individual student referrers with badge rewards.',
      visitors: 0,
      conversions: 0,
    },
    variant: {
      label: 'Variant B — Campus League Cohorts',
      description: 'Inter-college leaderboard: "Help your college top the AI60 Campus League. Proposed cohort starter kit unlock."',
      visitors: 0,
      conversions: 0,
    },
    metric: 'K-factor (viral coefficient: verified referred registrations per registrant)',
    status: 'awaiting_data',
    resultStatus: 'Awaiting data',
    action: 'CONTINUE',
    decisionReason: 'Core thesis of the distribution model. In CONTINUE status to validate K-factor across first 5 campuses before scaling.',
    isSimulated: true,
  },
  {
    id: 'exp4',
    number: 4,
    title: 'Creator Challenge Content: Outcome-Driven vs Viral Meme',
    hypothesis: 'Outcome-oriented promotional creative (Creator B: Portfolio AI project walkthrough) will generate more qualified registrations (31) and higher score (86) than high-reach meme creative (Creator C: 18 regs, score 71), proving that high-intent framing outperforms top-of-funnel vanity views.',
    control: {
      label: 'Control (Creator C) — Viral Humor & Meme Reel',
      description: 'Format: Short tech meme video. Reach: 6,100, Clicks: 410, Regs: 18, CTR: 6.7%, Score: 71. Weak intent.',
      visitors: 6100,
      conversions: 18,
    },
    variant: {
      label: 'Winner (Creator B) — Portfolio Project Walkthrough',
      description: 'Format: 60-second prototype demo. Reach: 2,900, Clicks: 240, Regs: 31, CTR: 8.3%, Score: 86. High intent.',
      visitors: 2900,
      conversions: 31,
    },
    metric: 'Qualified Registrations (60% weight) & Total Challenge Score',
    status: 'completed',
    resultStatus: 'Illustrative simulation',
    action: 'SCALE',
    decisionReason: 'Creator B scaled (🏆 ₹300 winner). Creator A iterated (24 regs). Creator C killed (18 regs). Principle: Views are useful. Clicks are useful. Registrations matter more. Qualified registrations matter most.',
    isSimulated: true,
    autopsy: {
      whatHappened: 'Creator C generated the highest impressions (6,100) and link clicks (410) via meme humor, but only 18 qualified registrations (4.4% click-to-reg). Creator B generated 2,900 reach and 240 clicks, but achieved 31 qualified registrations (12.9% click-to-reg).',
      possibleInterpretation: 'Possible explanation (Hypothesis): Humor/meme formats generate superficial viral reach and passive curiosity clicks, but fail to convey the concrete portfolio value required for an engineering student to commit to a 60-minute technical session. Walkthrough video demonstrated the actual finished prototype, setting high intent.',
      whatToTestNext: 'Scale Creator B blueprint across student creators: test portfolio-first hook templates with clear GitHub/LinkedIn output previews before allocating further prize incentives.',
    },
  },
];

const DEMO_DECISION_LOGS: IDecisionLog[] = [
  {
    id: 'dl1',
    observation: 'Direct placement WhatsApp broadcasts from student captains demonstrated higher observed engagement than generic student community announcements in testing phases.',
    decision: 'Direct zero budget to cold paid ads; instead fund student-driven incentives (₹300 creator challenge prize, ₹500 referral rewards, and ₹900 post-workshop project prizes).',
    reason: 'Campus captains and student peers possess localized trust and verified placement WhatsApp group access that cold social ads cannot replicate.',
    frameworkAction: 'SCALE',
    status: 'testing',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    impact: 'Expected impact: Deliver ~200 registrations across 25 captains and 150 referrals with zero paid ad waste.',
    isSimulated: true,
  },
  {
    id: 'dl2',
    observation: 'Monolithic multi-field registration forms create drop-off before students understand workshop relevance.',
    decision: 'Split into 3-question personal Project Passport first, followed by streamlined 5-field registration.',
    reason: 'Friction reduction principle: users commit easily to lightweight discovery, generating sunk cost and high desire to finish.',
    frameworkAction: 'CONTINUE',
    status: 'implemented',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    impact: 'Expected impact: Improved funnel completion by personalizing value prior to registration.',
    isSimulated: true,
  },
  {
    id: 'dl3',
    observation: 'Unverified share links create referral fraud without driving genuine attendance.',
    decision: 'Require 2 VERIFIED registrations before unlocking the proposed starter repository and placement prep checklist.',
    reason: 'Ensures viral quality over spam. Anti-fraud checks prevent self-referrals and duplicate emails.',
    frameworkAction: 'ITERATE',
    status: 'implemented',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    impact: 'Expected impact: Secures authentic batchmate engagement and protects attendee quality.',
    isSimulated: true,
  },
  {
    id: 'dl4',
    observation: 'Creator C generated the highest reach (6,100) and clicks (410), but only 18 qualified registrations (Score 71). Creator B had lower reach (2,900) but drove 31 qualified registrations (Score 86).',
    decision: 'Award ₹300 prize to Creator B (SCALE), iterate messaging on Creator A (ITERATE), and kill vanity meme strategy Creator C (KILL).',
    reason: 'Core Growth Principle: Views and clicks are useful top-of-funnel indicators, but qualified registrations matter most for real workshop attendance.',
    frameworkAction: 'SCALE',
    status: 'implemented',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    impact: 'Expected impact: Align creator incentives strictly with verified attendee acquisition rather than vanity reach.',
    isSimulated: true,
  },
];

export async function seedDatabase(): Promise<void> {
  await connectDB();

  // 1. Campuses
  for (const campus of DEMO_CAMPUSES) {
    await CampusModel.findOneAndUpdate({ code: campus.code }, campus, { upsert: true, new: true });
  }

  // 2. Captains
  for (const cap of DEMO_CAPTAINS) {
    await CampusCaptainModel.findOneAndUpdate({ email: cap.email }, cap, { upsert: true, new: true });
  }

  // 3. Registrations (upsert simulated only)
  for (const reg of DEMO_REGISTRATIONS) {
    await RegistrationModel.findOneAndUpdate({ email: reg.email }, reg, { upsert: true, new: true });
  }

  // 4. Referrals
  for (const ref of DEMO_REFERRALS) {
    await ReferralModel.findOneAndUpdate({ id: ref.id }, ref, { upsert: true, new: true });
  }

  // 5. Experiments
  for (const exp of DEMO_EXPERIMENTS) {
    await ExperimentModel.findOneAndUpdate({ id: exp.id }, exp, { upsert: true, new: true });
  }

  // 6. Decisions
  for (const d of DEMO_DECISION_LOGS) {
    await DecisionLogModel.findOneAndUpdate({ id: d.id }, d, { upsert: true, new: true });
  }

  console.log('[Seed] Database seeded with demo and planning data (clearly marked isSimulated: true)');
}

// Standalone execution support only when directly run from CLI
if (
  process.argv[1] &&
  (process.argv[1].endsWith('seed.js') || process.argv[1].endsWith('seed.ts'))
) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}
