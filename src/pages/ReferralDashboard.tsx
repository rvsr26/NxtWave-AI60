import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';
import { DEMO_REFERRAL_LEADERBOARD } from '../demoData';

interface Props {
  onNavigateToRegister?: () => void;
}

export default function ReferralDashboard({ onNavigateToRegister }: Props) {
  const { state } = useApp();
  const [copied, setCopied] = useState(false);

  // If student registered in session, use their real code; otherwise use default demo profile
  const currentReg = state.currentRegistration;
  const referralCode = currentReg ? currentReg.referralCode : 'VISHNU26';
  const studentName = currentReg ? currentReg.name.split(' ')[0] : 'Vishnu';
  const college = currentReg ? currentReg.college : 'BITS Pilani';

  const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${referralCode}`;

  // WhatsApp share template matching challenge instructions
  const rawShareMessage = 
`🚀 Build your first AI project in 60 minutes!

Join this free AI workshop for engineering students.

Register here:
${referralUrl}

Bring your friends and compete on the referral leaderboard! 🏆`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(rawShareMessage)}`;

  // Referral metrics (actual demo events vs simulated leaderboard)
  const actualReferrals = state.referrals.filter(r => r.referrerCode === referralCode);
  const actualQualifiedCount = actualReferrals.filter(r => r.isVerified !== false).length;

  // If user has demo/real referrals, use them; fallback to illustrative default profile (7 qualified, #4 rank)
  const qualifiedCount = currentReg ? Math.max(actualQualifiedCount, 0) : 7;
  const totalClicksEstimated = Math.max(qualifiedCount * 4, 18);
  const conversionRate = totalClicksEstimated > 0 
    ? ((qualifiedCount / totalClicksEstimated) * 100).toFixed(1) 
    : '22.5';
  const rank: number = currentReg 
    ? (qualifiedCount > 34 ? 1 : qualifiedCount > 27 ? 2 : qualifiedCount > 21 ? 3 : qualifiedCount > 0 ? 4 : 5) 
    : 4;
  const rewardStatus = rank <= 3 
    ? (rank === 1 ? '🥇 ₹250 Leaderboard Winner' : rank === 2 ? '🥈 ₹150 Runner-Up' : '🥉 ₹100 Top-3 Winner')
    : 'Next reward: Top 3 leaderboard (₹100 at #3)';

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      Analytics.referralLinkCopied(referralCode);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  }

  function shareWhatsApp() {
    Analytics.whatsappClicked(referralCode);
    window.open(whatsappShareUrl, '_blank');
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f1f5', letterSpacing: '-0.02em', margin: 0 }}>
            👥 Campus Referral Dashboard
          </h1>
          <span className="chip chip-green">Active Referral Loop</span>
          <span className="chip chip-demo">Illustrative Simulation Data</span>
        </div>
        <p style={{ color: 'rgba(241,241,245,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Turn every registered student into an organic distribution channel. Referrals qualify only after verified registration.
        </p>
      </div>

      {/* Main Student Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 16, padding: '24px', marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <span className="section-label" style={{ color: '#818cf8', marginBottom: 4 }}>Student Ambassador Profile</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f1f5', margin: '4px 0' }}>
              {studentName} · {college}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.5)', margin: 0 }}>
              Class of 2027 · AI60 Campus Representative
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="chip chip-amber" style={{ fontSize: 12, padding: '4px 10px' }}>
              Rank: #{rank}
            </span>
            <p style={{ fontSize: 12, color: '#34d399', fontWeight: 700, marginTop: 6, margin: '6px 0 0' }}>
              {rewardStatus}
            </p>
          </div>
        </div>

        {/* Anti-Fraud & Quality Assurance Banner */}
        <div style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#818cf8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              REFERRAL COUNT ≠ QUALIFIED ACQUISITION
            </p>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.8)', margin: '2px 0 0', lineHeight: 1.4 }}>
              Anti-fraud verification blocks self-referrals, duplicate emails, and invalid domains. Only unique engineering batchmates who complete verified registration advance your standing and unlock placement rewards.
            </p>
          </div>
        </div>

        {/* 4-Tier Funnel Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', fontWeight: 700, margin: 0 }}>REFERRAL CLICKS</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#818cf8', margin: '4px 0 0' }}>{totalClicksEstimated}</p>
            <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Total link impressions/clicks</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', fontWeight: 700, margin: 0 }}>RAW REGISTRATIONS</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#fcd34d', margin: '4px 0 0' }}>{qualifiedCount + (qualifiedCount > 0 ? 2 : 0)}</p>
            <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Pre-verification signups</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#34d399', fontWeight: 700, margin: 0 }}>VERIFIED REGISTRATIONS</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#34d399', margin: '4px 0 0' }}>{qualifiedCount}</p>
            <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', margin: 0 }}>Anti-fraud passed &amp; qualified</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, margin: 0 }}>REWARD STATUS</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', margin: '6px 0 0', lineHeight: 1.3 }}>{rewardStatus}</p>
            <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', margin: '4px 0 0' }}>Leaderboard Rank #{rank}</p>
          </div>
        </div>

        {/* Share Link Box & WhatsApp Button */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 14, overflow: 'hidden', flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ flex: 1, minWidth: 200, fontSize: 12, color: '#818cf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {referralUrl}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              id="copy-referral-btn"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: 12 }}
              onClick={copyLink}
            >
              {copied ? '✓ Copied' : '📋 Copy URL'}
            </button>
            <button
              id="whatsapp-share-btn"
              className="btn-green"
              style={{ padding: '8px 18px', fontSize: 12, fontWeight: 700 }}
              onClick={shareWhatsApp}
            >
              <span>💬</span> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* WhatsApp Pre-filled message preview */}
        <div style={{
          background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <p style={{ fontSize: 11, color: '#34d399', fontWeight: 700, margin: '0 0 4px' }}>
            PRE-FILLED WHATSAPP MESSAGE PREVIEW
          </p>
          <pre style={{
            fontSize: 12, color: 'rgba(241,241,245,0.8)', whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-sans)', margin: 0, lineHeight: 1.5,
          }}>
            {rawShareMessage}
          </pre>
        </div>
      </div>

      {/* 🏆 CAMPUS REFERRAL LEADERBOARD */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
              🏆 CAMPUS REFERRAL LEADERBOARD
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', margin: '4px 0 0' }}>
              Top referrers ranked by verified unique registrations. Rewards paid after campaign verification.
            </p>
          </div>
          <span className="chip chip-amber">Top 3 Win ₹500 Total</span>
        </div>

        {/* Anti-fraud note badge */}
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🛡</span>
          <p style={{ fontSize: 12, color: '#fca5a5', margin: 0, lineHeight: 1.4 }}>
            <strong>Anti-Fraud Rule:</strong> Only verified unique registrations count.
            <span style={{ color: 'rgba(241,241,245,0.6)', marginLeft: 6 }}>
              Qualified Referral = unique student + valid registration + verification. Duplicate emails and self-referrals are automatically disqualified.
            </span>
          </p>
        </div>

        {/* Leaderboard Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DEMO_REFERRAL_LEADERBOARD.map(entry => {
            const isTop3 = entry.rank <= 3;
            const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
            const rewardLabel = entry.reward ? `₹${entry.reward}` : '—';

            return (
              <div
                key={entry.name}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: entry.isCurrentStudent ? 'rgba(99,102,241,0.12)' : isTop3 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: entry.isCurrentStudent ? '1px solid rgba(99,102,241,0.4)' : isTop3 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 10, flexWrap: 'wrap', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: isTop3 ? 20 : 14, fontWeight: 800, width: 28, textAlign: 'center',
                    color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#9ca3af' : entry.rank === 3 ? '#d97706' : 'rgba(241,241,245,0.4)',
                  }}>
                    {rankEmoji}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 14 }}>
                        {entry.name}
                      </span>
                      {entry.isCurrentStudent && (
                        <span className="chip chip-brand" style={{ fontSize: 10 }}>You</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.45)', margin: '2px 0 0' }}>
                      {entry.college}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#34d399', margin: 0 }}>
                      {entry.qualifiedReferrals}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', margin: 0 }}>qualified</p>
                  </div>
                  <div style={{ minWidth: 70, textAlign: 'right' }}>
                    {entry.reward ? (
                      <span style={{
                        fontSize: 13, fontWeight: 800, color: '#fbbf24',
                        background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)',
                        padding: '3px 8px', borderRadius: 6,
                      }}>
                        {rewardLabel}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.3)' }}>Rank #{entry.rank}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral Program Summary */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f5', margin: '0 0 2px' }}>
            Want to invite batchmates or host a study group?
          </p>
          <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', margin: 0 }}>
            Every qualified registration pushes your campus higher in the Campus League and advances your rank.
          </p>
        </div>
        {onNavigateToRegister && (
          <button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }} onClick={onNavigateToRegister}>
            Register Another Student →
          </button>
        )}
      </div>
    </div>
  );
}
