import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LecturerShell from '../components/layout/LecturerShell';
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
    <LecturerShell>
    <div className="question-list-page">
      <div className="question-list-page__hero">
        <div>
          <Link to="/banks" className="back-link">&larr; Banks</Link>
          <h1>{bank?.title || 'Questions'}</h1>
          <p>Manage the question set for this bank, edit content, and keep the answer key consistent.</p>
        </div>
        <button className="question-list-page__cta" onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      <div className="question-list-page__layout">
        <section className="question-list-page__panel question-list-page__panel--form">
          <div className="question-list-page__panel-header">
            <h2>{editing ? 'Edit' : 'New'} Question</h2>
            <span className="question-list-page__panel-sub">Structured editor</span>
          </div>

          {showForm ? (
            <form className="question-list-form" onSubmit={handleSubmit}>
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, correctAnswer: '' }))}>
                <option value="mcq">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
              </select>

              <label>Question Text</label>
              <textarea value={form.questionText} onChange={e => setForm(p => ({ ...p, questionText: e.target.value }))} rows={4} required />

              {form.type === 'mcq' && (
                <>
                  <label>Options</label>
                  <textarea value={form.options} onChange={e => setForm(p => ({ ...p, options: e.target.value }))} rows={5} placeholder="A. First option&#10;B. Second option&#10;C. Third option&#10;D. Fourth option" />
                  <label>Correct Answer</label>
                  <input value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} placeholder="e.g. A" />
                </>
              )}

              {form.type === 'short-answer' && (
                <>
                  <label>Correct Answer</label>
                  <input value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} placeholder="Expected answer" />
                </>
              )}

              <label>Explanation</label>
              <textarea value={form.explanation} onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))} rows={3} placeholder="Why this answer is correct" />

              <label>Points</label>
              <input type="number" min={1} value={form.points} onChange={e => setForm(p => ({ ...p, points: e.target.value }))} />

              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Question</button>
            </form>
          ) : (
            <div className="question-list-page__empty-preview">
              <p>Open the editor to create or update a question in this bank.</p>
            </div>
          )}
        </section>

        <section className="question-list-page__panel question-list-page__panel--items">
          <div className="question-list-page__panel-header">
            <h2>Question Set</h2>
            <span className="question-list-page__panel-sub">{questions.length} items</span>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">No questions in this bank. Add your first question.</div>
          ) : (
            <div className="question-list">
              {questions.map((q, i) => (
                <div key={q.id} className="card question-card question-card--rich">
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
        </section>
      </div>
    </div>
    </LecturerShell>
  );
}
