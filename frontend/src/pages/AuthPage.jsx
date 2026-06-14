import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Lock, User, IdCard, Eye, EyeOff, Loader2, GraduationCap, BookOpen } from 'lucide-react';

const FACULTIES = [
  'Computer Science',
  'Information Technology',
  'Engineering',
  'Mathematics',
  'Physics',
  'Business Administration',
  'Education',
  'Arts & Humanities',
];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthPage() {
  const location = useLocation();
  const [role, setRole] = useState('student');
  const [view, setView] = useState(location.pathname.includes('register') ? 'signup' : 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    faculty: FACULTIES[0],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (view === 'signup') {
      if (!form.name.trim() || form.name.trim().length < 2) {
        errs.name = 'Full name must be at least 2 characters';
      }
      if (role === 'student' && !form.studentId.trim()) {
        errs.studentId = 'Student ID number is required';
      }
      if (role === 'lecturer' && !form.faculty.trim()) {
        errs.faculty = 'Please select a faculty/department';
      }
      if (!form.confirmPassword) {
        errs.confirmPassword = 'Please confirm your password';
      } else if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    const payload = {
      role,
      email: form.email,
      password: form.password,
      ...(view === 'signup' && {
        name: form.name.trim(),
        ...(role === 'student' && { studentId: form.studentId.trim() }),
        ...(role === 'lecturer' && { faculty: form.faculty }),
      }),
    };

    console.log('Auth payload:', payload);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const switchView = () => {
    setView((v) => (v === 'login' ? 'signup' : 'login'));
    setErrors({});
  };

  const inputClass = (name) =>
    `auth-input${errors[name] ? ' auth-input--error' : ''}`;

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--enhanced">

        {/* ---- Role Toggle ---- */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn${role === 'student' ? ' role-btn--active' : ''}`}
            onClick={() => { setRole('student'); setErrors({}); }}
          >
            <GraduationCap size={18} />
            Student
          </button>
          <button
            type="button"
            className={`role-btn${role === 'lecturer' ? ' role-btn--active' : ''}`}
            onClick={() => { setRole('lecturer'); setErrors({}); }}
          >
            <BookOpen size={18} />
            Lecturer
          </button>
        </div>

        {/* ---- View Toggle ---- */}
        <div className="view-toggle">
          <button
            type="button"
            className={`view-btn${view === 'login' ? ' view-btn--active' : ''}`}
            onClick={() => switchView()}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`view-btn${view === 'signup' ? ' view-btn--active' : ''}`}
            onClick={() => switchView()}
          >
            Sign Up
          </button>
        </div>

        {/* ---- Heading ---- */}
        <h2 className="auth-title">
          {view === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {view === 'login'
            ? `Sign in as a ${role === 'student' ? 'Student' : 'Lecturer'}`
            : `Register as a ${role === 'student' ? 'Student' : 'Lecturer'}`}
        </p>

        {/* ---- Form ---- */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name (signup only) */}
          {view === 'signup' && (
            <div className="auth-field">
              <div className={inputClass('name')}>
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          {/* Student ID (signup + student) */}
          {view === 'signup' && role === 'student' && (
            <div className="auth-field">
              <div className={inputClass('studentId')}>
                <IdCard size={18} className="input-icon" />
                <input
                  type="text"
                  name="studentId"
                  placeholder="Student ID Number"
                  value={form.studentId}
                  onChange={handleChange}
                />
              </div>
              {errors.studentId && <span className="field-error">{errors.studentId}</span>}
            </div>
          )}

          {/* Faculty dropdown (signup + lecturer) */}
          {view === 'signup' && role === 'lecturer' && (
            <div className="auth-field">
              <div className={inputClass('faculty')}>
                <BookOpen size={18} className="input-icon" />
                <select name="faculty" value={form.faculty} onChange={handleChange}>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              {errors.faculty && <span className="field-error">{errors.faculty}</span>}
            </div>
          )}

          {/* Email */}
          <div className="auth-field">
            <div className={inputClass('email')}>
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className={inputClass('password')}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password (signup only) */}
          {view === 'signup' && (
            <div className="auth-field">
              <div className={inputClass('confirmPassword')}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Processing...
              </>
            ) : view === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* ---- Footer toggle ---- */}
        <p className="auth-footer">
          {view === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" className="link-btn" onClick={switchView}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={switchView}>
                Sign In
              </button>
            </>
          )}
        </p>
      </div>

      {/* ---- Styles ---- */}
      <style>{`
        .auth-card--enhanced {
          max-width: 440px;
          padding: 2rem 2rem 1.8rem;
        }

        /* ---- Role Toggle ---- */
        .role-toggle {
          display: flex;
          background: #f0f2f5;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 1.25rem;
        }
        .role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.55rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .role-btn--active {
          background: #fff;
          color: #1976d2;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .role-btn:not(.role-btn--active):hover {
          color: #444;
        }

        /* ---- View Toggle ---- */
        .view-toggle {
          display: flex;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .view-btn {
          flex: 1;
          padding: 0.5rem;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 500;
          color: #888;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .view-btn--active {
          background: #1976d2;
          color: #fff;
          font-weight: 600;
        }
        .view-btn:not(.view-btn--active):hover {
          color: #555;
        }

        /* ---- Title ---- */
        .auth-title {
          text-align: center;
          font-size: 1.4rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 0.25rem;
        }
        .auth-subtitle {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 1.5rem;
        }

        /* ---- Fields ---- */
        .auth-field {
          margin-bottom: 0.5rem;
        }
        .auth-input {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          padding: 0 12px;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus-within {
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25,118,210,0.12);
          background: #fff;
        }
        .auth-input--error {
          border-color: #e53935;
        }
        .auth-input--error:focus-within {
          border-color: #e53935;
          box-shadow: 0 0 0 3px rgba(229,57,53,0.12);
        }
        .input-icon {
          flex-shrink: 0;
          color: #999;
        }
        .auth-input input,
        .auth-input select {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.7rem 0;
          font-size: 0.95rem;
          outline: none;
          font-family: inherit;
          color: #222;
          min-width: 0;
        }
        .auth-input select {
          cursor: pointer;
          appearance: none;
          background: transparent;
        }
        .pw-toggle {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .pw-toggle:hover {
          color: #555;
        }
        .field-error {
          display: block;
          font-size: 0.78rem;
          color: #e53935;
          margin-top: 4px;
          padding-left: 4px;
        }

        /* ---- Submit ---- */
        .auth-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1rem;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          background: #1976d2;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
        }
        .auth-submit:hover:not(:disabled) {
          background: #1565c0;
        }
        .auth-submit:disabled {
          background: #90caf9;
          cursor: not-allowed;
        }
        .spinner {
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ---- Link button ---- */
        .link-btn {
          background: none;
          border: none;
          color: #1976d2;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          font-family: inherit;
          padding: 0;
        }
        .link-btn:hover {
          text-decoration: underline;
        }

        /* ---- Responsive ---- */
        @media (max-width: 480px) {
          .auth-card--enhanced {
            padding: 1.5rem 1.2rem;
          }
          .role-btn {
            font-size: 0.8rem;
            padding: 0.45rem;
          }
          .auth-input input,
          .auth-input select {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
