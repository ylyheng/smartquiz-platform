import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Menu,
  Plus,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

export default function LecturerDashboard() {
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
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalStudents = overview?.totalStudents ?? 0;
  const activeQuizzes = quizzes.filter(quiz => quiz.showResults !== false).length;
  const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentQuizzes = sortedQuizzes.slice(0, 3);
  const participationQuizzes = sortedQuizzes.slice(0, 2);

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatus = (quiz) => {
    if (quiz.showResults === false) return { label: 'Closed', tone: 'closed' };
    if ((quiz._count?.attempts ?? 0) === 0) return { label: 'Draft', tone: 'draft' };
    return { label: 'Active', tone: 'active' };
  };

  const getParticipation = (quiz) => {
    if (!totalStudents) return 0;
    const attempts = quiz._count?.attempts ?? 0;
    return Math.min(100, Math.round((attempts / totalStudents) * 100));
  };

  return (
    <LecturerShell>
        <header className="lecturer-dashboard__header">
          <div>
            <h1>Lecturer Dashboard</h1>
            <p>Overview of your current academic assessments and student engagement.</p>
          </div>

          <div className="lecturer-dashboard__header-actions">
            <button className="lecturer-icon-button" type="button" aria-label="Open menu">
              <Menu size={18} />
            </button>
            <button className="lecturer-icon-button lecturer-icon-button--bell" type="button" aria-label="Notifications">
              <Bell size={18} />
              <span className="lecturer-icon-button__dot" />
            </button>
            <Link to="/quizzes/create" className="lecturer-create-button">
              <Plus size={16} />
              <span>Create Quiz</span>
            </Link>
          </div>
        </header>

        {!loading && overview && (
          <div className="lecturer-stats-grid">
            <article className="lecturer-stat-card">
              <div className="lecturer-stat-card__top">
                <span className="lecturer-stat-card__icon lecturer-stat-card__icon--indigo">
                  <Target size={18} />
                </span>
                <span className="lecturer-stat-card__flag">All time</span>
              </div>
              <div className="lecturer-stat-card__label">Total Quizzes</div>
              <div className="lecturer-stat-card__value">{overview.totalQuizzes}</div>
            </article>

            <article className="lecturer-stat-card">
              <div className="lecturer-stat-card__top">
                <span className="lecturer-stat-card__icon lecturer-stat-card__icon--green">
                  <Users size={18} />
                </span>
                <span className="lecturer-stat-card__flag">Enrolled</span>
              </div>
              <div className="lecturer-stat-card__label">Total Students</div>
              <div className="lecturer-stat-card__value">{overview.totalStudents}</div>
            </article>

            <article className="lecturer-stat-card">
              <div className="lecturer-stat-card__top">
                <span className="lecturer-stat-card__icon lecturer-stat-card__icon--amber">
                  <Sparkles size={18} />
                </span>
                <span className="lecturer-stat-card__flag">Current avg</span>
              </div>
              <div className="lecturer-stat-card__label">Average Score</div>
              <div className="lecturer-stat-card__value">{overview.averageScore !== null ? `${overview.averageScore}%` : '-'}</div>
            </article>

            <article className="lecturer-stat-card">
              <div className="lecturer-stat-card__top">
                <span className="lecturer-stat-card__icon lecturer-stat-card__icon--teal">
                  <Zap size={18} />
                </span>
                <span className="lecturer-stat-card__flag lecturer-stat-card__flag--live">Live</span>
              </div>
              <div className="lecturer-stat-card__label">Active Quizzes</div>
              <div className="lecturer-stat-card__value">{activeQuizzes}</div>
            </article>
          </div>
        )}

        <div className="lecturer-dashboard__content">
          <section className="lecturer-panel lecturer-panel--table">
            <div className="lecturer-panel__header">
              <h2>Recent Assessments</h2>
              <Link to="/quizzes" className="lecturer-panel__link">
                View All Quizzes
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="loading-screen lecturer-panel__empty">Loading...</div>
            ) : recentQuizzes.length === 0 ? (
              <div className="empty-state lecturer-panel__empty">No quizzes yet. Create your first quiz!</div>
            ) : (
              <div className="lecturer-table-wrap">
                <table className="lecturer-table">
                  <thead>
                    <tr>
                      <th>Quiz Name</th>
                      <th>Status</th>
                      <th>Date Created</th>
                      <th>Submissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQuizzes.map(quiz => {
                      const status = getStatus(quiz);
                      return (
                        <tr key={quiz.id}>
                          <td>
                            <div className="lecturer-table__quiz-name">{quiz.title}</div>
                            <div className="lecturer-table__quiz-meta">{quiz._count?.quizQuestions ?? 0} questions</div>
                          </td>
                          <td>
                            <span className={`lecturer-status lecturer-status--${status.tone}`}>{status.label}</span>
                          </td>
                          <td>{formatDate(quiz.createdAt)}</td>
                          <td>{quiz._count?.attempts ?? 0}/{totalStudents || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="lecturer-panel lecturer-panel--participation">
            <h2>Student Participation</h2>
            {loading ? (
              <div className="loading-screen lecturer-panel__empty">Loading...</div>
            ) : participationQuizzes.length === 0 ? (
              <div className="empty-state lecturer-panel__empty">No engagement data yet.</div>
            ) : (
              <div className="lecturer-participation-list">
                {participationQuizzes.map(quiz => {
                  const participation = getParticipation(quiz);
                  return (
                    <div key={quiz.id} className="lecturer-participation-item">
                      <div className="lecturer-participation-item__top">
                        <span>{quiz.title}</span>
                        <span>{participation}%</span>
                      </div>
                      <div className="lecturer-progress">
                        <div className="lecturer-progress__fill" style={{ width: `${participation}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
    </LecturerShell>
  );
}
