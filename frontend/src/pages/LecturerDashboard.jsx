import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [o, q] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/quizzes'),
        ]);
        setOverview(o.data);
        setQuizzes(q.data.quizzes);
      } catch (e) { /* ignore */ }
      finally { setLoading(false) }
    })();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="dashboard-sub">Lecturer Dashboard</p>
        </div>
        <Link to="/quizzes/create" className="btn-primary">+ Create Quiz</Link>
      </div>

      {!loading && overview && (
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

      <div className="dashboard-content">
        <div>
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Quizzes</h2>
              <Link to="/quizzes" className="view-all">View All</Link>
            </div>
            {loading ? <div className="loading-screen" style={{ minHeight: 100 }}>Loading...</div> :
              quizzes.length === 0 ? <div className="empty-state">No quizzes yet. Create your first quiz!</div> :
              quizzes.slice(0, 5).map(q => (
                <Link to={`/analytics/quiz/${q.id}`} key={q.id} className="quiz-card">
                  <div>
                    <h3>{q.title}</h3>
                    <div className="quiz-meta">
                      <span>📄 {q._count.quizQuestions} questions</span>
                      <span>👥 {q._count.attempts} attempts</span>
                    </div>
                  </div>
                  <span className="card-arrow">&rarr;</span>
                </Link>
              ))
            }
          </div>
        </div>

        <div>
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="actions-stack">
              <Link to="/banks" className="action-link">📚 Question Banks</Link>
              <Link to="/quizzes/create" className="action-link">➕ Create Quiz</Link>
              <Link to="/analytics" className="action-link">📊 Analytics</Link>
              <Link to="/quizzes" className="action-link">📋 All Quizzes</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
