import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

export default function QuizCreatePage() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', timeLimit: 30, shuffle: false, showResults: true,
  });

  const load = async () => {
    try {
      const res = await api.get('/banks');
      setBanks(res.data.banks);
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  };

  useEffect(() => { load() }, []);

  const loadQuestions = async (bankId) => {
    if (!bankId) { setQuestions([]); return }
    try {
      const res = await api.get(`/banks/${bankId}/questions`);
      setQuestions(res.data.questions);
    } catch (e) { alert(e.message) }
  };

  const handleBankChange = (bankId) => {
    setSelectedBank(bankId);
    setSelectedIds([]);
    loadQuestions(bankId);
  };

  const toggleQuestion = (qId) => {
    setSelectedIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) { alert('Select at least one question'); return }
    setSubmitting(true);
    try {
      const res = await api.post('/quizzes', { ...form, questionIds: selectedIds });
      navigate(`/quizzes/${res.data.quiz.id}`);
    } catch (e) { alert(e.message) }
    finally { setSubmitting(false) }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <LecturerShell>
    <div className="page-container">
      <div className="page-header">
        <h1>Create Quiz</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label>Quiz Title</label>
        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />

        <label>Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />

        <label>Time Limit (minutes)</label>
        <input type="number" min={1} value={form.timeLimit} onChange={e => setForm(p => ({ ...p, timeLimit: parseInt(e.target.value) || 30 }))} />

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input type="checkbox" checked={form.shuffle} onChange={e => setForm(p => ({ ...p, shuffle: e.target.checked }))} />
            Shuffle questions
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.showResults} onChange={e => setForm(p => ({ ...p, showResults: e.target.checked }))} />
            Show results after submission
          </label>
        </div>

        <label>Select Question Bank</label>
        <select value={selectedBank} onChange={e => handleBankChange(e.target.value)}>
          <option value="">-- Choose a bank --</option>
          {banks.map(b => <option key={b.id} value={b.id}>{b.title} ({b._count.questions} questions)</option>)}
        </select>

        {questions.length > 0 && (
          <>
            <label>Select Questions ({selectedIds.length} selected)</label>
            <div className="question-pick-list">
              {questions.map((q, i) => (
                <div key={q.id} className={`question-pick-item ${selectedIds.includes(q.id) ? 'selected' : ''}`} onClick={() => toggleQuestion(q.id)}>
                  <input type="checkbox" checked={selectedIds.includes(q.id)} readOnly />
                  <div>
                    <span className="badge badge-sm">{q.type === 'mcq' ? 'MCQ' : 'SA'}</span>
                    <span>{q.questionText.substring(0, 80)}{q.questionText.length > 80 ? '...' : ''}</span>
                  </div>
                  <span className="q-pick-points">{q.points} pt</span>
                </div>
              ))}
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" disabled={submitting || selectedIds.length === 0}>
          {submitting ? 'Creating...' : `Create Quiz (${selectedIds.length} questions)`}
        </button>
      </form>
    </div>
    </LecturerShell>
  );
}
