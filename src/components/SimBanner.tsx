import React from 'react';
import { useApp } from '../context/AppContext';

export default function SimBanner() {
  const { state } = useApp();
  const hasSimulated = state.registrations.some(r => r.isSimulated);

  if (!hasSimulated) return null;

  return (
    <div className="sim-banner">
      <span>⚠</span>
      <span>SIMULATION DATA — NOT ACTUAL CAMPAIGN RESULTS</span>
    </div>
  );
}
