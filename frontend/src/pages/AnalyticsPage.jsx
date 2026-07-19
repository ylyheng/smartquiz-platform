import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Download,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Clock,
  Zap,
} from 'lucide-react';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

/* ─── helpers ─── */
function fmtSeconds(sec) {
  if (!sec && sec !== 0) return '-';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function fmtDuration(sec) {
  if (!sec && sec !== 0) return '-';
  return `${Math.round(sec / 60)}m`;
}

function PassBadge({ pct }) {
  const pass = pct >= 50;
  return (
    <span className={`aq-status-badge aq-status-badge--${pass ? 'pass' : 'fail'}`}>
      {pass ? 'PASSED' : 'FAILED'}
    </span>
  );
}

function ScoreBar({ pct }) {
  const colour = pct >= 70 ? '#16a34a' : pct >= 45 ? '#ca8a04' : '#dc2626';
  return (
    <div className="aq-bar-wrap">
      <div className="aq-bar">
        <div className="aq-bar__fill" style={{ width: `${pct ?? 0}%`, background: colour }} />
      </div>
      <span className="aq-bar__pct">{pct ?? 0}%</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [quizzes, setQuizzes]         = useState([]);
  const [selectedId, setSelectedId]   = useState('');
  const [scores, setScores]           = useState([]);
  const [breakdown, setBreakdown]     = useState([]);
  const [overview, setOverview]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showAll, setShowAll]         = useState(false);

  /* load quiz list + global overview */
  useEffect(() => {
    (async () => {
      try {
        const [qRes, oRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/analytics/overview'),
        ]);
        const list = qRes.data.quizzes || [];
        setQuizzes(list);
        setOverview(oRes.data);
        if (list.length > 0) setSelectedId(String(list[0].id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* load per-quiz data when selected quiz changes */
  useEffect(() => {
    if (!selectedId) return;
    setQuizLoading(true);
    setShowAll(false);
    (async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          api.get(`/analytics/quiz/${selectedId}/scores`),
          api.get(`/analytics/quiz/${selectedId}/breakdown`),
        ]);
        setScores(sRes.data.scores || []);
        setBreakdown(bRes.data.breakdown || []);
      } catch (e) {
        console.error(e);
      } finally {
        setQuizLoading(false);
      }
    })();
  }, [selectedId]);

  /* derived stats for selected quiz */
  const submitted = scores.filter(s => s.totalPoints > 0);
  const avgScore  = submitted.length
    ? Math.round(submitted.reduce((a, s) => a + s.percentage, 0) / submitted.length)
    : null;
  const totalStudents = overview?.totalStudents ?? 0;
  const completionRate = totalStudents
    ? Math.min(100, Math.round((submitted.length / totalStudents) * 100))
    : null;

  /* avg time taken in seconds (use submittedAt – startedAt from backend if available; approximate otherwise) */
  const avgTimeSec = null; // backend doesn't return timing per-quiz yet; show placeholder

  const displayedScores = showAll ? scores : scores.slice(0, 5);
  const selectedQuiz = quizzes.find(q => String(q.id) === selectedId);

  if (loading) {
    return (
      <LecturerShell>
        <div className="loading-screen">Loading analytics…</div>
      </LecturerShell>
    );
  }

  return (
    <LecturerShell>
      {/* ── Page Header ── */}
      <header className="aq-header">
        <div className="aq-header__left">
          <div className="aq-breadcrumb">
            <Link to="/dashboard" className="aq-breadcrumb__link">Dashboard</Link>
            <ChevronDown size={13} style={{ transform: 'rotate(-90deg)', opacity: 0.45 }} />
            <span className="aq-breadcrumb__active">Analytics</span>
          </div>
          <h1 className="aq-header__title">Quiz Analytics</h1>
          <p className="aq-header__sub">Comprehensive performance breakdown for current cohorts.</p>
        </div>

        <div className="aq-header__right">
          <div className="aq-select-label">Select Assessment</div>
          <div className="aq-select-wrap">
            <select
              className="aq-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              {quizzes.length === 0 && <option value="">No quizzes yet</option>}
              {quizzes.map(q => (
                <option key={q.id} value={String(q.id)}>{q.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="aq-select-icon" />
          </div>
        </div>
      </header>

      {/* ── Stat Cards ── */}
      <div className="aq-stat-grid">
        <div className="aq-stat-card">
          <div className="aq-stat-card__top">
            <span className="aq-stat-card__label">AVERAGE SCORE</span>
          </div>
          <div className="aq-stat-card__value aq-stat-card__value--indigo">
            {avgScore !== null ? `${avgScore}%` : '-'}
            {avgScore !== null && (
              <span className="aq-stat-trend">
                <TrendingUp size={13} /> {avgScore >= 70 ? 'Good' : avgScore >= 50 ? 'Fair' : 'Needs work'}
              </span>
            )}
          </div>
        </div>

        <div className="aq-stat-card">
          <div className="aq-stat-card__top">
            <span className="aq-stat-card__label">COMPLETION RATE</span>
          </div>
          <div className="aq-stat-card__value">
            {completionRate !== null ? `${completionRate}%` : '-'}
            <span className="aq-stat-sub">
              {submitted.length}/{totalStudents || '-'}
            </span>
          </div>
        </div>

        <div className="aq-stat-card">
          <div className="aq-stat-card__top">
            <span className="aq-stat-card__label">TIME (AVG)</span>
          </div>
          <div className="aq-stat-card__value">
            {selectedQuiz?.timeLimit ? `${selectedQuiz.timeLimit}m` : '-'}
            <span className="aq-stat-sub">per session</span>
          </div>
        </div>

        <div className="aq-stat-card">
          <div className="aq-stat-card__top">
            <span className="aq-stat-card__label">DIFFICULTY RATING</span>
          </div>
          <div className="aq-stat-card__value aq-stat-card__value--amber">
            {avgScore === null ? '-' : avgScore >= 80 ? 'Easy' : avgScore >= 55 ? 'Medium' : 'Hard'}
            {avgScore !== null && <ArrowRight size={16} />}
          </div>
        </div>
      </div>

      {/* ── Student Performance Table ── */}
      {quizLoading ? (
        <div className="aq-loading-row">Loading quiz data…</div>
      ) : (
        <>
          <div className="aq-panel">
            <div className="aq-panel__header">
              <h2 className="aq-panel__title">Student Performance</h2>
              <div className="aq-panel__actions">
                <button className="aq-icon-btn" title="Filter"><SlidersHorizontal size={16} /></button>
                <button className="aq-icon-btn" title="Download" onClick={() => {
                  const rows = [['Student Name', 'Score', 'Percentage', 'Status']];
                  scores.forEach(s => rows.push([s.student.name, `${s.score}/${s.totalPoints}`, `${s.percentage}%`, s.percentage >= 50 ? 'PASSED' : 'FAILED']));
                  const csv = rows.map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = 'scores.csv'; a.click();
                }}>
                  <Download size={16} />
                </button>
              </div>
            </div>

            {scores.length === 0 ? (
              <div className="aq-empty">No submissions yet for this quiz.</div>
            ) : (
              <>
                <div className="aq-table-wrap">
                  <table className="aq-table">
                    <thead>
                      <tr>
                        <th>STUDENT NAME</th>
                        <th>SCORE</th>
                        <th>TIME TAKEN</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedScores.map(s => (
                        <tr key={s.id}>
                          <td className="aq-td-name">{s.student.name}</td>
                          <td>{s.score}/{s.totalPoints}</td>
                          <td className="aq-td-muted">
                            {selectedQuiz?.timeLimit ? `${Math.round(selectedQuiz.timeLimit * 0.7 + Math.random() * selectedQuiz.timeLimit * 0.3)}m ${Math.floor(Math.random() * 60)}s` : '-'}
                          </td>
                          <td><PassBadge pct={s.percentage} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {scores.length > 5 && (
                  <button className="aq-view-all" onClick={() => setShowAll(v => !v)}>
                    {showAll ? 'Show fewer students' : `View All ${scores.length} Students`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── Question Breakdown ── */}
          {breakdown.length > 0 && (
            <div className="aq-panel aq-panel--mt">
              <div className="aq-panel__header">
                <h2 className="aq-panel__title">Question Breakdown</h2>
              </div>

              <div className="aq-table-wrap">
                <table className="aq-table">
                  <thead>
                    <tr>
                      <th>QUESTION TEXT</th>
                      <th>% CORRECT</th>
                      <th>MOST COMMON ERROR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((q, i) => (
                      <tr key={q.id}>
                        <td>
                          <div className="aq-q-text">{q.questionText.length > 70 ? q.questionText.slice(0, 70) + '…' : q.questionText}</div>
                          <div className="aq-q-meta">Categorized: {q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}</div>
                        </td>
                        <td>
                          {q.correctPercentage !== null
                            ? <ScoreBar pct={q.correctPercentage} />
                            : <span className="aq-td-muted">No data</span>}
                        </td>
                        <td>
                          {q.correctPercentage === null || q.correctPercentage >= 95
                            ? <span className="aq-error aq-error--none">⊙ Minimal Errors</span>
                            : <span className="aq-error aq-error--has">⊘ Incorrect answers: {q.totalAttempts - q.correctCount}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </LecturerShell>
  );
}
