import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Analytics } from '../analytics';
import { getCampuses } from '../storage';

const INTERESTS = ['Web', 'Mobile', 'Data', 'Education', 'Productivity', 'Finance', 'Developer Tools', 'Other'];
const GRAD_YEARS = ['2025', '2026', '2027', '2028'];

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
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {/* Step indicator: Low friction */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span className="chip chip-brand" style={{ fontSize: 11, fontWeight: 700 }}>
            Step 2 of 2 · 5 Essential Fields
          </span>
        </div>

        {state.currentPassport && (
          <div style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            textAlign: 'left',
          }}>
            <p className="section-label" style={{ marginBottom: 4 }}>Your Project Passport</p>
            <p style={{ fontWeight: 700, color: '#818cf8', fontSize: 15 }}>
              🤖 {state.currentPassport.projectName}
            </p>
          </div>
        )}
        <h2 style={{
          fontSize: 28, fontWeight: 800, color: '#f1f1f5',
          letterSpacing: '-0.02em', marginBottom: 8,
        }}>
          Reserve Your Free Workshop Seat
        </h2>
        <p style={{ color: 'rgba(241,241,245,0.6)', fontSize: 14 }}>
          Target: Final-Year Engineering Students — Class of 2027
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {errors.global && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 14,
            }}>
              ⚠ {errors.global}
            </div>
          )}

          {/* 1. Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
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
            {errors.name && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
          </div>

          {/* 2. Email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
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
            {errors.email && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>

          {/* 3. College */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
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
            {errors.college && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.college}</p>}
          </div>

          {/* 4. Engineering Branch */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
              Engineering Branch *
            </label>
            <select
              id="reg-branch"
              className="input-base"
              style={{ backgroundColor: '#12141f', color: '#f1f1f5' }}
              value={form.branch}
              onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
            >
              <option value="Computer Science" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Computer Science / IT</option>
              <option value="Electronics & Communication" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Electronics & Communication (ECE)</option>
              <option value="Electrical & Electronics" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Electrical & Electronics (EEE)</option>
              <option value="Mechanical Engineering" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Mechanical Engineering</option>
              <option value="Civil Engineering" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Civil Engineering</option>
              <option value="Other Engineering" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Other Engineering Branch</option>
            </select>
            {errors.branch && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.branch}</p>}
          </div>

          {/* 5. Graduation Year: Class of 2027 */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
              Graduation Year *
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 8, padding: '10px 14px',
            }}>
              <span style={{ fontSize: 16 }}>🎓</span>
              <div>
                <span style={{ fontWeight: 700, color: '#818cf8', fontSize: 14 }}>Class of 2027 (Pre-final / Final-Year Placement Track)</span>
                <p style={{ fontSize: 11, color: 'rgba(241,241,245,0.5)', margin: 0 }}>
                  Curriculum and starter repositories calibrated for 2027 placement season.
                </p>
              </div>
            </div>
          </div>

          {/* Interest */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
              Primary Interest *
            </label>
            <select
              id="reg-interest"
              className="input-base"
              style={{ backgroundColor: '#12141f', color: '#f1f1f5' }}
              value={form.interest}
              onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
            >
              <option value="" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>Select your interest</option>
              {INTERESTS.map(i => <option key={i} value={i} style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>{i}</option>)}
            </select>
            {errors.interest && <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 4 }}>{errors.interest}</p>}
          </div>

          {/* Campus Code */}
          {campuses.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
                Campus Code <span style={{ fontWeight: 400, color: 'rgba(241,241,245,0.4)' }}>(optional)</span>
              </label>
              <select
                id="reg-campus"
                className="input-base"
                style={{ backgroundColor: '#12141f', color: '#f1f1f5' }}
                value={campusCode}
                onChange={e => setCampusCode(e.target.value)}
              >
                <option value="" style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>None</option>
                {campuses.map(c => (
                  <option key={c.code} value={c.code} style={{ backgroundColor: '#161824', color: '#f1f1f5' }}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Referral Code */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(241,241,245,0.8)', marginBottom: 6 }}>
              Referral Code <span style={{ fontWeight: 400, color: 'rgba(241,241,245,0.4)' }}>(optional)</span>
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
            style={{ width: '100%', padding: '16px', fontSize: 15, fontWeight: 800, marginTop: 4 }}
            disabled={loading}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Reserving your seat…</>
            ) : (
              <><span>🎯</span> Reserve My Seat</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(241,241,245,0.3)' }}>
            Free workshop · No credit card · We don't spam
          </p>
        </div>
      </form>
    </div>
  );
}
