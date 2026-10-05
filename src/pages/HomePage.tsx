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

type GoalIntent = 'resume' | 'interview' | 'idea';

interface Props {
  onNavigate: (page: string) => void;
  onPassportGenerated: () => void;
  onRegister: () => void;
}

export default function HomePage({ onNavigate, onPassportGenerated, onRegister }: Props) {
  const { setCurrentPassport } = useApp();
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [branch, setBranch] = useState('Computer Science');
  const [experience, setExperience] = useState('Beginner');
  const [interest, setInterest] = useState('Web');
  const [domain, setDomain] = useState('AI Agents & Automation');
  const [goal, setGoal] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<GoalIntent | null>(() => {
    return (localStorage.getItem('ai60_selected_goal_intent') as GoalIntent) || null;
  });
  const [error, setError] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const campusCode = urlParams.get('campus');
  const refCode = urlParams.get('ref');

  // Handle selecting a goal track
  function handleSelectGoal(intent: GoalIntent) {
    setSelectedIntent(intent);
    localStorage.setItem('ai60_selected_goal_intent', intent);
    
    if (intent === 'resume') {
      setGoal('Build a production-grade GenAI application with clean code to showcase on my resume and GitHub portfolio.');
      setDomain('Full-Stack GenAI');
    } else if (intent === 'interview') {
      setGoal('Build an autonomous AI agent with API integration that I can confidently defend in technical placement rounds.');
      setDomain('AI Agents & Automation');
    } else if (intent === 'idea') {
      setGoal('Transform my campus problem-solving concept into a working interactive AI prototype in 60 minutes.');
      setDomain('Developer Productivity');
    }

    scrollToPassport();
  }

  function scrollToPassport() {
    const el = document.getElementById('passport-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToHowItWorks() {
    const el = document.getElementById('how-it-works-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc', padding: '60px 24px' }}>
        <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease forwards', maxWidth: 480 }}>
          <div className="relative mx-auto mb-8" style={{ width: 80, height: 80 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              border: '4px solid #e0e7ff',
              borderTop: '4px solid #4f46e5',
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🤖</div>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Generating Your AI Project Passport…
          </h3>
          <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
            Tailoring your 60-minute roadmap, tech stack, and placement resume bullet for the AI Challenge
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION (High-Scale Tech Conference / Hackathon Style) */}
      {/* ============================================================== */}
      <section className="tech-grid-bg" style={{
        paddingTop: '68px',
        paddingBottom: '56px',
        textAlign: 'center',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          
          {/* Attribution chips if coming from campus captain or peer referral */}
          {(campusCode || refCode) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
              {campusCode && <span className="chip chip-brand">🏫 Campus Chapter: {campusCode}</span>}
              {refCode && <span className="chip chip-green">👋 Verified Peer Invite: {refCode}</span>}
            </div>
          )}

          {/* Conference Tagline & Event Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{
              background: '#ffffff',
              border: '1px solid #c7d2fe',
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 800,
              color: '#4338ca',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 1px 3px rgba(79,70,229,0.08)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }} />
              AI60 Challenge · Class of 2027 · Build • Learn • Compete
            </span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 style={{
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            fontWeight: 900,
            lineHeight: 1.14,
            letterSpacing: '-0.035em',
            color: '#0f172a',
            margin: '0 auto 20px',
            textTransform: 'uppercase',
            maxWidth: 820,
          }}>
            BUILD YOUR FIRST AI PROJECT IN 60 MINUTES
          </h1>

          {/* Supporting Headline */}
          <p style={{
            fontSize: 'clamp(18px, 2.3vw, 22px)',
            fontWeight: 700,
            color: '#4338ca',
            marginBottom: 16,
            letterSpacing: '-0.015em',
          }}>
            One project. One resume story. One chance to compete.
          </p>

          {/* Supporting Copy */}
          <p style={{
            fontSize: 16,
            color: '#475569',
            maxWidth: 640,
            margin: '0 auto 36px',
            lineHeight: 1.65,
          }}>
            Build something real with AI, add it to your portfolio, compete with engineering students across colleges, and climb the live challenge leaderboard.
          </p>

          {/* Primary & Secondary CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
            <button
              id="hero-start-challenge-btn"
              className="btn-primary"
              style={{ padding: '15px 32px', fontSize: 15, fontWeight: 800, borderRadius: 12, cursor: 'pointer' }}
              onClick={scrollToPassport}
            >
              <span>🚀</span> Start My AI Challenge
            </button>
            <button
              id="hero-see-how-btn"
              className="btn-secondary"
              style={{ padding: '15px 28px', fontSize: 15, fontWeight: 700, borderRadius: 12, cursor: 'pointer' }}
              onClick={scrollToHowItWorks}
            >
              See How It Works
            </button>
          </div>

          {/* Trust / Value Indicator Strip */}
          <div style={{
            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 18, flexWrap: 'wrap',
            fontSize: 12, color: '#64748b', fontWeight: 600,
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 999, padding: '8px 20px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#4f46e5' }}>⚡</span> Free Live Build Sprint
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#059669' }}>💼</span> Placement-Ready Code
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#d97706' }}>🏆</span> ₹1,700 Reward Pool (Simulation)
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. "WHAT'S IN IT FOR YOU?" (Compact 4-Card Value + Reward Strip) */}
      {/* ============================================================== */}
      <section style={{
        padding: '52px 24px',
        maxWidth: 1040,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="section-label" style={{ color: '#4338ca', marginBottom: 6 }}>
            VALUE-FIRST INCENTIVES
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            WHAT'S IN IT FOR YOU?
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, margin: '8px 0 0' }}>
            Gain verifiable career proof-of-work first, then participate in student distribution rewards.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 18,
          marginBottom: 26,
        }}>
          {/* Card 1: BUILD */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              BUILD
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Build your first AI project in 60 minutes with step-by-step guidance.
            </p>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginTop: 'auto' }}>
              ✓ Core Workshop Outcome
            </span>
          </div>

          {/* Card 2: COMPETE */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              COMPETE
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Submit your project code post-workshop and compete for:
            </p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#4338ca', margin: 'auto 0 0' }}>
              ₹400 / ₹300 / ₹200
            </p>
          </div>

          {/* Card 3: REFER */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🔗</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              REFER
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Bring classmates via your verified link and compete for:
            </p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#059669', margin: 'auto 0 0' }}>
              ₹250 / ₹150 / ₹100
            </p>
          </div>

          {/* Card 4: CREATE */}
          <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🎨</span>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              CREATE
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Create top workshop promotional content (Reel/meme/post) and win:
            </p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#be185d', margin: 'auto 0 0' }}>
              ₹300 Winner Prize
            </p>
          </div>
        </div>

        {/* Total Reward Pool Callout */}
        <div style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)',
          border: '1px solid #c7d2fe',
          borderRadius: 14,
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          boxShadow: '0 1px 3px rgba(79,70,229,0.06)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>💰</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                ₹1,700 TOTAL REWARD POOL
              </span>
              <span className="chip chip-amber" style={{ fontSize: 10 }}>SIMULATION STRATEGY</span>
            </div>
            <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>
              Allocated across ₹300 Creator Challenge + ₹500 Referral Rewards + ₹900 Project Prizes (₹300 reserve contingency not included).
            </p>
          </div>
          <button
            id="hp-view-rewards-btn"
            onClick={() => onNavigate('rewards')}
            className="btn-secondary"
            style={{
              padding: '9px 16px', fontSize: 12, fontWeight: 700, color: '#4338ca',
            }}
          >
            View Reward Rules →
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. "CHOOSE YOUR GOAL" SECTION (Selectable Intent Cards)        */}
      {/* ============================================================== */}
      <section style={{
        padding: '54px 24px',
        maxWidth: 1040,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="section-label" style={{ color: '#4338ca', marginBottom: 6 }}>
            CUSTOMIZE YOUR EXPERIENCE
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            WHAT DO YOU WANT FROM THE WORKSHOP?
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, margin: '8px 0 0' }}>
            Select your primary objective to pre-calibrate your personal Project Passport.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}>
          {/* Track A: RESUME */}
          <div
            className="card card-hover"
            style={{
              cursor: 'pointer',
              border: selectedIntent === 'resume' ? '2px solid #4f46e5' : '1px solid #e2e8f0',
              background: selectedIntent === 'resume' ? '#f5f7ff' : '#ffffff',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}
            onClick={() => handleSelectGoal('resume')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: '#4338ca' }}>TRACK A</span>
              <span style={{ fontSize: 22 }}>📄</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              RESUME
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Build an AI project you can add to your portfolio and resume.
            </p>
            <button
              id="goal-resume-btn"
              className="btn-primary"
              style={{ marginTop: 'auto', padding: '10px 16px', fontSize: 13, fontWeight: 700, width: '100%' }}
              onClick={(e) => { e.stopPropagation(); handleSelectGoal('resume'); }}
            >
              Build for My Resume →
            </button>
          </div>

          {/* Track B: INTERVIEW */}
          <div
            className="card card-hover"
            style={{
              cursor: 'pointer',
              border: selectedIntent === 'interview' ? '2px solid #059669' : '1px solid #e2e8f0',
              background: selectedIntent === 'interview' ? '#f0fdf4' : '#ffffff',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}
            onClick={() => handleSelectGoal('interview')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: '#047857' }}>TRACK B</span>
              <span style={{ fontSize: 22 }}>🎯</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              INTERVIEW
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Build something you can confidently explain in your next interview.
            </p>
            <button
              id="goal-interview-btn"
              className="btn-green"
              style={{ marginTop: 'auto', padding: '10px 16px', fontSize: 13, fontWeight: 700, width: '100%' }}
              onClick={(e) => { e.stopPropagation(); handleSelectGoal('interview'); }}
            >
              Build for My Interview →
            </button>
          </div>

          {/* Track C: PROJECT IDEA */}
          <div
            className="card card-hover"
            style={{
              cursor: 'pointer',
              border: selectedIntent === 'idea' ? '2px solid #d97706' : '1px solid #e2e8f0',
              background: selectedIntent === 'idea' ? '#fffbeb' : '#ffffff',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}
            onClick={() => handleSelectGoal('idea')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 800, color: '#b45309' }}>TRACK C</span>
              <span style={{ fontSize: 22 }}>💡</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              PROJECT IDEA
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Turn your idea into an AI-powered prototype.
            </p>
            <button
              id="goal-idea-btn"
              className="btn-primary"
              style={{
                marginTop: 'auto', padding: '10px 16px', fontSize: 13, fontWeight: 700, width: '100%',
                background: 'linear-gradient(135deg, #d97706, #b45309)', border: '1px solid #b45309',
              }}
              onClick={(e) => { e.stopPropagation(); handleSelectGoal('idea'); }}
            >
              Build My Idea →
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. CHOOSE YOUR CHALLENGE (Framed Motivation Paths)            */}
      {/* ============================================================== */}
      <section style={{
        padding: '48px 24px',
        maxWidth: 960,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            CHOOSE YOUR CHALLENGE
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: '4px 0 0' }}>
            Pick the framing that aligns with your placement urgency.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontWeight: 800, color: '#4338ca', fontSize: 15, marginBottom: 4 }}>Resume Challenge</p>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Build an AI project worth putting on your resume.
            </p>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontWeight: 800, color: '#047857', fontSize: 15, marginBottom: 4 }}>Interview Challenge</p>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Build something you can explain in an interview.
            </p>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontWeight: 800, color: '#b45309', fontSize: 15, marginBottom: 4 }}>Project Rescue</p>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Turn your existing project idea into an AI prototype.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
          Different paths. Same 60-minute build challenge.
        </p>
      </section>

      {/* ============================================================== */}
      {/* 5. PROJECT PASSPORT SECTION (Value First → Registration Second)*/}
      {/* ============================================================== */}
      <section id="passport-section" style={{
        padding: '64px 24px 72px',
        maxWidth: 760,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', marginBottom: 12 }}>
            <span className="chip chip-brand" style={{ fontSize: 11 }}>
              💡 Value First → Registration Second
            </span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            GET SOMETHING USEFUL BEFORE YOU REGISTER
          </h2>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
            Answer a few quick questions and get a personalized AI Project Passport.
          </p>
        </div>

        {/* 5 High-Value Outputs Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '18px 22px',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#4338ca', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
            What you receive immediately:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13, color: '#334155' }}>
            <div>💡 <strong>AI Project Idea</strong> (domain-calibrated)</div>
            <div>⏱️ <strong>60-Minute Roadmap</strong> (4 build phases)</div>
            <div>🛠️ <strong>Modern Tech Stack</strong> (APIs & UI)</div>
            <div>📄 <strong>Placement Resume Bullet</strong></div>
            <div>🎯 <strong>Interview Defense Talking Point</strong></div>
          </div>
        </div>

        {/* Student Intent & Value Proposition Signal Banner */}
        <div style={{
          background: selectedIntent === 'resume'
            ? '#eef2ff'
            : selectedIntent === 'interview'
            ? '#ecfdf5'
            : selectedIntent === 'idea'
            ? '#fffbeb'
            : '#ffffff',
          border: selectedIntent === 'resume'
            ? '1px solid #c7d2fe'
            : selectedIntent === 'interview'
            ? '1px solid #a7f3d0'
            : selectedIntent === 'idea'
            ? '1px solid #fde68a'
            : '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 22,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: selectedIntent === 'resume' ? '#4338ca' : selectedIntent === 'interview' ? '#047857' : selectedIntent === 'idea' ? '#b45309' : '#4338ca',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                STUDENT INTENT: {selectedIntent === 'resume' ? 'RESUME / PORTFOLIO' : selectedIntent === 'interview' ? 'INTERVIEW READINESS' : selectedIntent === 'idea' ? 'PROJECT PROTOTYPE' : 'PLACEMENT PREP'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#0f172a', margin: 0, fontWeight: 600 }}>
              Recommended Value Proposition: &ldquo;{
                selectedIntent === 'resume'
                  ? 'Build an AI project you can add to your portfolio.'
                  : selectedIntent === 'interview'
                  ? 'Build something you can confidently explain in your next interview.'
                  : selectedIntent === 'idea'
                  ? 'Turn your idea into an AI-powered prototype.'
                  : 'Build an AI project you can add to your portfolio or defend in interviews.'
              }&rdquo;
            </p>
          </div>
          <span style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
            CTA: {
              selectedIntent === 'resume'
                ? 'Generate Resume Passport →'
                : selectedIntent === 'interview'
                ? 'Generate Interview Passport →'
                : selectedIntent === 'idea'
                ? 'Generate Prototype Passport →'
                : 'Generate AI Project Passport →'
            }
          </span>
        </div>

        {/* The 5-Input Passport Generator Form */}
        <div className="card" style={{ gap: 24, display: 'flex', flexDirection: 'column', padding: '30px' }}>
          {/* Question 1: Branch */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              1. What is your Engineering Branch?
            </label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Calibrated for Class of 2027 placement domains
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {BRANCHES.map(b => (
                <button
                  key={b}
                  type="button"
                  id={`hp-branch-${b.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  aria-pressed={branch === b}
                  onClick={() => setBranch(b)}
                  style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: 12, fontWeight: branch === b ? 700 : 500, cursor: 'pointer',
                    border: branch === b ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: branch === b ? '#eef2ff' : '#ffffff',
                    color: branch === b ? '#4338ca' : '#334155',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Skill Level */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              2. What is your current AI / Coding skill level?
            </label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Ensures your 60-minute build plan is practical and achievable
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {EXPERIENCES.map(exp => (
                <button
                  key={exp}
                  type="button"
                  id={`hp-experience-${exp.toLowerCase()}`}
                  aria-pressed={experience === exp}
                  onClick={() => setExperience(exp)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: experience === exp ? 700 : 500, cursor: 'pointer',
                    border: experience === exp ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: experience === exp ? '#eef2ff' : '#ffffff',
                    color: experience === exp ? '#4338ca' : '#334155',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Interest Area */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              3. What area of technology interests you most?
            </label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Choose your target project medium
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {INTERESTS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  id={`hp-interest-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                  aria-pressed={interest === opt}
                  onClick={() => setInterest(opt)}
                  style={{
                    padding: '9px 10px', borderRadius: 8, fontSize: 12, fontWeight: interest === opt ? 700 : 500, cursor: 'pointer',
                    border: interest === opt ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: interest === opt ? '#eef2ff' : '#ffffff',
                    color: interest === opt ? '#4338ca' : '#334155',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Preferred Domain */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              4. Preferred AI Domain / Career Track
            </label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Tailors interview talking points to specific hiring tracks
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {DOMAINS.map(d => (
                <button
                  key={d}
                  type="button"
                  id={`hp-domain-${d.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  aria-pressed={domain === d}
                  onClick={() => setDomain(d)}
                  style={{
                    padding: '9px 10px', borderRadius: 8, fontSize: 12, fontWeight: domain === d ? 700 : 500, cursor: 'pointer',
                    border: domain === d ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: domain === d ? '#ecfdf5' : '#ffffff',
                    color: domain === d ? '#047857' : '#334155',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Goal */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              5. What do you want to build or achieve?
            </label>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
              Describe your project idea, career goal, or interview focus in a few words
            </p>
            <textarea
              id="hp-goal-input"
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
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px', color: '#b91c1c', fontSize: 13,
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            id="hp-generate-passport-btn"
            className="btn-primary"
            style={{ width: '100%', padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
            onClick={handleGenerate}
          >
            <span>🚀</span> Generate My Project
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', margin: 0 }}>
            Free workshop · No credit card · Takes 60 seconds
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. "HOW THE CHALLENGE WORKS" (5-Step Visual Growth Flow)      */}
      {/* ============================================================== */}
      <section id="how-it-works-section" style={{
        padding: '54px 24px',
        maxWidth: 1040,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="section-label" style={{ color: '#4338ca', marginBottom: 6 }}>
            THE 5-STEP JOURNEY
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            HOW THE CHALLENGE WORKS
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          position: 'relative',
        }}>
          {[
            { num: '01', title: 'DISCOVER', desc: 'Find a project worth building.' },
            { num: '02', title: 'PERSONALIZE', desc: 'Get your AI Project Passport.' },
            { num: '03', title: 'BUILD', desc: 'Join the 60-minute workshop.' },
            { num: '04', title: 'SHARE', desc: 'Refer friends or create promotional content.' },
            { num: '05', title: 'COMPETE', desc: 'Submit your project and compete.' },
          ].map((st) => (
            <div key={st.num} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '20px 16px',
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: 8,
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#4338ca' }}>
                {st.num}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {st.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SOCIAL PROOF / CAMPUS COMPETITION                           */}
      {/* ============================================================== */}
      <section style={{
        padding: '54px 24px',
        maxWidth: 960,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                YOUR COLLEGE IS IN THE GAME
              </h2>
              <span className="chip chip-amber" style={{ fontSize: 10 }}>SIMULATION DATA</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Bring your classmates. Help your college climb the leaderboard.
            </p>
          </div>
          <button
            id="hp-view-campus-btn"
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700 }}
            onClick={() => onNavigate('campus')}
          >
            View Campus League →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🥇</span>
              <div>
                <p style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: 15 }}>VIT</p>
                <span style={{ fontSize: 11, color: '#64748b' }}>Vellore Institute</span>
              </div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#b45309' }}>87 regs</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🥈</span>
              <div>
                <p style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: 15 }}>Amrita</p>
                <span style={{ fontSize: 11, color: '#64748b' }}>Amrita Vishwa</span>
              </div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#64748b' }}>72 regs</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🥉</span>
              <div>
                <p style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: 15 }}>SRM</p>
                <span style={{ fontSize: 11, color: '#64748b' }}>SRM Institute</span>
              </div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#b45309' }}>64 regs</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. REFERRAL SECTION (Build With Your Friends)                 */}
      {/* ============================================================== */}
      <section style={{
        padding: '54px 24px',
        maxWidth: 960,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 16,
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 24,
          alignItems: 'center',
        }}>
          <div>
            <span className="chip chip-green" style={{ marginBottom: 10, display: 'inline-flex' }}>
              👥 Student Referral Engine
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              BUILD WITH YOUR FRIENDS
            </h2>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: '0 0 18px' }}>
              Already registered? Bring your friends, climb the referral leaderboard, and compete for rewards.
            </p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>
              🔒 <em>Your private referral code is generated immediately upon registration to prevent unauthorized sharing.</em>
            </p>
            <button
              id="hp-see-referral-btn"
              className="btn-green"
              style={{ padding: '10px 20px', fontSize: 14, fontWeight: 700 }}
              onClick={() => onNavigate('referrals')}
            >
              See Referral Challenge →
            </button>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: '0 1px 3px rgba(22,101,52,0.06)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#047857', textTransform: 'uppercase', margin: 0 }}>
              Campus Referral Prizes (₹500 Pool)
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>🥇 Rank #1 Top Referrer</span>
              <strong style={{ fontSize: 16, color: '#b45309' }}>₹250</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>🥈 Rank #2 Runner Up</span>
              <strong style={{ fontSize: 16, color: '#64748b' }}>₹150</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>🥉 Rank #3 Second Runner Up</span>
              <strong style={{ fontSize: 16, color: '#b45309' }}>₹100</strong>
            </div>
            <p style={{ fontSize: 11, color: '#64748b', margin: '6px 0 0', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              Strict anti-fraud: Verified unique registrations count only.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. CREATOR CHALLENGE SECTION (Market It Better)               */}
      {/* ============================================================== */}
      <section style={{
        padding: '54px 24px',
        maxWidth: 960,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          background: '#fdf2f8',
          border: '1px solid #fbcfe8',
          borderRadius: 16,
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 24,
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="chip" style={{ background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' }}>
                🎨 Student Creator Challenge
              </span>
              <span className="chip chip-amber" style={{ fontSize: 10 }}>SIMULATION</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              THINK YOU CAN MARKET IT BETTER?
            </h2>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: '0 0 14px' }}>
              Create a Reel, post, meme or WhatsApp creative promoting the workshop with your unique tracking link.
            </p>
            <div style={{
              background: '#ffffff', padding: '10px 14px', borderRadius: 8, marginBottom: 18,
              borderLeft: '3px solid #db2777', fontSize: 12, color: '#0f172a', border: '1px solid #fbcfe8',
            }}>
              💡 <em>"Views are useful. Clicks are useful. Qualified registrations matter most."</em>
            </div>
            <button
              id="hp-see-creator-btn"
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: 13, fontWeight: 700 }}
              onClick={() => onNavigate('dashboard')}
            >
              See Creator Challenge →
            </button>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #fbcfe8',
            borderRadius: 12,
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(190,24,93,0.06)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>
              WINNER PRIZE
            </p>
            <p style={{ fontSize: 42, fontWeight: 900, color: '#be185d', margin: '6px 0 2px' }}>
              🏆 ₹300
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
              Top Promotional Creator
            </p>
            <div style={{ fontSize: 11, color: '#64748b', textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
              Scoring Model:<br/>
              • Qualified registrations = <strong>60%</strong><br/>
              • Click-through rate = <strong>20%</strong><br/>
              • Engagement = <strong>10%</strong> · Creativity = <strong>10%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. REWARD SUMMARY (Compact Final Strip)                      */}
      {/* ============================================================== */}
      <section style={{
        padding: '48px 24px',
        maxWidth: 960,
        margin: '0 auto',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
            BUILD. REFER. CREATE. WIN.
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Structured rewards aligned with quality acquisition and genuine technical output.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', textAlign: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: '#4338ca', margin: 0 }}>₹900</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>AI Project Competition</p>
            <span style={{ fontSize: 11, color: '#64748b' }}>Post-workshop submissions</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', textAlign: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: '#047857', margin: 0 }}>₹500</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>Referral Leaderboard</p>
            <span style={{ fontSize: 11, color: '#64748b' }}>Verified unique peers</span>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px', textAlign: 'center', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <p style={{ fontSize: 26, fontWeight: 900, color: '#be185d', margin: 0 }}>₹300</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '4px 0 0' }}>Creator Challenge</p>
            <span style={{ fontSize: 11, color: '#64748b' }}>Top promotional creative</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 10 }}>
            ₹1,700 TOTAL REWARD POOL
          </p>
          <button
            id="hp-view-full-rewards-link"
            onClick={() => onNavigate('rewards')}
            style={{
              background: 'none', border: 'none', color: '#4338ca', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            View Full Reward Rules →
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. FINAL CTA SECTION                                          */}
      {/* ============================================================== */}
      <section className="tech-grid-bg" style={{
        padding: '72px 24px',
        textAlign: 'center',
        borderTop: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            READY TO BUILD YOUR FIRST AI PROJECT?
          </h2>
          <p style={{ fontSize: 16, color: '#475569', margin: '0 0 32px' }}>
            Start with your personalized Project Passport.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            <button
              id="final-start-challenge-btn"
              className="btn-primary"
              style={{ padding: '15px 32px', fontSize: 15, fontWeight: 800, borderRadius: 12, cursor: 'pointer' }}
              onClick={scrollToPassport}
            >
              <span>🚀</span> Start My AI Challenge
            </button>
            <button
              id="final-see-how-btn"
              className="btn-secondary"
              style={{ padding: '15px 28px', fontSize: 15, fontWeight: 700, borderRadius: 12, cursor: 'pointer' }}
              onClick={scrollToHowItWorks}
            >
              View How It Works
            </button>
          </div>
          <div className="sim-banner" style={{ display: 'inline-flex', padding: '6px 14px' }}>
            <span>⚠</span>
            <span>Simulation prototype for NxtWave Growth Challenge — 500-registration target model</span>
          </div>
        </div>
      </section>

    </div>
  );
}
