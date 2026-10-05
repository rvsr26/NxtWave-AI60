import React from 'react';

export interface StepInfo {
  number: number;
  title: string;
  page: string;
  description: string;
  focus: string;
}

export const REVIEWER_STEPS: StepInfo[] = [
  {
    number: 1,
    title: 'Student Problem & Context',
    page: 'home',
    description: 'Final-year engineering students ignore generic webinar pitches. Their real anxiety: placement readiness, resume portfolio, and defending technical projects in interviews.',
    focus: 'Thesis: "Don\'t ask students to register — give them a reason to want to register."',
  },
  {
    number: 2,
    title: 'Value-First Homepage',
    page: 'home',
    description: 'Answers in 5 seconds: What is this? Who is it for? What do I get? What do I do next? Clear hero hierarchy prioritizing tangible creation over webinar attendance.',
    focus: 'Value First → Registration Second: No form friction before value perception.',
  },
  {
    number: 3,
    title: 'Choose Goal Intent',
    page: 'home',
    description: 'Explicit student intent signal: Resume track (portfolio proof), Interview track (defense talking point), or Project Idea track (prototype build). Dynamic value calibration.',
    focus: 'Intent-driven segmentation without complex CRM overhead.',
  },
  {
    number: 4,
    title: 'Generate Project Passport',
    page: 'home',
    description: 'The Hero Asset: Generates instant customized 60-min build roadmap, modern stack, resume bullet point, and recruiter interview talking point before registration.',
    focus: 'Sunk cost & high desire: Student receives immediate high value before submitting email.',
  },
  {
    number: 5,
    title: 'Registration (Class of 2027)',
    page: 'register',
    description: 'Streamlined 5-field registration pre-filled from Passport. Verified Class of 2027 engineering students with college domain and branch validation.',
    focus: 'Low-friction conversion with anti-fraud tracking.',
  },
  {
    number: 6,
    title: 'Referral System & Anti-Fraud',
    page: 'referrals',
    description: 'Quality-gated viral loop: REFERRAL COUNT ≠ QUALIFIED ACQUISITION. Requires 2 verified batchmate registrations before unlocking starter repos. Blocks duplicate emails and self-referrals.',
    focus: 'Quality over vanity clicks: Anti-fraud protected K-factor.',
  },
  {
    number: 7,
    title: 'Growth Dashboard & 500 Model',
    page: 'dashboard',
    description: 'Full-funnel tracking toward the 500-student milestone under ₹2,000 budget. Rigorously separates Actual Demo Events, Simulation Data, and Planning Assumptions.',
    focus: 'Data integrity & transparent attribution modeling.',
  },
  {
    number: 8,
    title: 'Experiment Lab & Autopsy',
    page: 'experiments',
    description: 'Rigorous A/B tests following Hypothesis → Test → Metric → Signal → Decision → Next Action. Completed tests feature a Growth Autopsy post-mortem. Unvalidated tests remain in CONTINUE.',
    focus: 'Scientific experimentation: "We don\'t know until we test."',
  },
  {
    number: 9,
    title: 'Growth Decision Center',
    page: 'decisions',
    description: '"If this campaign were live tomorrow, what would I do next?" Channel Decision Table with SCALE, CONTINUE, ITERATE, KILL guardrails, full funnel loop, and audit trail.',
    focus: 'Problem Solving & Judgment: Evidence-based channel reallocation.',
  },
  {
    number: 10,
    title: 'Next ₹500 Budget Decision',
    page: 'decisions',
    description: 'Interactive tranche simulator modeling where the next available funds should go to maximize qualified registrations. Explores downside sensitivity and 24-hour sprint roadmap.',
    focus: 'DATA → INSIGHT → DECISION → ACTION → NEXT EXPERIMENT.',
  },
];

interface Props {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  onClose: () => void;
}

export default function ReviewerDemoModal({ currentStep, onSelectStep, onClose }: Props) {
  const active = REVIEWER_STEPS[currentStep - 1] || REVIEWER_STEPS[0];

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 'min(440px, calc(100vw - 32px))',
      zIndex: 9999,
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid #c7d2fe',
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(79, 70, 229, 0.08)',
      padding: '20px 22px',
      color: '#0f172a',
      animation: 'fadeInUp 0.3s ease',
    }}>
      {/* Modal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🧭</span>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.02em', color: '#4338ca' }}>
            REVIEWER EVALUATION TOUR
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: '#0f172a',
            cursor: 'pointer', fontSize: 18, padding: '2px 6px',
          }}
          title="Close review tour"
        >
          ✕
        </button>
      </div>

      {/* Progress pill */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {REVIEWER_STEPS.map((s, idx) => (
          <div
            key={s.number}
            onClick={() => onSelectStep(s.number)}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              cursor: 'pointer',
              background: idx + 1 <= currentStep ? '#4f46e5' : '#e2e8f0',
              transition: 'background 0.3s ease',
            }}
            title={`Step ${s.number}: ${s.title}`}
          />
        ))}
      </div>

      {/* Current Step Content */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="mono" style={{
            fontSize: 11, fontWeight: 800, color: '#047857',
            background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 4,
          }}>
            Step {active.number} of {REVIEWER_STEPS.length}
          </span>
          <p style={{ fontSize: 14, fontWeight: 800, margin: 0, color: '#0f172a' }}>
            {active.title}
          </p>
        </div>

        <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.5, margin: '6px 0 10px' }}>
          {active.description}
        </p>

        <div style={{
          background: '#eef2ff', border: '1px solid #c7d2fe',
          borderRadius: 8, padding: '9px 12px',
        }}>
          <p style={{ fontSize: 12, color: '#4338ca', margin: 0, lineHeight: 1.4 }}>
            🎯 <strong>Reviewer Focus:</strong> {active.focus}
          </p>
        </div>
      </div>

      {/* Tour Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <button
          disabled={currentStep <= 1}
          onClick={() => onSelectStep(currentStep - 1)}
          className="btn-secondary"
          style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: currentStep <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep <= 1 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>

        <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 600 }}>
          Under 3-min walkthrough
        </span>

        {currentStep < REVIEWER_STEPS.length ? (
          <button
            onClick={() => onSelectStep(currentStep + 1)}
            className="btn-primary"
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Next Step →
          </button>
        ) : (
          <button
            onClick={onClose}
            className="btn-green"
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Finish Tour ✓
          </button>
        )}
      </div>
    </div>
  );
}
