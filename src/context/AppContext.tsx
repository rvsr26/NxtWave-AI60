import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppState, Registration, Campus, ProjectPassport, CampusCaptain, Referral, AnalyticsEvent, SharerProfile } from '../types';
import {
  getRegistrations, getCampuses, getCaptains, getPassports,
  getEvents, getReferrals, saveRegistration, saveCampus,
  saveCaptain, savePassport, incrementCampusRegistrations,
  saveReferral, emailExists, clearSimulatedData, clearAllData,
  getSharerProfile, saveSharerProfile
} from '../storage';
import { seedDemoData, isDemoDataSeeded } from '../demoData';
import { Analytics } from '../analytics';
import { api, ApiError, isBackendOnline } from '../services/api';

interface AppContextType {
  state: AppState;
  sharerProfile: SharerProfile;
  updateSharerProfile: (profile: SharerProfile) => void;
  getEffectiveSharer: () => { name: string; college: string; code: string; isRegistered: boolean; isCustomized: boolean };
  setCurrentPassport: (passport: ProjectPassport | undefined) => void;
  setCurrentRegistration: (reg: Registration | undefined) => void;
  register: (data: Omit<Registration, 'id' | 'referralCode' | 'registeredAt'>) => Promise<{ success: boolean; error?: string }>;
  addCampus: (campus: Campus) => Promise<void>;
  addCaptain: (captain: CampusCaptain) => Promise<void>;
  addPassport: (passport: ProjectPassport) => void;
  toggleDemo: () => void;
  seedDemo: () => Promise<void>;
  resetDemo: () => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
  isDemo: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function generateReferralCode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
  return clean ? `${clean}60` : `STUDENT${Math.floor(10 + Math.random() * 90)}60`;
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    ref: params.get('ref') || undefined,
    campus: params.get('campus') || undefined,
    src: params.get('src') || undefined,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    registrations: getRegistrations(),
    campuses: getCampuses(),
    captains: getCaptains(),
    passports: getPassports(),
    events: getEvents(),
    referrals: getReferrals(),
    currentPassport: undefined,
    currentRegistration: undefined,
    isDemo: false,
    urlParams: getUrlParams(),
  }));

  const [sharerProfile, setSharerProfileState] = useState<SharerProfile>(() => {
    const stored = getSharerProfile();
    if (stored) return stored;
    const initial: SharerProfile = {
      name: 'Student Ambassador',
      college: 'Engineering College',
      sharerCode: 'STUDENT60',
      createdAt: new Date().toISOString(),
      customized: false,
    };
    saveSharerProfile(initial);
    return initial;
  });

  const updateSharerProfile = useCallback((profile: SharerProfile) => {
    saveSharerProfile(profile);
    setSharerProfileState(profile);
    // Asynchronously save to MongoDB
    api.referrals.saveProfile({
      name: profile.name,
      college: profile.college,
      referralCode: profile.sharerCode,
    }).catch(err => {
      console.warn('[AppContext] Could not persist referral profile to MongoDB:', err);
    });
  }, []);

  const getEffectiveSharer = useCallback(() => {
    if (state.currentRegistration) {
      return {
        name: state.currentRegistration.name,
        college: state.currentRegistration.college,
        code: state.currentRegistration.referralCode,
        isRegistered: true,
        isCustomized: true,
      };
    }
    return {
      name: sharerProfile.name,
      college: sharerProfile.college,
      code: sharerProfile.sharerCode,
      isRegistered: false,
      isCustomized: !!sharerProfile.customized,
    };
  }, [state.currentRegistration, sharerProfile]);

  // Fetch live MongoDB state from Backend API
  const syncFromBackend = useCallback(async () => {
    if (!isBackendOnline()) return;
    try {
      const [regsRes, campusesRes, captainsRes, passportsRes, referralsRes, eventsRes] =
        await Promise.allSettled([
          api.registrations.getAll(true),
          api.campuses.getAll(),
          api.captains.getAll(),
          api.passports.getAll(),
          api.referrals.getAll(true),
          api.analytics.getEvents(200),
        ]);

      setState(prev => {
        const nextState = { ...prev };

        if (regsRes.status === 'fulfilled' && regsRes.value.registrations) {
          nextState.registrations = regsRes.value.registrations;
          try {
            localStorage.setItem('ai60_registrations', JSON.stringify(regsRes.value.registrations));
          } catch {}
        }

        if (campusesRes.status === 'fulfilled' && campusesRes.value.campuses) {
          nextState.campuses = campusesRes.value.campuses;
          try {
            localStorage.setItem('ai60_campuses', JSON.stringify(campusesRes.value.campuses));
          } catch {}
        }

        if (captainsRes.status === 'fulfilled' && captainsRes.value.captains) {
          nextState.captains = captainsRes.value.captains;
          try {
            localStorage.setItem('ai60_captains', JSON.stringify(captainsRes.value.captains));
          } catch {}
        }

        if (passportsRes.status === 'fulfilled' && passportsRes.value.passports) {
          nextState.passports = passportsRes.value.passports;
          try {
            localStorage.setItem('ai60_passports', JSON.stringify(passportsRes.value.passports));
          } catch {}
        }

        if (referralsRes.status === 'fulfilled' && referralsRes.value.referrals) {
          nextState.referrals = referralsRes.value.referrals;
          try {
            localStorage.setItem('ai60_referrals', JSON.stringify(referralsRes.value.referrals));
          } catch {}
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.events) {
          nextState.events = eventsRes.value.events as AnalyticsEvent[];
          try {
            localStorage.setItem('ai60_events', JSON.stringify(eventsRes.value.events));
          } catch {}
        }

        return nextState;
      });
    } catch (e) {
      console.warn('[AppContext] Backend sync failed, using cached state', e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    Analytics.landingView();

    // Check if initial baseline seed needed locally
    if (!isDemoDataSeeded() && getRegistrations().length === 0) {
      seedDemoData();
      setState(prev => ({
        ...prev,
        registrations: getRegistrations(),
        campuses: getCampuses(),
        captains: getCaptains(),
        referrals: getReferrals(),
      }));
    }

    // Hydrate from MongoDB API
    syncFromBackend();
  }, [syncFromBackend]);

  const refresh = useCallback(async () => {
    await syncFromBackend();
    setState(prev => ({
      ...prev,
      registrations: getRegistrations(),
      campuses: getCampuses(),
      captains: getCaptains(),
      passports: getPassports(),
      events: getEvents(),
      referrals: getReferrals(),
    }));
  }, [syncFromBackend]);

  const setCurrentPassport = useCallback((passport: ProjectPassport | undefined) => {
    setState(prev => ({ ...prev, currentPassport: passport }));
  }, []);

  const setCurrentRegistration = useCallback((reg: Registration | undefined) => {
    setState(prev => ({ ...prev, currentRegistration: reg }));
  }, []);

  const register = useCallback(async (
    data: Omit<Registration, 'id' | 'referralCode' | 'registeredAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    const urlParams = getUrlParams();
    const referredCode = data.referredBy || urlParams.ref;
    const cleanSelfCode = generateReferralCode(data.name);

    // Client-side quick check
    if (referredCode && referredCode.toUpperCase() === cleanSelfCode.toUpperCase()) {
      return { success: false, error: 'Self-referral detected. You cannot use your own referral code.' };
    }

    const payload = {
      name: data.name,
      email: data.email,
      college: data.college,
      branch: data.branch,
      interest: data.interest,
      referredBy: referredCode || undefined,
      campus: urlParams.campus || data.campus || undefined,
      source: urlParams.src || data.source || 'direct',
      passportId: data.passportId,
    };

    try {
      // 1. Call Backend MongoDB API
      const res = await api.registrations.create(payload);

      if (res.success && res.registration) {
        // Save to local cache as well
        saveRegistration(res.registration);

        if (res.registration.referredBy) {
          const cleanRefCode = res.registration.referredBy.trim().toUpperCase();
          const newRef: Referral = {
            id: `ref_${Date.now()}`,
            referrerCode: cleanRefCode,
            referreeEmail: res.registration.email,
            referreeName: res.registration.name,
            referreeCollege: res.registration.college,
            registrationId: res.registration.id,
            createdAt: res.registration.registeredAt,
            isVerified: true,
            isSimulated: false,
          };
          saveReferral(newRef);
          Analytics.referralRegistration(cleanRefCode);
        }

        if (res.registration.campus) {
          incrementCampusRegistrations(res.registration.campus);
        }

        Analytics.registrationCompleted(res.registration.college, res.registration.source);

        setState(prev => ({
          ...prev,
          registrations: [res.registration, ...prev.registrations.filter(r => r.email.toLowerCase() !== res.registration.email.toLowerCase())],
          referrals: getReferrals(),
          currentRegistration: res.registration,
        }));

        // Refresh live data from backend
        syncFromBackend();

        return { success: true };
      }

      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409) {
          return { success: false, error: 'This email is already registered. Duplicate submissions are prevented.' };
        }
        if (err.statusCode !== 0) {
          return { success: false, error: err.message };
        }
        // Status code 0 means network offline / backend unreachable
        return {
          success: false,
          error: 'Backend API connection unavailable. Please check backend deployment.',
        };
      }
      if (emailExists(data.email)) {
        return { success: false, error: 'This email is already registered. Duplicate submissions are prevented.' };
      }

      const fallbackReg: Registration = {
        ...data,
        graduationYear: '2027',
        id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        referralCode: cleanSelfCode,
        registeredAt: new Date().toISOString(),
        referredBy: referredCode ? referredCode.trim().toUpperCase() : undefined,
        campus: urlParams.campus || data.campus,
        source: urlParams.src || data.source || 'direct',
      };

      saveRegistration(fallbackReg);

      let createdReferral: Referral | undefined;
      if (fallbackReg.referredBy) {
        const cleanRefCode = fallbackReg.referredBy.trim().toUpperCase();
        createdReferral = {
          id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          referrerCode: cleanRefCode,
          referreeEmail: fallbackReg.email,
          referreeName: fallbackReg.name,
          referreeCollege: fallbackReg.college,
          registrationId: fallbackReg.id,
          createdAt: fallbackReg.registeredAt,
          isVerified: true,
          isSimulated: false,
        };
        saveReferral(createdReferral);
        Analytics.referralRegistration(cleanRefCode);
      }

      if (fallbackReg.campus) {
        incrementCampusRegistrations(fallbackReg.campus);
      }

      Analytics.registrationCompleted(fallbackReg.college, fallbackReg.source);

      setState(prev => ({
        ...prev,
        registrations: [...prev.registrations, fallbackReg],
        referrals: createdReferral ? [...prev.referrals, createdReferral] : prev.referrals,
        currentRegistration: fallbackReg,
      }));

      return { success: true };
    }
  }, [syncFromBackend]);

  const addCampus = useCallback(async (campus: Campus) => {
    saveCampus(campus);
    try {
      await api.campuses.create({ name: campus.name, code: campus.code });
    } catch {}
    await refresh();
  }, [refresh]);

  const addCaptain = useCallback(async (captain: CampusCaptain) => {
    saveCaptain(captain);
    try {
      await api.captains.create({
        name: captain.name,
        email: captain.email,
        college: captain.college,
        whatsapp: captain.whatsapp,
        campusCode: captain.campusCode,
      });
    } catch {}
    await refresh();
  }, [refresh]);

  const addPassport = useCallback((passport: ProjectPassport) => {
    savePassport(passport);
    setState(prev => ({
      ...prev,
      passports: [...prev.passports, passport],
      currentPassport: passport,
    }));
  }, []);

  const toggleDemo = useCallback(() => {
    setState(prev => ({ ...prev, isDemo: !prev.isDemo }));
  }, []);

  const seedDemo = useCallback(async () => {
    try {
      await api.admin.seed();
    } catch {
      seedDemoData();
    }
    await refresh();
  }, [refresh]);

  const resetDemo = useCallback(async () => {
    try {
      await api.admin.clearSimulated();
    } catch {
      clearSimulatedData();
    }
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    try {
      await api.admin.clearAll();
    } catch {
      clearAllData();
    }
    await refresh();
  }, [refresh]);

  return (
    <AppContext.Provider value={{
      state,
      sharerProfile,
      updateSharerProfile,
      getEffectiveSharer,
      setCurrentPassport,
      setCurrentRegistration,
      register,
      addCampus,
      addCaptain,
      addPassport,
      toggleDemo,
      seedDemo,
      resetDemo,
      clearAll,
      refresh,
      isDemo: state.isDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
