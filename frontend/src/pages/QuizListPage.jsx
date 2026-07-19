import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Search, Trash2, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

export default function QuizListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (e) {
      console.error(e);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuizzes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      loadQuizzes();
    } catch (e) { alert(e.message); }
  };

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatus = (quiz) => {
    if (quiz.showResults === false) return { label: 'Closed', tone: 'closed' };
    if ((quiz._count?.attempts ?? 0) === 0) return { label: 'Draft', tone: 'draft' };
    return { label: 'Active', tone: 'active' };
  };

  const isLecturer = user?.role === 'lecturer';

  if (loading) {
    return isLecturer
      ? <LecturerShell><div className="loading-screen">Loading quizzes...</div></LecturerShell>
      : <div className="loading-screen">Loading quizzes...</div>;
  }

  const content = (
    <div className="quiz-list-page">
      <section className="question-bank-hero">
        <div>
          <div className="question-bank-breadcrumb">
            <span>Dashboard</span>
            <ArrowRight size={14} />
            <span>Quizzes</span>
          </div>
          <h1>{isLecturer ? 'Your Quizzes' : 'Available Quizzes'}</h1>
          <p>{isLecturer ? 'Manage and track your quizzes.' : 'Browse and start available quizzes.'}</p>
        </div>
        {isLecturer && (
          <button className="question-bank-cta" onClick={() => navigate('/quizzes/create')}>
            <Plus size={16} />
            <span>Create Quiz</span>
          </button>
        )}
      </section>

      <section className="question-bank-toolbar">
        <div className="question-bank-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="question-bank-table-card">
        <div className="question-bank-table-card__header">
          <h2>Quiz List</h2>
          <span>{filtered.length} quizzes</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {quizzes.length === 0
              ? isLecturer
                ? 'No quizzes yet. Create your first quiz from a question bank!'
                : 'No quizzes available right now.'
              : 'No quizzes match your search.'}
          </div>
        ) : (
          <div className="table-wrapper question-bank-table-wrap">
            <table className="questions-table">
              <thead>
                <tr>
                  <th>Quiz Name</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Time Limit</th>
                  <th>{isLecturer ? 'Submissions' : 'Created'}</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(quiz => {
                  const status = getStatus(quiz);
                  return (
                    <tr key={quiz.id}>
                      <td>
                        <div className="question-text">{quiz.title}</div>
                        {quiz.description && <div className="topic-text">{quiz.description.substring(0, 60)}</div>}
                      </td>
                      <td>
                        <span className={`lecturer-status lecturer-status--${status.tone}`}>{status.label}</span>
                      </td>
                      <td>{quiz._count?.quizQuestions ?? 0}</td>
                      <td>{quiz.timeLimit} mins</td>
                      <td>{isLecturer ? (quiz._count?.attempts ?? 0) : formatDate(quiz.createdAt)}</td>
                      <td className="text-center">
                        {isLecturer ? (
                          <>
                            <Link to={`/analytics/quiz/${quiz.id}`} className="btn-action-trigger" title="Analytics">
                              <BarChart3 size={14} />
                            </Link>
                            <button className="btn-action-trigger btn-action-danger" title="Delete" onClick={() => handleDelete(quiz.id)}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <Link to={`/take-quiz/${quiz.id}`} className="start-btn">
                            Start
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );

  if (isLecturer) {
    return <LecturerShell>{content}</LecturerShell>;
  }
  return content;
}
