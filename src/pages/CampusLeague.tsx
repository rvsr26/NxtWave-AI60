import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';

type SortKey = 'registrations' | 'growth' | 'name';

export default function CampusLeague() {
  const { state } = useApp();
  const [sortBy, setSortBy] = useState<SortKey>('registrations');

  const campuses = [...state.campuses].sort((a, b) => {
    if (sortBy === 'registrations') return b.registrations - a.registrations;
    if (sortBy === 'growth') return (b.registrations - b.yesterdayRegistrations) - (a.registrations - a.yesterdayRegistrations);
    return a.name.localeCompare(b.name);
  });

  const totalRegs = campuses.reduce((s, c) => s + c.registrations, 0);
  const topCampus = campuses[0];

  const hasSimulated = state.campuses.some(c => c.isSimulated);

  function handleCampusClick(campusCode: string) {
    Analytics.campusLinkClicked(campusCode);
    const url = new URL(window.location.href);
    url.searchParams.set('campus', campusCode);
    navigator.clipboard.writeText(url.toString()).catch(() => {});
    window.open(`${window.location.origin}${window.location.pathname}?campus=${campusCode}`, '_blank');
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 900, color: '#f1f1f5',
            letterSpacing: '-0.02em',
          }}>
            🏆 AI60 Campus League
          </h1>
          <span className="chip chip-brand">Proposed Campaign Mechanic</span>
          {hasSimulated && (
            <span className="chip chip-demo">Illustrative Simulation</span>
          )}
        </div>
        <p style={{ color: 'rgba(241,241,245,0.65)', fontSize: 14, lineHeight: 1.6 }}>
          College-level competition designed to tap collegiate peer affinity. Proposed reward: Top campus cohorts unlock the <strong>AI Placement Starter Kit &amp; VIP live Q&amp;A session</strong>.
        </p>

        {/* Institutional Governance Disclaimer */}
        <div style={{
          marginTop: 12,
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
          fontSize: 12,
          color: 'rgba(241,241,245,0.5)',
        }}>
          💡 <em>Note: College cohorts (Amrita, VIT, SRM, BITS, MIT, NIT) are illustrative examples modeling the proposed inter-college competition structure. They do not imply official institutional partnerships or endorsements from these colleges.</em>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 16, marginBottom: 32,
      }}>
        {[
          { label: 'Campus Registrations', value: totalRegs.toString(), icon: '🎓' },
          { label: 'Campuses Participating', value: campuses.length.toString(), icon: '🏫' },
          { label: 'Leading Campus', value: topCampus?.name?.split(' ')[0] || '—', icon: '🥇' },
          { label: 'Total Captains', value: state.captains.length.toString(), icon: '⚡' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#f1f1f5', letterSpacing: '-0.02em' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.45)', marginTop: 4, fontWeight: 600 }}>
              {stat.label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'rgba(241,241,245,0.5)', alignSelf: 'center' }}>Sort by:</span>
        {([
          ['registrations', '📊 Registrations'],
          ['growth', '📈 Growth'],
          ['name', '🔤 Name'],
        ] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            id={`sort-${key}`}
            onClick={() => setSortBy(key)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: sortBy === key ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
              background: sortBy === key ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
              color: sortBy === key ? '#818cf8' : 'rgba(241,241,245,0.6)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {campuses.map((campus, idx) => {
          const rank = idx + 1;
          const growth = campus.registrations - campus.yesterdayRegistrations;
          const maxRegs = campuses[0]?.registrations || 1;
          const barWidth = (campus.registrations / maxRegs) * 100;
          const rankColor = rank === 1 ? '#fbbf24' : rank === 2 ? '#9ca3af' : rank === 3 ? '#d97706' : 'rgba(241,241,245,0.5)';
          const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

          return (
            <div
              key={campus.id}
              className="card glass-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {/* Rank */}
              <div style={{
                width: 44, height: 44, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 10,
                background: rank <= 3 ? `${rankColor}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${rankColor}30`,
                fontSize: rank <= 3 ? 22 : 18,
                fontWeight: 800, color: rankColor,
              }}>
                {rankEmoji || rank}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15 }}>{campus.name}</p>
                    <p className="mono" style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 2 }}>
                      {campus.code}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 24, fontWeight: 800, color: rankColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {campus.registrations}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', fontWeight: 600, marginTop: 2 }}>
                      registrations
                    </p>
                  </div>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${barWidth}%` }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: growth > 0 ? '#34d399' : 'rgba(241,241,245,0.4)',
                  }}>
                    {growth > 0 ? `+${growth}` : growth === 0 ? '—' : growth} since yesterday
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)' }}>
                      {campus.captains} captain{campus.captains !== 1 ? 's' : ''}
                    </span>
                    <button
                      id={`campus-link-${campus.code}`}
                      onClick={() => handleCampusClick(campus.code)}
                      style={{
                        fontSize: 11, fontWeight: 600, color: '#818cf8',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
                      }}
                    >
                      Share →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {campuses.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🏫</p>
            <p style={{ color: 'rgba(241,241,245,0.5)', fontSize: 15 }}>
              No campuses yet. Register your campus to appear here!
            </p>
          </div>
        )}
      </div>

      {/* 🏆 CAMPUS REFERRAL LEADERBOARD */}
      <div className="card" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
              🏆 CAMPUS REFERRAL LEADERBOARD
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(241,241,245,0.5)', margin: '4px 0 0' }}>
              Top student referrers ranked by verified unique registrations.
            </p>
          </div>
          <span className="chip chip-amber">Top 3 Rewards: ₹250 / ₹150 / ₹100</span>
        </div>

        {/* Anti-fraud banner */}
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>🛡</span>
          <p style={{ fontSize: 12, color: '#fca5a5', margin: 0 }}>
            <strong>Anti-Fraud Rule:</strong> Only verified unique registrations count. Qualified Referral = unique student + valid registration + verification.
          </p>
        </div>

        {/* Leaderboard entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { rank: 1, name: 'Rahul', college: 'Amrita University', count: 34, reward: '₹250' },
            { rank: 2, name: 'Priya', college: 'VIT University', count: 27, reward: '₹150' },
            { rank: 3, name: 'Arjun', college: 'SRM University', count: 21, reward: '₹100' },
            { rank: 4, name: 'Vishnu', college: 'BITS Pilani', count: 18, reward: null },
            { rank: 5, name: 'Sneha', college: 'NIT Trichy', count: 15, reward: null },
          ].map(entry => (
            <div
              key={entry.name}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 16, fontWeight: 800, width: 24, textAlign: 'center',
                  color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#9ca3af' : entry.rank === 3 ? '#d97706' : 'rgba(241,241,245,0.4)',
                }}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>
                <div>
                  <span style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 14 }}>{entry.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)', marginLeft: 8 }}>{entry.college}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>
                  {entry.count} qualified
                </span>
                {entry.reward ? (
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: '#fbbf24',
                    background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)',
                    padding: '2px 8px', borderRadius: 4,
                  }}>
                    {entry.reward}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: 'rgba(241,241,245,0.3)' }}>Rank #{entry.rank}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasSimulated && (
        <div className="sim-banner" style={{ marginTop: 24, display: 'flex' }}>
          <span>⚠</span>
          <span>Campus and referral data is illustrative simulation — not actual campaign results</span>
        </div>
      )}
    </div>
  );
}
