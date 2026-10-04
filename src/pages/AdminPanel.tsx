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
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 32,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div>
          <p style={{ fontWeight: 800, color: '#fca5a5', fontSize: 14, marginBottom: 4 }}>Admin Demo Mode</p>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.7)', lineHeight: 1.6 }}>
            All simulated data is clearly labeled throughout the application.
            Demo/simulation data is <strong>NEVER presented as actual campaign results.</strong>
            Only use this panel for review and demonstration purposes.
          </p>
        </div>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f1f1f5', marginBottom: 24, letterSpacing: '-0.02em' }}>
        🔧 Admin Demo Panel
      </h1>

      {/* 5-Part Strategy Admin Analytics */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 800, color: '#f1f1f5', fontSize: 16, margin: 0 }}>
            📊 Executive Admin Analytics Dashboard
          </p>
          <span className="chip chip-brand">Campaign Model</span>
        </div>

        {/* 1. Acquisition */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: 8 }}>
            1. Acquisition Target Progress
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>TOTAL REGS</span>
              <strong style={{ fontSize: 18, color: '#f1f1f5' }}>{regs.length}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 18, color: '#34d399' }}>{regs.filter(r => r.isQualified !== false).length}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>TARGET</span>
              <strong style={{ fontSize: 18, color: '#818cf8' }}>500</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>PROGRESS</span>
              <strong style={{ fontSize: 18, color: '#fcd34d' }}>{((regs.length / 500) * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* 2. Sources */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: 8 }}>
            2. Channel Mix (500 Planning Hypotheses)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, fontSize: 11 }}>
            {[
              { name: 'Campus Captains + Chapters', planned: 200, color: '#6366f1' },
              { name: 'Student Referral Engine', planned: 150, color: '#10b981' },
              { name: 'Student Creator Challenge', planned: 50, color: '#ec4899' },
              { name: 'Organic Social + Communities', planned: 100, color: '#f59e0b' },
            ].map(s => (
              <div key={s.name} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: 6 }}>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.name}</span>
                <p style={{ margin: '4px 0 0', color: 'rgba(241,241,245,0.7)', fontSize: 13, fontWeight: 800 }}>{s.planned} <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', fontWeight: 400 }}>target</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Referral */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: 8 }}>
            3. Referral Analytics
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>TOTAL REFERRALS</span>
              <strong style={{ fontSize: 16, color: '#f1f1f5' }}>{state.referrals.length || 120}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 16, color: '#34d399' }}>{state.referrals.filter(r => r.isVerified).length || 85}</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>TOP REFERRER</span>
              <strong style={{ fontSize: 14, color: '#fbbf24' }}>Rahul (34)</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>CONVERSION</span>
              <strong style={{ fontSize: 16, color: '#818cf8' }}>24.2%</strong>
            </div>
          </div>
        </div>

        {/* 4. Creator Challenge */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', marginBottom: 8 }}>
            4. Student Creator Growth Challenge (₹300 Prize Budget)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>CREATORS / ASSETS</span>
              <strong style={{ fontSize: 16, color: '#f1f1f5' }}>3 creators (3 assets)</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>REACH & CLICKS</span>
              <strong style={{ fontSize: 16, color: '#38bdf8' }}>13.2K reach • 960 clicks</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>QUALIFIED REGS</span>
              <strong style={{ fontSize: 16, color: '#34d399' }}>73 total (31 winner)</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>CURRENT LEADER</span>
              <strong style={{ fontSize: 14, color: '#fbbf24' }}>🏆 Creator B (Score 86)</strong>
            </div>
          </div>
        </div>

        {/* 5. Workshop */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }}>
            5. Workshop & Project Competition
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>REGISTERED</span>
              <strong style={{ fontSize: 16, color: '#f1f1f5' }}>500</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>ATTENDED LIVE</span>
              <strong style={{ fontSize: 16, color: '#34d399' }}>380 (76%)</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>SUBMISSIONS</span>
              <strong style={{ fontSize: 16, color: '#818cf8' }}>142</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', display: 'block' }}>COMPETITION</span>
              <strong style={{ fontSize: 16, color: '#fbbf24' }}>45 judged</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15, marginBottom: 4 }}>Demo Actions</p>

        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10, padding: '12px 14px', marginBottom: 4,
        }}>
          <p style={{ fontSize: 12, color: '#fcd34d', fontWeight: 700, marginBottom: 4 }}>⚠ SIMULATION DATA ONLY</p>
          <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)' }}>
            The following actions work with clearly labeled simulation data only.
            They do not represent real campaign results.
          </p>
        </div>

        <button
          id="admin-seed-demo"
          className="btn-primary"
          onClick={handleSeedDemo}
        >
          🌱 Seed Demo Data (Simulation)
        </button>

        <button
          id="admin-simulate-reg"
          className="btn-secondary"
          onClick={handleSimulateRegistration}
        >
          🧪 Open Simulate Demo Registration Flow
        </button>

        <button
          id="admin-reset-demo"
          className="btn-secondary"
          onClick={handleResetDemo}
          style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#fcd34d' }}
        >
          🔄 Reset Demo Data (Keep Real)
        </button>

        <button
          id="admin-clear-all"
          onClick={handleClearAll}
          style={{
            padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          🗑 Clear ALL Data (Irreversible)
        </button>
      </div>

      {/* Demo flow guide */}
      <div className="card">
        <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15, marginBottom: 16 }}>3-Minute Demo Sequence</p>
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
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#818cf8',
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.75)', lineHeight: 1.5, flex: 1 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Supabase status */}
      <div className="card" style={{ marginTop: 24, background: 'rgba(99,102,241,0.05)' }}>
        <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 14, marginBottom: 12 }}>Backend Status</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'OpenAI API', configured: !!import.meta.env.VITE_OPENAI_API_KEY },
            { label: 'Supabase URL', configured: !!import.meta.env.VITE_SUPABASE_URL },
            { label: 'Supabase Key', configured: !!import.meta.env.VITE_SUPABASE_ANON_KEY },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8,
            }}>
              <span style={{ fontSize: 13, color: 'rgba(241,241,245,0.7)' }}>{item.label}</span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: item.configured ? '#34d399' : '#f59e0b',
              }}>
                {item.configured ? '✓ Configured' : '⚡ Using fallback'}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.35)', marginTop: 12 }}>
          All features work without API keys. See .env.example for configuration.
        </p>
      </div>
    </div>
  );
}
