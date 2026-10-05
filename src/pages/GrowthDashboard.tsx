import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_CREATOR_EXPERIMENT, DEMO_REFERRAL_LEADERBOARD, DEMO_WORKSHOP_PROJECTS } from '../demoData';

const TARGET = 500;

const SOURCE_LABELS: Record<string, string> = {
  campus: 'Campus Captains',
  whatsapp: 'WhatsApp / Telegram',
  referral: 'Student Referrals',
  creator: 'Student Creator Challenge',
  instagram: 'Instagram / Social',
  linkedin: 'LinkedIn',
  direct: 'Direct / Communities',
};

const SOURCE_COLORS: Record<string, string> = {
  campus: '#6366f1',
  whatsapp: '#25d366',
  referral: '#10b981',
  creator: '#f59e0b',
  instagram: '#e1306c',
  linkedin: '#0077b5',
  direct: '#6b7280',
};

export default function GrowthDashboard() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'creator' | 'admin-analytics' | 'sources'>('overview');

  const regs = state.registrations;
  const passports = state.passports;
  const referrals = state.referrals;
  const campuses = state.campuses;

  const totalRegs = regs.length;
  const qualifiedRegs = regs.filter(r => r.isQualified !== false).length;
  const referralRegs = regs.filter(r => r.referredBy).length;
  const campusRegs = regs.filter(r => r.campus).length;
  const simRegs = regs.filter(r => r.isSimulated).length;
  const hasSimulated = regs.some(r => r.isSimulated);

  // Source breakdown
  const sourceBreakdown: Record<string, number> = {};
  regs.forEach(r => {
    const src = r.source || 'direct';
    sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
  });

  const sourceEntries = Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1]);
  const maxSource = Math.max(...sourceEntries.map(([, v]) => v), 1);

  // 8-Step Campaign Funnel (as specifically mandated in strategy)
  // DISCOVERY → PROJECT PASSPORT → REGISTRATION → REFERRAL → QUALIFIED REGISTRATION → WORKSHOP ATTENDANCE → AI PROJECT SUBMISSION → PROJECT COMPETITION
  const funnelSteps = [
    { step: 1, label: 'DISCOVERY', value: Math.max(totalRegs * 7, 2800), note: 'Landing visitors across all channels', color: '#6366f1' },
    { step: 2, label: 'PROJECT PASSPORT', value: Math.max(passports.length, Math.round(totalRegs * 2.2)), note: 'Personalized project blueprint generated', color: '#818cf8' },
    { step: 3, label: 'REGISTRATION', value: Math.max(totalRegs, 500), note: 'Workshop seat reserved (5-field form)', color: '#38bdf8' },
    { step: 4, label: 'REFERRAL', value: Math.max(referrals.length * 3, 210), note: 'Student shared unique referral link', color: '#34d399' },
    { step: 5, label: 'QUALIFIED REGISTRATION', value: Math.max(referralRegs, 150), note: 'Unique verified student registration', color: '#10b981' },
    { step: 6, label: 'WORKSHOP ATTENDANCE', value: 380, note: 'Attended live 60-min project build sprint', color: '#f59e0b' },
    { step: 7, label: 'AI PROJECT SUBMISSION', value: 142, note: 'Submitted working GitHub project code', color: '#fb923c' },
    { step: 8, label: 'PROJECT COMPETITION', value: 45, note: 'Qualified for human-judged prize leaderboard', color: '#ec4899' },
  ];
  const maxFunnelVal = funnelSteps[0].value;

  const creators = DEMO_CREATOR_EXPERIMENT;
  const topCreator = creators.find(c => c.isWinner) || creators[0];
  const totalCreatorReach = creators.reduce((acc, c) => acc + c.reach, 0);
  const totalCreatorClicks = creators.reduce((acc, c) => acc + c.clicks, 0);
  const totalCreatorQualified = creators.reduce((acc, c) => acc + c.qualifiedRegistrations, 0);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 900, color: '#0f172a',
            letterSpacing: '-0.02em', margin: 0,
          }}>
            📊 AI60 Growth Command Center
          </h1>
          <span className="chip chip-brand">7-Day Campaign System</span>
          <span className="chip chip-demo">Includes Simulation Data</span>
        </div>
        <p style={{ color: '#475569', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Measurable growth system tracking 500 registrations across organic communities, campus captains, verified referrals, and ₹300 Student Creator Growth Challenge.
        </p>
      </div>

      {/* Target Progress Card with 3-Way Data Integrity Indicators */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16, padding: '24px', marginBottom: 28,
        boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 6px 16px -4px rgba(15,23,42,0.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>CAMPAIGN TARGET</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 50, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.04em' }}>
                {totalRegs}
              </span>
              <span style={{ fontSize: 20, color: '#64748b', fontWeight: 700 }}>/ {TARGET}</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>verified & demo registrations</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#4338ca', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
              {((totalRegs / TARGET) * 100).toFixed(1)}%
            </p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>of 500 target reached</p>
            {TARGET - totalRegs > 0 && (
              <p style={{ fontSize: 12, color: '#b45309', fontWeight: 700, marginTop: 4, margin: '4px 0 0' }}>
                {TARGET - totalRegs} to go in 7-day model
              </p>
            )}
          </div>
        </div>

        <div className="progress-bar" style={{ height: 10, marginBottom: 14 }}>
          <div style={{
            height: '100%', borderRadius: 999,
            width: `${Math.min((totalRegs / TARGET) * 100, 100)}%`,
            background: 'linear-gradient(90deg, #4f46e5, #059669)',
            transition: 'width 0.8s ease',
          }} />
        </div>

        {/* 3-Tier Data Honesty Bar */}
        <div style={{
          paddingTop: 12, borderTop: '1px solid #f1f5f9',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#047857', margin: 0 }}>ACTUAL DEMO EVENTS</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{regs.filter(r => !r.isSimulated).length} verified live registrations</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#b45309', margin: 0 }}>SIMULATION DATA</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{simRegs} illustrative student records</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', margin: 0 }}>PLANNING ASSUMPTIONS</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>500-student model / ₹2,000 budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 14, marginBottom: 28,
      }}>
        {[
          { label: 'Total Registrations', value: totalRegs.toString(), sub: `Target: ${TARGET}`, color: '#4338ca' },
          { label: 'Qualified Registrations', value: qualifiedRegs.toString(), sub: 'Verified unique students', color: '#047857' },
          { label: 'Referral Registrations', value: referralRegs.toString(), sub: 'via batchmate link', color: '#059669' },
          { label: 'Campus Captain Regs', value: campusRegs.toString(), sub: `${campuses.length} colleges active`, color: '#be185d' },
          { label: 'Creator Challenge Regs', value: totalCreatorQualified.toString(), sub: 'Target: 50 | 3 creators', color: '#b45309' },
          { label: 'Creator Top Score', value: `${topCreator.totalScore}/100`, sub: `${topCreator.creatorName} (🏆 Leader)`, color: '#047857' },
        ].map(kpi => (
          <div key={kpi.label} className="card" style={{ padding: '16px 18px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: kpi.color, lineHeight: 1, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{kpi.label}</p>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 0, flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'funnel', label: '8-Step Campaign Funnel' },
          { id: 'creator', label: 'Student Creator Challenge (₹300)' },
          { id: 'admin-analytics', label: 'Admin Analytics' },
          { id: 'sources', label: 'Acquisition Sources' },
        ].map(tab => (
          <button
            key={tab.id}
            id={`dash-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px 8px 0 0',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: 'none',
              background: activeTab === tab.id ? '#eef2ff' : 'transparent',
              color: activeTab === tab.id ? '#4338ca' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Recent registrations */}
          <div className="card" style={{ gridColumn: 'span 2', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, margin: 0 }}>
                Recent Student Registrations
              </p>
              <span className="chip chip-brand" style={{ fontSize: 11 }}>Class of 2027</span>
            </div>
            {regs.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: 14 }}>No registrations yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...regs].reverse().slice(0, 7).map(reg => (
                  <div key={reg.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: '#f8fafc',
                    borderRadius: 8, border: '1px solid #e2e8f0',
                    flexWrap: 'wrap', gap: 8,
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{reg.name}</span>
                      <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                        {reg.college} · {reg.branch}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {reg.campus && (
                        <span className="chip chip-brand" style={{ fontSize: 10 }}>{reg.campus}</span>
                      )}
                      {reg.referredBy && (
                        <span className="chip chip-green" style={{ fontSize: 10 }}>ref: {reg.referredBy}</span>
                      )}
                      {reg.isQualified !== false && (
                        <span className="chip chip-green" style={{ fontSize: 10 }}>Verified Unique</span>
                      )}
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Creator Challenge Preview Widget */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, margin: 0 }}>
                🎬 Student Creator Growth Challenge (₹300 Prize)
              </p>
              <span className="chip chip-demo" style={{ fontSize: 10 }}>SIMULATION</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {creators.map(c => (
                <div key={c.id} style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: c.isWinner ? '#ecfdf5' : '#f8fafc',
                  border: c.isWinner ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.isWinner ? '#047857' : '#0f172a' }}>
                      {c.creatorName} {c.isWinner && '🏆 CURRENT LEADER'}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: c.isWinner ? '#047857' : '#b45309' }}>
                      Score: {c.totalScore} ({c.action})
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>
                    {c.format} · Reach: {c.reach.toLocaleString()} · Clicks: {c.clicks} · <strong style={{ color: '#047857' }}>{c.qualifiedRegistrations} qualified</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Leaderboard Preview Widget */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, margin: 0 }}>
                🏆 Campus Referral Leaderboard
              </p>
              <span className="chip chip-amber" style={{ fontSize: 10 }}>₹500 Prizes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEMO_REFERRAL_LEADERBOARD.slice(0, 3).map(entry => (
                <div key={entry.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <span style={{ fontSize: 13, color: '#0f172a' }}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'} <strong>{entry.name}</strong> ({entry.college.split(' ')[0]})
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#047857' }}>{entry.qualifiedReferrals} qualified</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#b45309' }}>₹{entry.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 8-STEP CAMPAIGN FUNNEL */}
      {activeTab === 'funnel' && (
        <div>
          <div className="sim-banner" style={{ marginBottom: 20, display: 'flex' }}>
            <span>⚠</span>
            <span>SIMULATION DATA — Illustrative drop-off model across the 8-step growth funnel</span>
          </div>

          <div className="card" style={{ marginBottom: 24, background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Campaign Funnel: From Discovery to Project Competition
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                DISCOVERY &rarr; PROJECT PASSPORT &rarr; REGISTRATION &rarr; REFERRAL &rarr; QUALIFIED REGISTRATION &rarr; WORKSHOP ATTENDANCE &rarr; AI PROJECT SUBMISSION &rarr; PROJECT COMPETITION
              </p>
            </div>

            {/* Strategic Annotation */}
            <div style={{
              background: '#eef2ff', border: '1px solid #c7d2fe',
              borderRadius: 10, padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <p style={{ fontSize: 12, color: '#312e81', margin: 0 }}>
                <strong>Strategic Pipeline Note:</strong> Creator Challenge and Campus Captains feed the discovery/registration stages. Registrants then become distribution channels through verified peer referrals.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {funnelSteps.map((step, idx) => {
                const width = (step.value / maxFunnelVal) * 100;
                const prev = idx > 0 ? funnelSteps[idx - 1].value : step.value;
                const convRate = ((step.value / prev) * 100).toFixed(0);

                return (
                  <div key={step.label}>
                    {idx > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0 2px 200px', fontSize: 11, color: '#4338ca', fontWeight: 600 }}>
                        <span>↓</span>
                        <span>{convRate}% conversion from {funnelSteps[idx - 1].label}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 190, flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#4338ca', width: 18 }}>{step.step}.</span>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>{step.label}</p>
                        </div>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0 24px' }}>{step.note}</p>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ height: 26, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.max(width, 6)}%`,
                            background: step.color,
                            borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                            paddingRight: 10,
                            transition: 'width 0.8s ease',
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>
                              {step.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT CREATOR GROWTH CHALLENGE (₹300) */}
      {activeTab === 'creator' && (
        <div>
          <div className="sim-banner" style={{ marginBottom: 20, display: 'flex' }}>
            <span>⚠</span>
            <span>SIMULATION DATA — Creator performance metrics based on published scoring model. Not actual campaign results.</span>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <p className="section-label" style={{ color: '#b45309', marginBottom: 4 }}>CREATOR GROWTH CHALLENGE</p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Student Creator Growth Challenge (Prize: ₹300)
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="chip chip-brand">Budget: ₹300</span>
                <span className="chip chip-demo">Status: SIMULATION</span>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
              Instead of spending ₹300 on cold paid ads, ₹300 is awarded as a performance prize to the student creator who drives the best verified workshop acquisition.
              Content formats include Instagram Reels, WhatsApp creatives, LinkedIn posts, X threads, and short videos.
            </p>

            {/* Scoring Model Callout */}
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '16px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <strong style={{ color: '#0f172a', fontSize: 13 }}>📐 Published Creator Scoring Model (100% Total)</strong>
                <span style={{ fontSize: 11, color: '#047857', fontWeight: 700 }}>Focus on Actual Growth &gt; Vanity Views</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '10px' }}>
                  <span style={{ fontSize: 11, color: '#4338ca', display: 'block', fontWeight: 700 }}>QUALIFIED REGS</span>
                  <strong style={{ fontSize: 18, color: '#0f172a' }}>60%</strong>
                  <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>Primary decision driver</p>
                </div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px' }}>
                  <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700 }}>CLICK-THROUGH (CTR)</span>
                  <strong style={{ fontSize: 18, color: '#0f172a' }}>20%</strong>
                  <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>Interest & hook quality</p>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px' }}>
                  <span style={{ fontSize: 11, color: '#b45309', display: 'block', fontWeight: 700 }}>ENGAGEMENT</span>
                  <strong style={{ fontSize: 18, color: '#0f172a' }}>10%</strong>
                  <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>Comments & shares</p>
                </div>
                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 8, padding: '10px' }}>
                  <span style={{ fontSize: 11, color: '#be185d', display: 'block', fontWeight: 700 }}>CREATIVITY</span>
                  <strong style={{ fontSize: 18, color: '#0f172a' }}>10%</strong>
                  <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>Originality of messaging</p>
                </div>
              </div>
            </div>

            {/* Creator Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
              {creators.map(c => (
                <div key={c.id} style={{
                  background: c.isWinner ? '#f0fdf4' : '#ffffff',
                  border: c.isWinner ? '1px solid #86efac' : '1px solid #e2e8f0',
                  borderRadius: 12, padding: '18px', position: 'relative',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                }}>
                  {c.isWinner && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span className="chip chip-green" style={{ fontSize: 11, fontWeight: 800 }}>🏆 CURRENT WINNER (₹300)</span>
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: c.isWinner ? '#15803d' : '#0f172a', margin: '0 0 2px' }}>
                      {c.creatorName}
                    </p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>Code: {c.creatorCode}</span>
                      <span style={{ fontSize: 11, color: '#4338ca', fontWeight: 600 }}>• {c.format}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 12 }}>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: 10, fontWeight: 600 }}>REACH (VIEWS)</span>
                      <strong style={{ color: '#0f172a' }}>{c.reach.toLocaleString()}</strong>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: 10, fontWeight: 600 }}>CLICKS</span>
                      <strong style={{ color: '#0f172a' }}>{c.clicks}</strong>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: 10, fontWeight: 600 }}>CTR</span>
                      <strong style={{ color: '#b45309' }}>{c.ctr}%</strong>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '8px 10px', borderRadius: 6, border: '1px solid #a7f3d0' }}>
                      <span style={{ color: '#047857', display: 'block', fontSize: 10, fontWeight: 700 }}>QUALIFIED REGS</span>
                      <strong style={{ color: '#047857', fontSize: 14 }}>{c.qualifiedRegistrations}</strong>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
                  }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Composite Score:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 16, color: c.isWinner ? '#15803d' : '#4338ca' }}>{c.totalScore} / 100</strong>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                        background: c.action === 'SCALE' ? '#dcfce7' : c.action === 'ITERATE' ? '#fef3c7' : '#fee2e2',
                        color: c.action === 'SCALE' ? '#15803d' : c.action === 'ITERATE' ? '#b45309' : '#b91c1c',
                      }}>
                        {c.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Creator Leaderboard */}
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '16px 20px', marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  🏆 Compact Creator Leaderboard
                </p>
                <span className="chip chip-amber" style={{ fontSize: 10 }}>Prize: ₹300</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { rank: 1, name: 'Creator B', regs: 31, score: 86, isLeader: true, prize: '₹300', status: '🏆 CURRENT LEADER' },
                  { rank: 2, name: 'Creator A', regs: 24, score: 74, isLeader: false, prize: '—', status: 'Runner-Up' },
                  { rank: 3, name: 'Creator C', regs: 18, score: 71, isLeader: false, prize: '—', status: 'Third Place' },
                ].map(entry => (
                  <div key={entry.name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', borderRadius: 8,
                    background: entry.isLeader ? '#f0fdf4' : '#ffffff',
                    border: entry.isLeader ? '1px solid #86efac' : '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 800, color: entry.isLeader ? '#d97706' : '#64748b', width: 24 }}>
                        #{entry.rank}
                      </span>
                      <strong style={{ color: '#0f172a', fontSize: 13 }}>{entry.name}</strong>
                      <span style={{ fontSize: 11, color: entry.isLeader ? '#047857' : '#64748b', fontWeight: 600 }}>
                        ({entry.status})
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 12, color: '#475569' }}>
                        <strong style={{ color: '#047857' }}>{entry.regs}</strong> qualified regs
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: entry.isLeader ? '#047857' : '#4338ca' }}>
                        Score: {entry.score}
                      </span>
                      {entry.isLeader && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 4 }}>
                          {entry.prize}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#64748b', margin: '10px 0 0', fontStyle: 'italic' }}>
                “Final winner determined after the campaign based on qualified registrations and the published scoring model.”
              </p>
            </div>

            {/* Growth Decision Framework Callout */}
            <div style={{
              background: '#eef2ff',
              border: '1px solid #c7d2fe', borderRadius: 10, padding: '16px 20px',
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#4338ca', margin: '0 0 4px' }}>
                🧠 Growth Decision Framework (KILL · ITERATE · SCALE)
              </p>
              <p style={{ fontSize: 12, color: '#334155', margin: '0 0 8px', lineHeight: 1.5 }}>
                • <strong>Creator B &rarr; SCALE:</strong> Highest qualified registrations (31) and highest CTR (8.3%). Awarded current ₹300 prize leadership.<br />
                • <strong>Creator A &rarr; ITERATE:</strong> Solid conversion (24 qualified regs), but reach can expand via placement WhatsApp groups.<br />
                • <strong>Creator C &rarr; KILL:</strong> High vanity reach (6,100) and clicks (410) but low qualified registrations (18). Vanity memes do not convert serious engineering students.
              </p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#047857', margin: 0 }}>
                Growth Insight: Views are useful. Clicks are useful. Registrations matter more. Qualified registrations matter most.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN ANALYTICS */}
      {activeTab === 'admin-analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="sim-banner" style={{ display: 'flex' }}>
            <span>⚠</span>
            <span>SIMULATION DATA — Comprehensive Admin Metrics view</span>
          </div>

          {/* Section 1: Acquisition */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#4338ca', marginBottom: 12 }}>
              1. Acquisition Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 700 }}>TOTAL REGISTRATIONS</span>
                <strong style={{ fontSize: 22, color: '#0f172a' }}>{totalRegs}</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REGISTRATIONS</span>
                <strong style={{ fontSize: 22, color: '#047857' }}>{qualifiedRegs}</strong>
              </div>
              <div style={{ background: '#eef2ff', padding: '12px', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: 11, color: '#4338ca', display: 'block', fontWeight: 700 }}>REGISTRATION TARGET</span>
                <strong style={{ fontSize: 22, color: '#4338ca' }}>500</strong>
              </div>
              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: 8, border: '1px solid #fde68a' }}>
                <span style={{ fontSize: 11, color: '#b45309', display: 'block', fontWeight: 700 }}>PROGRESS TOWARD 500</span>
                <strong style={{ fontSize: 22, color: '#b45309' }}>{((totalRegs / 500) * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Sources */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#4338ca', marginBottom: 12 }}>
              2. Source Breakdown (500-Model Hypotheses)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13 }}>
              {[
                { name: 'Campus Captains', planned: 200, color: '#4338ca' },
                { name: 'Student Referrals', planned: 150, color: '#047857' },
                { name: 'Student Creator Challenge', planned: 50, color: '#b45309' },
                { name: 'Organic Social + Communities', planned: 100, color: '#059669' },
              ].map(s => (
                <div key={s.name} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <span style={{ color: s.color, fontWeight: 700 }}>{s.name}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Planned Target:</span>
                    <strong style={{ color: '#0f172a' }}>{s.planned}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Referral */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#047857', marginBottom: 12 }}>
              3. Referral System Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 700 }}>TOTAL REFERRALS</span>
                <strong style={{ fontSize: 18, color: '#0f172a' }}>{Math.max(referrals.length, 120)}</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REFERRALS</span>
                <strong style={{ fontSize: 18, color: '#047857' }}>{Math.max(referralRegs, 85)}</strong>
              </div>
              <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: 8, border: '1px solid #fde68a' }}>
                <span style={{ fontSize: 11, color: '#b45309', display: 'block', fontWeight: 700 }}>TOP REFERRER</span>
                <strong style={{ fontSize: 16, color: '#b45309' }}>Rahul (34 qualified)</strong>
              </div>
              <div style={{ background: '#eef2ff', padding: '10px 12px', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: 11, color: '#4338ca', display: 'block', fontWeight: 700 }}>CONVERSION RATE</span>
                <strong style={{ fontSize: 18, color: '#4338ca' }}>24.2%</strong>
              </div>
            </div>
          </div>

          {/* Section 4: Creator Challenge */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#b45309', marginBottom: 12 }}>
              4. Student Creator Challenge Analytics (₹300 Winner Prize)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 700 }}>PRIZE POOL ALLOCATED</span>
                <strong style={{ fontSize: 18, color: '#0f172a' }}>₹300</strong>
              </div>
              <div style={{ background: '#eef2ff', padding: '10px 12px', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: 11, color: '#4338ca', display: 'block', fontWeight: 700 }}>TOTAL CREATOR REACH</span>
                <strong style={{ fontSize: 18, color: '#4338ca' }}>{totalCreatorReach.toLocaleString()}</strong>
              </div>
              <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: 8, border: '1px solid #fde68a' }}>
                <span style={{ fontSize: 11, color: '#b45309', display: 'block', fontWeight: 700 }}>TOTAL CLICKS (BLENDED CTR)</span>
                <strong style={{ fontSize: 16, color: '#b45309' }}>{totalCreatorClicks} (7.3%)</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700 }}>QUALIFIED REGS (WINNER)</span>
                <strong style={{ fontSize: 16, color: '#047857' }}>{totalCreatorQualified} (Creator B: 31)</strong>
              </div>
            </div>
          </div>

          {/* Section 5: Workshop */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              5. Workshop & Project Competition Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 700 }}>REGISTERED FOR WORKSHOP</span>
                <strong style={{ fontSize: 18, color: '#0f172a' }}>500</strong>
              </div>
              <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700 }}>ATTENDED LIVE SPRINT</span>
                <strong style={{ fontSize: 18, color: '#047857' }}>380 (76%)</strong>
              </div>
              <div style={{ background: '#eef2ff', padding: '10px 12px', borderRadius: 8, border: '1px solid #c7d2fe' }}>
                <span style={{ fontSize: 11, color: '#4338ca', display: 'block', fontWeight: 700 }}>PROJECTS SUBMITTED</span>
                <strong style={{ fontSize: 18, color: '#4338ca' }}>142</strong>
              </div>
              <div style={{ background: '#fffbeb', padding: '10px 12px', borderRadius: 8, border: '1px solid #fde68a' }}>
                <span style={{ fontSize: 11, color: '#b45309', display: 'block', fontWeight: 700 }}>COMPETITION ENTRIES</span>
                <strong style={{ fontSize: 18, color: '#b45309' }}>45 qualified</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SOURCES TAB */}
      {activeTab === 'sources' && (
        <div>
          {hasSimulated && (
            <div className="sim-banner" style={{ marginBottom: 20, display: 'flex' }}>
              <span>⚠</span>
              <span>Source data includes simulation — not actual campaign results</span>
            </div>
          )}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 24 }}>
              Registrations by Source
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sourceEntries.length > 0 ? sourceEntries.map(([source, count]) => {
                const color = SOURCE_COLORS[source] || '#6b7280';
                const label = SOURCE_LABELS[source] || source;
                const percentage = ((count / totalRegs) * 100).toFixed(1);

                return (
                  <div key={source}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{label}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{percentage}%</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color }}>
                          {count}
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(count / maxSource) * 100}%`,
                        background: color,
                        borderRadius: 999,
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                );
              }) : (
                <p style={{ color: '#64748b', fontSize: 14 }}>No source data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
