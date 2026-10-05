// Storage layer — works with localStorage, easily replaceable with Supabase
import type {
  Registration, Campus, CampusCaptain, ProjectPassport,
  AnalyticsEvent, Referral, Experiment, DecisionLog, SharerProfile
} from './types';

const KEYS = {
  REGISTRATIONS: 'ai60_registrations',
  CAMPUSES: 'ai60_campuses',
  CAPTAINS: 'ai60_captains',
  PASSPORTS: 'ai60_passports',
  EVENTS: 'ai60_events',
  REFERRALS: 'ai60_referrals',
  SHARER_PROFILE: 'ai60_sharer_profile',
  EXPERIMENTS: 'ai60_experiments',
  DECISION_LOGS: 'ai60_decision_logs',
  SESSION_ID: 'ai60_session_id',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// ─── Registrations ────────────────────────────────────────────────────────────
export const getRegistrations = (): Registration[] =>
  getItem<Registration[]>(KEYS.REGISTRATIONS, []);

export const saveRegistration = (reg: Registration): void => {
  const all = getRegistrations();
  // Prevent duplicates
  if (all.find(r => r.email.toLowerCase() === reg.email.toLowerCase())) return;
  setItem(KEYS.REGISTRATIONS, [...all, reg]);
};

export const emailExists = (email: string): boolean =>
  getRegistrations().some(r => r.email.toLowerCase() === email.toLowerCase());

// ─── Campuses ─────────────────────────────────────────────────────────────────
export const getCampuses = (): Campus[] =>
  getItem<Campus[]>(KEYS.CAMPUSES, []);

export const saveCampus = (campus: Campus): void => {
  const all = getCampuses();
  const idx = all.findIndex(c => c.code === campus.code);
  if (idx >= 0) { all[idx] = campus; setItem(KEYS.CAMPUSES, all); }
  else setItem(KEYS.CAMPUSES, [...all, campus]);
};

export const incrementCampusRegistrations = (campusCode: string): void => {
  const all = getCampuses();
  const idx = all.findIndex(c => c.code === campusCode);
  if (idx >= 0) {
    all[idx].registrations = (all[idx].registrations || 0) + 1;
    setItem(KEYS.CAMPUSES, all);
  }
};

// ─── Campus Captains ─────────────────────────────────────────────────────────
export const getCaptains = (): CampusCaptain[] =>
  getItem<CampusCaptain[]>(KEYS.CAPTAINS, []);

export const saveCaptain = (captain: CampusCaptain): void => {
  const all = getCaptains();
  if (all.find(c => c.email.toLowerCase() === captain.email.toLowerCase())) return;
  setItem(KEYS.CAPTAINS, [...all, captain]);
};

// ─── Passports ───────────────────────────────────────────────────────────────
export const getPassports = (): ProjectPassport[] =>
  getItem<ProjectPassport[]>(KEYS.PASSPORTS, []);

export const savePassport = (passport: ProjectPassport): void => {
  const all = getPassports();
  setItem(KEYS.PASSPORTS, [...all, passport]);
};

// ─── Events ──────────────────────────────────────────────────────────────────
export const getEvents = (): AnalyticsEvent[] =>
  getItem<AnalyticsEvent[]>(KEYS.EVENTS, []);

export const trackEvent = (event: AnalyticsEvent): void => {
  const all = getEvents();
  setItem(KEYS.EVENTS, [...all.slice(-1000), event]); // cap at 1000
};

// ─── Referrals ───────────────────────────────────────────────────────────────
export const getReferrals = (): Referral[] =>
  getItem<Referral[]>(KEYS.REFERRALS, []);

export const saveReferral = (referral: Referral): void => {
  const all = getReferrals();
  // Prevent duplicate referral registration IDs
  if (all.some(r => r.registrationId && r.registrationId === referral.registrationId)) return;
  setItem(KEYS.REFERRALS, [...all, referral]);
};

// ─── Sharer Profile (No signup needed) ───────────────────────────────────────
export const getSharerProfile = (): SharerProfile | null =>
  getItem<SharerProfile | null>(KEYS.SHARER_PROFILE, null);

export const saveSharerProfile = (profile: SharerProfile): void =>
  setItem(KEYS.SHARER_PROFILE, profile);

// ─── Experiments ─────────────────────────────────────────────────────────────
export const getExperiments = (): Experiment[] =>
  getItem<Experiment[]>(KEYS.EXPERIMENTS, []);

export const saveExperiments = (experiments: Experiment[]): void =>
  setItem(KEYS.EXPERIMENTS, experiments);

// ─── Decision Logs ───────────────────────────────────────────────────────────
export const getDecisionLogs = (): DecisionLog[] =>
  getItem<DecisionLog[]>(KEYS.DECISION_LOGS, []);

export const saveDecisionLogs = (logs: DecisionLog[]): void =>
  setItem(KEYS.DECISION_LOGS, logs);

// ─── Session ─────────────────────────────────────────────────────────────────
export const getSessionId = (): string => {
  let id = localStorage.getItem(KEYS.SESSION_ID);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(KEYS.SESSION_ID, id);
  }
  return id;
};

// ─── Demo / Reset ────────────────────────────────────────────────────────────
export const clearAllData = (): void => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};

export const clearSimulatedData = (): void => {
  const regs = getRegistrations().filter(r => !r.isSimulated);
  setItem(KEYS.REGISTRATIONS, regs);
  const campuses = getCampuses().filter(c => !c.isSimulated);
  setItem(KEYS.CAMPUSES, campuses);
  const captains = getCaptains().filter(c => !c.isSimulated);
  setItem(KEYS.CAPTAINS, captains);
  const referrals = getReferrals().filter(r => !r.isSimulated);
  setItem(KEYS.REFERRALS, referrals);
};
