import React from 'react';
import type { ProjectPassport } from '../types';

interface Props {
  passport: ProjectPassport;
  onRegister: () => void;
  referralCode?: string;
}

export default function PassportCard({ passport, onRegister, referralCode }: Props) {
  const difficultyColor = {
    Beginner: '#059669',
    Intermediate: '#d97706',
    Advanced: '#dc2626',
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
          color: '#0f172a',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          Your personalized project is ready
        </h2>
        <p style={{ color: '#0f172a', fontSize: 14, marginTop: 8, fontWeight: 500 }}>
          This is an example project concept tailored to your interests — not a guaranteed workshop curriculum.
        </p>
      </div>

      {/* Passport Card */}
      <div className="card fade-in-up" style={{
        border: '1px solid #c7d2fe',
        background: '#ffffff',
        boxShadow: '0 4px 20px -2px rgba(79, 70, 229, 0.08), 0 2px 6px rgba(15, 23, 42, 0.03)',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 120, height: 120,
          background: 'radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 70%)',
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
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              }}>🤖</div>
              <div>
                <p className="section-label" style={{ marginBottom: 2 }}>Project Name</p>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {passport.projectName}
                </h3>
              </div>
            </div>
            <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.6 }}>
              {passport.description}
            </p>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 20 }} />

        {/* Metadata row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>Difficulty:</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: difficultyColor,
              background: `${difficultyColor}14`,
              border: `1px solid ${difficultyColor}35`,
              padding: '2px 8px', borderRadius: 999,
            }}>{passport.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>Area:</span>
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
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why this project fits me */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #a7f3d0',
          borderRadius: 12, padding: '16px 18px', marginBottom: 20,
        }}>
          <p className="section-label" style={{ color: '#047857', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💡</span> Why This Project Fits You
          </p>
          <div style={{
            fontSize: 12, color: '#0f172a', marginBottom: 12,
            background: '#ffffff', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: 8, display: 'inline-block',
            fontWeight: 600,
          }}>
            Selected: <strong style={{ color: '#4338ca' }}>{passport.interest}</strong> + <strong style={{ color: '#047857' }}>{passport.difficulty}</strong> + <span style={{ color: '#b45309', fontWeight: 700 }}>Class of 2027</span>
          </div>
          {passport.whyReasons && passport.whyReasons.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {passport.whyReasons.map((reason, i) => (
                <li key={i} style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.6 }}>
                  {reason}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.6, margin: 0 }}>
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
                fontWeight: 600,
                background: '#ecfeff',
                border: '1px solid #a5f3fc',
                color: '#0e7490',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Example Resume Bullet & Interview Talking Point */}
        {passport.resumeBullet && (
          <div style={{
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: 12, padding: '16px 18px', marginBottom: 14,
          }}>
            <p className="section-label" style={{ color: '#4338ca', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📄</span> Placement Resume Bullet Point
            </p>
            <p style={{ fontSize: 13, color: '#1e1b4b', lineHeight: 1.6, fontStyle: 'italic', margin: 0, fontWeight: 500 }}>
              • {passport.resumeBullet}
            </p>
            <p style={{ fontSize: 11, color: '#0f172a', marginTop: 8, margin: '8px 0 0', fontWeight: 600 }}>
              Action-oriented technical bullet point tailored for 2027 campus placements.
            </p>
          </div>
        )}

        {passport.interviewTalkingPoint && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 12, padding: '16px 18px', marginBottom: 20,
          }}>
            <p className="section-label" style={{ color: '#047857', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🎙</span> Recruiter Interview Talking Point
            </p>
            <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {passport.interviewTalkingPoint}
            </p>
            <p style={{ fontSize: 11, color: '#0f172a', marginTop: 8, margin: '8px 0 0', fontWeight: 600 }}>
              Architectural defense statement for answering “Walk me through an AI project you've built.”
            </p>
          </div>
        )}

        {/* 60-minute Build Roadmap */}
        {passport.buildRoadmap && passport.buildRoadmap.length > 0 && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12, padding: '16px 18px', marginBottom: 20,
          }}>
            <p className="section-label" style={{ color: '#b45309', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⏱</span> 60-Minute Build Roadmap
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {passport.buildRoadmap.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 13 }}>
                  <span className="mono" style={{
                    color: '#4338ca', fontWeight: 700, fontSize: 11, minWidth: 55, flexShrink: 0,
                    background: '#eef2ff', border: '1px solid #c7d2fe', padding: '2px 6px', borderRadius: 4, textAlign: 'center',
                  }}>
                    {item.time}
                  </span>
                  <span style={{ color: '#0f172a', lineHeight: 1.5 }}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What you'll build */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12, padding: '14px 16px', marginBottom: 20,
        }}>
          <p className="section-label" style={{ color: '#047857', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🛠</span> Live Workshop Scope
          </p>
          <p style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.6, margin: 0 }}>
            {passport.workshopBuild}
          </p>
        </div>

        {/* Next step */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12, padding: '14px 16px',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, color: '#4f46e5' }}>→</span>
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>Next Step After Workshop</p>
            <p style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.5, margin: 0 }}>
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
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 10,
        }}>
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>
            👋 You were referred by <strong>{referralCode}</strong>
          </p>
        </div>
      )}

      <p style={{
        textAlign: 'center', fontSize: 12,
        color: '#0f172a', marginTop: 20, fontWeight: 500,
      }}>
        This is a personalized project concept, not a guaranteed workshop curriculum.
      </p>
    </div>
  );
}
