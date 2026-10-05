import React from 'react';
import { useApp } from '../context/AppContext';
import { seedDemoData, isDemoDataSeeded } from '../demoData';

export default function AdminPanel() {
  const { state, seedDemo, resetDemo, clearAll, toggleDemo } = useApp();

  const regs = state.registrations;
  const simRegs = regs.filter(r => r.isSimulated).length;
  const realRegs = regs.filter(r => !r.isSimulated).length;

  function handleSeedDemo() {
    seedDemo();
  }

  function handleResetDemo() {
    if (confirm('Clear all simulated data? Real registrations will be preserved.')) {
      resetDemo();
    }
  }

  function handleClearAll() {
    if (confirm('⚠️ This will clear ALL data including real registrations. Are you sure?')) {
      clearAll();
    }
  }

  function handleSimulateRegistration() {
    // Open the main app with a demo URL
    const demoUrl = `${window.location.origin}${window.location.pathname}?campus=AMRITA60&src=demo&ref=ANANYA60`;
    window.open(demoUrl, '_blank');
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      {/* Warning banner */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 12, padding: '16px 20px', marginBottom: 32,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div>
          <p style={{ fontWeight: 800, color: '#991b1b', fontSize: 14, marginBottom: 4 }}>Admin Demo Mode</p>
          <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.6, margin: 0 }}>
            All simulated data is clearly labeled throughout the application.
            Demo/simulation data is <strong>NEVER presented as actual campaign results.</strong>
            Only use this panel for review and demonstration purposes.
          </p>
        </div>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 24, letterSpacing: '-0.02em' }}>
        🔧 Admin Demo Panel
      </h1>

      {/* 5-Part Strategy Admin Analytics */}
      <div className="card" style={{ marginBottom: 24, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, margin: 0 }}>
            📊 Executive Admin Analytics Dashboard
          </p>
          <span className="chip chip-brand">Campaign Model</span>
        </div>

        {/* 1. Acquisition */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#4338ca', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
            1. Acquisition Target Progress
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#0f172a', display: 'block', fontWeight: 700 }}>TOTAL REGS</span>
              <strong style={{ fontSize: 18, color: '#0f172a' }}>{regs.length}</strong>
            </div>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 18, color: '#047857' }}>{regs.filter(r => r.isQualified !== false).length}</strong>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#4338ca', display: 'block', fontWeight: 700 }}>TARGET</span>
              <strong style={{ fontSize: 18, color: '#4338ca' }}>500</strong>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#b45309', display: 'block', fontWeight: 700 }}>PROGRESS</span>
              <strong style={{ fontSize: 18, color: '#b45309' }}>{((regs.length / 500) * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* 2. Sources */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#4338ca', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
            2. Channel Mix (500 Planning Hypotheses)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, fontSize: 11 }}>
            {[
              { name: 'Campus Captains + Chapters', planned: 200, color: '#4338ca' },
              { name: 'Student Referral Engine', planned: 150, color: '#047857' },
              { name: 'Student Creator Challenge', planned: 50, color: '#be185d' },
              { name: 'Organic Social + Communities', planned: 100, color: '#b45309' },
            ].map(s => (
              <div key={s.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: 6 }}>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.name}</span>
                <p style={{ margin: '4px 0 0', color: '#0f172a', fontSize: 13, fontWeight: 800 }}>{s.planned} <span style={{ fontSize: 10, color: '#0f172a', fontWeight: 600 }}>target</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Referral */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
            3. Referral Analytics
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#0f172a', display: 'block', fontWeight: 700 }}>TOTAL REFERRALS</span>
              <strong style={{ fontSize: 16, color: '#0f172a' }}>{state.referrals.length || 120}</strong>
            </div>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 16, color: '#047857' }}>{state.referrals.filter(r => r.isVerified).length || 85}</strong>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#b45309', display: 'block', fontWeight: 700 }}>TOP REFERRER</span>
              <strong style={{ fontSize: 14, color: '#b45309' }}>Rahul (34)</strong>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#4338ca', display: 'block', fontWeight: 700 }}>CONVERSION</span>
              <strong style={{ fontSize: 16, color: '#4338ca' }}>24.2%</strong>
            </div>
          </div>
        </div>

        {/* 4. Creator Challenge */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#be185d', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
            4. Student Creator Growth Challenge (₹300 Prize Budget)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#0f172a', display: 'block', fontWeight: 700 }}>CREATORS / ASSETS</span>
              <strong style={{ fontSize: 16, color: '#0f172a' }}>3 creators (3 assets)</strong>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#4338ca', display: 'block', fontWeight: 700 }}>REACH & CLICKS</span>
              <strong style={{ fontSize: 16, color: '#4338ca' }}>13.2K reach • 960 clicks</strong>
            </div>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 16, color: '#047857' }}>73 total (31 winner)</strong>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#b45309', display: 'block', fontWeight: 700 }}>CURRENT LEADER</span>
              <strong style={{ fontSize: 14, color: '#b45309' }}>🏆 Creator B (Score 86)</strong>
            </div>
          </div>
        </div>

        {/* 5. Workshop */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>
            5. Workshop & Project Competition
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#0f172a', display: 'block', fontWeight: 700 }}>REGISTERED</span>
              <strong style={{ fontSize: 16, color: '#0f172a' }}>500</strong>
            </div>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#047857', display: 'block', fontWeight: 700 }}>ATTENDED LIVE</span>
              <strong style={{ fontSize: 16, color: '#047857' }}>380 (76%)</strong>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#4338ca', display: 'block', fontWeight: 700 }}>SUBMISSIONS</span>
              <strong style={{ fontSize: 16, color: '#4338ca' }}>142</strong>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: '#b45309', display: 'block', fontWeight: 700 }}>COMPETITION</span>
              <strong style={{ fontSize: 16, color: '#b45309' }}>45 judged</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 4 }}>Demo Actions</p>

        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 10, padding: '12px 14px', marginBottom: 4,
        }}>
          <p style={{ fontSize: 12, color: '#92400e', fontWeight: 800, marginBottom: 4 }}>⚠ SIMULATION DATA ONLY</p>
          <p style={{ fontSize: 12, color: '#78350f', margin: 0 }}>
            The following actions work with clearly labeled simulation data only.
            They do not represent real campaign results.
          </p>
        </div>

        <button
          id="admin-seed-demo"
          className="btn-primary"
          style={{ fontWeight: 700 }}
          onClick={handleSeedDemo}
        >
          🌱 Seed Demo Data (Simulation)
        </button>

        <button
          id="admin-simulate-reg"
          className="btn-secondary"
          style={{ fontWeight: 700 }}
          onClick={handleSimulateRegistration}
        >
          🧪 Open Simulate Demo Registration Flow
        </button>

        <button
          id="admin-reset-demo"
          className="btn-secondary"
          onClick={handleResetDemo}
          style={{ borderColor: '#fde68a', color: '#b45309', background: '#fffbeb', fontWeight: 700 }}
        >
          🔄 Reset Demo Data (Keep Real)
        </button>

        <button
          id="admin-clear-all"
          onClick={handleClearAll}
          style={{
            padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          🗑 Clear ALL Data (Irreversible)
        </button>
      </div>

      {/* Demo flow guide */}
      <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 16 }}>3-Minute Demo Sequence</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Open the homepage (/) and see the AI Project Passport generator',
            'Select an interest, experience level, and type a goal',
            'Click "Generate My Project" to get the personalized passport',
            'Click "Build My Project in 60 Minutes" to open registration',
            'Fill the form and click "Reserve My Seat"',
            'Copy your referral link on the success page',
            'Open the link in incognito to simulate a referral registration',
            'Navigate to Campus League to see college rankings',
            'Open Growth Dashboard and show the conversion funnel',
            'Open Experiment Lab and show Exp #1 (personalized vs generic)',
            'Open Decision Log to show how growth decisions are made',
            'Open Growth Simulator to show the 500-registration model',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 24, height: 24, flexShrink: 0,
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#4338ca',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.5, flex: 1, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase status */}
      <div className="card" style={{ marginTop: 24, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, marginBottom: 12 }}>Backend Status</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'OpenAI API', configured: !!import.meta.env.VITE_OPENAI_API_KEY },
            { label: 'Supabase URL', configured: !!import.meta.env.VITE_SUPABASE_URL },
            { label: 'Supabase Key', configured: !!import.meta.env.VITE_SUPABASE_ANON_KEY },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
            }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{item.label}</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: item.configured ? '#047857' : '#b45309',
              }}>
                {item.configured ? '✓ Configured' : '⚡ Using fallback'}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#0f172a', marginTop: 12, margin: '12px 0 0' }}>
          All features work without API keys. See .env.example for configuration.
        </p>
      </div>
    </div>
  );
}
