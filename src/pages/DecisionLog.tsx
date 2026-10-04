import React, { useState } from 'react';
import { getDecisionLogs } from '../storage';
import { DEMO_DECISION_LOGS } from '../demoData';
import type { DecisionLog } from '../types';

const STATUS_CONFIG = {
  testing: { color: '#b45309', bg: '#fffbeb', border: '#fde68a', label: '🧪 Testing' },
  implemented: { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0', label: '✅ Implemented' },
  rejected: { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', label: '❌ Rejected' },
  monitoring: { color: '#4338ca', bg: '#eef2ff', border: '#c7d2fe', label: '👁 Monitoring' },
};

export default function DecisionLogPage() {
  const [logs] = useState<DecisionLog[]>(() => {
    const stored = getDecisionLogs();
    return stored.length > 0 ? stored : DEMO_DECISION_LOGS;
  });

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f1f5', letterSpacing: '-0.02em' }}>
            📓 Decision Log
          </h1>
          <span className="chip chip-demo">Illustrative</span>
        </div>
        <p style={{ color: 'rgba(241,241,245,0.55)', fontSize: 15, lineHeight: 1.6, maxWidth: 600 }}>
          Every growth decision documented: observation → reasoning → action → outcome.
          This is what separates a growth operator from someone who just ships features.
        </p>
      </div>

      {/* Framework explanation */}
      <div style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 32,
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        <div style={{ fontSize: 24, flexShrink: 0 }}>🧠</div>
        <div>
          <p style={{ fontWeight: 700, color: '#818cf8', fontSize: 14, marginBottom: 4 }}>
            Growth Decision Framework
          </p>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.7)', lineHeight: 1.6 }}>
            Good growth decisions start with an observation, not an idea. Every decision here follows:
            <strong style={{ color: '#f1f1f5' }}> See → Interpret → Decide → Act → Measure.</strong>
          </p>
        </div>
      </div>

      {/* Logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {logs.map((log, idx) => {
          const status = STATUS_CONFIG[log.status];
          return (
            <div
              key={log.id}
              className="card fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Log header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, color: '#818cf8',
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: 999,
                    background: status.bg, border: `1px solid ${status.border}`,
                    color: status.color, fontSize: 12, fontWeight: 700,
                  }}>
                    {status.label}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.35)' }}>
                  {new Date(log.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>

              {/* Observation */}
              <div style={{ marginBottom: 14 }}>
                <p className="section-label" style={{ marginBottom: 6, color: 'rgba(241,241,245,0.5)' }}>
                  👀 Observation
                </p>
                <p style={{ fontSize: 14, color: 'rgba(241,241,245,0.85)', lineHeight: 1.7 }}>
                  {log.observation}
                </p>
              </div>

              <div className="divider" style={{ marginBottom: 14 }} />

              {/* Decision + Reason */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: log.impact ? 14 : 0 }}>
                <div>
                  <p className="section-label" style={{ marginBottom: 6, color: '#818cf8' }}>🎯 Decision</p>
                  <p style={{ fontSize: 13, color: '#f1f1f5', lineHeight: 1.6, fontWeight: 500 }}>
                    {log.decision}
                  </p>
                </div>
                <div>
                  <p className="section-label" style={{ marginBottom: 6, color: '#34d399' }}>💭 Reason</p>
                  <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.75)', lineHeight: 1.6 }}>
                    {log.reason}
                  </p>
                </div>
              </div>

              {/* Impact */}
              {log.impact && (
                <>
                  <div className="divider" style={{ marginBottom: 14 }} />
                  <div style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>📊</span>
                    <p style={{ fontSize: 13, color: '#fcd34d', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {log.impact}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Growth principle box */}
      <div style={{
        marginTop: 32,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16, padding: '24px',
      }}>
        <p style={{ fontWeight: 800, color: '#f1f1f5', fontSize: 16, marginBottom: 12 }}>
          🚀 Growth Operating Principle
        </p>
        <p style={{ fontSize: 14, color: 'rgba(241,241,245,0.75)', lineHeight: 1.8 }}>
          Every decision in this log represents the core growth loop in action:{' '}
          <strong style={{ color: '#818cf8' }}>Discover → Personalize → Register → Share → Attribute → Measure → Experiment → Learn → Scale.</strong>
          <br /><br />
          The goal is not to run more experiments — it's to make better decisions faster, with evidence.
        </p>
      </div>

      <div className="sim-banner" style={{ marginTop: 24, display: 'flex' }}>
        <span>⚠</span>
        <span>All decision log entries are illustrative examples — not actual campaign decisions</span>
      </div>
    </div>
  );
}
