import React, { useState } from 'react';
import { DEMO_WORKSHOP_PROJECTS, DEMO_REFERRAL_LEADERBOARD, DEMO_REWARDS_CONFIG } from '../demoData';

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'creator' | 'referral' | 'competition' | 'budget'>('all');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f1f5', letterSpacing: '-0.02em', margin: 0 }}>
            🎁 Campaign Rewards & Prize System
          </h1>
          <span className="chip chip-amber">₹2,000 Total Allocation</span>
          <span className="chip chip-demo">Simulation Assumptions</span>
        </div>
        <p style={{ color: 'rgba(241,241,245,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Incentive architecture designed to reward student promotional creators, quality peer distribution, and post-workshop hands-on project creation.
        </p>
      </div>

      {/* Disclaimers & Governance Alert */}
      <div style={{
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20 }}>⚖️</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fcd34d', margin: '0 0 4px' }}>
            Campaign Simulation Notice & Human-in-the-Loop Governance
          </p>
          <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.7)', margin: 0, lineHeight: 1.6 }}>
            Rewards are campaign simulation assumptions and would require organizer approval before a real-world campaign launch.
            All AI-assisted scoring and grading serve solely as support mechanisms; <strong>final judging and prize decisions are strictly human-controlled.</strong>
          </p>
        </div>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Rewards & Budget' },
          { id: 'creator', label: '1. Creator Challenge (₹300)' },
          { id: 'referral', label: '2. Referral Rewards (₹500)' },
          { id: 'competition', label: '3. Project Competition (₹900)' },
          { id: 'budget', label: '₹2,000 Budget Breakdown' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
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

      {/* SECTION 1: Student Creator Challenge */}
      {(activeTab === 'all' || activeTab === 'creator') && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p className="section-label" style={{ color: '#f59e0b', marginBottom: 4 }}>CREATOR CONTENT COMPETITION</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                🎬 1. Student Creator Growth Challenge (Total: ₹300)
              </h2>
            </div>
            <span className="chip chip-amber">🏆 Winner Prize: ₹300</span>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
            Students are invited to create promotional content (Instagram Reels, WhatsApp creatives, LinkedIn posts, X posts, short videos, or memes).
            Each creator gets a unique tracking code (e.g. CREATOR01, CREATOR02, VISHNU26). The winner is determined by actual acquisition performance rather than mere vanity views.
          </p>

          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))',
            border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '20px', textAlign: 'center', marginBottom: 16,
          }}>
            <span style={{ fontSize: 36 }}>🏆</span>
            <p style={{ fontSize: 30, fontWeight: 900, color: '#fbbf24', margin: '8px 0 2px' }}>₹300</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>Top Student Creator Grand Prize</p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', marginTop: 4 }}>Awarded to the creator with the highest composite growth score</p>
          </div>

          {/* Scoring Model Rubric */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px', marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#f1f1f5', marginBottom: 10 }}>
              📐 Official Creator Scoring Model (100% Total)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <div style={{ background: 'rgba(99,102,241,0.08)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>Qualified Registrations</span>
                  <strong style={{ color: '#f1f1f5' }}>60%</strong>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', margin: '2px 0 0' }}>Verified unique student signups</p>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.08)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>Click-Through Rate (CTR)</span>
                  <strong style={{ color: '#f1f1f5' }}>20%</strong>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', margin: '2px 0 0' }}>Clicks / Reach engagement</p>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.08)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fcd34d', fontWeight: 700 }}>Engagement</span>
                  <strong style={{ color: '#f1f1f5' }}>10%</strong>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', margin: '2px 0 0' }}>Saves, shares, comments</p>
              </div>
              <div style={{ background: 'rgba(236,72,153,0.08)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#f472b6', fontWeight: 700 }}>Creativity</span>
                  <strong style={{ color: '#f1f1f5' }}>10%</strong>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', margin: '2px 0 0' }}>Message clarity & hook</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Referral Rewards */}
      {(activeTab === 'all' || activeTab === 'referral') && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p className="section-label" style={{ color: '#34d399', marginBottom: 4 }}>REFERRAL LEADERBOARD PRIZES</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                🏆 2. Campus Referral Leaderboard (Total: ₹500)
              </h2>
            </div>
            <span className="chip chip-green">Condition: Verified unique registrations</span>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
            Top 3 student captains or batchmates who drive the highest volume of verified unique registrations during the 7-day campaign.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.03))',
              border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥇</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#fbbf24', margin: '8px 0 2px' }}>₹250</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#1 Referral Winner</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>Top verified student referral leader</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(156,163,175,0.12), rgba(156,163,175,0.03))',
              border: '1px solid rgba(156,163,175,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥈</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#9ca3af', margin: '8px 0 2px' }}>₹150</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#2 Referral Runner-Up</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>Second highest verified referrals</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(217,119,6,0.12), rgba(217,119,6,0.03))',
              border: '1px solid rgba(217,119,6,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥉</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#d97706', margin: '8px 0 2px' }}>₹100</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#3 Referral Third Place</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>Third highest verified referrals</p>
            </div>
          </div>

          {/* Anti-fraud note */}
          <div style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(241,241,245,0.7)',
          }}>
            <strong style={{ color: '#fca5a5' }}>Anti-Spam Policy:</strong> Do not reward fake or spam registrations. A referral counts only when:
            <span style={{ color: '#34d399', fontWeight: 600, marginLeft: 6 }}>
              Qualified Referral = unique student + valid registration + verification.
            </span>
          </div>
        </div>
      )}

      {/* SECTION 3: AI Project Competition */}
      {(activeTab === 'all' || activeTab === 'competition') && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <p className="section-label" style={{ color: '#818cf8', marginBottom: 4 }}>POST-WORKSHOP SHOWCASE</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                ⚡ 3. AI Project Competition (Total: ₹900)
              </h2>
            </div>
            <span className="chip chip-brand">Post-Workshop Engagement</span>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
            After workshop participation, students build and submit their AI project to demonstrate authentic skills.
            This ₹900 pool is a <strong>post-workshop engagement incentive</strong>, not top-of-funnel acquisition spend.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.03))',
              border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#818cf8', margin: '8px 0 2px' }}>₹400</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#1 Best AI Project</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>Grand prize post-workshop winner</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥈</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#34d399', margin: '8px 0 2px' }}>₹300</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#2 Project Runner-Up</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>High-scoring functional implementation</p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))',
              border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥉</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#fcd34d', margin: '8px 0 2px' }}>₹200</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: 0 }}>#3 Project Third Place</p>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4 }}>Strong creative or utility solution</p>
            </div>
          </div>

          {/* 5-Criteria Rubric */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '18px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#f1f1f5', marginBottom: 12 }}>
              📐 Official Evaluation Criteria (100% Total)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_REWARDS_CONFIG.evaluationCriteria.map(item => (
                <div key={item.criterion}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f1f5' }}>{item.criterion}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#818cf8' }}>{item.weight}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6, marginBottom: 4 }}>
                    <div style={{ width: `${item.weight * 3.33}%`, height: '100%', background: '#6366f1', borderRadius: 999 }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(241,241,245,0.7)',
          }}>
            <strong>Evaluation Protocol:</strong> AI assists evaluation; final awards are human-decided.
          </div>
        </div>
      )}

      {/* SECTION 4: ₹2,000 Budget Breakdown Table */}
      {(activeTab === 'all' || activeTab === 'budget') && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p className="section-label" style={{ color: '#fcd34d', marginBottom: 4 }}>FINANCIAL INTEGRITY</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                ₹2,000 Total Campaign Budget
              </h2>
            </div>
            <span className="chip chip-amber">Exactly ₹2,000</span>
          </div>

          {/* Table display */}
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: 'rgba(241,241,245,0.5)', fontWeight: 700 }}>Allocation</th>
                  <th style={{ padding: '10px 14px', color: 'rgba(241,241,245,0.5)', fontWeight: 700 }}>Strategic Mechanism</th>
                  <th style={{ padding: '10px 14px', color: 'rgba(241,241,245,0.5)', fontWeight: 700, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '10px 14px', color: 'rgba(241,241,245,0.5)', fontWeight: 700, textAlign: 'right' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f59e0b' }}>Creator Challenge</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.7)' }}>Prize for top-performing student content creator (60% qualified regs)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#f1f1f5', textAlign: 'right' }}>₹300</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.5)', textAlign: 'right' }}>15%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#10b981' }}>Referral Rewards</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.7)' }}>Top 3 campus referrers (#1 ₹250, #2 ₹150, #3 ₹100)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#f1f1f5', textAlign: 'right' }}>₹500</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.5)', textAlign: 'right' }}>25%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#818cf8' }}>AI Project Competition</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.7)' }}>Post-workshop project showcase prizes (#1 ₹400, #2 ₹300, #3 ₹200)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#f1f1f5', textAlign: 'right' }}>₹900</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.5)', textAlign: 'right' }}>45%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f59e0b' }}>Contingency</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.7)' }}>Safety reserve buffer for unexpected campaign distribution costs</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#f1f1f5', textAlign: 'right' }}>₹300</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(241,241,245,0.5)', textAlign: 'right' }}>15%</td>
                </tr>
                <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#818cf8' }}>TOTAL</td>
                  <td style={{ padding: '14px', color: 'rgba(241,241,245,0.7)', fontStyle: 'italic' }}>
                    Zero budget leak; disciplined growth resource allocation
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#34d399', fontSize: 16, textAlign: 'right' }}>₹2,000</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#818cf8', textAlign: 'right' }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px',
            fontSize: 12, color: 'rgba(241,241,245,0.6)', lineHeight: 1.6,
          }}>
            <strong>Important Growth Architecture Note:</strong> The ₹900 project competition is a <strong>post-workshop engagement incentive</strong> designed to drive attendance-to-completion, not top-of-funnel acquisition spend. Top-of-funnel acquisition is driven by campus captains, verified student referrals, and the ₹300 Creator Challenge.
          </div>
        </div>
      )}

      {/* Demo Workshop Submissions */}
      <div className="card">
        <p style={{ fontSize: 15, fontWeight: 800, color: '#f1f1f5', marginBottom: 12 }}>
          💡 Illustrative Workshop Project Submissions (Simulation Data)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEMO_WORKSHOP_PROJECTS.slice(0, 3).map(proj => (
            <div key={proj.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{proj.rank === 1 ? '🥇' : proj.rank === 2 ? '🥈' : '🥉'}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f1f5' }}>{proj.projectName}</span>
                  <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)' }}>by {proj.studentName} ({proj.college})</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.55)', margin: '4px 0 0' }}>{proj.summary}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>{proj.totalScore}/100</span>
                <p style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, margin: '2px 0 0' }}>Reward: ₹{proj.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
