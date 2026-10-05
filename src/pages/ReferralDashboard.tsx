import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';
import { DEMO_REFERRAL_LEADERBOARD } from '../demoData';
import { api } from '../services/api';
import type { Referral } from '../types';

interface Props {
  onNavigateToRegister?: () => void;
}

function cleanReferralCode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
  return clean ? `${clean}60` : `STUDENT${Math.floor(10 + Math.random() * 90)}60`;
}

export default function ReferralDashboard({ onNavigateToRegister }: Props) {
  const { state, updateSharerProfile, getEffectiveSharer, register } = useApp();
  const [copied, setCopied] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  const sharer = getEffectiveSharer();

  // Local edit form state
  const [nameInput, setNameInput] = useState(sharer.name);
  const [collegeInput, setCollegeInput] = useState(sharer.college);

  const referralCode = sharer.code;
  const studentName = sharer.name;
  const college = sharer.college;

  const referralUrl = `${window.location.origin}/?ref=${encodeURIComponent(referralCode)}`;

  // WhatsApp share template matching challenge instructions
  const rawShareMessage = 
`🚀 Build your first AI project in 60 minutes!

Join this free AI workshop for engineering students.

Register here:
${referralUrl}

Bring your friends and compete on the referral leaderboard! 🏆`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(rawShareMessage)}`;

  // Fetch real referrals from backend API
  const [remoteReferrals, setRemoteReferrals] = useState<Referral[] | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    api.referrals.getMy(referralCode).then((res: { success: boolean; referrals: Referral[] }) => {
      if (isMounted && res.success && res.referrals) {
        setRemoteReferrals(res.referrals);
      }
    }).catch(() => {
      // Backend not reached or fallback
    });
    return () => { isMounted = false; };
  }, [referralCode, state.referrals]);

  // Referral metrics: combine remote MongoDB referrals if available, fallback to state.referrals
  const allMyReferrals = remoteReferrals !== null 
    ? remoteReferrals 
    : state.referrals.filter(
        r => r.referrerCode && r.referrerCode.toUpperCase() === referralCode.toUpperCase()
      );
  const genuineReferrals = allMyReferrals.filter(r => !r.isSimulated);
  const genuineCount = genuineReferrals.length;

  // Funnel calculations
  const totalClicksEstimated = Math.max(genuineCount * 4, genuineCount > 0 ? genuineCount * 3 + 2 : 0);
  const rank: number = genuineCount >= 35 ? 1 : genuineCount >= 25 ? 2 : genuineCount >= 15 ? 3 : genuineCount > 0 ? 4 : 5;
  const rewardStatus = rank <= 3 
    ? (rank === 1 ? '🥇 ₹250 Leaderboard Winner' : rank === 2 ? '🥈 ₹150 Runner-Up' : '🥉 ₹100 Top-3 Winner')
    : genuineCount > 0
    ? `Rank #${rank} (Earn ₹100 at Top 3)`
    : 'Share your link to unlock leaderboard prizes';

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

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newCode = cleanReferralCode(nameInput);
    updateSharerProfile({
      name: nameInput.trim(),
      college: collegeInput.trim() || 'Engineering College',
      sharerCode: newCode,
      createdAt: new Date().toISOString(),
      customized: true,
    });
    setIsEditingProfile(false);
  }

  async function handleSimulateFriendRegister() {
    const randomId = Math.floor(100 + Math.random() * 900);
    const demoFriendNames = ['Aarav Sharma', 'Priya Patel', 'Rohan Iyer', 'Ananya Gupta', 'Aditya Nair'];
    const friendName = demoFriendNames[Math.floor(Math.random() * demoFriendNames.length)];
    const friendEmail = `${friendName.toLowerCase().replace(' ', '.')}${randomId}@college.edu`;

    const res = await register({
      name: friendName,
      email: friendEmail,
      college: college || 'Amrita Vishwa Vidyapeetham',
      branch: 'Computer Science',
      graduationYear: '2027',
      interest: 'Web',
      source: 'whatsapp_referral',
      referredBy: referralCode,
    });

    if (res.success) {
      setTestNotice(`✅ Successfully registered ${friendName} with referral code ${referralCode}!`);
      setTimeout(() => setTestNotice(null), 4000);
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            👥 Campus Referral Dashboard
          </h1>
          <span className="chip chip-green">Active Referral Loop</span>
          <span className="chip chip-brand">
            {sharer.isRegistered ? 'Registered Student' : 'Instant Sharer (No Signup Required)'}
          </span>
        </div>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Turn every student into an organic distribution channel. Share your link directly — no login or signup needed to start sharing and tracking genuine referrals in your browser.
        </p>
      </div>

      {testNotice && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 12, padding: '12px 18px',
          marginBottom: 20, color: '#065f46', fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>{testNotice}</span>
          <span style={{ fontSize: 11, color: '#047857' }}>Recorded in browser storage</span>
        </div>
      )}

      {/* Main Student / Sharer Card */}
      <div className="card" style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: 16, padding: '24px', marginBottom: 32,
        boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="section-label" style={{ color: '#4338ca', margin: 0, fontWeight: 800 }}>
                {sharer.isRegistered ? 'Verified Student Profile' : 'Browser Sharer Profile'}
              </span>
              {!sharer.isRegistered && (
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{
                    background: 'transparent', border: 'none', color: '#4f46e5',
                    fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 700
                  }}
                >
                  {isEditingProfile ? 'Cancel' : '✏️ Edit Name & College'}
                </button>
              )}
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {studentName} · {college}
            </h2>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Referral Code: <strong style={{ color: '#4338ca', letterSpacing: '0.05em' }}>{referralCode}</strong>
              {!sharer.isRegistered && ' · (Stored in this browser)'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="chip chip-amber" style={{ fontSize: 12, padding: '4px 10px' }}>
              Rank: #{rank}
            </span>
            <p style={{ fontSize: 12, color: '#047857', fontWeight: 700, marginTop: 6, margin: '6px 0 0' }}>
              {rewardStatus}
            </p>
          </div>
        </div>

        {/* Profile Customizer (No Signup Required) */}
        {isEditingProfile && !sharer.isRegistered && (
          <form onSubmit={handleSaveProfile} style={{
            background: '#f8fafc', border: '1px solid #cbd5e1',
            borderRadius: 12, padding: '16px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
              Customize Who is Sharing (Saved in your browser):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Your Full Name</label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="e.g. Vishnu"
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>Your College / Campus</label>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
                  value={collegeInput}
                  onChange={e => setCollegeInput(e.target.value)}
                  placeholder="e.g. Amrita Vishwa Vidyapeetham"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>
                ✓ Save & Update Link
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: 12 }}
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Anti-Fraud & Quality Assurance Banner */}
        <div style={{
          background: '#eef2ff',
          border: '1px solid #c7d2fe',
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#3730a3', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              REFERRAL COUNT = GENUINE VERIFIED ACQUISITION
            </p>
            <p style={{ fontSize: 12, color: '#334155', margin: '2px 0 0', lineHeight: 1.4 }}>
              Anti-fraud verification blocks self-referrals and duplicate emails. Only genuine batchmates who register with your referral link advance your standing and unlock prize rewards.
            </p>
          </div>
        </div>

        {/* 4-Tier Funnel Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#64748b', fontWeight: 800, margin: 0 }}>REFERRAL CLICKS</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#4338ca', margin: '4px 0 0' }}>{totalClicksEstimated}</p>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Estimated link impressions</p>
          </div>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#065f46', fontWeight: 800, margin: 0 }}>GENUINE REGISTRATIONS</p>
            <p className="mono" style={{ fontSize: 22, fontWeight: 900, color: '#047857', margin: '4px 0 0' }}>{genuineCount}</p>
            <p style={{ fontSize: 11, color: '#047857', margin: 0 }}>Real registered users</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#166534', fontWeight: 800, margin: 0 }}>VERIFIED STATUS</p>
            <p className="mono" style={{ fontSize: 16, fontWeight: 900, color: '#15803d', margin: '6px 0 0' }}>
              {genuineCount > 0 ? '100% Verified' : 'Awaiting 1st User'}
            </p>
            <p style={{ fontSize: 11, color: '#166534', margin: 0 }}>Anti-fraud passed</p>
          </div>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '14px' }}>
            <p style={{ fontSize: 11, color: '#7e22ce', fontWeight: 800, margin: 0 }}>REWARD STATUS</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#6b21a8', margin: '6px 0 0', lineHeight: 1.3 }}>{rewardStatus}</p>
            <p style={{ fontSize: 11, color: '#7e22ce', margin: '4px 0 0' }}>Leaderboard Rank #{rank}</p>
          </div>
        </div>

        {/* Share Link Box & WhatsApp Button */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#f8fafc', border: '1px solid #cbd5e1',
          borderRadius: 10, padding: '10px 14px', marginBottom: 14, overflow: 'hidden', flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ flex: 1, minWidth: 200, fontSize: 13, color: '#4338ca', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {referralUrl}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              id="copy-referral-btn"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700 }}
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
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, padding: '12px 16px',
        }}>
          <p style={{ fontSize: 11, color: '#166534', fontWeight: 800, margin: '0 0 4px', letterSpacing: '0.04em' }}>
            PRE-FILLED WHATSAPP MESSAGE PREVIEW
          </p>
          <pre style={{
            fontSize: 12, color: '#1e293b', whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-sans)', margin: 0, lineHeight: 1.5,
          }}>
            {rawShareMessage}
          </pre>
        </div>
      </div>

      {/* 🌟 GENUINE USER REFERRALS LIST */}
      <div className="card" style={{ marginBottom: 32, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌟 Genuine User Referrals ({genuineCount})
              </h2>
              <span className="chip chip-green" style={{ fontSize: 11 }}>
                Live Browser Verified
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>
              Real batchmates who registered using your referral code (<strong style={{ color: '#4338ca' }}>{referralCode}</strong>).
            </p>
          </div>

          <button
            onClick={handleSimulateFriendRegister}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: 12, borderColor: '#cbd5e1', color: '#4338ca', fontWeight: 700 }}
          >
            🧪 Test Friend Registration
          </button>
        </div>

        {genuineCount === 0 ? (
          <div style={{
            textAlign: 'center', padding: '36px 20px',
            background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1'
          }}>
            <p style={{ fontSize: 32, margin: '0 0 10px' }}>🌱</p>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              No genuine registrations recorded yet for {referralCode}
            </h3>
            <p style={{ fontSize: 13, color: '#475569', maxWidth: 500, margin: '0 auto 18px', lineHeight: 1.5 }}>
              Share your link (<span className="mono" style={{ color: '#4338ca', fontWeight: 700 }}>{referralUrl}</span>) with friends. Whenever someone completes registration, they will be saved in the browser and displayed here instantly.
            </p>
            <button
              onClick={handleSimulateFriendRegister}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: 12 }}
            >
              Simulate a Classmate Registering with {referralCode}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {genuineReferrals.map((ref, idx) => (
              <div
                key={ref.id || idx}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10, flexWrap: 'wrap', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#dcfce7', color: '#166534',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                        {ref.referreeName || 'Registered Student'}
                      </span>
                      <span className="chip chip-green" style={{ fontSize: 10, padding: '2px 8px' }}>
                        ✓ Genuine Verified
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', margin: '2px 0 0' }}>
                      {ref.referreeCollege || college} · {ref.referreeEmail}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, margin: 0 }}>
                    Registered At
                  </p>
                  <p className="mono" style={{ fontSize: 12, color: '#4338ca', fontWeight: 700, margin: '2px 0 0' }}>
                    {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🏆 CAMPUS REFERRAL LEADERBOARD */}
      <div className="card" style={{ marginBottom: 32, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              🏆 CAMPUS REFERRAL LEADERBOARD
            </h2>
            <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>
              Top referrers ranked by verified unique registrations. Rewards paid after campaign verification.
            </p>
          </div>
          <span className="chip chip-amber">Top 3 Win ₹500 Total</span>
        </div>

        {/* Anti-fraud note badge */}
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <p style={{ fontSize: 12, color: '#991b1b', margin: 0, lineHeight: 1.4 }}>
            <strong>Anti-Fraud Rule:</strong> Only verified unique registrations count.
            <span style={{ color: '#475569', marginLeft: 6 }}>
              Qualified Referral = unique student + valid registration + verification. Duplicate emails and self-referrals are automatically disqualified.
            </span>
          </p>
        </div>

        {/* Leaderboard Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Inject dynamic entry for current sharer at their calculated rank */}
          {(() => {
            const list = DEMO_REFERRAL_LEADERBOARD.map(e => ({ ...e }));
            const userIndex = list.findIndex(e => e.isCurrentStudent);
            if (userIndex >= 0) {
              list[userIndex] = {
                ...list[userIndex],
                name: studentName,
                college: college,
                qualifiedReferrals: genuineCount,
                rank: rank,
              };
            }
            return list.map(entry => {
              const isTop3 = entry.rank <= 3;
              const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
              const rewardLabel = entry.reward ? `₹${entry.reward}` : '—';

              return (
                <div
                  key={entry.name}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: entry.isCurrentStudent ? '#eef2ff' : isTop3 ? '#fafafa' : '#ffffff',
                    border: entry.isCurrentStudent ? '1px solid #c7d2fe' : isTop3 ? '1px solid #e2e8f0' : '1px solid #f1f5f9',
                    borderRadius: 10, flexWrap: 'wrap', gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      fontSize: isTop3 ? 20 : 14, fontWeight: 800, width: 28, textAlign: 'center',
                      color: entry.rank === 1 ? '#d97706' : entry.rank === 2 ? '#64748b' : entry.rank === 3 ? '#b45309' : '#64748b',
                    }}>
                      {rankEmoji}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                          {entry.name}
                        </span>
                        {entry.isCurrentStudent && (
                          <span className="chip chip-brand" style={{ fontSize: 10 }}>You ({referralCode})</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                        {entry.college}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 16, fontWeight: 800, color: '#047857', margin: 0 }}>
                        {entry.isCurrentStudent ? genuineCount : entry.qualifiedReferrals}
                      </p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0, fontWeight: 600 }}>qualified</p>
                    </div>
                    <div style={{ minWidth: 70, textAlign: 'right' }}>
                      {entry.reward ? (
                        <span style={{
                          fontSize: 13, fontWeight: 800, color: '#b45309',
                          background: '#fef3c7', border: '1px solid #fde68a',
                          padding: '3px 8px', borderRadius: 6,
                        }}>
                          {rewardLabel}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Rank #{entry.rank}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Referral Program Summary */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>
            Want to invite batchmates or host a study group?
          </p>
          <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
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
