import type {
  Registration,
  ProjectPassport,
  Campus,
  CampusCaptain,
  Referral,
  AnalyticsEvent,
  Experiment,
  DecisionLog,
} from '../types';

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';

let isServerOnline = Boolean(API_BASE_URL && API_BASE_URL.trim().length > 0);
let lastOfflineCheck = 0;
const OFFLINE_RETRY_INTERVAL_MS = 60000;

export const isBackendOnline = () => Boolean(API_BASE_URL && isServerOnline);

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // If no backend URL configured or server detected offline, fail-fast without triggering browser network errors
  if (!API_BASE_URL || (!isServerOnline && Date.now() - lastOfflineCheck < OFFLINE_RETRY_INTERVAL_MS)) {
    throw new ApiError('Local storage mode active (using browser storage)', 0);
  }

  const { timeoutMs = 8000, headers, ...rest } = options;
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    isServerOnline = true;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    // Failed fetch / Connection refused -> mark server offline to prevent repetitive browser errors
    isServerOnline = false;
    lastOfflineCheck = Date.now();
    throw new ApiError(error.message || 'Network request failed', 0);
  }
}

// ─── Typed API Methods ────────────────────────────────────────────────────────

export const api = {
  // Health
  health: {
    check: () => request<{ success: boolean; service: string; database: string }>('/health'),
  },

  // Registrations
  registrations: {
    create: (data: {
      name: string;
      email: string;
      college: string;
      branch: string;
      interest: string;
      referredBy?: string;
      campus?: string;
      source?: string;
      passportId?: string;
    }) =>
      request<{
        success: boolean;
        registration: Registration;
        registrationId: string;
        referralCode: string;
      }>('/registrations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getAll: (includeSimulated = true) =>
      request<{ success: boolean; count: number; registrations: Registration[] }>(
        `/registrations?includeSimulated=${includeSimulated}`
      ),

    checkEmail: (email: string) =>
      request<{ success: boolean; available: boolean }>(
        `/registrations/check-email?email=${encodeURIComponent(email)}`
      ),
  },

  // Passports
  passports: {
    generate: (input: {
      branch: string;
      experience: string;
      interest: string;
      domain?: string;
      goal: string;
    }) =>
      request<{ success: boolean; passport: ProjectPassport }>('/passports/generate', {
        method: 'POST',
        body: JSON.stringify(input),
      }),

    getAll: () =>
      request<{ success: boolean; count: number; passports: ProjectPassport[] }>('/passports'),

    getById: (id: string) =>
      request<{ success: boolean; passport: ProjectPassport }>(`/passports/${id}`),
  },

  // Referrals
  referrals: {
    getAll: (includeSimulated = true) =>
      request<{ success: boolean; count: number; referrals: Referral[] }>(
        `/referrals?includeSimulated=${includeSimulated}`
      ),

    getMy: (code: string) =>
      request<{
        success: boolean;
        referralCode: string;
        totalCount: number;
        genuineCount: number;
        referrals: Referral[];
        allReferrals: Referral[];
      }>(`/referrals/my?code=${encodeURIComponent(code)}`),

    saveProfile: (data: { name: string; college: string; referralCode?: string }) =>
      request<{
        success: boolean;
        profile: {
          name: string;
          college: string;
          referralCode: string;
          createdAt: string;
          updatedAt: string;
        };
      }>('/referrals/profiles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getStats: (code: string) =>
      request<{
        success: boolean;
        stats: {
          referralCode: string;
          verifiedCount: number;
          isRewardEligible: boolean;
          rewardThreshold: number;
        };
      }>(`/referrals/${encodeURIComponent(code)}/stats`),

    getLeaderboard: () =>
      request<{ success: boolean; leaderboard: any[] }>('/referrals/leaderboard'),
  },

  // Campuses
  campuses: {
    getAll: () =>
      request<{ success: boolean; count: number; campuses: Campus[] }>('/campuses'),

    getByCode: (code: string) =>
      request<{ success: boolean; campus: Campus }>(`/campuses/${encodeURIComponent(code)}`),

    create: (data: { name: string; code: string }) =>
      request<{ success: boolean; campus: Campus }>('/campuses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getLeaderboard: () =>
      request<{ success: boolean; leaderboard: Campus[] }>('/campuses/leaderboard'),
  },

  // Campus Captains
  captains: {
    getAll: () =>
      request<{ success: boolean; count: number; captains: CampusCaptain[] }>('/captains'),

    create: (data: {
      name: string;
      email: string;
      college: string;
      whatsapp?: string;
      campusCode: string;
    }) =>
      request<{ success: boolean; captain: CampusCaptain }>('/captains', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Analytics
  analytics: {
    track: async (event: Omit<AnalyticsEvent, 'id'>) => {
      if (!API_BASE_URL || (!isServerOnline && Date.now() - lastOfflineCheck < OFFLINE_RETRY_INTERVAL_MS)) {
        return { success: true, event: event as AnalyticsEvent };
      }
      try {
        return await request<{ success: boolean; event: AnalyticsEvent }>('/analytics/events', {
          method: 'POST',
          body: JSON.stringify(event),
        });
      } catch {
        return { success: false, event: event as AnalyticsEvent };
      }
    },

    getEvents: (limit = 200, eventType?: string) =>
      request<{ success: boolean; count: number; events: AnalyticsEvent[] }>(
        `/analytics/events?limit=${limit}${eventType ? `&event=${encodeURIComponent(eventType)}` : ''}`
      ),
  },

  // Growth Dashboard
  growth: {
    getOverview: () =>
      request<{ success: boolean; data: any }>('/growth/overview'),

    getFunnel: () =>
      request<{ success: boolean; simulationNotice: string; funnel: any[] }>('/growth/funnel'),

    getSources: () =>
      request<{ success: boolean; sources: any[] }>('/growth/sources'),

    getReferrals: () =>
      request<{ success: boolean; metrics: any }>('/growth/referrals'),

    getCampuses: () =>
      request<{ success: boolean; campuses: Campus[]; totals: any }>('/growth/campuses'),
  },

  // Experiments
  experiments: {
    getAll: () =>
      request<{ success: boolean; count: number; experiments: Experiment[] }>('/experiments'),

    update: (id: string, updates: Partial<Experiment>) =>
      request<{ success: boolean; experiment: Experiment }>(`/experiments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  // Decisions
  decisions: {
    getAll: () =>
      request<{ success: boolean; count: number; decisions: DecisionLog[] }>('/decisions'),

    create: (data: {
      observation: string;
      decision: string;
      reason: string;
      frameworkAction: string;
      impact?: string;
    }) =>
      request<{ success: boolean; decision: DecisionLog }>('/decisions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Admin
  admin: {
    getOverview: () =>
      request<{ success: boolean; data: any }>('/admin/overview'),

    seed: () =>
      request<{ success: boolean; message: string }>('/admin/seed', { method: 'POST' }),

    clearSimulated: () =>
      request<{ success: boolean; message: string }>('/admin/clear-simulated', { method: 'POST' }),

    clearAll: () =>
      request<{ success: boolean; message: string }>('/admin/clear-all', { method: 'POST' }),
  },
};
