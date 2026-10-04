import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type Page =
  | 'home'
  | 'register'
  | 'success'
  | 'referrals'
  | 'rewards'
  | 'campus'
  | 'captain'
  | 'dashboard'
  | 'experiments'
  | 'decisions'
  | 'copilot'
  | 'simulator'
  | 'admin';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onStartReviewerDemo?: () => void;
}

const NAV_ITEMS = [
  { id: 'home' as Page, label: 'Home', emoji: '🚀', group: 'student' },
  { id: 'register' as Page, label: 'Register', emoji: '📝', group: 'student' },
  { id: 'referrals' as Page, label: 'Referral Hub', emoji: '👥', group: 'student' },
  { id: 'rewards' as Page, label: 'Rewards & Prizes', emoji: '🎁', group: 'student' },
  { id: 'campus' as Page, label: 'Campus League', emoji: '🏆', group: 'student' },
  { id: 'captain' as Page, label: 'Campus Captain', emoji: '⚡', group: 'student' },
  { id: 'dashboard' as Page, label: 'Growth Dashboard', emoji: '📊', group: 'growth' },
  { id: 'experiments' as Page, label: 'Experiment Lab', emoji: '🧪', group: 'growth' },
  { id: 'decisions' as Page, label: 'Decision Center', emoji: '🧭', group: 'growth' },
  { id: 'copilot' as Page, label: 'AI Copilot', emoji: '🤖', group: 'growth' },
  { id: 'simulator' as Page, label: 'Scenario Planner', emoji: '📐', group: 'growth' },
  { id: 'admin' as Page, label: 'Admin', emoji: '🔧', group: 'admin' },
];

export default function Navigation({ currentPage, onNavigate, onStartReviewerDemo }: Props) {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalRegs = state.registrations.length;

  const studentItems = NAV_ITEMS.filter(n => n.group === 'student');
  const growthItems = NAV_ITEMS.filter(n => n.group === 'growth');
  const adminItems = NAV_ITEMS.filter(n => n.group === 'admin');

  function NavSection({ items, label }: { items: typeof NAV_ITEMS; label?: string }) {
    return (
      <div>
        {label && (
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(241,241,245,0.3)', textTransform: 'uppercase',
            padding: '12px 16px 6px', margin: 0,
          }}>
            {label}
          </p>
        )}
        {items.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => {
              onNavigate(item.id);
              setMobileOpen(false);
            }}
          >
            <span style={{ fontSize: 14 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop sidebar
  const Sidebar = () => (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--color-surface-1)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          id="nav-logo"
          onClick={() => onNavigate('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, color: 'white',
            boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
          }}>
            60
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: '#f1f1f5', lineHeight: 1 }}>AI60</p>
            <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.4)', lineHeight: 1, marginTop: 2 }}>GROWTH OS</p>
          </div>
        </button>
      </div>

      {/* Registration counter */}
      <div style={{
        margin: '12px', padding: '10px 14px',
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>REGISTRATIONS</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#34d399' }}>{totalRegs}</span>
        </div>
        <div className="progress-bar" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${Math.min((totalRegs / 500) * 100, 100)}%` }} />
        </div>
        <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.35)', marginTop: 4 }}>of 500 target</p>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        <NavSection items={studentItems} label="Student" />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 16px' }} />
        <NavSection items={growthItems} label="Growth OS" />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 16px' }} />
        <NavSection items={adminItems} />
      </div>

      {/* Reviewer Demo Quick-Launch Button */}
      <div style={{ padding: '0 12px 10px' }}>
        <button
          id="reviewer-demo-sidebar-btn"
          onClick={onStartReviewerDemo}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.15))',
            border: '1px solid rgba(99,102,241,0.4)',
            color: '#c7d2fe',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(99,102,241,0.15)',
          }}
        >
          <span>🧭</span>
          <span>Reviewer Demo Tour</span>
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: 10, color: 'rgba(241,241,245,0.25)', lineHeight: 1.6, margin: 0 }}>
          AI60 Growth OS · NxtWave Challenge
        </p>
        <p style={{ fontSize: 10, color: 'rgba(245,158,11,0.6)', marginTop: 2, margin: 0 }}>
          ⚠ Simulation data present
        </p>
      </div>
    </aside>
  );

  // Mobile top bar
  const TopBar = () => (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <button
        onClick={() => onNavigate('home')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: 'white',
        }}>60</div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f1f5' }}>AI60</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>{totalRegs} / 500</span>
        <button
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '6px 12px',
            color: '#f1f1f5', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--color-surface-1)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '8px',
          maxHeight: '80vh', overflow: 'auto',
          zIndex: 200,
        }}>
          <NavSection items={studentItems} label="Student" />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 16px' }} />
          <NavSection items={growthItems} label="Growth OS" />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 16px' }} />
          <NavSection items={adminItems} />
        </div>
      )}
    </div>
  );

  return { Sidebar, TopBar };
}
