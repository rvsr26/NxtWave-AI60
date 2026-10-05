import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';
import { getCampuses } from '../storage';

const INTERESTS = ['Web', 'Mobile', 'Data', 'Education', 'Productivity', 'Finance', 'Developer Tools', 'Other'];

interface Props {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const { register, state } = useApp();
  const urlParams = new URLSearchParams(window.location.search);
  const urlCampus = urlParams.get('campus') || '';
  const urlRef = urlParams.get('ref') || '';
  const urlSrc = urlParams.get('src') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    branch: 'Computer Science',
    graduationYear: '2027' as const,
    interest: state.currentPassport?.interest || 'Web',
    source: urlSrc || 'direct',
  });
  const [referralCode, setReferralCode] = useState(urlRef || '');
  const [campusCode, setCampusCode] = useState(urlCampus || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const campuses = getCampuses();

  Analytics.registrationStarted();

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.college.trim()) errs.college = 'College is required';
    if (!form.branch.trim()) errs.branch = 'Engineering branch is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const result = await register({
      ...form,
      referredBy: referralCode || urlRef || undefined,
      campus: campusCode || urlCampus || undefined,
      source: urlSrc || form.source,
      passportId: state.currentPassport?.id,
    });

    setLoading(false);
    if (result.success) {
      onSuccess();
    } else {
      setErrors({ global: result.error || 'Registration failed. Please try again.' });
    }
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {/* Step indicator: Low friction */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <span className="chip chip-brand" style={{ fontSize: 11, fontWeight: 700 }}>
            Step 2 of 2 · 5 Essential Fields
          </span>
        </div>

        {state.currentPassport && (
          <div style={{
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: 12, padding: '14px 18px', marginBottom: 20,
            textAlign: 'left',
          }}>
            <p className="section-label" style={{ color: '#4338ca', marginBottom: 4 }}>Your Project Passport</p>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, margin: 0 }}>
              🤖 {state.currentPassport.projectName}
            </p>
          </div>
        )}
        <h2 style={{
          fontSize: 28, fontWeight: 900, color: '#0f172a',
          letterSpacing: '-0.02em', marginBottom: 8,
        }}>
          Reserve Your Free Workshop Seat
        </h2>
        <p style={{ color: '#0f172a', fontSize: 14, margin: 0, fontWeight: 600 }}>
          Target: Final-Year Engineering Students — Class of 2027
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '30px' }}>
          {errors.global && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px', color: '#b91c1c', fontSize: 14,
            }}>
              ⚠ {errors.global}
            </div>
          )}

          {/* 1. Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Full Name *
            </label>
            <input
              id="reg-name"
              type="text"
              className="input-base"
              placeholder="e.g. Arjun Kumar"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              autoComplete="name"
            />
            {errors.name && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* 2. Email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              College Email Address *
            </label>
            <input
              id="reg-email"
              type="email"
              className="input-base"
              placeholder="you@college.edu"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
            {errors.email && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>

          {/* 3. College */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              College / University *
            </label>
            <input
              id="reg-college"
              type="text"
              className="input-base"
              placeholder="e.g. VIT University"
              value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
            />
            {errors.college && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.college}</p>}
          </div>

          {/* 4. Engineering Branch */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Engineering Branch *
            </label>
            <select
              id="reg-branch"
              className="input-base"
              value={form.branch}
              onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
            >
              <option value="Computer Science">Computer Science / IT</option>
              <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
              <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Other Engineering">Other Engineering Branch</option>
            </select>
            {errors.branch && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.branch}</p>}
          </div>

          {/* 5. Graduation Year: Class of 2027 */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Graduation Year *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#eef2ff', border: '1px solid #c7d2fe',
              borderRadius: 10, padding: '12px 16px',
            }}>
              <span style={{ fontSize: 18 }}>🎓</span>
              <div>
                <span style={{ fontWeight: 800, color: '#4338ca', fontSize: 14 }}>Class of 2027 (Pre-final / Final-Year Placement Track)</span>
                <p style={{ fontSize: 11, color: '#0f172a', margin: '2px 0 0', fontWeight: 600 }}>
                  Curriculum and starter repositories calibrated for 2027 placement season.
                </p>
              </div>
            </div>
          </div>

          {/* Interest */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Primary Interest *
            </label>
            <select
              id="reg-interest"
              className="input-base"
              value={form.interest}
              onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
            >
              <option value="">Select your interest</option>
              {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.interest && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.interest}</p>}
          </div>

          {/* Campus Code */}
          {campuses.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Campus Code <span style={{ fontWeight: 600, color: '#0f172a' }}>(optional)</span>
              </label>
              <select
                id="reg-campus"
                className="input-base"
                value={campusCode}
                onChange={e => setCampusCode(e.target.value)}
              >
                <option value="">None</option>
                {campuses.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Referral Code */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Referral Code <span style={{ fontWeight: 600, color: '#0f172a' }}>(optional)</span>
            </label>
            <input
              id="reg-referral"
              type="text"
              className="input-base mono"
              placeholder="e.g. ARJUN60"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              style={{ letterSpacing: '0.05em' }}
            />
          </div>

          <button
            id="submit-registration-btn"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 15, fontWeight: 800, marginTop: 6 }}
            disabled={loading}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Reserving your seat…</>
            ) : (
              <><span>🎯</span> Reserve My Seat</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#0f172a', margin: 0, fontWeight: 600 }}>
            Free workshop · No credit card · We don't spam
          </p>
        </div>
      </form>
    </div>
  );
}
