import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';

interface Props {
  onExplore: () => void;
}

export default function SuccessPage({ onExplore }: Props) {
  const { state } = useApp();
  const reg = state.currentRegistration;
  const passport = state.currentPassport;
  const [copied, setCopied] = useState(false);

  if (!reg) return null;

  const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${reg.referralCode}`;

  const rawWhatsappMessage =
`🚀 Build your first AI project in 60 minutes!

Join this free AI workshop for engineering students.

Register here:
${referralUrl}

Bring your friends and compete on the referral leaderboard! 🏆`;

  const whatsappMessage = encodeURIComponent(rawWhatsappMessage);

  async function copyLink() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    Analytics.referralLinkCopied(reg!.referralCode);
    setTimeout(() => setCopied(false), 2500);
  }

  function shareWhatsApp() {
    Analytics.whatsappClicked(reg!.referralCode);
    window.open(`https://api.whatsapp.com/send?text=${whatsappMessage}`, '_blank');
  }

  // Count how many referrals this person has
  const myReferrals = state.referrals.filter(r => r.referrerCode === reg.referralCode).length;
  const qualifiedCount = myReferrals;
  const currentRank = qualifiedCount >= 34 ? 1 : qualifiedCount >= 27 ? 2 : qualifiedCount >= 21 ? 3 : qualifiedCount >= 18 ? 4 : 5;
  const rewardStatusText = currentRank <= 3
    ? (currentRank === 1 ? '🥇 ₹250 Leaderboard Winner' : currentRank === 2 ? '🥈 ₹150 Runner-Up' : '🥉 ₹100 3rd Place')
    : 'Next reward: Top 3 leaderboard (₹100 at #3)';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
        {/* Celebration */}
        <div style={{
          fontSize: 64, marginBottom: 16,
          animation: 'fadeInUp 0.5s ease forwards',
        }}>
          🎉
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 4vw, 36px)',
          fontWeight: 900, color: '#0f172a',
          letterSpacing: '-0.02em', marginBottom: 8,
        }}>
          You're in, {reg.name.split(' ')[0]}!
        </h2>
        <p style={{ color: '#0f172a', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          Your seat is reserved for <strong>Build Your First AI Project in 60 Minutes</strong>.<br />
          Now share your referral link and compete on the campus leaderboard!
        </p>

        {/* Passport recap */}
        {passport && (
          <div className="card" style={{
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            marginBottom: 24, textAlign: 'left',
          }}>
            <p className="section-label" style={{ color: '#4338ca', marginBottom: 8 }}>Your Confirmed Project Passport</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#ffffff',
              }}>🤖</div>
              <div>
                <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 17, margin: 0 }}>{passport.projectName}</p>
                <p style={{ fontSize: 13, color: '#0f172a', marginTop: 2, margin: '2px 0 0', fontWeight: 600 }}>
                  {passport.difficulty} · {passport.interest} · {reg.branch}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Referral Dashboard Section */}
        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, margin: 0 }}>
              👥 Your Referral Dashboard
            </p>
            <span className="chip chip-amber">
              Rank: #{currentRank}
            </span>
          </div>

          {/* 4 Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>REFERRAL CODE</p>
              <p className="mono" style={{ fontSize: 16, fontWeight: 900, color: '#4338ca', margin: '4px 0 0' }}>{reg.referralCode}</p>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>QUALIFIED REFERRALS</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#047857', margin: '4px 0 0' }}>{qualifiedCount}</p>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>CURRENT RANK</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#b45309', margin: '4px 0 0' }}>#{currentRank}</p>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#0f172a', fontWeight: 800, margin: 0 }}>REWARD STATUS</p>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#047857', margin: '4px 0 0', lineHeight: 1.3 }}>{rewardStatusText}</p>
            </div>
          </div>

          {/* Reward Status Banner */}
          <div style={{
            background: qualifiedCount >= 3 ? '#ecfdf5' : '#eef2ff',
            border: `1px solid ${qualifiedCount >= 3 ? '#a7f3d0' : '#c7d2fe'}`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: qualifiedCount >= 3 ? '#047857' : '#4338ca', marginBottom: 4, margin: '0 0 4px' }}>
              🏆 Top 3 Referral Rewards: #1 ₹250 · #2 ₹150 · #3 ₹100
            </p>
            <p style={{ fontSize: 12, color: '#0f172a', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              Referrals qualify only after verified registration. Anti-fraud checks prevent duplicate signups and self-referrals.
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 10, padding: '10px 14px',
            marginBottom: 14, overflow: 'hidden',
          }}>
            <span className="mono" style={{
              flex: 1, fontSize: 12, color: '#4338ca',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {referralUrl}
            </span>
            <span className="chip chip-brand" style={{ flexShrink: 0 }}>
              {reg.referralCode}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              id="copy-referral-btn"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={copyLink}
            >
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>
            <button
              id="whatsapp-share-btn"
              className="btn-green"
              style={{ flex: 1 }}
              onClick={shareWhatsApp}
            >
              <span>💬</span> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Campus info */}
        {reg.campus && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 12, padding: '16px', marginBottom: 24,
            textAlign: 'left',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#b45309', marginBottom: 4, margin: '0 0 4px' }}>
              🏫 Campus Code: {reg.campus}
            </p>
            <p style={{ fontSize: 13, color: '#0f172a', margin: 0, fontWeight: 500 }}>
              Your registration counts toward your campus score in the AI60 Campus League!
            </p>
          </div>
        )}

        {/* Registration details */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28,
        }}>
          {[
            { label: 'Name', value: reg.name },
            { label: 'College', value: reg.college },
            { label: 'Referral Code', value: reg.referralCode },
            { label: 'Registered', value: new Date(reg.registeredAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 10, padding: '12px 14px',
              textAlign: 'left',
              boxShadow: '0 1px 3px rgba(15,23,42,0.02)',
            }}>
              <p className="section-label" style={{ marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }} className={label === 'Referral Code' ? 'mono' : ''}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <button
          id="explore-growth-os-btn"
          className="btn-secondary"
          style={{ width: '100%', padding: '14px' }}
          onClick={onExplore}
        >
          Explore Growth OS Dashboard →
        </button>
      </div>
    </div>
  );
}
