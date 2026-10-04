// Seed demo data — clearly labeled as simulation
import type { Registration, Campus, CampusCaptain, Referral } from './types';
import {
  saveRegistration, saveCampus, saveCaptain, saveReferral,
  getRegistrations, getCampuses, getCaptains, getReferrals,
  clearSimulatedData, saveExperiments, saveDecisionLogs
} from './storage';
import type { Experiment, DecisionLog, ChannelDecisionEntry } from './types';

const DEMO_CAMPUSES: Campus[] = [
  { id: 'c1', name: 'Amrita University', code: 'AMRITA60', registrations: 74, yesterdayRegistrations: 68, captains: 4, isSimulated: true },
  { id: 'c2', name: 'VIT University', code: 'VIT60', registrations: 61, yesterdayRegistrations: 55, captains: 3, isSimulated: true },
  { id: 'c3', name: 'SRM University', code: 'SRM60', registrations: 53, yesterdayRegistrations: 50, captains: 3, isSimulated: true },
  { id: 'c4', name: 'BITS Pilani', code: 'BITS60', registrations: 47, yesterdayRegistrations: 47, captains: 2, isSimulated: true },
  { id: 'c5', name: 'MIT Manipal', code: 'MIT60', registrations: 38, yesterdayRegistrations: 31, captains: 2, isSimulated: true },
  { id: 'c6', name: 'NIT Trichy', code: 'NIT60', registrations: 32, yesterdayRegistrations: 29, captains: 2, isSimulated: true },
  { id: 'c7', name: 'SASTRA University', code: 'SASTRA60', registrations: 21, yesterdayRegistrations: 21, captains: 1, isSimulated: true },
];

const DEMO_CAPTAINS: CampusCaptain[] = [
  { id: 'cap1', name: 'Arjun Menon', email: 'arjun.demo@amrita.edu', college: 'Amrita University', whatsapp: '+91 98xxx xxxxx', campusCode: 'AMRITA60', registrations: 42, createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap2', name: 'Priya Sharma', email: 'priya.demo@vit.ac.in', college: 'VIT University', whatsapp: '+91 99xxx xxxxx', campusCode: 'VIT60', registrations: 31, createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap3', name: 'Rohan Verma', email: 'rohan.demo@srm.edu.in', college: 'SRM University', whatsapp: '+91 97xxx xxxxx', campusCode: 'SRM60', registrations: 28, createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
  { id: 'cap4', name: 'Divya Nair', email: 'divya.demo@bits.com', college: 'BITS Pilani', whatsapp: '+91 96xxx xxxxx', campusCode: 'BITS60', registrations: 24, createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true },
];

const DEMO_REGISTRATIONS: Registration[] = [
  { id: 'r1', name: 'Ananya Kumar', email: 'ananya.demo@gmail.com', college: 'Amrita University', branch: 'Computer Science', graduationYear: '2027', interest: 'Web', referralCode: 'ANANYA60', campus: 'AMRITA60', source: 'campus', registeredAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r2', name: 'Karthik R', email: 'karthik.demo@gmail.com', college: 'VIT University', branch: 'Information Technology', graduationYear: '2027', interest: 'Data', referralCode: 'KARTHIK60', referredBy: 'ANANYA60', campus: 'VIT60', source: 'referral', registeredAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r3', name: 'Sneha Pillai', email: 'sneha.demo@gmail.com', college: 'SRM University', branch: 'Electronics & Communication', graduationYear: '2027', interest: 'Mobile', referralCode: 'SNEHA60', campus: 'SRM60', source: 'whatsapp', registeredAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r4', name: 'Aditya Singh', email: 'aditya.demo@gmail.com', college: 'BITS Pilani', branch: 'Computer Science', graduationYear: '2027', interest: 'Developer Tools', referralCode: 'ADITYA60', campus: 'BITS60', source: 'campus', registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r5', name: 'Meera Krishnan', email: 'meera.demo@gmail.com', college: 'MIT Manipal', branch: 'Electrical & Electronics', graduationYear: '2027', interest: 'Education', referralCode: 'MEERA60', referredBy: 'KARTHIK60', campus: 'MIT60', source: 'referral', registeredAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r6', name: 'Rahul Nath', email: 'rahul.demo@gmail.com', college: 'NIT Trichy', branch: 'Mechanical Engineering', graduationYear: '2027', interest: 'Finance', referralCode: 'RAHUL60', campus: 'NIT60', source: 'instagram', registeredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
  { id: 'r7', name: 'Shruti Joshi', email: 'shruti.demo@gmail.com', college: 'Amrita University', branch: 'Computer Science', graduationYear: '2027', interest: 'Productivity', referralCode: 'SHRUTI60', referredBy: 'ANANYA60', campus: 'AMRITA60', source: 'referral', registeredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), isSimulated: true, isQualified: true },
];

const DEMO_REFERRALS: Referral[] = [
  { id: 'ref1', referrerCode: 'ANANYA60', referreeEmail: 'karthik.demo@gmail.com', registrationId: 'r2', createdAt: DEMO_REGISTRATIONS[1].registeredAt, isSimulated: true, isVerified: true },
  { id: 'ref2', referrerCode: 'KARTHIK60', referreeEmail: 'meera.demo@gmail.com', registrationId: 'r5', createdAt: DEMO_REGISTRATIONS[4].registeredAt, isSimulated: true, isVerified: true },
  { id: 'ref3', referrerCode: 'ANANYA60', referreeEmail: 'shruti.demo@gmail.com', registrationId: 'r7', createdAt: DEMO_REGISTRATIONS[6].registeredAt, isSimulated: true, isVerified: true },
];

// Campus Referral Leaderboard (Verified Unique Registrations only)
export const DEMO_REFERRAL_LEADERBOARD: import('./types').ReferralLeaderboardEntry[] = [
  { rank: 1, name: 'Rahul', college: 'Amrita University', qualifiedReferrals: 34, reward: 250 },
  { rank: 2, name: 'Priya', college: 'VIT University', qualifiedReferrals: 27, reward: 150 },
  { rank: 3, name: 'Arjun', college: 'SRM University', qualifiedReferrals: 21, reward: 100 },
  { rank: 4, name: 'Vishnu', college: 'BITS Pilani', qualifiedReferrals: 18, isCurrentStudent: true },
  { rank: 5, name: 'Sneha', college: 'NIT Trichy', qualifiedReferrals: 15 },
];

// Student Creator Growth Challenge (₹300 winner prize pool)
// Primary decision metric: Qualified Registrations (not vanity views)
// Scoring Model: Qualified Regs 60%, CTR 20%, Engagement 10%, Creativity 10%
export const DEMO_CREATOR_EXPERIMENT: import('./types').CreatorExperimentEntry[] = [
  {
    id: 'creator-b',
    creatorName: 'Creator B',
    creatorCode: 'CREATOR02',
    format: 'Instagram Reel / Short Video',
    reach: 2900,
    clicks: 240,
    qualifiedRegistrations: 31,
    ctr: 8.3,
    engagementRate: 9.1,
    creativityScore: 88,
    totalScore: 86,
    status: 'Leading',
    action: 'SCALE',
    isWinner: true,
    reward: 300,
  },
  {
    id: 'creator-a',
    creatorName: 'Creator A',
    creatorCode: 'CREATOR01',
    format: 'WhatsApp Creative / Carousel',
    reach: 4200,
    clicks: 310,
    qualifiedRegistrations: 24,
    ctr: 7.4,
    engagementRate: 6.5,
    creativityScore: 80,
    totalScore: 74,
    status: 'Active',
    action: 'ITERATE',
    isWinner: false,
    reward: 0,
  },
  {
    id: 'creator-c',
    creatorName: 'Creator C',
    creatorCode: 'CREATOR03',
    format: 'Viral AI Meme / X Post',
    reach: 6100,
    clicks: 410,
    qualifiedRegistrations: 18,
    ctr: 6.7,
    engagementRate: 11.2,
    creativityScore: 92,
    totalScore: 71,
    status: 'Review',
    action: 'KILL',
    isWinner: false,
    reward: 0,
  },
];

// Alias for backwards compatibility
export const DEMO_PAID_EXPERIMENT = DEMO_CREATOR_EXPERIMENT as any;

// Post-Workshop AI Project Competition (₹900 total prize pool)
export const DEMO_WORKSHOP_PROJECTS: import('./types').WorkshopProjectSubmission[] = [
  {
    id: 'proj-1',
    studentName: 'Rahul Verma',
    college: 'Amrita University',
    projectName: 'AI Resume Tailor & Mock Pitcher',
    summary: 'Analyzes target JD, tailors placement resume points, and simulates 3 technical recruiter questions with voice response.',
    functionalityScore: 28, // / 30
    creativityScore: 24,    // / 25
    aiUsageScore: 19,       // / 20
    uxScore: 14,            // / 15
    presentationScore: 9,   // / 10
    totalScore: 94,
    rank: 1,
    reward: 400,
    status: 'Evaluated',
  },
  {
    id: 'proj-2',
    studentName: 'Priya Sharma',
    college: 'VIT University',
    projectName: 'Real-time Voice Code Explainer',
    summary: 'Chrome extension that records student code selection and delivers natural-language architectural walkthroughs.',
    functionalityScore: 27,
    creativityScore: 23,
    aiUsageScore: 19,
    uxScore: 14,
    presentationScore: 8,
    totalScore: 91,
    rank: 2,
    reward: 300,
    status: 'Evaluated',
  },
  {
    id: 'proj-3',
    studentName: 'Arjun Menon',
    college: 'SRM University',
    projectName: 'Campus Placement Quiz Evaluator',
    summary: 'Dynamic mock assessment platform generating college-specific aptitude and DSA questions using LLM fine-tuning.',
    functionalityScore: 26,
    creativityScore: 22,
    aiUsageScore: 18,
    uxScore: 13,
    presentationScore: 9,
    totalScore: 88,
    rank: 3,
    reward: 200,
    status: 'Evaluated',
  },
  {
    id: 'proj-4',
    studentName: 'Divya Nair',
    college: 'BITS Pilani',
    projectName: 'Automated Engineering Lab Summarizer',
    summary: 'Parses raw experiment observation data and writes standard IEEE format lab reports in 60 seconds.',
    functionalityScore: 25,
    creativityScore: 21,
    aiUsageScore: 17,
    uxScore: 13,
    presentationScore: 8,
    totalScore: 84,
    status: 'Evaluated',
  },
  {
    id: 'proj-5',
    studentName: 'Sneha Pillai',
    college: 'NIT Trichy',
    projectName: 'Multi-modal Study Flashcard Bot',
    summary: 'Extracts textbook diagrams and notes into spaced-repetition mobile study cards with audio explanations.',
    functionalityScore: 24,
    creativityScore: 21,
    aiUsageScore: 16,
    uxScore: 12,
    presentationScore: 8,
    totalScore: 81,
    status: 'Evaluated',
  },
];

export const DEMO_REWARDS_CONFIG: import('./types').RewardsConfig = {
  creatorChallengeReward: {
    amount: 300,
    condition: 'Top performing creator based on Qualified Registrations (60%), CTR (20%), Engagement (10%), Creativity (10%)',
  },
  referralRewards: [
    { rank: 1, amount: 250, condition: '#1 Top Referrer (Verified unique registrations only)' },
    { rank: 2, amount: 150, condition: '#2 Top Referrer (Verified unique registrations only)' },
    { rank: 3, amount: 100, condition: '#3 Top Referrer (Verified unique registrations only)' },
  ],
  competitionRewards: [
    { rank: 1, amount: 400, condition: '#1 Best AI Project (Post-workshop project submission)' },
    { rank: 2, amount: 300, condition: '#2 Runner-up AI Project' },
    { rank: 3, amount: 200, condition: '#3 Second Runner-up AI Project' },
  ],
  evaluationCriteria: [
    { criterion: 'Functionality', weight: 30, desc: 'Working code, clean execution, and real-time response.' },
    { criterion: 'Creativity & Novelty', weight: 25, desc: 'Originality of use case and real utility for engineering students.' },
    { criterion: 'AI Integration', weight: 20, desc: 'Effective prompt architecture, API usage, or model chaining.' },
    { criterion: 'User Experience (UX)', weight: 15, desc: 'Intuitive interface, mobile responsiveness, and clean layout.' },
    { criterion: 'Presentation & Defense', weight: 10, desc: 'Concise explanation, clear demo video, and code documentation.' },
  ],
};

export const DEMO_EXPERIMENTS: Experiment[] = [
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

export const DEMO_CHANNEL_DECISIONS: ChannelDecisionEntry[] = [
  {
    id: 'cd1',
    channel: 'Campus Captains',
    plannedRegistrations: 200,
    qualifiedRegistrations: 184,
    cost: 0,
    conversionRate: 28.5,
    qualitySignal: 'High (Direct college placement WhatsApp groups; 91% qualification rate)',
    decision: 'SCALE',
    why: 'Campus captains have authentic local trust in placement groups that cold outreach cannot match.',
    nextAction: 'Recruit and onboard 5 additional captains in Tier-2 colleges across AP, Telangana, and Karnataka.',
    isSimulated: true,
  },
  {
    id: 'cd2',
    channel: 'Verified Referrals',
    plannedRegistrations: 150,
    qualifiedRegistrations: 132,
    cost: 500,
    conversionRate: 22.4,
    qualitySignal: 'High (Anti-fraud gated: requires 2 verified unique student registrations before unlock)',
    decision: 'SCALE',
    why: 'Low friction peer-to-peer loop with verified email protection delivers ₹3.79 CAC per qualified student.',
    nextAction: 'Keep ₹500 referral pool active; feature unlocked repository starter kit upon 2nd verification.',
    isSimulated: true,
  },
  {
    id: 'cd3',
    channel: 'WhatsApp / Telegram Communities',
    plannedRegistrations: 100,
    qualifiedRegistrations: 78,
    cost: 0,
    conversionRate: 14.2,
    qualitySignal: 'Moderate (Organic tech groups show higher drop-off than captain-moderated placement chats)',
    decision: 'CONTINUE',
    why: 'Zero cash expenditure with healthy volume, but requires departmental club leads to prevent spamming.',
    nextAction: 'Continue organic seeding; prioritize placement prep and competitive programming groups.',
    isSimulated: true,
  },
  {
    id: 'cd4',
    channel: 'Instagram / LinkedIn / Creators',
    plannedRegistrations: 50,
    qualifiedRegistrations: 42,
    cost: 300,
    conversionRate: 12.9,
    qualitySignal: 'Variable (Portfolio walkthroughs delivered 12.9% CVR vs 4.4% for tech meme formats)',
    decision: 'ITERATE',
    why: 'Creator B proved outcome-first walkthroughs drive high qualification (31 regs), while meme formats wasted reach.',
    nextAction: 'Enforce portfolio project demo creative brief; discontinue vanity meme partnerships.',
    isSimulated: true,
  },
  {
    id: 'cd5',
    channel: 'Paid Ads',
    plannedRegistrations: 25,
    qualifiedRegistrations: 8,
    cost: 200,
    conversionRate: 3.2,
    qualitySignal: 'Poor (High cold traffic drop-off; low intent without campus peer validation)',
    decision: 'KILL',
    why: 'Simulation test tranche showed CAC >₹25 per qualified student vs <₹2 across organic peer channels on a ₹2,000 budget.',
    nextAction: 'Stop all paid ad spend; protect 100% of remaining funds for student prize pools and referral rewards.',
    isSimulated: true,
  },
];

export const DEMO_DECISION_LOGS: DecisionLog[] = [
  {
    id: 'dl1',
    observation: 'Direct placement WhatsApp broadcasts from student captains demonstrated higher observed engagement than generic student community announcements in testing phases.',
    decision: 'Direct zero budget to cold paid ads; instead fund student-driven incentives (₹300 creator challenge prize, ₹500 referral rewards, and ₹900 post-workshop project prizes).',
    reason: 'Campus captains and student peers possess localized trust and verified placement WhatsApp group access that cold social ads cannot replicate.',
    frameworkAction: 'SCALE',
    status: 'testing',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    impact: 'Expected impact: Deliver ~200 registrations across 25 captains and 150 referrals with zero paid ad waste.',
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
  },
];

export const ASSUMPTION_CHECKS = [
  {
    id: 'ac1',
    assumption: 'Campus Captain Productivity',
    expectedValue: '8 registrations / captain',
    riskLevel: 'HIGH' as const,
    validationMethod: 'Test with 3 pilot captains across Amrita, VIT, and SRM before Day 3.',
    currentStatus: 'Pilot active with 4 captains (simulation phase)',
  },
  {
    id: 'ac2',
    assumption: 'Referral Rate (K-Factor)',
    expectedValue: '0.25 (1 in 4 students refers a friend)',
    riskLevel: 'MEDIUM' as const,
    validationMethod: 'Measure referral conversion rate on first 50 verified registrations.',
    currentStatus: 'Awaiting initial live traffic validation',
  },
  {
    id: 'ac3',
    assumption: 'Project Passport Conversion (Passport → Reg)',
    expectedValue: '25% completion rate',
    riskLevel: 'MEDIUM' as const,
    validationMethod: 'Monitor funnel drop-off between passport generation and registration form submit.',
    currentStatus: 'Interactive wizard prototype deployed',
  },
  {
    id: 'ac4',
    assumption: 'Blended Acquisition Efficiency within Budget',
    expectedValue: '≤ ₹4.00 per registration (₹2,000 / 500 planning target)',
    riskLevel: 'HIGH' as const,
    validationMethod: 'Cap creator prize at ₹300 fixed reward; judge on qualified registrations (60%) rather than vanity views.',
    currentStatus: 'Budget locked: ₹300 creator + ₹500 referral + ₹900 workshop competition + ₹300 contingency',
  },
];


export function seedDemoData(): void {
  // Clear any existing simulated data first
  clearSimulatedData();

  // Seed campuses
  DEMO_CAMPUSES.forEach(saveCampus);

  // Seed captains
  DEMO_CAPTAINS.forEach(saveCaptain);

  // Seed registrations
  DEMO_REGISTRATIONS.forEach(saveRegistration);

  // Seed referrals
  DEMO_REFERRALS.forEach(saveReferral);

  // Seed experiments
  saveExperiments(DEMO_EXPERIMENTS);

  // Seed decision logs
  saveDecisionLogs(DEMO_DECISION_LOGS);
}

export function isDemoDataSeeded(): boolean {
  const regs = getRegistrations();
  const campuses = getCampuses();
  const captains = getCaptains();
  const referrals = getReferrals();
  return regs.some(r => r.isSimulated) ||
    campuses.some(c => c.isSimulated) ||
    captains.some(c => c.isSimulated) ||
    referrals.some(r => r.isSimulated);
}
