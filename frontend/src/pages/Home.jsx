import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      {/* ── Hero Section ── */}
      <section className="home-hero">
        <h1 className="home-title">Welcome to SmartQuiz</h1>
        <p className="home-subtitle">
          Select your entry point to access the ultimate assessment engine.
          Rigorous management meets seamless learning.
        </p>

        {/* ── Login Cards ── */}
        <div className="home-cards">
          {/* Lecturer Card */}
          <Link to="/login?role=lecturer" className="home-card home-card--lecturer">
            <div className="hcard-top">
              <div className="hcard-icon hcard-icon--lecturer">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <svg className="hcard-bg-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="hcard-title">Login as Lecturer</h2>
            <span className="hcard-badge hcard-badge--lecturer">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Architect Mode
            </span>
            <p className="hcard-desc">
              Create complex assessments, manage question banks, and analyze
              student performance with deep data-driven insights.
            </p>
            <span className="hcard-cta hcard-cta--lecturer">
              Enter Dashboard
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* Student Card */}
          <Link to="/login?role=student" className="home-card home-card--student">
            <div className="hcard-top">
              <div className="hcard-icon hcard-icon--student">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <svg className="hcard-bg-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h2 className="hcard-title">Login as Student</h2>
            <span className="hcard-badge hcard-badge--student">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Learner Mode
            </span>
            <p className="hcard-desc">
              Experience a distraction-free assessment environment. Track your
              results and review your progress over time.
            </p>
            <span className="hcard-cta hcard-cta--student">
              Join Assessment
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* ── Dashboard Preview Section ── */}
      <section className="home-preview">
        <div className="home-preview__wrapper">
          <img
            src="/dashboard-hero.png"
            alt="SmartQuiz analytics dashboard preview"
            className="home-preview__img"
          />
          <div className="home-preview__badges">
            <div className="preview-badge">
              <span className="preview-badge__icon preview-badge__icon--blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 1.41 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                  <path d="M14.83 9.17a4 4 0 0 1 0 5.66M9.17 9.17a4 4 0 0 0 0 5.66" />
                </svg>
              </span>
              <div>
                <div className="preview-badge__label">Trusted by</div>
                <div className="preview-badge__value">500+ Universities</div>
              </div>
            </div>

            <div className="preview-badge">
              <span className="preview-badge__icon preview-badge__icon--green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
              <div>
                <div className="preview-badge__label">Improvement</div>
                <div className="preview-badge__value">92% Grade Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features Section ── */}
      <section className="home-features">
        <div className="features-inner">
          <div className="section-title-area">
            <span className="section-label">Core Capabilities</span>
            <h2 className="section-title">Everything you need to deliver assessments at scale</h2>
            <p className="section-desc">
              SmartQuiz streamlines the entire lifecycle of educational and corporate evaluations.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon f-icon--purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="feature-title">Robust Question Banks</h3>
              <p className="feature-text">
                Organize question pools, customize complexity, and easily reuse items across different exams.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon f-icon--blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="feature-title">Flexible Timers</h3>
              <p className="feature-text">
                Enforce strict time durations per quiz, keeping student assessments fair and tightly controlled.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon f-icon--green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="feature-title">Real-Time Insights</h3>
              <p className="feature-text">
                Analyze test result distribution, track averages, and view individual student improvement indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="home-steps">
        <div className="steps-inner">
          <div className="section-title-area">
            <span className="section-label">Onboarding Workflow</span>
            <h2 className="section-title">Get started in three simple steps</h2>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3 className="step-title">Choose Your Role</h3>
              <p className="step-text">
                Register as a Lecturer to build assessments, or register as a Student to participate in quizzes.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <h3 className="step-title">Deploy or Take Exams</h3>
              <p className="step-text">
                Lecturers create quizzes using robust question banks. Students join assessments seamlessly.
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <h3 className="step-title">Analyze Outcomes</h3>
              <p className="step-text">
                Receive graded scores instantly. Track cohort averages, grade distributions, and statistics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
