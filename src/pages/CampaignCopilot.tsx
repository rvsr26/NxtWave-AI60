import React, { useState } from 'react';
import { generateGrowthHypotheses, type GrowthHypothesisVariant } from '../ai';

const AUDIENCES = ['2027 Graduating Engineering Students', 'CS/IT Branch Placement Aspirants', 'Non-CS Branches (ECE, EEE, Mech, Civil)', 'Campus Captain Ambassdors'];
const CHANNELS = ['WhatsApp Placement Groups', 'Campus Captain 1:1 Outreach', 'LinkedIn Peer Posts', 'Instagram Stories'];
const GOALS = ['Verified Workshop Registrations', 'Campus Captain Recruitment', 'Peer Referral Unlocks'];

export default function CampaignCopilot() {
  const [audience, setAudience] = useState('2027 Graduating Engineering Students');
  const [channel, setChannel] = useState('WhatsApp Placement Groups');
  const [goal, setGoal] = useState('Verified Workshop Registrations');
  const [hypotheses, setHypotheses] = useState<GrowthHypothesisVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;

  async function handleGenerate() {
    setLoading(true);
    setGenerated(false);
    try {
      const result = await generateGrowthHypotheses(audience, channel, goal);
      setHypotheses(result);
      setGenerated(true);
    } catch {
      setHypotheses([]);
    } finally {
      setLoading(false);
    }
  }

  function copyVariant(idx: number, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const variantColors = ['#6366f1', '#10b981', '#f59e0b'];
  const variantBg = ['#eef2ff', '#ecfdf5', '#fffbeb'];
  const variantBorder = ['#c7d2fe', '#a7f3d0', '#fde68a'];

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            🤖 AI Growth Hypothesis Generator
          </h1>
          <span className={`chip ${hasApiKey ? 'chip-green' : 'chip-amber'}`}>
            {hasApiKey ? '✓ OpenAI Connected' : '⚡ Deterministic Mode'}
          </span>
        </div>
        <p style={{ color: '#0f172a', fontWeight: 600, fontSize: 15, lineHeight: 1.6 }}>
          Generate 3 testable growth angles: <strong style={{ color: '#4338ca' }}>Career Angle</strong>, <strong style={{ color: '#047857' }}>Project Angle</strong>, and <strong style={{ color: '#b45309' }}>Community Angle</strong>.
        </p>

        {/* Operating Mantra Banner */}
        <div style={{
          marginTop: 16,
          background: '#eef2ff',
          border: '1.5px solid #a5b4fc',
          borderRadius: 10, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b', margin: 0, letterSpacing: '0.01em' }}>
            "AI proposes. Experiments measure. I decide."
          </p>
        </div>
      </div>

      {/* Config card */}
      <div className="card" style={{ marginBottom: 24, background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 20 }}>
          Campaign Configuration
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {/* Audience */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              Target Audience
            </label>
            <select
              id="copilot-audience"
              className="input-base"
              value={audience}
              onChange={e => setAudience(e.target.value)}
            >
              {AUDIENCES.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Channel */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              Channel
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CHANNELS.map(c => (
                <button
                  key={c}
                  id={`channel-${c.toLowerCase()}`}
                  onClick={() => setChannel(c)}
                  style={{
                    padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: channel === c ? '2px solid #4338ca' : '1px solid #94a3b8',
                    background: channel === c ? '#eef2ff' : '#ffffff',
                    color: channel === c ? '#4338ca' : '#0f172a',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              Campaign Goal
            </label>
            <select
              id="copilot-goal"
              className="input-base"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            >
              {GOALS.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          id="generate-variants-btn"
          className="btn-primary"
          style={{ marginTop: 20, padding: '12px 28px', fontWeight: 700 }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Generating…</>
          ) : (
            <><span>✨</span> Generate Campaign Variants</>
          )}
        </button>

        {!hasApiKey && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 10, margin: '10px 0 0' }}>
            No OpenAI key detected — using curated deterministic variants optimized for engineering student audiences.
          </p>
        )}
      </div>

      {/* Generated Growth Hypotheses */}
      {generated && hypotheses.length > 0 && (
        <div style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
            3 Growth Hypotheses — {channel} · {audience}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {hypotheses.map((h, i) => (
              <div key={i} style={{
                background: variantBg[i] || '#f8fafc',
                border: `1px solid ${variantBorder[i] || '#cbd5e1'}`,
                borderRadius: 14, padding: '20px 24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                    color: variantColors[i], background: `${variantColors[i]}18`,
                    border: `1px solid ${variantColors[i]}30`,
                    padding: '4px 10px', borderRadius: 999,
                  }}>
                    {h.angle}
                  </span>
                  <button
                    id={`copy-hypothesis-${i}`}
                    onClick={() => copyVariant(i, `${h.headline}\n\n${h.body}`)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      border: '1px solid #cbd5e1', background: '#ffffff',
                      color: '#4338ca',
                    }}
                  >
                    {copiedIdx === i ? '✓ Copied' : '📋 Copy Copy'}
                  </button>
                </div>

                {/* Growth Hypothesis */}
                <div style={{ marginBottom: 12 }}>
                  <p className="section-label" style={{ color: variantColors[i], marginBottom: 4, fontWeight: 800 }}>💡 Testable Growth Hypothesis</p>
                  <p style={{ fontSize: 13, color: '#0f172a', fontStyle: 'italic', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                    "{h.hypothesis}"
                  </p>
                </div>

                <div style={{ background: '#ffffff', borderRadius: 8, padding: '12px 14px', marginBottom: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 6, lineHeight: 1.4 }}>
                    "{h.headline}"
                  </p>
                  <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {h.body}
                  </p>
                </div>

                {/* Behavioral Rationale */}
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  <strong style={{ color: '#0f172a' }}>Strategic Rationale:</strong> {h.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder state */}
      {!generated && !loading && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 8 }}>
            Configure and generate your campaign variants
          </p>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Set your audience, channel and goal above, then click Generate.
          </p>
        </div>
      )}
    </div>
  );
}
