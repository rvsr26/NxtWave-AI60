import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isBackendOnline } from '../services/api';

export type Page =
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

export interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
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

function NavSection({
  items,
  label,
  currentPage,
  onItemClick,
}: {
  items: typeof NAV_ITEMS;
  label?: string;
  currentPage: Page;
  onItemClick: (page: Page) => void;
}) {
  return (
    <div>
      {label && (
        <p style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
          color: '#64748b', textTransform: 'uppercase',
          padding: '12px 14px 6px', margin: 0,
        }}>
          {label}
        </p>
      )}
      {items.map(item => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            type="button"
            className={`nav-link ${isActive ? 'active' : ''}`}
            style={{
              width: '100%',
              textAlign: 'left',
              backgroundColor: isActive ? '#eef2ff' : 'transparent',
              color: isActive ? '#4338ca' : '#475569',
              fontWeight: isActive ? 700 : 500,
              borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent',
              borderRadius: '6px',
              padding: '8px 12px',
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onClick={() => onItemClick(item.id)}
          >
            <span style={{ fontSize: 15 }}>{item.emoji}</span>
            <span style={{ fontSize: 13 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Sidebar({ currentPage, onNavigate }: NavigationProps) {
  const { state } = useApp();
  const totalRegs = state.registrations.length;

  const studentItems = NAV_ITEMS.filter(n => n.group === 'student');
  const growthItems = NAV_ITEMS.filter(n => n.group === 'growth');
  const adminItems = NAV_ITEMS.filter(n => n.group === 'admin');

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '1px 0 3px rgba(15,23,42,0.02)',
    }}>
      {/* Event Brand Header */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #f1f5f9' }}>
        <button
          id="nav-logo"
          type="button"
          onClick={() => onNavigate('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
          }}>
            60
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>AI60</p>
              {isBackendOnline() ? (
                <span style={{ fontSize: 9, fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em' }}>MONGODB LIVE</span>
              ) : (
                <span style={{ fontSize: 9, fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em' }}>LOCAL MODE</span>
              )}
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', lineHeight: 1, marginTop: 4, letterSpacing: '0.04em', margin: '4px 0 0' }}>GROWTH CHALLENGE</p>
          </div>
        </button>
      </div>

      {/* Target Progress Card */}
      <div style={{
        margin: '12px', padding: '12px 14px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#166534', fontWeight: 800, letterSpacing: '0.03em' }}>REGISTRATIONS</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>{totalRegs}</span>
        </div>
        <div className="progress-bar" style={{ height: 5, background: '#e2e8f0' }}>
          <div className="progress-fill" style={{ width: `${Math.min((totalRegs / 500) * 100, 100)}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>of 500 student target</span>
          <span style={{ fontSize: 10, color: '#15803d', fontWeight: 700 }}>{Math.round((totalRegs / 500) * 100)}%</span>
        </div>
      </div>

      {/* Nav items scrollable list - keeps its scroll position when clicking */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        <NavSection items={studentItems} label="Student Challenge" currentPage={currentPage} onItemClick={onNavigate} />
        <div style={{ height: 1, background: '#f1f5f9', margin: '8px 10px' }} />
        <NavSection items={growthItems} label="Growth OS" currentPage={currentPage} onItemClick={onNavigate} />
        <div style={{ height: 1, background: '#f1f5f9', margin: '8px 10px' }} />
        <NavSection items={adminItems} currentPage={currentPage} onItemClick={onNavigate} />
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
        <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          AI60 Challenge · NxtWave Growth
        </p>
        <p style={{ fontSize: 10, color: '#b45309', marginTop: 3, margin: '3px 0 0', fontWeight: 600 }}>
          ⚡ Class of 2027 Event
        </p>
      </div>
    </aside>
  );
}

export function TopBar({ currentPage, onNavigate }: NavigationProps) {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalRegs = state.registrations.length;

  const studentItems = NAV_ITEMS.filter(n => n.group === 'student');
  const growthItems = NAV_ITEMS.filter(n => n.group === 'growth');
  const adminItems = NAV_ITEMS.filter(n => n.group === 'admin');

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 18px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
    }}>
      <button
        type="button"
        onClick={() => onNavigate('home')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 900, color: '#ffffff',
          boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
        }}>60</div>
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>AI60</span>
          <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6, fontWeight: 600 }}>CHALLENGE</span>
        </div>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: 12, fontWeight: 800, color: '#15803d',
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          padding: '4px 8px', borderRadius: 6,
        }}>
          {totalRegs} / 500
        </span>
        <button
          id="mobile-menu-btn"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 8, padding: '6px 12px',
            color: '#0f172a', cursor: 'pointer', fontSize: 14, fontWeight: 700,
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px',
          maxHeight: '80vh', overflowY: 'auto',
          zIndex: 200,
          boxShadow: '0 12px 28px rgba(15,23,42,0.12)',
        }}>
          <NavSection items={studentItems} label="Student Challenge" currentPage={currentPage} onItemClick={(p) => { onNavigate(p); setMobileOpen(false); }} />
          <div style={{ height: 1, background: '#e2e8f0', margin: '8px 12px' }} />
          <NavSection items={growthItems} label="Growth OS" currentPage={currentPage} onItemClick={(p) => { onNavigate(p); setMobileOpen(false); }} />
          <div style={{ height: 1, background: '#e2e8f0', margin: '8px 12px' }} />
          <NavSection items={adminItems} currentPage={currentPage} onItemClick={(p) => { onNavigate(p); setMobileOpen(false); }} />
        </div>
      )}
    </div>
  );
}

export default function Navigation(props: NavigationProps) {
  return {
    Sidebar: () => <Sidebar {...props} />,
    TopBar: () => <TopBar {...props} />,
  };
}
