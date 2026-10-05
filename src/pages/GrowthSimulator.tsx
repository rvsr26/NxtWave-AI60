import React, { useState } from 'react';
import type { GrowthSimulation } from '../types';

const DEFAULT_SIM: GrowthSimulation = {
  campusCaptains: 25,
  registrationsPerCaptain: 8, // 25 * 8 = 200
  referralRegistrations: 150, // 150
  communityRegistrations: 50, // 50
  creatorRegistrations: 50,   // 50 Student Creator Challenge
  organicSocialRegistrations: 50, // 50 Organic Social -> Total = 500
  creatorPrizeBudget: 300,    // ₹300 Student Creator Challenge prize
  referralRewardBudget: 500,  // ₹500 referral rewards (#1 ₹250, #2 ₹150, #3 ₹100)
  competitionRewardBudget: 900, // ₹900 post-workshop AI project awards (#1 ₹400, #2 ₹300, #3 ₹200)
};

const TOTAL_BUDGET_CAP = 2000;

function SliderInput({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{label}</label>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#4338ca' }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%', height: 6, borderRadius: 999,
          background: `linear-gradient(90deg, #4f46e5 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%)`,
          outline: 'none', cursor: 'pointer',
          WebkitAppearance: 'none', appearance: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#0f172a', fontWeight: 700 }}>{min}</span>
        <span style={{ fontSize: 10, color: '#0f172a', fontWeight: 700 }}>{max}</span>
      </div>
    </div>
  );
}

export default function GrowthSimulator() {
  const [sim, setSim] = useState<GrowthSimulation>(DEFAULT_SIM);

  const captainContrib = Math.round(sim.campusCaptains * sim.registrationsPerCaptain);
  const totalRegistrations = captainContrib + sim.referralRegistrations + sim.communityRegistrations + sim.creatorRegistrations + sim.organicSocialRegistrations;
  const target = 500;
  const regGap = Math.max(0, target - totalRegistrations);
  const regSurplus = Math.max(0, totalRegistrations - target);

  // Budget calculations
  const totalAllocatedBudget = sim.creatorPrizeBudget + sim.referralRewardBudget + sim.competitionRewardBudget;
  const remainingBudget = TOTAL_BUDGET_CAP - totalAllocatedBudget;
  const isBudgetExceeded = totalAllocatedBudget > TOTAL_BUDGET_CAP;
  const isTargetUnmet = totalRegistrations < target;

  const channels = [
    { label: 'Campus Captains + College Communities', value: captainContrib, color: '#6366f1', formula: `${sim.campusCaptains} captains × ${sim.registrationsPerCaptain} avg = ${captainContrib}` },
    { label: 'Student Referral Engine', value: sim.referralRegistrations, color: '#10b981', formula: 'Verified unique student-to-student invites' },
    { label: 'Student Creator Challenge', value: sim.creatorRegistrations, color: '#ec4899', formula: 'Student promotional creators competing for ₹300 prize' },
    { label: 'College WhatsApp/Telegram Communities', value: sim.communityRegistrations, color: '#25d366', formula: 'College coding clubs & placement group broadcasts' },
    { label: 'Organic Social (LinkedIn / X / Instagram)', value: sim.organicSocialRegistrations, color: '#f59e0b', formula: 'Student project passport shares & peer posts' },
  ];

  function resetToDefaults() {
    setSim(DEFAULT_SIM);
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            📐 500-Registration Scenario Planner
          </h1>
          <span className="chip chip-amber">PLANNING ASSUMPTION — NOT ACTUAL CAMPAIGN RESULTS</span>
        </div>
        <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.6, margin: '0 0 10px', fontWeight: 500 }}>
          Interactive growth modeling tool to test channel sensitivity, budget allocations, and risk boundaries against the 500-registration goal under the ₹2,000 budget constraint.
        </p>
        <p style={{ fontSize: 12, color: '#0f172a', margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
          500-registration target model — planning assumptions, not campaign results. Levers model channel distribution, not guaranteed acquisition.
        </p>
      </div>

      {/* Warnings & Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {isTargetUnmet && (
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#92400e', margin: 0 }}>
                Target gap — increase distribution or improve conversion.
              </p>
              <p style={{ fontSize: 12, color: '#78350f', margin: '2px 0 0' }}>
                Projected registrations: {totalRegistrations} / 500 ({regGap} registration gap). Increase Campus Captains, Referral Engine, or Creator Challenge to reach target.
              </p>
            </div>
          </div>
        )}

        {isBudgetExceeded && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#991b1b', margin: 0 }}>
                Budget constraint exceeded.
              </p>
              <p style={{ fontSize: 12, color: '#7f1d1d', margin: '2px 0 0' }}>
                ₹{totalAllocatedBudget} allocated exceeds ₹2,000 hard ceiling by ₹{totalAllocatedBudget - TOTAL_BUDGET_CAP}. Reduce creator challenge prize or referral/competition allocations.
              </p>
            </div>
          </div>
        )}

        {!isTargetUnmet && !isBudgetExceeded && (
          <div style={{
            background: '#ecfdf5', border: '1px solid #a7f3d0',
            borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <p style={{ fontSize: 13, color: '#065f46', fontWeight: 600, margin: 0 }}>
              Viable Growth Scenario: 500-student target reached ({totalRegistrations} projected) within the ₹2,000 budget constraint (₹{remainingBudget} contingency remaining).
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs (Levers) & Output Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        
        {/* Levers Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#ffffff', border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, margin: 0 }}>
              🎛 Growth Model Levers
            </p>
            <button
              onClick={resetToDefaults}
              style={{
                fontSize: 11, color: '#4338ca', background: '#eef2ff',
                border: '1px solid #c7d2fe', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontWeight: 700
              }}
            >
              Reset to 500 Baseline
            </button>
          </div>

          {/* Acquisition Levers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
              Acquisition Channels
            </p>

            <SliderInput label="Campus Captains" value={sim.campusCaptains} min={5} max={50} step={1}
              onChange={v => setSim(s => ({ ...s, campusCaptains: v }))} />

            <SliderInput label="Average Registrations per Captain" value={sim.registrationsPerCaptain} min={2} max={25} step={1}
              onChange={v => setSim(s => ({ ...s, registrationsPerCaptain: v }))} />

            <SliderInput label="Referral Registrations (Verified Loop)" value={sim.referralRegistrations} min={0} max={300} step={5}
              onChange={v => setSim(s => ({ ...s, referralRegistrations: v }))} />

            <SliderInput label="Creator Challenge Registrations" value={sim.creatorRegistrations} min={0} max={150} step={5}
              onChange={v => setSim(s => ({ ...s, creatorRegistrations: v }))} />

            <SliderInput label="College Community Registrations (WhatsApp/TG)" value={sim.communityRegistrations} min={0} max={150} step={5}
              onChange={v => setSim(s => ({ ...s, communityRegistrations: v }))} />

            <SliderInput label="Organic Social Registrations (LinkedIn/X/IG)" value={sim.organicSocialRegistrations} min={0} max={150} step={5}
              onChange={v => setSim(s => ({ ...s, organicSocialRegistrations: v }))} />
          </div>

          <div className="divider" style={{ margin: '4px 0', borderColor: '#e2e8f0' }} />

          {/* Budget Levers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
              Budget Allocations (Limit: ₹2,000)
            </p>

            <SliderInput label="Creator Challenge Prize Budget (₹)" value={sim.creatorPrizeBudget} min={0} max={600} step={25}
              onChange={v => setSim(s => ({ ...s, creatorPrizeBudget: v }))} format={v => `₹${v}`} />

            <SliderInput label="Referral Reward Budget (₹)" value={sim.referralRewardBudget} min={0} max={800} step={25}
              onChange={v => setSim(s => ({ ...s, referralRewardBudget: v }))} format={v => `₹${v}`} />

            <SliderInput label="AI Project Competition Prize Budget (₹)" value={sim.competitionRewardBudget} min={0} max={1400} step={50}
              onChange={v => setSim(s => ({ ...s, competitionRewardBudget: v }))} format={v => `₹${v}`} />
          </div>
        </div>

        {/* Output Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Number Block */}
          <div style={{
            background: totalRegistrations >= target ? '#ecfdf5' : '#eef2ff',
            border: `1px solid ${totalRegistrations >= target ? '#a7f3d0' : '#c7d2fe'}`,
            borderRadius: 16, padding: '24px', textAlign: 'center',
          }}>
            <p className="section-label" style={{ marginBottom: 4, color: '#0f172a', fontWeight: 700 }}>PROJECTED REGISTRATIONS</p>
            <p style={{
              fontSize: 56, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
              color: totalRegistrations >= target ? '#047857' : '#4338ca', margin: 0,
            }}>
              {totalRegistrations}
            </p>
            <p style={{ fontSize: 14, color: '#0f172a', marginTop: 4, fontWeight: 700 }}>
              of {target} target ({((totalRegistrations / target) * 100).toFixed(0)}%)
            </p>

            <div className="progress-bar" style={{ height: 10, marginTop: 14, background: '#cbd5e1' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${Math.min((totalRegistrations / target) * 100, 100)}%`,
                background: totalRegistrations >= target
                  ? 'linear-gradient(90deg, #059669, #10b981)'
                  : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                transition: 'width 0.3s ease',
              }} />
            </div>

            {/* Financial Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>ALLOCATED</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: isBudgetExceeded ? '#dc2626' : '#0f172a', margin: '4px 0 0' }}>
                  ₹{totalAllocatedBudget}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>REMAINING BUFFER</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: remainingBudget >= 0 ? '#047857' : '#dc2626', margin: '4px 0 0' }}>
                  {remainingBudget >= 0 ? `₹${remainingBudget}` : `-₹${Math.abs(remainingBudget)}`}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>TARGET STATUS</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: totalRegistrations >= target ? '#047857' : '#b45309', margin: '4px 0 0' }}>
                  {totalRegistrations >= target ? `+${regSurplus} surplus` : `-${regGap} to go`}
                </p>
              </div>
            </div>
          </div>

          {/* Channel Contribution Breakdown */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, margin: '0 0 4px' }}>Channel Contribution Model</p>
            {channels.map(ch => (
              <div key={ch.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{ch.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: ch.color }}>{ch.value}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{
                    height: '100%', width: `${totalRegistrations > 0 ? (ch.value / totalRegistrations) * 100 : 0}%`,
                    background: ch.color, borderRadius: 999, transition: 'width 0.3s ease',
                  }} />
                </div>
                <p style={{ fontSize: 11, color: '#0f172a', margin: 0, fontWeight: 500 }}>{ch.formula}</p>
              </div>
            ))}
          </div>

          {/* Baseline Planning Model Comparison */}
          <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
            <p style={{ fontWeight: 800, color: '#4338ca', fontSize: 13, marginBottom: 8 }}>
              📋 500-Registration Target Model (Planning Assumptions)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#0f172a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Campus Captains + College Communities:</span>
                <strong style={{ color: '#0f172a' }}>200 (40%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Student Referral Engine:</span>
                <strong style={{ color: '#0f172a' }}>150 (30%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Student Creator Challenge:</span>
                <strong style={{ color: '#0f172a' }}>50 (10%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Organic Social + Communities:</span>
                <strong style={{ color: '#0f172a' }}>100 (20%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: 6, marginTop: 4 }}>
                <strong style={{ color: '#4338ca' }}>TOTAL TARGET MODEL:</strong>
                <strong style={{ color: '#047857' }}>500 (100%)</strong>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#0f172a', marginTop: 8, marginBottom: 0, fontStyle: 'italic', fontWeight: 600 }}>
              500-registration target model — planning assumptions, not campaign results.
            </p>
          </div>
        </div>
      </div>

      {/* Downside Sensitivity Analysis */}
      <div className="card" style={{ marginBottom: 28, background: '#fef2f2', border: '1px solid #fecaca' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontWeight: 800, color: '#991b1b', fontSize: 14, margin: 0 }}>
            📉 Downside Sensitivity Testing (Stress-Testing Key Assumptions)
          </p>
          <span className="chip chip-amber" style={{ fontSize: 10 }}>Planning Guardrail</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, fontSize: 12 }}>
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: 10, border: '1px solid #fecaca' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Scenario A: Captain Productivity Halves</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>Captain Productivity:</span>
              <strong style={{ color: '#dc2626' }}>8 → 4 registrations</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>Projected Total:</span>
              <strong style={{ color: '#dc2626' }}>500 → 400</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#0f172a' }}>Registration Gap:</span>
              <strong className="mono" style={{ color: '#dc2626' }}>-100 (-20%)</strong>
            </div>
            <p style={{ color: '#0f172a', margin: 0, lineHeight: 1.4, fontSize: 11, borderTop: '1px solid #f1f5f9', paddingTop: 6 }}>
              💡 <em>&ldquo;Captain activation is a high-sensitivity lever and should be validated early during Day 1–2 pilot sprints.&rdquo;</em>
            </p>
          </div>
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Scenario B: Referral Viral Loop Halves</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>K-Factor Efficiency:</span>
              <strong style={{ color: '#dc2626' }}>0.30 → 0.15</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>Projected Referrals:</span>
              <strong style={{ color: '#dc2626' }}>150 → 75</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#0f172a' }}>Registration Gap:</span>
              <strong className="mono" style={{ color: '#dc2626' }}>-75 (-15%)</strong>
            </div>
            <p style={{ color: '#0f172a', margin: 0, lineHeight: 1.4, fontSize: 11, borderTop: '1px solid #f1f5f9', paddingTop: 6 }}>
              💡 <em>&ldquo;Emphasizes importance of anti-fraud verification and featuring unlocked project repos immediately on 2nd referral.&rdquo;</em>
            </p>
          </div>
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Scenario C: Creator Content Underperforms</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>Creator Yield:</span>
              <strong style={{ color: '#b45309' }}>50 → 20 regs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#0f172a' }}>Budget Impact:</span>
              <strong style={{ color: '#047857' }}>₹0 extra cost</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#0f172a' }}>Registration Gap:</span>
              <strong className="mono" style={{ color: '#dc2626' }}>-30 (-6%)</strong>
            </div>
            <p style={{ color: '#0f172a', margin: 0, lineHeight: 1.4, fontSize: 11, borderTop: '1px solid #f1f5f9', paddingTop: 6 }}>
              💡 <em>&ldquo;Prize of ₹300 is a fixed bounty reward. Low yield doesn&apos;t inflate budget; operator scales winning Creator B angle.&rdquo;</em>
            </p>
          </div>
        </div>
      </div>

      {/* Budget Phasing Table */}
      <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 12 }}>
          💰 Recommended Budget Allocation (₹2,000 Total)
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', color: '#0f172a', fontWeight: 800 }}>Allocation</th>
                <th style={{ padding: '8px 12px', color: '#0f172a', fontWeight: 800 }}>Purpose</th>
                <th style={{ padding: '8px 12px', color: '#0f172a', fontWeight: 800, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#be185d' }}>Student Creator Challenge</td>
                <td style={{ padding: '10px 12px', color: '#0f172a' }}>Prize for top promotional content creator (qualified regs + CTR + score)</td>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>₹{sim.creatorPrizeBudget}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#047857' }}>Referral Rewards</td>
                <td style={{ padding: '10px 12px', color: '#0f172a' }}>Top 3 verified referrers (🥇 ₹250 / 🥈 ₹150 / 🥉 ₹100)</td>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>₹{sim.referralRewardBudget}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#4338ca' }}>AI Project Competition</td>
                <td style={{ padding: '10px 12px', color: '#0f172a' }}>Post-workshop AI project awards (🥇 ₹400 / 🥈 ₹300 / 🥉 ₹200) — post-workshop incentive</td>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>₹{sim.competitionRewardBudget}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#b45309' }}>Contingency</td>
                <td style={{ padding: '10px 12px', color: '#0f172a' }}>Unallocated reserve buffer</td>
                <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>
                  ₹{Math.max(0, TOTAL_BUDGET_CAP - (sim.creatorPrizeBudget + sim.referralRewardBudget + sim.competitionRewardBudget))}
                </td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '12px', fontWeight: 900, color: '#4338ca' }}>TOTAL</td>
                <td style={{ padding: '12px', color: '#0f172a', fontWeight: 700 }}>Hard budget ceiling</td>
                <td style={{ padding: '12px', fontWeight: 900, color: isBudgetExceeded ? '#dc2626' : '#047857', textAlign: 'right' }}>
                  ₹{totalAllocatedBudget + Math.max(0, TOTAL_BUDGET_CAP - totalAllocatedBudget)} / ₹{TOTAL_BUDGET_CAP}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
