import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';
import type { CampusCaptain, Campus } from '../types';

const DEMO_CAMPUS_CODES = [
  { code: 'AMRITA60', name: 'Amrita University' },
  { code: 'VIT60', name: 'VIT University' },
  { code: 'SRM60', name: 'SRM University' },
  { code: 'BITS60', name: 'BITS Pilani' },
  { code: 'MIT60', name: 'MIT Manipal' },
  { code: 'NIT60', name: 'NIT Trichy' },
  { code: 'CUSTOM', name: 'Other (enter custom code)' },
];

export default function CampusCaptainPage() {
  const { state, addCaptain, addCampus } = useApp();
  const [view, setView] = useState<'join' | 'dashboard'>('join');
  const [form, setForm] = useState({ name: '', email: '', college: '', whatsapp: '', campusCode: '' });
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [myCaptain, setMyCaptain] = useState<CampusCaptain | null>(null);

  const target = 50; // milestone target

  // Check if current user is already a captain
  const existingCaptain = state.captains.find(c => c.email === form.email);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.college.trim()) errs.college = 'Required';
    if (!form.whatsapp.trim()) errs.whatsapp = 'Required';
    if (!form.campusCode && !customCode) errs.campusCode = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const code = form.campusCode === 'CUSTOM' ? customCode.toUpperCase() + '60' : form.campusCode;

    // Create or update campus
    const campusExists = state.campuses.find(c => c.code === code);
    if (!campusExists) {
      const newCampus: Campus = {
        id: `camp_${Date.now()}`,
        name: form.college,
        code,
        registrations: 0,
        yesterdayRegistrations: 0,
        captains: 1,
      };
      addCampus(newCampus);
    }

    const captain: CampusCaptain = {
      id: `cap_${Date.now()}`,
      name: form.name,
      email: form.email,
      college: form.college,
      whatsapp: form.whatsapp,
      campusCode: code,
      registrations: 0,
      createdAt: new Date().toISOString(),
    };

    addCaptain(captain);
    Analytics.campusCaptainCreated(form.college);
    setMyCaptain(captain);
    setLoading(false);
    setView('dashboard');
  }

  function renderDashboard(captain: CampusCaptain) {
    const campusData = state.campuses.find(c => c.code === captain.campusCode);
    const campusRegs = campusData?.registrations || 0;
    const sortedCampuses = [...state.campuses].sort((a, b) => b.registrations - a.registrations);
    const rank = sortedCampuses.findIndex(c => c.code === captain.campusCode) + 1;
    const shareUrl = `${window.location.origin}${window.location.pathname}?campus=${captain.campusCode}`;
    const progress = Math.min((campusRegs / target) * 100, 100);
    const remaining = Math.max(target - campusRegs, 0);

    function copyShareLink() {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }

    function shareWhatsApp() {
      const msg = encodeURIComponent(
        `[${captain.college}] Join AI60 Campus League! 🏆\n\n` +
        `We need ${remaining} more registrations to hit our milestone.\n\n` +
        `Register free: ${shareUrl}\n\n` +
        `Takes 2 minutes. Free AI workshop. Let's go!`
      );
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    }

    return (
      <div>
        {/* Dashboard Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.08))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 16, padding: '28px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>Campus Captain Dashboard</p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f1f5', lineHeight: 1.2 }}>
                {captain.college}
              </h2>
              <p className="mono" style={{ fontSize: 13, color: '#818cf8', marginTop: 4 }}>
                {captain.campusCode}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 40, fontWeight: 900, color: '#f1f1f5', lineHeight: 1, letterSpacing: '-0.03em' }}>
                #{rank}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.45)', fontWeight: 600 }}>Campus Rank</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Registrations', value: campusRegs.toString(), color: '#818cf8' },
              { label: 'Your Referrals', value: captain.registrations.toString(), color: '#34d399' },
              { label: 'Target', value: `${target}`, color: '#fcd34d' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 10, padding: '14px 16px', textAlign: 'center',
              }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4, fontWeight: 600 }}>{s.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Milestone progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f1f5' }}>
                {campusRegs} / {target} registrations
              </span>
              <span style={{ fontSize: 13, color: '#fcd34d', fontWeight: 700 }}>
                {remaining > 0 ? `${remaining} to next milestone` : '🎯 Milestone reached!'}
              </span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366f1, #f59e0b)',
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Share Link */}
        <div className="card" style={{ marginBottom: 24 }}>
          <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15, marginBottom: 4 }}>
            📤 Campus Share Link
          </p>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.5)', marginBottom: 14 }}>
            Every student who registers via this link is attributed to {captain.college}
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 14,
          }}>
            <span className="mono" style={{ flex: 1, fontSize: 12, color: '#818cf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button id="captain-copy-btn" className="btn-secondary" style={{ flex: 1 }} onClick={copyShareLink}>
              📋 Copy Link
            </button>
            <button id="captain-whatsapp-btn" className="btn-green" style={{ flex: 1 }} onClick={shareWhatsApp}>
              <span>💬</span> WhatsApp
            </button>
          </div>
        </div>

        {/* Campaign message template */}
        <div className="card" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p className="section-label" style={{ marginBottom: 8, color: '#34d399' }}>📝 WhatsApp Message Template</p>
          <p style={{
            fontSize: 13, color: 'rgba(241,241,245,0.8)', lineHeight: 1.8,
            background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 14,
            fontStyle: 'italic',
          }}>
            "Hey! Our college is competing in the AI60 Campus League 🏆<br/><br/>
            We need {remaining} more students from {captain.college} to register for this free AI workshop.<br/><br/>
            It's completely free, takes 60 minutes, and you build a real AI project.<br/><br/>
            Register here → {shareUrl}<br/><br/>
            Help us climb the leaderboard! 🚀"
          </p>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && myCaptain) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button
            onClick={() => setView('join')}
            style={{ background: 'none', border: 'none', color: 'rgba(241,241,245,0.5)', cursor: 'pointer', fontSize: 13 }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f1f5' }}>
            ⚡ Campus Captain Dashboard
          </h1>
        </div>
        {renderDashboard(myCaptain)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <h1 style={{
          fontSize: 30, fontWeight: 900, color: '#f1f1f5',
          letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          Become a Campus Captain
        </h1>
        <p style={{ color: 'rgba(241,241,245,0.55)', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
          Lead your campus in the AI60 campaign. Get a tracked link, dashboard, and milestone progress tracker.
        </p>
      </div>

      {/* What you get */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {[
          { emoji: '🎯', title: 'Campus Tracking', desc: 'Every registration attributed to your college' },
          { emoji: '📊', title: 'Live Dashboard', desc: 'Real-time stats and rank on Campus League' },
          { emoji: '🔗', title: 'Unique Link', desc: 'Shareable URL for WhatsApp and social media' },
          { emoji: '🏆', title: 'Milestones', desc: 'Progress toward registration targets' },
        ].map(item => (
          <div key={item.title} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.emoji}</div>
            <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 13, marginBottom: 4 }}>{item.title}</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleJoin}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 16 }}>Join as Campus Captain</h3>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>Full Name *</label>
            <input id="captain-name" type="text" className="input-base" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {errors.name && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>Email *</label>
            <input id="captain-email" type="email" className="input-base" placeholder="you@college.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>College *</label>
            <input id="captain-college" type="text" className="input-base" placeholder="e.g. Amrita University" value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} />
            {errors.college && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.college}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>WhatsApp Number *</label>
            <input id="captain-whatsapp" type="tel" className="input-base" placeholder="+91 98xxx xxxxx" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
            {errors.whatsapp && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.whatsapp}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>Campus Code *</label>
            <select
              id="captain-campus-code"
              className="input-base"
              style={{ backgroundColor: '#12141f', color: '#f1f1f5' }}
              value={form.campusCode}
              onChange={e => setForm(f => ({ ...f, campusCode: e.target.value }))}
            >
              <option value="" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Select campus code</option>
              {DEMO_CAMPUS_CODES.map(c => (
                <option key={c.code} value={c.code} style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            {form.campusCode === 'CUSTOM' && (
              <input
                type="text" className="input-base" style={{ marginTop: 10 }}
                placeholder="Enter your campus name (e.g. RVCE) — will become RVCE60"
                value={customCode} onChange={e => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              />
            )}
            {errors.campusCode && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.campusCode}</p>}
          </div>

          <button
            id="join-captain-btn"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? '⟳ Setting up...' : '⚡ Become Campus Captain'}
          </button>

          <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.3)', textAlign: 'center' }}>
            No commitment required. This is a volunteer campaign role.
            Physical rewards are not guaranteed unless explicitly communicated by NxtWave.
          </p>
        </div>
      </form>

      {/* Campus Captain Quality & Efficiency View */}
      {state.captains.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                ⚡ Campus Captain Quality &amp; Conversion
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', margin: '2px 0 0' }}>
                Which captains are producing qualified registrations efficiently?
              </p>
            </div>
            <span className="chip chip-demo" style={{ fontSize: 10 }}>
              SIMULATION DATA — illustrative scenario
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {state.captains.map((cap, idx) => {
              const qualified = Math.max(Math.round(cap.registrations * 0.9), cap.registrations > 0 ? 1 : 0);
              const conversion = cap.registrations > 0 ? ((qualified / cap.registrations) * 100).toFixed(0) : '0';
              const milestonePercent = Math.min(Math.round((cap.registrations / 50) * 100), 100);

              return (
                <div
                  key={cap.id}
                  className="card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: 'rgba(99,102,241,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 12, color: '#818cf8',
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 14, margin: 0 }}>
                        {cap.name}
                      </p>
                      <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', margin: 0 }}>
                        {cap.college} · <span className="mono" style={{ color: '#818cf8' }}>{cap.campusCode}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', textTransform: 'uppercase', margin: 0 }}>Total Regs</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>{cap.registrations}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>Qualified</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 800, color: '#34d399', margin: 0 }}>{qualified}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#818cf8', textTransform: 'uppercase', margin: 0 }}>Qualified %</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', margin: 0 }}>{conversion}%</p>
                    </div>
                    <div style={{ minWidth: 100, textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#fcd34d', textTransform: 'uppercase', margin: 0 }}>50 Milestone</p>
                      <p className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#fcd34d', margin: 0 }}>{milestonePercent}% reached</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
