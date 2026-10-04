import React from 'react';
import type { ProjectPassport } from '../types';

interface Props {
  passport: ProjectPassport;
  onRegister: () => void;
  referralCode?: string;
}

export default function PassportCard({ passport, onRegister, referralCode }: Props) {
  const difficultyColor = {
    Beginner: '#10b981',
    Intermediate: '#f59e0b',
    Advanced: '#ef4444',
  }[passport.difficulty];

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '32px 24px 80px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span className="chip chip-green" style={{ marginBottom: 16, display: 'inline-flex' }}>
          ✨ Your AI Project Passport
        </span>
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 900,
          color: '#f1f1f5',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Your personalized project is ready
        </h2>
        <p style={{ color: 'rgba(241,241,245,0.5)', fontSize: 14, marginTop: 8 }}>
          This is an example project concept tailored to your interests — not a guaranteed workshop curriculum.
        </p>
      </div>

      {/* Passport Card */}
      <div className="card fade-in-up" style={{
        border: '1px solid rgba(99,102,241,0.3)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.05))',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 120, height: 120,
          background: 'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 70%)',
        }} />

        {/* Project Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>🤖</div>
              <div>
                <p className="section-label" style={{ marginBottom: 2 }}>Project Name</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#f1f1f5', lineHeight: 1.2 }}>
                  {passport.projectName}
                </h3>
              </div>
            </div>
            <p style={{ color: 'rgba(241,241,245,0.7)', fontSize: 14, lineHeight: 1.6 }}>
              {passport.description}
            </p>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 20 }} />

        {/* Metadata row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)' }}>Difficulty:</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: difficultyColor,
              background: `${difficultyColor}18`,
              border: `1px solid ${difficultyColor}30`,
              padding: '2px 8px', borderRadius: 999,
            }}>{passport.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(241,241,245,0.4)' }}>Area:</span>
            <span className="chip chip-brand" style={{ fontSize: 11 }}>{passport.interest}</span>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 20 }}>
          <p className="section-label" style={{ marginBottom: 10 }}>Skills You'll Learn</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {passport.skills.map(skill => (
              <span key={skill} style={{
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#a5b4fc',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why this project fits me */}
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 10, padding: '16px 18px', marginBottom: 20,
        }}>
          <p className="section-label" style={{ color: '#34d399', marginBottom: 8 }}>💡 Why This Project Fits You</p>
          <div style={{
            fontSize: 12, color: 'rgba(241,241,245,0.6)', marginBottom: 10,
            background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, display: 'inline-block',
          }}>
            Selected: <strong style={{ color: '#818cf8' }}>{passport.interest}</strong> + <strong style={{ color: '#34d399' }}>{passport.difficulty}</strong> + <span style={{ color: '#fcd34d' }}>Class of 2027</span>
          </div>
          {passport.whyReasons && passport.whyReasons.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {passport.whyReasons.map((reason, i) => (
                <li key={i} style={{ fontSize: 13, color: 'rgba(241,241,245,0.85)', lineHeight: 1.5 }}>
                  {reason}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.75)', lineHeight: 1.6, margin: 0 }}>
              {passport.relevance}
            </p>
          )}
        </div>

        {/* Suggested Tech Stack */}
        <div style={{ marginBottom: 20 }}>
          <p className="section-label" style={{ marginBottom: 10 }}>Suggested Tech Stack</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {passport.techStack.map(tech => (
              <span key={tech} className="mono" style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.2)',
                color: '#67e8f9',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Example Resume Bullet & Interview Talking Point */}
        {passport.resumeBullet && (
          <div style={{
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 14,
          }}>
            <p className="section-label" style={{ color: '#a5b4fc', marginBottom: 6 }}>📄 Placement Resume Bullet Point</p>
            <p style={{ fontSize: 13, color: '#f1f1f5', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              • {passport.resumeBullet}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 6, margin: '6px 0 0' }}>
              Action-oriented technical bullet point tailored for 2027 campus placements.
            </p>
          </div>
        )}

        {passport.interviewTalkingPoint && (
          <div style={{
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
          }}>
            <p className="section-label" style={{ color: '#34d399', marginBottom: 6 }}>🎙 Recruiter Interview Talking Point</p>
            <p style={{ fontSize: 13, color: '#f1f1f5', lineHeight: 1.6, margin: 0 }}>
              {passport.interviewTalkingPoint}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.4)', marginTop: 6, margin: '6px 0 0' }}>
              Architectural defense statement for answering “Walk me through an AI project you've built.”
            </p>
          </div>
        )}

        {/* 60-minute Build Roadmap */}
        {passport.buildRoadmap && passport.buildRoadmap.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '16px', marginBottom: 20,
          }}>
            <p className="section-label" style={{ color: '#fcd34d', marginBottom: 12 }}>⏱ 60-Minute Build Roadmap</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {passport.buildRoadmap.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 13 }}>
                  <span className="mono" style={{
                    color: '#818cf8', fontWeight: 700, fontSize: 11, minWidth: 55, flexShrink: 0,
                    background: 'rgba(99,102,241,0.12)', padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                  }}>
                    {item.time}
                  </span>
                  <span style={{ color: 'rgba(241,241,245,0.8)', lineHeight: 1.4 }}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What you'll build */}
        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 10, padding: '14px 16px', marginBottom: 20,
        }}>
          <p className="section-label" style={{ color: '#818cf8', marginBottom: 6 }}>🛠 Live Workshop Scope</p>
          <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.75)', lineHeight: 1.6 }}>
            {passport.workshopBuild}
          </p>
        </div>

        {/* Next step */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>→</span>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Next Step After Workshop</p>
            <p style={{ fontSize: 13, color: 'rgba(241,241,245,0.7)', lineHeight: 1.5 }}>
              {passport.nextStep}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          id="register-from-passport-btn"
          className="btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 800 }}
          onClick={onRegister}
        >
          <span>🚀</span>
          Build My Project in 60 Minutes
        </button>
        <button
          id="register-seat-btn"
          className="btn-secondary"
          style={{ width: '100%', padding: '14px' }}
          onClick={onRegister}
        >
          Reserve My Free Workshop Seat
        </button>
      </div>

      {referralCode && (
        <div style={{
          marginTop: 24, textAlign: 'center',
          padding: '12px 16px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 10,
        }}>
          <p style={{ fontSize: 13, color: '#34d399' }}>
            👋 You were referred by <strong>{referralCode}</strong>
          </p>
        </div>
      )}

      <p style={{
        textAlign: 'center', fontSize: 12,
        color: 'rgba(241,241,245,0.3)', marginTop: 20,
      }}>
        This is a personalized project concept, not a guaranteed workshop curriculum.
      </p>
    </div>
  );
}
