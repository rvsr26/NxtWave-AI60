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
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            📓 Decision Log
          </h1>
          <span className="chip chip-demo">Illustrative</span>
        </div>
        <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, maxWidth: 600 }}>
          Every growth decision documented: observation → reasoning → action → outcome.
          This is what separates a growth operator from someone who just ships features.
        </p>
      </div>

      {/* Framework explanation */}
      <div style={{
        background: '#eef2ff',
        border: '1px solid #c7d2fe',
        borderRadius: 12, padding: '16px 20px', marginBottom: 32,
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        <div style={{ fontSize: 24, flexShrink: 0 }}>🧠</div>
        <div>
          <p style={{ fontWeight: 800, color: '#4338ca', fontSize: 14, marginBottom: 4 }}>
            Growth Decision Framework
          </p>
          <p style={{ fontSize: 13, color: '#312e81', lineHeight: 1.6, margin: 0 }}>
            Good growth decisions start with an observation, not an idea. Every decision here follows:
            <strong style={{ color: '#0f172a' }}> See → Interpret → Decide → Act → Measure.</strong>
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
              style={{ animationDelay: `${idx * 0.1}s`, background: '#ffffff', border: '1px solid #cbd5e1' }}
            >
              {/* Log header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#eef2ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, color: '#4338ca',
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
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                  {new Date(log.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>

              {/* Observation */}
              <div style={{ marginBottom: 14 }}>
                <p className="section-label" style={{ marginBottom: 6, color: '#64748b', fontWeight: 700 }}>
                  👀 Observation
                </p>
                <p style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.7, margin: 0 }}>
                  {log.observation}
                </p>
              </div>

              <div className="divider" style={{ marginBottom: 14, borderColor: '#e2e8f0' }} />

              {/* Decision + Reason */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: log.impact ? 14 : 0 }}>
                <div>
                  <p className="section-label" style={{ marginBottom: 6, color: '#4338ca', fontWeight: 800 }}>🎯 Decision</p>
                  <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.6, fontWeight: 600, margin: 0 }}>
                    {log.decision}
                  </p>
                </div>
                <div>
                  <p className="section-label" style={{ marginBottom: 6, color: '#047857', fontWeight: 800 }}>💭 Reason</p>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {log.reason}
                  </p>
                </div>
              </div>

              {/* Impact */}
              {log.impact && (
                <>
                  <div className="divider" style={{ marginBottom: 14, borderColor: '#e2e8f0' }} />
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>📊</span>
                    <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
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
        background: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: 16, padding: '24px',
      }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 12 }}>
          🚀 Growth Operating Principle
        </p>
        <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.8, margin: 0 }}>
          Every decision in this log represents the core growth loop in action:{' '}
          <strong style={{ color: '#4338ca' }}>Discover → Personalize → Register → Share → Attribute → Measure → Experiment → Learn → Scale.</strong>
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
