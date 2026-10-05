import React, { useState } from 'react';
import { DEMO_WORKSHOP_PROJECTS, DEMO_REFERRAL_LEADERBOARD, DEMO_REWARDS_CONFIG } from '../demoData';

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'creator' | 'referral' | 'competition' | 'budget'>('all');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            🎁 Campaign Rewards & Prize System
          </h1>
          <span className="chip chip-amber">₹2,000 Total Allocation</span>
          <span className="chip chip-demo">Simulation Assumptions</span>
        </div>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Incentive architecture designed to reward student promotional creators, quality peer distribution, and post-workshop hands-on project creation.
        </p>
      </div>

      {/* Disclaimers & Governance Alert */}
      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 20 }}>⚖️</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#92400e', margin: '0 0 4px' }}>
            Campaign Simulation Notice & Human-in-the-Loop Governance
          </p>
          <p style={{ fontSize: 12, color: '#78350f', margin: 0, lineHeight: 1.6 }}>
            Rewards are campaign simulation assumptions and would require organizer approval before a real-world campaign launch.
            All AI-assisted scoring and grading serve solely as support mechanisms; <strong>final judging and prize decisions are strictly human-controlled.</strong>
          </p>
        </div>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 0, flexWrap: 'wrap' }}>
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
              <p className="section-label" style={{ color: '#b45309', marginBottom: 4 }}>CREATOR CONTENT COMPETITION</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🎬 1. Student Creator Growth Challenge (Prize: ₹300)
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="chip chip-brand" style={{ fontWeight: 700 }}>Budget: ₹300</span>
              <span className="chip chip-demo" style={{ fontWeight: 700 }}>Status: SIMULATION</span>
              <span className="chip chip-amber" style={{ fontWeight: 700 }}>🏆 WINNER PRIZE: ₹300</span>
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
            Instead of spending ₹300 on cold paid ads, ₹300 is awarded as a performance prize to the student creator who drives the best verified workshop acquisition. Content formats include Instagram Reels, WhatsApp creatives, LinkedIn posts, X threads, and short videos.
          </p>

          <div style={{
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '1px solid #fde68a', borderRadius: 12, padding: '20px', textAlign: 'center', marginBottom: 16,
          }}>
            <span style={{ fontSize: 36 }}>🏆</span>
            <p style={{ fontSize: 30, fontWeight: 900, color: '#b45309', margin: '8px 0 2px' }}>₹300</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Top Student Creator Grand Prize</p>
            <p style={{ fontSize: 12, color: '#78350f', marginTop: 4 }}>Awarded to the creator with the highest composite growth score</p>
          </div>

          {/* Scoring Model Rubric */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <strong style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                📐 Published Creator Scoring Model (100% Total)
              </strong>
              <span style={{ fontSize: 12, color: '#047857', fontWeight: 800 }}>
                Focus on Actual Growth &gt; Vanity Views 🎯
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4338ca', fontWeight: 700 }}>Qualified Registrations</span>
                  <strong style={{ color: '#0f172a' }}>60%</strong>
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>Verified unique student signups</p>
              </div>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#047857', fontWeight: 700 }}>Click-Through Rate (CTR)</span>
                  <strong style={{ color: '#0f172a' }}>20%</strong>
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>Clicks / Reach engagement</p>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b45309', fontWeight: 700 }}>Engagement</span>
                  <strong style={{ color: '#0f172a' }}>10%</strong>
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>Saves, shares, comments</p>
              </div>
              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#be185d', fontWeight: 700 }}>Creativity</span>
                  <strong style={{ color: '#0f172a' }}>10%</strong>
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0' }}>Message clarity & hook</p>
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
              <p className="section-label" style={{ color: '#047857', marginBottom: 4 }}>REFERRAL LEADERBOARD PRIZES</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🏆 2. Campus Referral Leaderboard (Total: ₹500)
              </h2>
            </div>
            <span className="chip chip-green">Condition: Verified unique registrations</span>
          </div>

          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
            Top 3 student captains or batchmates who drive the highest volume of verified unique registrations during the 7-day campaign.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥇</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#b45309', margin: '8px 0 2px' }}>₹250</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#1 Referral Winner</p>
              <p style={{ fontSize: 11, color: '#78350f', marginTop: 4 }}>Top verified student referral leader</p>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥈</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#475569', margin: '8px 0 2px' }}>₹150</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#2 Referral Runner-Up</p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Second highest verified referrals</p>
            </div>

            <div style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥉</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#c2410c', margin: '8px 0 2px' }}>₹100</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#3 Referral Third Place</p>
              <p style={{ fontSize: 11, color: '#7c2d12', marginTop: 4 }}>Third highest verified referrals</p>
            </div>
          </div>

          {/* Anti-fraud note */}
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#991b1b',
          }}>
            <strong style={{ color: '#dc2626' }}>Anti-Spam Policy:</strong> Do not reward fake or spam registrations. A referral counts only when:
            <span style={{ color: '#047857', fontWeight: 600, marginLeft: 6 }}>
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
              <p className="section-label" style={{ color: '#4338ca', marginBottom: 4 }}>POST-WORKSHOP SHOWCASE</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ⚡ 3. AI Project Competition (Total: ₹900)
              </h2>
            </div>
            <span className="chip chip-brand">Post-Workshop Engagement</span>
          </div>

          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
            After workshop participation, students build and submit their AI project to demonstrate authentic skills.
            This ₹900 pool is a <strong style={{ color: '#0f172a' }}>post-workshop engagement incentive</strong>, not top-of-funnel acquisition spend.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{
              background: '#eef2ff',
              border: '1px solid #c7d2fe', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🏆</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#4338ca', margin: '8px 0 2px' }}>₹400</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#1 Best AI Project</p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Grand prize post-workshop winner</p>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥈</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#047857', margin: '8px 0 2px' }}>₹300</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#2 Project Runner-Up</p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>High-scoring functional implementation</p>
            </div>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a', borderRadius: 12, padding: '18px', textAlign: 'center',
            }}>
              <span style={{ fontSize: 32 }}>🥉</span>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#b45309', margin: '8px 0 2px' }}>₹200</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>#3 Project Third Place</p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Strong creative or utility solution</p>
            </div>
          </div>

          {/* 5-Criteria Rubric */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              📐 Official Evaluation Criteria (100% Total)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_REWARDS_CONFIG.evaluationCriteria.map(item => (
                <div key={item.criterion}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.criterion}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#4338ca' }}>{item.weight}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6, marginBottom: 4 }}>
                    <div style={{ width: `${item.weight * 3.33}%`, height: '100%', background: '#4f46e5', borderRadius: 999 }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#eef2ff', border: '1px solid #c7d2fe',
            borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#334155',
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
              <p className="section-label" style={{ color: '#b45309', marginBottom: 4 }}>FINANCIAL INTEGRITY</p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ₹2,000 Total Campaign Budget
              </h2>
            </div>
            <span className="chip chip-amber">Exactly ₹2,000</span>
          </div>

          {/* Table display */}
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Allocation</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700 }}>Strategic Mechanism</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '10px 14px', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#b45309' }}>Creator Challenge</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>Prize for top-performing student content creator (60% qualified regs)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>₹300</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', textAlign: 'right' }}>15%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#047857' }}>Referral Rewards</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>Top 3 campus referrers (#1 ₹250, #2 ₹150, #3 ₹100)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>₹500</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', textAlign: 'right' }}>25%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#4338ca' }}>AI Project Competition</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>Post-workshop project showcase prizes (#1 ₹400, #2 ₹300, #3 ₹200)</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>₹900</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', textAlign: 'right' }}>45%</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#b45309' }}>Contingency</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>Safety reserve buffer for unexpected campaign distribution costs</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>₹300</td>
                  <td style={{ padding: '12px 14px', color: '#64748b', textAlign: 'right' }}>15%</td>
                </tr>
                <tr style={{ background: '#eef2ff' }}>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#4338ca' }}>TOTAL</td>
                  <td style={{ padding: '14px', color: '#475569', fontStyle: 'italic' }}>
                    Zero budget leak; disciplined growth resource allocation
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#047857', fontSize: 16, textAlign: 'right' }}>₹2,000</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#4338ca', textAlign: 'right' }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px',
            fontSize: 12, color: '#334155', lineHeight: 1.6,
          }}>
            <strong>Important Growth Architecture Note:</strong> The ₹900 project competition is a <strong>post-workshop engagement incentive</strong> designed to drive attendance-to-completion, not top-of-funnel acquisition spend. Top-of-funnel acquisition is driven by campus captains, verified student referrals, and the ₹300 Creator Challenge.
          </div>
        </div>
      )}

      {/* Demo Workshop Submissions */}
      <div className="card">
        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
          💡 Illustrative Workshop Project Submissions (Simulation Data)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEMO_WORKSHOP_PROJECTS.slice(0, 3).map(proj => (
            <div key={proj.id} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{proj.rank === 1 ? '🥇' : proj.rank === 2 ? '🥈' : '🥉'}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{proj.projectName}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>by {proj.studentName} ({proj.college})</span>
                </div>
                <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>{proj.summary}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#047857' }}>{proj.totalScore}/100</span>
                <p style={{ fontSize: 11, color: '#b45309', fontWeight: 700, margin: '2px 0 0' }}>Reward: ₹{proj.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
