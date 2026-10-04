import React, { useState } from 'react';
import { DEMO_CHANNEL_DECISIONS, DEMO_DECISION_LOGS } from '../demoData';
import { getDecisionLogs } from '../storage';
import type { ChannelDecisionEntry, DecisionFrameworkAction, DecisionLog } from '../types';

interface BudgetTrancheState {
  captains: number;
  referrals: number;
  communities: number;
  creators: number;
  paidAds: number;
}

const INITIAL_TRANCHE: BudgetTrancheState = {
  captains: 200,
  referrals: 200,
  communities: 0,
  creators: 100,
  paidAds: 0,
};

const ACTION_CONFIG: Record<DecisionFrameworkAction, { color: string; bg: string; border: string; label: string }> = {
  SCALE: { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', label: 'SCALE' },
  CONTINUE: { color: '#818cf8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', label: 'CONTINUE' },
  ITERATE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', label: 'ITERATE' },
  KILL: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', label: 'KILL' },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  testing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: '🧪 Testing' },
  implemented: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', label: '✅ Implemented' },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', label: '❌ Rejected' },
  monitoring: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', label: '👁 Monitoring' },
};

const FUNNEL_STEPS = [
  { step: '1. DISCOVERY', desc: 'College placement WhatsApp, student creators & campus captain outreach', tag: 'Top of Funnel' },
  { step: '2. PROJECT PASSPORT', desc: 'Select domain, branch & current level before any form friction', tag: 'Low Friction' },
  { step: '3. PERSONALIZED VALUE', desc: 'Instant 60-min roadmap, modern stack, resume bullet & defense point', tag: 'Aha Moment' },
  { step: '4. REGISTRATION', desc: '5-field registration linked directly to personalized passport', tag: 'Conversion' },
  { step: '5. VERIFIED REFERRAL', desc: '2 verified unique batchmate registrations unlock starter repos', tag: 'Anti-Fraud' },
  { step: '6. WORKSHOP ATTENDANCE', desc: 'Hands-on live 60-minute build session guided by mentor', tag: 'Activation' },
  { step: '7. AI PROJECT SUBMISSION', desc: 'Submit functional prototype code, GitHub repo & demo video', tag: 'Artifact' },
  { step: '8. PROJECT COMPETITION', desc: '₹900 prize pool evaluated on 5-factor objective rubric', tag: 'Incentive' },
  { step: '9. STUDENT CONTENT / SHARING', desc: 'Students post project demos on LinkedIn & WhatsApp status', tag: 'Social Proof' },
  { step: '10. NEW DISCOVERY', desc: 'Organic peer discovery loops back to Step 1 with zero paid CAC', tag: 'Growth Loop' },
];

export default function GrowthDecisionCenter() {
  const [channels] = useState<ChannelDecisionEntry[]>(DEMO_CHANNEL_DECISIONS);
  const [tranche, setTranche] = useState<BudgetTrancheState>(INITIAL_TRANCHE);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const [decisionLogs] = useState<DecisionLog[]>(() => {
    const stored = getDecisionLogs();
    return stored.length > 0 ? stored : DEMO_DECISION_LOGS;
  });

  const totalTrancheBudget = 500;
  const allocatedBudget = tranche.captains + tranche.referrals + tranche.communities + tranche.creators + tranche.paidAds;
  const remainingBudget = totalTrancheBudget - allocatedBudget;

  // Efficiency assumptions for next ₹500 allocation (Illustrative scenario)
  // Captains: ~₹2.50 per qualified reg (rewards & perks pool)
  // Referrals: ~₹3.80 per qualified reg (cash prizes for top 3 referrers)
  // Communities: ~₹0 direct cost (mod kit & organic time)
  // Creators: ~₹7.15 per qualified reg (portfolio demo challenge prizes)
  // Paid Ads: ~₹25.00 per qualified reg (pilot benchmark)
  const projectedFromCaptains = Math.round(tranche.captains / 2.5);
  const projectedFromReferrals = Math.round(tranche.referrals / 3.8);
  const projectedFromCommunities = 25; // baseline organic contribution
  const projectedFromCreators = Math.round(tranche.creators / 7.15);
  const projectedFromPaid = Math.round(tranche.paidAds / 25.0);

  const projectedTotalRegistrations = projectedFromCaptains + projectedFromReferrals + projectedFromCommunities + projectedFromCreators + projectedFromPaid;
  const projectedQualifiedRegistrations = Math.round(
    projectedFromCaptains * 0.91 +
    projectedFromReferrals * 0.88 +
    projectedFromCommunities * 0.78 +
    projectedFromCreators * 0.84 +
    projectedFromPaid * 0.32
  );

  const filteredChannels = filterAction === 'ALL'
    ? channels
    : channels.filter(c => c.decision === filterAction);

  function handleTrancheChange(key: keyof BudgetTrancheState, val: number) {
    const clamped = Math.max(0, Math.min(500, val));
    setTranche(prev => ({ ...prev, [key]: clamped }));
  }

  function applyPreset(preset: 'recommended' | 'balanced' | 'reset') {
    if (preset === 'recommended') {
      setTranche({ captains: 250, referrals: 200, communities: 0, creators: 50, paidAds: 0 });
    } else if (preset === 'balanced') {
      setTranche({ captains: 150, referrals: 150, communities: 0, creators: 100, paidAds: 100 });
    } else {
      setTranche(INITIAL_TRANCHE);
    }
  }

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#f1f1f5', letterSpacing: '-0.02em', margin: 0 }}>
            🧭 Growth Decision Center
          </h1>
          <span className="chip chip-demo">SIMULATION DATA — illustrative scenario, not actual campaign results</span>
        </div>
        <p style={{ color: 'rgba(241,241,245,0.7)', fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 840 }}>
          <strong>DATA → INSIGHT → DECISION → ACTION → NEXT EXPERIMENT</strong>.
          If this campaign were live tomorrow, where should effort and budget go next?
          Every channel and experiment is evaluated through rigorous guardrails prioritizing <em>qualified registrations</em> over vanity traffic.
        </p>
        <div style={{
          marginTop: 12,
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          fontSize: 12,
          color: 'rgba(241,241,245,0.5)',
        }}>
          💡 <em>Decision rules are proposed campaign guardrails, not observed campaign outcomes. Planning numbers represent hypotheses to validate.</em>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: "WHAT SHOULD I DO NEXT?" CARD                      */}
      {/* ============================================================== */}
      <div className="card fade-in-up" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 36,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <div>
              <p className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em', margin: 0 }}>
                ACTIVE CAMPAIGN DIRECTIVE
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: '2px 0 0' }}>
                WHAT SHOULD I DO NEXT?
              </h2>
            </div>
          </div>
          <span className="chip chip-amber" style={{ fontSize: 11, fontWeight: 700 }}>
            Dynamic Recommendation
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 18 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="section-label" style={{ color: '#fca5a5', marginBottom: 6 }}>📡 Current Signal</p>
            <p style={{ fontSize: 14, color: 'rgba(241,241,245,0.9)', lineHeight: 1.6, margin: 0 }}>
              Paid social acquisition is weaker than the strongest organic acquisition lever. Simulation indicates cold paid ads yield ~3.2% conversion with poor qualification (&gt;₹25/qual reg) compared to peer referral loops (22.4% CVR, ~₹3.8/qual reg).
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="section-label" style={{ color: '#34d399', marginBottom: 6 }}>⚡ Recommended Action</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: '#f1f1f5', lineHeight: 1.7 }}>
              <li><strong>Stop additional spend</strong> on cold paid social ads (KILL action).</li>
              <li><strong>Retest the stronger message</strong> (Creator B portfolio walkthrough) across student creators.</li>
              <li><strong>Reallocate future budget</strong> into high-trust peer incentives (Campus Captain perks &amp; referral leaderboards).</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 10,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <p style={{ fontSize: 13, color: '#f1f1f5', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#34d399' }}>Core Growth Rationale:</strong> &ldquo;Optimize for <em>qualified registrations</em>, not clicks.&rdquo; High-intent student peer discovery drives actual 60-minute workshop completion and project submissions.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: CHANNEL DECISION TABLE                             */}
      {/* ============================================================== */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
                Channel Decision Framework
              </h2>
              <span className="chip chip-demo" style={{ fontSize: 10 }}>Simulation Guardrails</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.55)', margin: 0 }}>
              Transparent guardrail evaluation for each distribution channel.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', 'SCALE', 'CONTINUE', 'ITERATE', 'KILL'].map(action => (
              <button
                key={action}
                id={`filter-channel-${action.toLowerCase()}`}
                onClick={() => setFilterAction(action)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filterAction === action ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
                  background: filterAction === action ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  color: filterAction === action ? '#c7d2fe' : 'rgba(241,241,245,0.6)',
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Decision Rules Guide */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 18,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
          fontSize: 12,
        }}>
          <div>
            <span style={{ color: '#34d399', fontWeight: 800 }}>SCALE:</span> Strong qualified efficiency &amp; sufficient signal.
          </div>
          <div>
            <span style={{ color: '#818cf8', fontWeight: 800 }}>CONTINUE:</span> Promising hypothesis, awaiting full volume.
          </div>
          <div>
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>ITERATE:</span> Some signal, clear creative optimization needed.
          </div>
          <div>
            <span style={{ color: '#ef4444', fontWeight: 800 }}>KILL:</span> Poor qualification efficiency or failed hypothesis.
          </div>
        </div>

        {/* Channel Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredChannels.map(ch => {
            const config = ACTION_CONFIG[ch.decision];
            return (
              <div
                key={ch.id}
                className="card"
                style={{
                  padding: '20px 24px',
                  border: `1px solid ${config.border}`,
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                        {ch.channel}
                      </h3>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        color: config.color,
                        background: config.bg,
                        border: `1px solid ${config.border}`,
                      }}>
                        {config.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.45)', marginTop: 4, margin: '4px 0 0' }}>
                      Quality Signal: {ch.qualitySignal}
                    </p>
                  </div>

                  {/* Metrics Badges */}
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', textTransform: 'uppercase', margin: 0 }}>Planned</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>{ch.plannedRegistrations}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>Qualified</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 800, color: '#34d399', margin: 0 }}>{ch.qualifiedRegistrations}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: '#818cf8', textTransform: 'uppercase', margin: 0 }}>Conv Rate</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#818cf8', margin: 0 }}>{ch.conversionRate}%</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', textTransform: 'uppercase', margin: 0 }}>Cost</p>
                      <p className="mono" style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>₹{ch.cost}</p>
                    </div>
                  </div>
                </div>

                <div className="divider" style={{ margin: '12px 0 14px' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(241,241,245,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>
                      Why this decision?
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.5, margin: 0 }}>
                      {ch.why}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', marginBottom: 4 }}>
                      Next Action
                    </p>
                    <p style={{ fontSize: 13, color: '#f1f1f5', lineHeight: 1.5, margin: 0 }}>
                      → {ch.nextAction}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PAID ACQUISITION MICRO-EXPERIMENT (₹300 TEST TRANCHE)         */}
      {/* ============================================================== */}
      <div className="card" style={{
        background: 'rgba(239,68,68,0.03)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 40,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🧪</span>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
                Paid Acquisition Micro-Experiment (₹300 Test Budget)
              </h3>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: '4px 0 0' }}>
              Micro-test isolating message framing. Positioned as an experimental test tranche, not the core acquisition engine.
            </p>
          </div>
          <span className="chip chip-demo" style={{ fontSize: 10 }}>
            SIMULATION DATA — illustrative test scenario
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16, marginBottom: 16 }}>
          {/* Creative A */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#fca5a5' }}>CREATIVE A (GENERIC HOOK)</span>
              <span style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)' }}>₹150 Spend</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '0 0 12px' }}>
              &ldquo;Build your first AI project in 60 minutes.&rdquo;
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11 }}>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Impressions</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>4,800</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Clicks (CTR)</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>142 (2.9%)</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Registrations</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>11 (7.7%)</p>
              </div>
              <div>
                <p style={{ color: '#ef4444', margin: 0 }}>Qualified Regs</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', margin: '2px 0 0' }}>3 (27% qual)</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Cost / Reg</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>₹13.63</p>
              </div>
              <div>
                <p style={{ color: '#ef4444', margin: 0 }}>Cost / Qual Reg</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', margin: '2px 0 0' }}>₹50.00</p>
              </div>
            </div>
          </div>

          {/* Creative B */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>CREATIVE B (OUTCOME HOOK)</span>
              <span style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)' }}>₹150 Spend</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '0 0 12px' }}>
              &ldquo;Final-year student? Build an AI project for your resume in 60 minutes.&rdquo;
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 11 }}>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Impressions</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>4,200</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Clicks (CTR)</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>168 (4.0%)</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Registrations</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>18 (10.7%)</p>
              </div>
              <div>
                <p style={{ color: '#34d399', margin: 0 }}>Qualified Regs</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#34d399', margin: '2px 0 0' }}>8 (44% qual)</p>
              </div>
              <div>
                <p style={{ color: 'rgba(241,241,245,0.4)', margin: 0 }}>Cost / Reg</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '2px 0 0' }}>₹8.33</p>
              </div>
              <div>
                <p style={{ color: '#34d399', margin: 0 }}>Cost / Qual Reg</p>
                <p className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#34d399', margin: '2px 0 0' }}>₹18.75</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <span style={{
              padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800,
              background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5',
              marginRight: 8,
            }}>
              DECISION: KILL
            </span>
            <span style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600 }}>
              Stop cold paid social spend. Retest Creative B&apos;s outcome-first angle strictly through organic campus ambassadors.
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.7)', fontStyle: 'italic' }}>
            🎯 Principle: Optimize for <strong>Qualified Registrations</strong>, not vanity clicks.
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: NEXT ₹500 BUDGET SIMULATOR                         */}
      {/* ============================================================== */}
      <div className="card" style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: '28px',
        marginBottom: 40,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>💰</span>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
                Where Should the Next ₹500 Go?
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: '4px 0 0' }}>
              Interactive Tranche Simulator. Test allocation scenarios across channels.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => applyPreset('recommended')}
            >
              Recommended (0% Paid)
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => applyPreset('balanced')}
            >
              Balanced Test
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => applyPreset('reset')}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={{
          padding: '8px 14px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 8,
          fontSize: 12,
          color: '#fcd34d',
          marginBottom: 20,
        }}>
          ⚠️ <strong>ILLUSTRATIVE SCENARIO</strong> — not actual campaign performance. Objective: <strong>MAXIMIZE QUALIFIED REGISTRATIONS</strong>, not raw clicks.
        </div>

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(241,241,245,0.8)', fontWeight: 600 }}>Campus Captains</span>
              <span className="mono" style={{ color: '#818cf8', fontWeight: 800 }}>₹{tranche.captains}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={tranche.captains}
              onChange={e => handleTrancheChange('captains', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 4, margin: 0 }}>~₹2.5/qual reg (Perks pool)</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(241,241,245,0.8)', fontWeight: 600 }}>Referral Rewards</span>
              <span className="mono" style={{ color: '#818cf8', fontWeight: 800 }}>₹{tranche.referrals}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={tranche.referrals}
              onChange={e => handleTrancheChange('referrals', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 4, margin: 0 }}>~₹3.8/qual reg (Leaderboard)</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(241,241,245,0.8)', fontWeight: 600 }}>Student Creators</span>
              <span className="mono" style={{ color: '#818cf8', fontWeight: 800 }}>₹{tranche.creators}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={tranche.creators}
              onChange={e => handleTrancheChange('creators', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 4, margin: 0 }}>~₹7.2/qual reg (Challenge pool)</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(241,241,245,0.8)', fontWeight: 600 }}>Communities</span>
              <span className="mono" style={{ color: '#818cf8', fontWeight: 800 }}>₹{tranche.communities}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={tranche.communities}
              onChange={e => handleTrancheChange('communities', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }}
            />
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 4, margin: 0 }}>Zero cash (Club starter kits)</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(241,241,245,0.8)', fontWeight: 600 }}>Paid Ads</span>
              <span className="mono" style={{ color: tranche.paidAds > 0 ? '#ef4444' : '#818cf8', fontWeight: 800 }}>₹{tranche.paidAds}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={tranche.paidAds}
              onChange={e => handleTrancheChange('paidAds', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444' }}
            />
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 4, margin: 0 }}>~₹25.0/qual reg (High waste)</p>
          </div>
        </div>

        {/* Projection KPI summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          padding: '18px 20px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 12,
        }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', textTransform: 'uppercase', margin: 0 }}>Tranche Allocated</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: allocatedBudget === 500 ? '#34d399' : '#f59e0b', margin: '4px 0 0' }}>
              ₹{allocatedBudget} <span style={{ fontSize: 13, color: 'rgba(241,241,245,0.4)' }}>/ ₹500</span>
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', margin: 0 }}>
              {remainingBudget === 0 ? 'Fully allocated' : remainingBudget > 0 ? `₹${remainingBudget} remaining` : `Exceeds by ₹${Math.abs(remainingBudget)}`}
            </p>
          </div>

          <div>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', textTransform: 'uppercase', margin: 0 }}>Projected Registrations</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: '4px 0 0' }}>
              ~{projectedTotalRegistrations}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Total simulated registrations</p>
          </div>

          <div>
            <p style={{ fontSize: 11, color: '#34d399', textTransform: 'uppercase', margin: 0 }}>Projected Qualified</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#34d399', margin: '4px 0 0' }}>
              ~{projectedQualifiedRegistrations}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Verified college attendees</p>
          </div>

          <div>
            <p style={{ fontSize: 11, color: '#818cf8', textTransform: 'uppercase', margin: 0 }}>Effective Qualified CAC</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#818cf8', margin: '4px 0 0' }}>
              ₹{projectedQualifiedRegistrations > 0 ? (allocatedBudget / projectedQualifiedRegistrations).toFixed(2) : '0.00'}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Cost per qualified acquisition</p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 4: CONNECT THE FULL FUNNEL (Visual Growth Loop)        */}
      {/* ============================================================== */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
              Full Funnel Growth Loop
            </h2>
            <span className="chip chip-brand" style={{ fontSize: 10 }}>Compounding Engine</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: '4px 0 0' }}>
            Every touchpoint is designed so post-workshop student output feeds top-of-funnel discovery for the next cohort.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '24px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {FUNNEL_STEPS.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#818cf8' }}>
                      {step.step}
                    </span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(99,102,241,0.12)',
                      color: '#a5b4fc',
                    }}>
                      {step.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.7)', lineHeight: 1.4, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
                {idx < FUNNEL_STEPS.length - 1 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(241,241,245,0.25)', fontSize: 14 }}>
                    ↓
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#34d399', fontSize: 12, fontWeight: 700 }}>
                    🔄 Loops back to Step 1
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 18,
            padding: '12px 16px',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgba(241,241,245,0.8)',
          }}>
            🎯 <strong>The Flywheel Effect:</strong> Final-year students don&apos;t just register for a webinar; they build a portfolio project, submit it to the competition, and share it on LinkedIn/WhatsApp. Their peers see proof of tangible creation, initiating fresh peer discovery with zero paid acquisition expenditure.
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 5: HISTORICAL DECISION LOG & AUDIT TRAIL               */}
      {/* ============================================================== */}
      <div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
              Decision Audit Trail
            </h2>
            <span className="chip chip-demo" style={{ fontSize: 10 }}>Documented History</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: '4px 0 0' }}>
            Historical decision records demonstrating evidence-based iteration.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {decisionLogs.map((log, idx) => {
            const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.testing;
            const actionConfig = ACTION_CONFIG[log.frameworkAction] || ACTION_CONFIG.CONTINUE;
            return (
              <div key={log.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: 'rgba(99,102,241,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 12, color: '#818cf8',
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{
                      padding: '3px 9px', borderRadius: 999,
                      background: status.bg, border: `1px solid ${status.border}`,
                      color: status.color, fontSize: 11, fontWeight: 700,
                    }}>
                      {status.label}
                    </span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6,
                      background: actionConfig.bg, border: `1px solid ${actionConfig.border}`,
                      color: actionConfig.color, fontSize: 11, fontWeight: 800,
                    }}>
                      {actionConfig.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(241,241,245,0.35)' }}>
                    {new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <p className="section-label" style={{ color: 'rgba(241,241,245,0.5)', marginBottom: 4 }}>👀 Observation</p>
                  <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.5, margin: 0 }}>
                    {log.observation}
                  </p>
                </div>

                <div className="divider" style={{ margin: '10px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  <div>
                    <p className="section-label" style={{ color: '#818cf8', marginBottom: 4 }}>🎯 Decision</p>
                    <p style={{ fontSize: 13, color: '#f1f1f5', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                      {log.decision}
                    </p>
                  </div>
                  <div>
                    <p className="section-label" style={{ color: '#34d399', marginBottom: 4 }}>💭 Reason</p>
                    <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.75)', lineHeight: 1.5, margin: 0 }}>
                      {log.reason}
                    </p>
                  </div>
                </div>

                {log.impact && (
                  <div style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    fontSize: 12,
                    color: '#a7f3d0',
                  }}>
                    📈 <strong>Impact:</strong> {log.impact}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 6: AI GOVERNANCE (AI PROPOSES, EXPERIMENTS MEASURE, I DECIDE) */}
      {/* ============================================================== */}
      <div className="card" style={{
        marginTop: 40,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 16,
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <div>
            <p className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em', margin: 0 }}>
              OPERATING MANTRA &amp; HUMAN-IN-THE-LOOP GOVERNANCE
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#f1f1f5', margin: '2px 0 0' }}>
              AI Proposes. Experiments Measure. I Decide.
            </h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', marginBottom: 8 }}>
              🤖 Where AI Powers the Campaign:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6 }}>
              <li><strong>Project Personalization:</strong> Generates tailored roadmaps, modern stacks, and resume bullets in Project Passport.</li>
              <li><strong>Copy &amp; Hypothesis Generation:</strong> Rapidly brainstorms testable variants across Career, Project, and Community angles.</li>
              <li><strong>Objective Rubric Assist:</strong> Parses project submission summaries to score novelty and technical stack depth.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: 8 }}>
              ⚖️ Where Human Judgment Decides:
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6 }}>
              <li><strong>Budget Allocation:</strong> Enforces the ₹2,000 hard ceiling and allocates funds to verified student incentives over paid ad waste.</li>
              <li><strong>Channel Guardrails:</strong> Decides when to SCALE, CONTINUE, ITERATE, or KILL based on qualified attendee signal.</li>
              <li><strong>Incentive &amp; Anti-Fraud Rules:</strong> Rejects self-referrals and gates rewards behind 2 verified unique domain registrations.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 7: 24-HOUR IMPROVEMENT ROADMAP                         */}
      {/* ============================================================== */}
      <div className="card" style={{
        marginTop: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>⏱️</span>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
                If I Had Another 24 Hours: Proposed Next Sprints
              </h3>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: '4px 0 0' }}>
              Strategic growth roadmap to validate high-sensitivity assumptions before full cohort rollout.
            </p>
          </div>
          <span className="chip chip-amber" style={{ fontSize: 10 }}>
            PROPOSED NEXT STEPS — strategic plan, not executed actions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#818cf8' }}>SPRINT 1 · CAPTAIN PILOT</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Pilot 3–5 Campus Captains</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              Test WhatsApp broadcast activation across Amrita, VIT, and SRM placement groups to validate the 8 registrations/captain planning baseline.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>SPRINT 2 · FUNNEL FRICTION</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Measure Passport → Registration Drop-off</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              Instrument drop-off analytics between blueprint preview and email registration to isolate form friction.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fcd34d' }}>SPRINT 3 · MESSAGING VALIDATION</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Test Career vs Project Hook</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              A/B test &ldquo;Build an AI project you can explain in interviews&rdquo; vs &ldquo;Turn your idea into an AI prototype&rdquo; in engineering club groups.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa' }}>SPRINT 4 · VIRAL AUDIT</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Audit Verified Referral Quality</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              Verify referral conversion quality by checking college email domain match rates before granting leaderboard prizes.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#f472b6' }}>SPRINT 5 · ATTENDANCE SIGNAL</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Compare Reg vs Attendance Intent</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              Add 1-click Google Calendar invite to measure real workshop attendance commitment vs passive form submissions.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8' }}>SPRINT 6 · CAPITAL EFFICIENCY</span>
            <p style={{ fontSize: 13, color: '#f1f1f5', fontWeight: 600, margin: '4px 0 2px' }}>Dynamic Tranche Reallocation</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.6)', margin: 0, lineHeight: 1.4 }}>
              Kill channels exceeding ₹10 CAC per qualified student; reallocate 100% of remaining buffer into winning captain cohorts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
