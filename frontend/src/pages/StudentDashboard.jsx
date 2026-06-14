import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [q, a] = await Promise.all([
          api.get('/quizzes'),
          api.get('/attempts/mine'),
        ]);
        setQuizzes(q.data.quizzes);
        setAttempts(a.data.attempts);
      } catch (e) { /* ignore */ }
      finally { setLoading(false) }
    })();
  }, []);

  const completed = attempts.filter(a => a.status !== 'in-progress');
  const avgPct = completed.reduce((sum, a) => sum + (a.totalPoints ? (a.score / a.totalPoints) * 100 : 0), 0);
  const avg = completed.length ? Math.round(avgPct / completed.length) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="dashboard-sub">Student Dashboard</p>
        </div>
      </div>

      {!loading && (
        <div className="stats-grid stats-grid-3">
          <div className="stat-card">
            <div className="stat-icon purple">📋</div>
            <div className="stat-info">
              <h3>Available Quizzes</h3>
              <p className="stat-value">{quizzes.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <h3>Completed</h3>
              <p className="stat-value">{completed.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">📈</div>
            <div className="stat-info">
              <h3>Average Score</h3>
              <p className="stat-value">{completed.length ? `${avg}%` : '-'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div>
          <div className="dashboard-section">
            <h2>Available Quizzes</h2>
            {loading ? <div className="loading-screen" style={{ minHeight: 100 }}>Loading...</div> :
              quizzes.length === 0 ? <div className="empty-state">No quizzes available right now.</div> :
              quizzes.map(q => (
                <div key={q.id} className="quiz-card">
                  <div>
                    <h3>{q.title}</h3>
                    <div className="quiz-meta">
                      <span>📄 {q._count.quizQuestions} questions</span>
                      <span>🕐 {q.timeLimit} mins</span>
                    </div>
                  </div>
                  <Link to={`/take-quiz/${q.id}`} className="start-btn">Start Quiz</Link>
                </div>
              ))
            }
          </div>
        </div>

        <div>
          <div className="dashboard-section">
            <h2>Recent Results</h2>
            {loading ? <div className="loading-screen" style={{ minHeight: 100 }}>Loading...</div> :
              completed.length === 0 ? <div className="empty-state">No submissions yet.</div> :
              <div className="results-stack">
                {completed.slice(0, 5).map(a => {
                  const pct = a.totalPoints ? Math.round((a.score / a.totalPoints) * 100) : 0;
                  return (
                    <Link to={`/results/${a.id}`} key={a.id} className="result-item">
                      <div>
                        <div className="result-title">{a.quiz.title}</div>
                        <div className="result-date">{new Date(a.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div className={`result-score ${pct >= 50 ? 'pass' : 'fail'}`}>{pct}%</div>
                    </Link>
                  );
                })}
                {completed.length > 5 && <Link to="/attempts/mine" className="view-all-link">View All Records</Link>}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
