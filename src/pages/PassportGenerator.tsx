import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateProjectPassport } from '../ai';
import { Analytics } from '../analytics';
import { savePassport } from '../storage';
import { api } from '../services/api';

const BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Electrical & Electronics',
  'Mechanical / Civil',
  'Other Engineering',
] as const;

const INTERESTS = ['Web', 'Mobile', 'Data', 'Education', 'Productivity', 'Finance', 'Developer Tools', 'Other'] as const;
const EXPERIENCES = ['Beginner', 'Intermediate', 'Advanced'] as const;
const DOMAINS = ['AI Agents & Automation', 'Full-Stack GenAI', 'Data & Analytics', 'Mobile AI & Apps', 'Developer Productivity'] as const;

interface Props {
  onPassportGenerated: () => void;
  onRegister: () => void;
  onShowGrowthLoop?: () => void;
}

export default function PassportGenerator({ onPassportGenerated, onRegister, onShowGrowthLoop }: Props) {
  const { setCurrentPassport } = useApp();
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [branch, setBranch] = useState('Computer Science');
  const [experience, setExperience] = useState('Beginner');
  const [interest, setInterest] = useState('Web');
  const [domain, setDomain] = useState('AI Agents & Automation');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const campusCode = urlParams.get('campus');
  const refCode = urlParams.get('ref');

  async function handleGenerate() {
    if (!branch) { setError('Please select your engineering branch.'); return; }
    if (!experience) { setError('Please select your skill level.'); return; }
    if (!interest) { setError('Please select an area of interest.'); return; }
    if (!domain) { setError('Please select your preferred domain.'); return; }
    if (!goal.trim()) { setError('Please describe what you want to build or your career goal.'); return; }
    setError('');

    Analytics.passportStarted(interest);
    setStep('loading');

    try {
      // 1. Generate & persist via backend MongoDB API
      const res = await api.passports.generate({ branch, experience, interest, domain, goal });
      const passport = res.passport;
      savePassport(passport);
      setCurrentPassport(passport);
      Analytics.passportGenerated(passport.projectName, interest);
      setStep('result');
      onPassportGenerated();
    } catch {
      // 2. Deterministic client fallback if network / backend unreachable
      try {
        const passport = await generateProjectPassport({ branch, experience, interest, domain, goal });
        savePassport(passport);
        setCurrentPassport(passport);
        Analytics.passportGenerated(passport.projectName, interest);
        setStep('result');
        onPassportGenerated();
      } catch {
        setStep('form');
        setError('Something went wrong. Please try again.');
      }
    }
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface-0)' }}>
        <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease forwards' }}>
          <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              border: '3px solid #e0e7ff',
              borderTop: '3px solid #4f46e5',
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🤖</div>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
            Generating your project…
          </h3>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Personalizing based on your interest and experience
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-0)' }}>
      {/* Hero */}
      <div style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)',
        paddingTop: 80, paddingBottom: 60,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Attribution banners */}
        {(campusCode || refCode) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            {campusCode && (
              <span className="chip chip-brand">🏫 {campusCode}</span>
            )}
            {refCode && (
              <span className="chip chip-green">👋 Referred by {refCode}</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <span className="chip chip-brand">
            <span>💡</span> Core Thesis: Don't ask students to register — give them a reason to want to register.
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#0f172a',
          maxWidth: 780,
          margin: '0 auto 16px',
          padding: '0 24px',
          textTransform: 'uppercase',
        }}>
          WHAT AI PROJECT COULD YOU BUILD IN 60 MINUTES?
        </h1>

        <p style={{
          fontSize: 18,
          color: '#475569',
          maxWidth: 580,
          margin: '0 auto 28px',
          lineHeight: 1.6,
          padding: '0 24px',
        }}>
          Answer a few quick questions. Get a personalized AI Project Passport and discover what you could build.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap', padding: '0 24px' }}>
          <button
            id="hero-discover-btn"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: 15, fontWeight: 800 }}
            onClick={() => {
              const el = document.getElementById('passport-form-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>🚀</span> Discover My Project
          </button>
          <button
            id="hero-growth-loop-btn"
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: 14 }}
            onClick={() => onShowGrowthLoop ? onShowGrowthLoop() : null}
          >
            <span>🔄</span> How the Growth Loop Works
          </button>
        </div>

        {/* Student Journey Breadcrumb */}
        <div style={{
          display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 6,
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: 999, padding: '6px 16px', marginBottom: 28, fontSize: 11, color: '#64748b',
          boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
        }}>
          <span style={{ color: '#4338ca', fontWeight: 700 }}>Discover</span>
          <span>→</span>
          <span style={{ color: '#4338ca', fontWeight: 700 }}>Personalize</span>
          <span>→</span>
          <span style={{ color: '#4338ca', fontWeight: 700 }}>Project Passport</span>
          <span>→</span>
          <span>Register</span>
          <span>→</span>
          <span>Share</span>
          <span>→</span>
          <span>Campus</span>
          <span>→</span>
          <span>Measure</span>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#4338ca',
            }}>
              {n}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#64748b' }}>Answer a few quick questions</p>
      </div>

      {/* Form */}
      <div id="passport-form-container" style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="card stagger-children" style={{ gap: 28, display: 'flex', flexDirection: 'column' }}>

          {/* Question 1: Branch */}
          <div>
            <label style={{
              display: 'block', fontSize: 15, fontWeight: 700,
              color: '#0f172a', marginBottom: 4,
            }}>
              1. What is your Engineering Branch?
            </label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Calibrated for Class of 2027 placement domains
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 8,
            }}>
              {BRANCHES.map(b => (
                <button
                  key={b}
                  type="button"
                  id={`branch-${b.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  aria-pressed={branch === b}
                  onClick={() => setBranch(b)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: branch === b ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: branch === b
                      ? '1.5px solid #4f46e5'
                      : '1px solid #cbd5e1',
                    background: branch === b
                      ? '#eef2ff'
                      : '#ffffff',
                    color: branch === b ? '#4338ca' : '#334155',
                    textAlign: 'left',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Experience / Skill Level */}
          <div>
            <label style={{
              display: 'block', fontSize: 15, fontWeight: 700,
              color: '#0f172a', marginBottom: 4,
            }}>
              2. What is your current AI / Coding skill level?
            </label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Ensures your 60-minute build plan is practical and achievable
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {EXPERIENCES.map(exp => (
                <button
                  key={exp}
                  type="button"
                  id={`experience-${exp.toLowerCase()}`}
                  aria-pressed={experience === exp}
                  onClick={() => setExperience(exp)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: experience === exp ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: experience === exp
                      ? '1.5px solid #4f46e5'
                      : '1px solid #cbd5e1',
                    background: experience === exp
                      ? '#eef2ff'
                      : '#ffffff',
                    color: experience === exp ? '#4338ca' : '#334155',
                  }}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Interest Area */}
          <div>
            <label style={{
              display: 'block', fontSize: 15, fontWeight: 700,
              color: '#0f172a', marginBottom: 4,
            }}>
              3. What area of technology interests you most?
            </label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Choose your target project medium
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 8,
            }}>
              {INTERESTS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  id={`interest-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                  aria-pressed={interest === opt}
                  onClick={() => setInterest(opt)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: interest === opt ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: interest === opt
                      ? '1.5px solid #4f46e5'
                      : '1px solid #cbd5e1',
                    background: interest === opt
                      ? '#eef2ff'
                      : '#ffffff',
                    color: interest === opt ? '#4338ca' : '#334155',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Preferred Domain */}
          <div>
            <label style={{
              display: 'block', fontSize: 15, fontWeight: 700,
              color: '#0f172a', marginBottom: 4,
            }}>
              4. Preferred AI Domain / Career Track
            </label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Tailors interview talking points to specific hiring tracks
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 8,
            }}>
              {DOMAINS.map(d => (
                <button
                  key={d}
                  type="button"
                  id={`domain-${d.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  aria-pressed={domain === d}
                  onClick={() => setDomain(d)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: domain === d ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: domain === d
                      ? '1.5px solid #059669'
                      : '1px solid #cbd5e1',
                    background: domain === d
                      ? '#ecfdf5'
                      : '#ffffff',
                    color: domain === d ? '#047857' : '#334155',
                    textAlign: 'left',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Goal */}
          <div>
            <label style={{
              display: 'block', fontSize: 15, fontWeight: 700,
              color: '#0f172a', marginBottom: 4,
            }}>
              5. What do you want to build or achieve?
            </label>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Describe your project idea, career goal, or interview focus in a few words
            </p>
            <textarea
              id="goal-input"
              className="input-base"
              style={{ resize: 'vertical', minHeight: 80, fontFamily: 'var(--font-sans)', fontSize: 13 }}
              placeholder="e.g. Build an AI agent to prep for technical interviews, automate student note summarization, or deploy a full-stack GenAI app..."
              value={goal}
              onChange={e => setGoal(e.target.value)}
              maxLength={300}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>
              {goal.length}/300
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#dc2626',
              fontSize: 14,
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            id="generate-passport-btn"
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 800 }}
            onClick={handleGenerate}
          >
            <span>🚀</span>
            Generate My Project
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b' }}>
            Free workshop · No credit card · Takes 60 seconds
          </p>
        </div>

        {/* Simulation Notice */}
        <div style={{
          marginTop: 28, textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Designed for <strong>2027 graduating batch</strong> engineering students preparing for placements.
          </p>
          <div className="sim-banner" style={{ display: 'inline-flex', padding: '6px 14px' }}>
            <span>⚠</span>
            <span>Simulation prototype for NxtWave Growth Challenge — All metrics are illustrative hypotheses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
