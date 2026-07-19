import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

export default function AnalyticsPage() {
  const { quizId } = useParams();
  const [overview, setOverview] = useState(null);
  const [scores, setScores] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (quizId) {
          const [s, b] = await Promise.all([
            api.get(`/analytics/quiz/${quizId}/scores`),
            api.get(`/analytics/quiz/${quizId}/breakdown`),
          ]);
          setScores(s.data.scores);
          setBreakdown(b.data.breakdown);
        } else {
          const [o, st] = await Promise.all([
            api.get('/analytics/overview'),
            api.get('/analytics/students'),
          ]);
          setOverview(o.data);
          setStudents(st.data.students);
        }
      } catch (e) { alert(e.message) }
      finally { setLoading(false) }
    })();
  }, [quizId]);

  if (loading) return <div className="loading-screen">Loading analytics...</div>;

  if (quizId) {
    return (
      <LecturerShell>
      <div className="page-container">
        <div className="page-header">
          <div>
            <Link to="/analytics" className="back-link">&larr; All Analytics</Link>
            <h1>Quiz Analytics</h1>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'scores' ? 'active' : ''}`} onClick={() => setTab('scores')}>Scores</button>
          <button className={`tab ${tab === 'breakdown' ? 'active' : ''}`} onClick={() => setTab('breakdown')}>Question Breakdown</button>
        </div>

        {tab === 'scores' && (
          <div className="card">
            {scores.length === 0 ? <div className="empty-state">No submissions yet</div> : (
              <table className="analytics-table">
                <thead>
                  <tr><th>Student</th><th>Email</th><th>Score</th><th>Percentage</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {scores.map(s => (
                    <tr key={s.id}>
                      <td>{s.student.name}</td>
                      <td>{s.student.email}</td>
                      <td>{s.score}/{s.totalPoints}</td>
                      <td><span className={`pct-badge ${s.percentage >= 50 ? 'pass' : 'fail'}`}>{s.percentage}%</span></td>
                      <td>{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'breakdown' && (
          <div className="card">
            {breakdown.length === 0 ? <div className="empty-state">No data</div> : (
              <table className="analytics-table">
                <thead>
                  <tr><th>#</th><th>Question</th><th>Type</th><th>Points</th><th>Correct</th><th>Rate</th></tr>
                </thead>
                <tbody>
                  {breakdown.map((q, i) => (
                    <tr key={q.id}>
                      <td>{i + 1}</td>
                      <td>{q.questionText.substring(0, 60)}...</td>
                      <td>{q.type === 'mcq' ? 'MCQ' : 'SA'}</td>
                      <td>{q.points}</td>
                      <td>{q.correctCount}/{q.totalAttempts}</td>
                      <td>{q.correctPercentage !== null ? `${q.correctPercentage}%` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      </LecturerShell>
    );
  }

  return (
    <LecturerShell>
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>Students</button>
      </div>

      {tab === 'overview' && overview && (
        <div className="stats-grid stats-grid-4">
          <div className="stat-card">
            <div className="stat-icon purple">📝</div>
            <div className="stat-info">
              <h3>Total Quizzes</h3>
              <p className="stat-value">{overview.totalQuizzes}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">👥</div>
            <div className="stat-info">
              <h3>Students</h3>
              <p className="stat-value">{overview.totalStudents}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📊</div>
            <div className="stat-info">
              <h3>Submissions</h3>
              <p className="stat-value">{overview.totalAttempts}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🎯</div>
            <div className="stat-info">
              <h3>Avg Score</h3>
              <p className="stat-value">{overview.averageScore !== null ? `${overview.averageScore}%` : '-'}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'students' && (
        <div className="card">
          {students.length === 0 ? <div className="empty-state">No student data yet</div> : (
            <table className="analytics-table">
              <thead>
                <tr><th>Student</th><th>Email</th><th>Attempts</th><th>Avg Score</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.totalAttempts}</td>
                    <td><span className={`pct-badge ${s.averagePercentage >= 50 ? 'pass' : 'fail'}`}>{s.averagePercentage !== null ? `${s.averagePercentage}%` : '-'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    </LecturerShell>
  );
}
