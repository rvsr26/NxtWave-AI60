import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppState, Registration, Campus, ProjectPassport, CampusCaptain } from '../types';
import {
  getRegistrations, getCampuses, getCaptains, getPassports,
  getEvents, getReferrals, saveRegistration, saveCampus,
  saveCaptain, savePassport, incrementCampusRegistrations,
  saveReferral, emailExists, clearSimulatedData, clearAllData
} from '../storage';
import { seedDemoData, isDemoDataSeeded } from '../demoData';
import { Analytics } from '../analytics';

interface AppContextType {
  state: AppState;
  setCurrentPassport: (passport: ProjectPassport | undefined) => void;
  setCurrentRegistration: (reg: Registration | undefined) => void;
  register: (data: Omit<Registration, 'id' | 'referralCode' | 'registeredAt'>) => Promise<{ success: boolean; error?: string }>;
  addCampus: (campus: Campus) => void;
  addCaptain: (captain: CampusCaptain) => void;
  addPassport: (passport: ProjectPassport) => void;
  toggleDemo: () => void;
  seedDemo: () => void;
  resetDemo: () => void;
  clearAll: () => void;
  refresh: () => void;
  isDemo: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

function generateReferralCode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
  return `${clean}60`;
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

  // Auto-seed demo on first load if no data
  useEffect(() => {
    Analytics.landingView();
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
  }, []);

  const refresh = useCallback(() => {
    setState(prev => ({
      ...prev,
      registrations: getRegistrations(),
      campuses: getCampuses(),
      captains: getCaptains(),
      passports: getPassports(),
      events: getEvents(),
      referrals: getReferrals(),
    }));
  }, []);

  const setCurrentPassport = useCallback((passport: ProjectPassport | undefined) => {
    setState(prev => ({ ...prev, currentPassport: passport }));
  }, []);

  const setCurrentRegistration = useCallback((reg: Registration | undefined) => {
    setState(prev => ({ ...prev, currentRegistration: reg }));
  }, []);

  const register = useCallback(async (
    data: Omit<Registration, 'id' | 'referralCode' | 'registeredAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    // Validation
    // Validation: Duplicate Email Check
    if (emailExists(data.email)) {
      return { success: false, error: 'This email is already registered. Duplicate submissions are prevented.' };
    }

    // Anti-Fraud: Self-referral prevention (both code match and existing email match)
    const urlParams = getUrlParams();
    const referredCode = data.referredBy || urlParams.ref;
    const cleanSelfCode = generateReferralCode(data.name);

    if (referredCode && referredCode.toUpperCase() === cleanSelfCode.toUpperCase()) {
      return { success: false, error: 'Self-referral detected. You cannot use your own referral code.' };
    }

    // Check if referrer code exists in our system
    const existingReferrer = getRegistrations().find(r => r.referralCode.toUpperCase() === (referredCode || '').toUpperCase());
    if (existingReferrer && existingReferrer.email.toLowerCase() === data.email.toLowerCase()) {
      return { success: false, error: 'Self-referral detected via email match.' };
    }

    const reg: Registration = {
      ...data,
      graduationYear: '2027',
      id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      referralCode: cleanSelfCode,
      registeredAt: new Date().toISOString(),
      referredBy: referredCode,
      campus: urlParams.campus || data.campus,
      source: urlParams.src || data.source || 'direct',
    };

    saveRegistration(reg);

    // Track Verified Referral (only if referrer exists and no duplicate referral for this email)
    if (reg.referredBy) {
      const existingRefs = getReferrals();
      const isDuplicateReferral = existingRefs.some(
        rf => rf.referrerCode.toUpperCase() === reg.referredBy!.toUpperCase() &&
              rf.referreeEmail.toLowerCase() === reg.email.toLowerCase()
      );

      if (!isDuplicateReferral) {
        saveReferral({
          id: `ref_${Date.now()}`,
          referrerCode: reg.referredBy,
          referreeEmail: reg.email,
          registrationId: reg.id,
          createdAt: reg.registeredAt,
          isVerified: true, // Requires complete, unique registration
        });
        Analytics.referralRegistration(reg.referredBy);
      }
    }

    // Update campus count
    if (reg.campus) {
      incrementCampusRegistrations(reg.campus);
    }

    Analytics.registrationCompleted(reg.college, reg.source);

    setState(prev => ({
      ...prev,
      registrations: getRegistrations(),
      campuses: getCampuses(),
      referrals: getReferrals(),
      currentRegistration: reg,
    }));

    return { success: true };
  }, []);

  const addCampus = useCallback((campus: Campus) => {
    saveCampus(campus);
    refresh();
  }, [refresh]);

  const addCaptain = useCallback((captain: CampusCaptain) => {
    saveCaptain(captain);
    refresh();
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

  const seedDemo = useCallback(() => {
    seedDemoData();
    refresh();
  }, [refresh]);

  const resetDemo = useCallback(() => {
    clearSimulatedData();
    refresh();
  }, [refresh]);

  const clearAll = useCallback(() => {
    clearAllData();
    refresh();
  }, [refresh]);

  return (
    <AppContext.Provider value={{
      state,
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
