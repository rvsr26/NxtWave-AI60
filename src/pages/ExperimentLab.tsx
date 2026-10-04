import React, { useState } from 'react';
import { getExperiments, saveExperiments } from '../storage';
import { DEMO_EXPERIMENTS } from '../demoData';
import type { Experiment } from '../types';

export default function ExperimentLab() {
  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    const stored = getExperiments();
    return stored.length > 0 ? stored : DEMO_EXPERIMENTS;
  });
  const [selected, setSelected] = useState<string>(experiments[0]?.id || '');

  const exp = experiments.find(e => e.id === selected) || experiments[0];

  if (!exp) return null;

  const controlRate = exp.control.visitors > 0
    ? ((exp.control.conversions / exp.control.visitors) * 100).toFixed(1)
    : '0.0';
  const variantRate = exp.variant.visitors > 0
    ? ((exp.variant.conversions / exp.variant.visitors) * 100).toFixed(1)
    : '0.0';
  const uplift = parseFloat(controlRate) > 0
    ? (((parseFloat(variantRate) - parseFloat(controlRate)) / parseFloat(controlRate)) * 100).toFixed(0)
    : '0';

  const statusColor: string = {
    running: '#f59e0b',
    completed: '#10b981',
    paused: '#6b7280',
    awaiting_data: '#818cf8',
  }[exp.status] || '#818cf8';

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f1f1f5', letterSpacing: '-0.02em' }}>
            🧪 Experiment Lab
          </h1>
          <span className="chip chip-demo">Illustrative Simulation</span>
        </div>
        <p style={{ color: 'rgba(241,241,245,0.55)', fontSize: 15, lineHeight: 1.6 }}>
          Growth experiments with defined hypotheses, metrics, and decisions.
          This demonstrates how A/B testing would work in the real campaign.
        </p>
      </div>

      {/* Experiment selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {experiments.map(e => (
          <button
            key={e.id}
            id={`exp-tab-${e.id}`}
            onClick={() => setSelected(e.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: selected === e.id ? '1.5px solid #4f46e5' : '1px solid #cbd5e1',
              background: selected === e.id ? '#eef2ff' : '#ffffff',
              color: selected === e.id ? '#4338ca' : '#475569',
            }}
          >
            Exp #{e.number} — {e.title.split(' ').slice(0, 4).join(' ')}…
          </button>
        ))}
      </div>

      {/* Experiment Detail */}
      <div key={exp.id} style={{ animation: 'fadeInUp 0.3s ease forwards' }}>
        {/* Header card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="mono" style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)' }}>Experiment #{exp.number}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
                  background: `${statusColor}18`, color: statusColor,
                  border: `1px solid ${statusColor}30`, textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {exp.status}
                </span>
                {exp.isSimulated && <span className="chip chip-demo" style={{ fontSize: 10 }}>simulated</span>}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f1f5', lineHeight: 1.3, marginBottom: 12 }}>
                {exp.title}
              </h2>
            </div>
          </div>

          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <p className="section-label" style={{ marginBottom: 6, color: '#818cf8' }}>💡 Hypothesis</p>
            <p style={{ fontSize: 14, color: 'rgba(241,241,245,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "{exp.hypothesis}"
            </p>
          </div>
        </div>

        {/* 6-Stage Experiment Lifecycle: HYPOTHESIS → TEST → METRIC → SIGNAL → DECISION → NEXT ACTION */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 8,
          fontSize: 11,
        }}>
          <div>
            <span style={{ color: '#818cf8', fontWeight: 800 }}>1. HYPOTHESIS</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Defined value angle</p>
          </div>
          <div>
            <span style={{ color: '#818cf8', fontWeight: 800 }}>2. TEST</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>50/50 Split A/B</p>
          </div>
          <div>
            <span style={{ color: '#818cf8', fontWeight: 800 }}>3. METRIC</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.metric.split(' ')[0]}...</p>
          </div>
          <div>
            <span style={{ color: exp.status === 'completed' ? '#34d399' : '#f59e0b', fontWeight: 800 }}>4. SIGNAL</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {exp.status === 'completed' ? 'Signal Achieved' : 'Awaiting Data'}
            </p>
          </div>
          <div>
            <span style={{ color: exp.action === 'SCALE' ? '#34d399' : exp.action === 'KILL' ? '#ef4444' : '#818cf8', fontWeight: 800 }}>5. DECISION</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.8)', fontWeight: 700 }}>{exp.action}</p>
          </div>
          <div>
            <span style={{ color: '#34d399', fontWeight: 800 }}>6. NEXT ACTION</span>
            <p style={{ margin: '2px 0 0', color: 'rgba(241,241,245,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {exp.action === 'SCALE' ? 'Scale Winner' : exp.action === 'KILL' ? 'Kill & Protect Budget' : 'Validate in Cohort'}
            </p>
          </div>
        </div>

        {/* A/B Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Control */}
          <div className="exp-control" style={{ position: 'relative' }}>
            <p className="section-label" style={{ color: '#fca5a5', marginBottom: 8 }}>Control A</p>
            <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15, marginBottom: 12, lineHeight: 1.4 }}>
              {exp.control.label}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
              {exp.control.description}
            </p>
            <div className="divider" style={{ marginBottom: 16 }} />
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px',
              textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span className="chip chip-amber" style={{ fontSize: 11 }}>Awaiting Live Traffic</span>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 6, margin: 0 }}>
                Sample allocation: 50%
              </p>
            </div>
          </div>

          {/* Variant */}
          <div className="exp-variant" style={{ position: 'relative' }}>
            <p className="section-label" style={{ color: '#34d399', marginBottom: 8 }}>Variant B (Tested Angle)</p>
            <p style={{ fontWeight: 700, color: '#f1f1f5', fontSize: 15, marginBottom: 12, lineHeight: 1.4 }}>
              {exp.variant.label}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
              {exp.variant.description}
            </p>
            <div className="divider" style={{ marginBottom: 16 }} />
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px',
              textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span className="chip chip-brand" style={{ fontSize: 11 }}>Hypothesis to Validate</span>
              <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 6, margin: 0 }}>
                Target Metric: {exp.metric}
              </p>
            </div>
          </div>
        </div>

        {/* Experiment Status & Decision Framework Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.06))',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-label" style={{ color: '#818cf8', marginBottom: 4 }}>📊 Experiment Status</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#f1f1f5', margin: 0 }}>
                {exp.resultStatus || 'Awaiting data'}
              </p>
              <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.6)', marginTop: 4, margin: 0 }}>
                Primary Evaluated Metric: <strong>{exp.metric}</strong>
              </p>
            </div>

            {/* Decision Framework Action */}
            <div style={{ textAlign: 'right' }}>
              <p className="section-label" style={{ marginBottom: 4 }}>Framework Recommendation</p>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 4 }}>
                {(['KILL', 'ITERATE', 'CONTINUE', 'SCALE'] as const).map(act => (
                  <span
                    key={act}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                      letterSpacing: '0.05em',
                      background: exp.action === act ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                      border: exp.action === act ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
                      color: exp.action === act ? '#c7d2fe' : 'rgba(241,241,245,0.3)',
                    }}
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Decision & Rationale */}
        <div className="card" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <p className="section-label" style={{ color: '#fcd34d', margin: 0 }}>Decision Framework: {exp.action}</p>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6, margin: 0 }}>
            {exp.decisionReason || 'Hypothesis queued for execution during pilot cohort sprint.'}
          </p>
        </div>

        {/* Growth Autopsy (Hypothetical Analysis) */}
        {exp.autopsy && (
          <div className="card" style={{
            marginTop: 18,
            background: 'rgba(239, 68, 68, 0.03)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 14,
            padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🔬</span>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: '#f1f1f5', margin: 0 }}>
                  GROWTH AUTOPSY &amp; POST-MORTEM
                </h3>
              </div>
              <span className="chip chip-amber" style={{ fontSize: 10 }}>
                Hypothetical Analysis — Needs live validation
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="section-label" style={{ color: '#fca5a5', marginBottom: 4 }}>🔍 WHAT HAPPENED?</p>
                <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6, margin: 0 }}>
                  {exp.autopsy.whatHappened}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="section-label" style={{ color: '#fcd34d', marginBottom: 4 }}>💭 WHY IT MAY HAVE HAPPENED (Hypothesis / Possible Explanation)</p>
                <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6, margin: 0 }}>
                  {exp.autopsy.possibleInterpretation}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="section-label" style={{ color: '#34d399', marginBottom: 4 }}>🚀 WHAT I WOULD TEST NEXT</p>
                <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.6, margin: 0 }}>
                  {exp.autopsy.whatToTestNext}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Core Growth Insight Callout */}
        <div style={{
          marginTop: 16,
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#818cf8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Growth Decision Principle
            </p>
            <p style={{ fontSize: 13, color: '#f1f1f5', margin: '4px 0 0', lineHeight: 1.5 }}>
              <strong>Views are useful. Clicks are useful. Registrations matter more. Qualified registrations matter most.</strong> Decisions (KILL / ITERATE / SCALE) optimize strictly for qualified student attendance over vanity traffic.
            </p>
          </div>
        </div>
      </div>

      <div className="sim-banner" style={{ marginTop: 28, display: 'flex' }}>
        <span>⚠</span>
        <span>All experiment data is illustrative simulation — not actual A/B test results</span>
      </div>
    </div>
  );
}
