import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function QuestionListPage() {
  const { bankId } = useParams();
  const [bank, setBank] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    type: 'mcq', questionText: '', options: '', correctAnswer: '', explanation: '', points: 1,
  });

  const load = async () => {
    try {
      const [b, q] = await Promise.all([
        api.get(`/banks/${bankId}`),
        api.get(`/banks/${bankId}/questions`),
      ]);
      setBank(b.data.bank);
      setQuestions(q.data.questions);
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  };

  useEffect(() => { load() }, [bankId]);

  const resetForm = () => {
    setForm({ type: 'mcq', questionText: '', options: '', correctAnswer: '', explanation: '', points: 1 });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        options: form.type === 'mcq' ? form.options : null,
        points: parseInt(form.points) || 1,
      };
      if (editing) {
        await api.put(`/banks/${bankId}/questions/${editing}`, payload);
      } else {
        await api.post(`/banks/${bankId}/questions`, payload);
      }
      resetForm();
      load();
    } catch (e) { alert(e.message) }
  };

  const handleEdit = (q) => {
    setForm({
      type: q.type,
      questionText: q.questionText,
      options: q.options || '',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      points: q.points,
    });
    setEditing(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/banks/${bankId}/questions/${id}`);
      load();
    } catch (e) { alert(e.message) }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link to="/banks" className="back-link">&larr; Banks</Link>
          <h1>{bank?.title || 'Questions'}</h1>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>{editing ? 'Edit' : 'New'} Question</h3>

          <label>Type</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, correctAnswer: '' }))}>
            <option value="mcq">Multiple Choice</option>
            <option value="short-answer">Short Answer</option>
          </select>

          <label>Question Text</label>
          <textarea value={form.questionText} onChange={e => setForm(p => ({ ...p, questionText: e.target.value }))} rows={3} required />

          {form.type === 'mcq' && (
            <>
              <label>Options (one per line, e.g. A. Option 1)</label>
              <textarea value={form.options} onChange={e => setForm(p => ({ ...p, options: e.target.value }))} rows={4} placeholder="A. First option&#10;B. Second option&#10;C. Third option&#10;D. Fourth option" />
              <label>Correct Answer</label>
              <input value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} placeholder="e.g. A" />
            </>
          )}

          {form.type === 'short-answer' && (
            <>
              <label>Correct Answer (case-insensitive)</label>
              <input value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} placeholder="Expected answer" />
            </>
          )}

          <label>Explanation (shown after answering)</label>
          <textarea value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} rows={2} placeholder="Why this answer is correct" />

          <label>Points</label>
          <input type="number" min={1} value={form.points} onChange={e => setForm(p => ({ ...p, points: e.target.value }))} />

          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Question</button>
        </form>
      )}

      {questions.length === 0 ? (
        <div className="empty-state">No questions in this bank. Add your first question.</div>
      ) : (
        <div className="question-list">
          {questions.map((q, i) => (
            <div key={q.id} className="card question-card">
              <div className="q-header">
                <span className="badge">{q.type === 'mcq' ? 'MCQ' : 'Short Answer'}</span>
                <span className="badge badge-points">{q.points} pt{q.points > 1 ? 's' : ''}</span>
              </div>
              <p className="q-text"><strong>Q{i + 1}:</strong> {q.questionText}</p>
              {q.options && <pre className="q-options">{q.options}</pre>}
              <p className="q-answer">Answer: <strong>{q.correctAnswer}</strong></p>
              <div className="card-actions">
                <button className="btn-sm" onClick={() => handleEdit(q)}>Edit</button>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(q.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
