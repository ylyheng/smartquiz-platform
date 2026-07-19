import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bold,
  ChevronRight,
  Eye,
  ImagePlay,
  Italic,
  List,
  Plus,
  Save,
  Sigma,
  Tag,
  X,
  Code,
  Search,
  Trash2,
  Pencil,
  Filter,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

const SUBJECTS = [
  'World History', 'Mathematics', 'Computer Science', 'Physics',
  'Chemistry', 'Biology', 'Literature', 'Economics', 'Other',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyOption = (label) => ({ label, text: '' });

function defaultForm() {
  return {
    type: 'mcq',
    questionText: '',
    options: [emptyOption('A'), emptyOption('B'), emptyOption('C'), emptyOption('D')],
    correctAnswer: 'A',
    explanation: '',
    points: 1,
    // metadata
    subject: 'Computer Science',
    difficulty: 'Medium',
    tags: ['Exam Prep'],
    tagInput: '',
  };
}

/* ── Create/Edit Question fullpage form ── */
function QuestionForm({ bankId, bankTitle, editing, initialForm, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm || defaultForm());
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  /* MCQ option helpers */
  const setOptionText = (idx, text) => {
    const opts = form.options.map((o, i) => i === idx ? { ...o, text } : o);
    setField('options', opts);
  };

  const addOption = () => {
    const labels = 'ABCDEFGHIJ';
    const next = labels[form.options.length] || String(form.options.length + 1);
    setField('options', [...form.options, emptyOption(next)]);
  };

  const removeOption = (idx) => {
    const opts = form.options.filter((_, i) => i !== idx);
    setField('options', opts);
    if (form.correctAnswer === form.options[idx]?.label) {
      setField('correctAnswer', opts[0]?.label || '');
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && form.tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(form.tagInput.trim())) {
        setField('tags', [...form.tags, form.tagInput.trim()]);
      }
      setField('tagInput', '');
    }
  };

  const removeTag = (t) => setField('tags', form.tags.filter(x => x !== t));

  /* Build API payload */
  const buildPayload = () => {
    if (form.type === 'mcq') {
      const optionsStr = form.options.map(o => `${o.label}. ${o.text}`).join('\n');
      return {
        type: 'mcq',
        questionText: form.questionText,
        options: optionsStr,
        correctAnswer: form.correctAnswer,
        explanation: form.explanation,
        points: parseInt(form.points) || 1,
      };
    }
    return {
      type: 'short-answer',
      questionText: form.questionText,
      options: null,
      correctAnswer: form.correctAnswer,
      explanation: form.explanation,
      points: parseInt(form.points) || 1,
    };
  };

  const handleSave = async (addAnother) => {
    if (!form.questionText.trim()) {
      alert('Please enter the question text');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) {
        await api.put(`/banks/${bankId}/questions/${editing}`, payload);
      } else {
        await api.post(`/banks/${bankId}/questions`, payload);
      }
      onSave(addAnother);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cq-page">
      {/* ── Top bar ── */}
      <div className="cq-topbar">
        <div className="cq-topbar__left">
          <div className="cq-breadcrumb">
            <Link to="/banks" className="cq-breadcrumb__link">Question Bank</Link>
            <ChevronRight size={14} className="cq-breadcrumb__sep" />
            <span className="cq-breadcrumb__link" style={{ cursor: 'pointer' }} onClick={onCancel}>{bankTitle}</span>
            <ChevronRight size={14} className="cq-breadcrumb__sep" />
            <span className="cq-breadcrumb__active">{editing ? 'Edit Question' : 'Create Question'}</span>
          </div>
          <h1 className="cq-title">{editing ? 'Edit Question' : 'Create New Question'}</h1>
        </div>
        <button className="cq-preview-btn" type="button" onClick={() => setShowPreview(v => !v)}>
          <Eye size={15} />
          {showPreview ? 'Hide Preview' : 'Preview Question'}
        </button>
      </div>

      {/* ── Two-column layout ── */}
      <div className="cq-layout">
        {/* LEFT: main */}
        <div className="cq-main">

          {/* Question Details card */}
          <div className="cq-card">
            <div className="cq-card__title">Question Details</div>

            {/* Question Type */}
            <div className="cq-field">
              <label className="cq-label">Question Type</label>
              <div className="cq-type-row">
                <button
                  type="button"
                  className={`cq-type-btn${form.type === 'mcq' ? ' is-active' : ''}`}
                  onClick={() => setField('type', 'mcq')}
                >
                  <span className="cq-type-btn__radio" />
                  <span className="cq-type-btn__text">Multiple Choice</span>
                </button>
                <button
                  type="button"
                  className={`cq-type-btn${form.type === 'short-answer' ? ' is-active' : ''}`}
                  onClick={() => setField('type', 'short-answer')}
                >
                  <span className="cq-type-btn__lines">≡</span>
                  <span className="cq-type-btn__text">Short Answer</span>
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="cq-field">
              <label className="cq-label">Question Stem</label>
              <div className="cq-editor">
                <div className="cq-editor__toolbar">
                  <button type="button" className="cq-tool-btn" title="Bold"><Bold size={14} /></button>
                  <button type="button" className="cq-tool-btn" title="Italic"><Italic size={14} /></button>
                  <button type="button" className="cq-tool-btn" title="List"><List size={14} /></button>
                  <button type="button" className="cq-tool-btn" title="Formula"><Sigma size={14} /></button>
                  <button type="button" className="cq-tool-btn" title="Code"><Code size={14} /></button>
                </div>
                <textarea
                  className="cq-editor__textarea"
                  value={form.questionText}
                  onChange={e => setField('questionText', e.target.value)}
                  placeholder="Type your question prompt here..."
                  rows={5}
                  required
                />
              </div>
            </div>

            {/* Media drop zone */}
            <div className="cq-media-zone">
              <ImagePlay size={28} className="cq-media-zone__icon" />
              <div className="cq-media-zone__title">Add Media or Equations</div>
              <div className="cq-media-zone__sub">Drag and drop images, PDFs, or insert LaTeX equations</div>
            </div>
          </div>

          {/* Answer Options card */}
          <div className="cq-card">
            <div className="cq-card__header">
              <div className="cq-card__title">Answer Options</div>
              <span className="cq-card__hint">Select the correct answer using the radio buttons</span>
            </div>

            {form.type === 'mcq' ? (
              <>
                <div className="cq-options-list">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="cq-option">
                      <button
                        type="button"
                        className={`cq-option__radio${form.correctAnswer === opt.label ? ' is-selected' : ''}`}
                        onClick={() => setField('correctAnswer', opt.label)}
                        aria-label={`Mark option ${opt.label} as correct`}
                      />
                      <input
                        className="cq-option__input"
                        value={opt.text}
                        onChange={e => setOptionText(idx, e.target.value)}
                        placeholder={`Option ${opt.label}`}
                      />
                      {form.options.length > 2 && (
                        <button type="button" className="cq-option__remove" onClick={() => removeOption(idx)}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {form.options.length < 8 && (
                  <button type="button" className="cq-add-choice" onClick={addOption}>
                    <Plus size={15} /> Add another choice
                  </button>
                )}
              </>
            ) : (
              <div className="cq-field">
                <label className="cq-label">Model Answer</label>
                <input
                  className="cq-input"
                  value={form.correctAnswer}
                  onChange={e => setField('correctAnswer', e.target.value)}
                  placeholder="Type the expected correct answer..."
                />
                <label className="cq-label" style={{ marginTop: '1rem' }}>Explanation (optional)</label>
                <textarea
                  className="cq-input"
                  value={form.explanation}
                  onChange={e => setField('explanation', e.target.value)}
                  placeholder="Why is this the correct answer?"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="cq-card cq-preview">
              <div className="cq-card__title">Preview</div>
              <div className="cq-preview__stem">{form.questionText || <em>No question text yet.</em>}</div>
              {form.type === 'mcq' && (
                <div className="cq-preview__options">
                  {form.options.map((opt, i) => (
                    <div key={i} className={`cq-preview__option${form.correctAnswer === opt.label ? ' is-correct' : ''}`}>
                      <span className="cq-preview__opt-label">{opt.label}.</span>
                      <span>{opt.text || <em>Empty</em>}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: metadata */}
        <aside className="cq-sidebar">
          <div className="cq-card">
            <div className="cq-card__title">Metadata</div>

            {/* Subject */}
            <div className="cq-field">
              <label className="cq-label">Subject/Topic</label>
              <div className="cq-select-wrap">
                <select
                  className="cq-select"
                  value={form.subject}
                  onChange={e => setField('subject', e.target.value)}
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Difficulty */}
            <div className="cq-field">
              <label className="cq-label">Difficulty Level</label>
              <div className="cq-difficulty-row">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`cq-diff-btn${form.difficulty === d ? ' is-active' : ''}`}
                    onClick={() => setField('difficulty', d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Points */}
            <div className="cq-field">
              <label className="cq-label">Points/Weightage</label>
              <div className="cq-points-row">
                <input
                  type="number"
                  className="cq-points-input"
                  min={1}
                  max={100}
                  value={form.points}
                  onChange={e => setField('points', e.target.value)}
                />
                <span className="cq-points-unit">pts</span>
              </div>
            </div>

            {/* Tags */}
            <div className="cq-field">
              <label className="cq-label">Tags</label>
              <div className="cq-tags-wrap">
                {form.tags.map(t => (
                  <span key={t} className="cq-tag">
                    {t}
                    <button type="button" className="cq-tag__remove" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
              </div>
              <div className="cq-tag-input-wrap">
                <Tag size={14} />
                <input
                  className="cq-tag-input"
                  value={form.tagInput}
                  onChange={e => setField('tagInput', e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag..."
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer Actions ── */}
      <div className="cq-footer">
        <button type="button" className="cq-footer-cancel" onClick={onCancel}>
          Cancel
        </button>
        <div className="cq-footer-right">
          <button
            type="button"
            className="cq-footer-add-another"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            Save &amp; Add Another
          </button>
          <button
            type="button"
            className="cq-footer-save"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save to Bank'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main QuestionListPage ── */
export default function QuestionListPage() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editingQ, setEditingQ] = useState(null);
  const [editInitialForm, setEditInitialForm] = useState(null);

  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const load = async () => {
    try {
      const [b, q] = await Promise.all([
        api.get(`/banks/${bankId}`),
        api.get(`/banks/${bankId}/questions`),
      ]);
      setBank(b.data.bank);
      setQuestions(q.data.questions || []);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [bankId]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/banks/${bankId}/questions/${id}`);
      load();
    } catch (e) { alert(e.message); }
  };

  const startEdit = (q) => {
    let parsedOptions = [];
    if (q.type === 'mcq' && q.options) {
      parsedOptions = q.options.split('\n').map(line => {
        const match = line.match(/^([A-J])\.\s*(.*)/);
        return match ? { label: match[1], text: match[2] } : { label: '?', text: line };
      });
    }
    setEditInitialForm({
      type: q.type,
      questionText: q.questionText,
      options: parsedOptions.length > 0 ? parsedOptions : [emptyOption('A'), emptyOption('B')],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      points: q.points,
      subject: 'Computer Science',
      difficulty: q.points <= 2 ? 'Easy' : q.points <= 5 ? 'Medium' : 'Hard',
      tags: ['Exam Prep'],
      tagInput: '',
    });
    setEditingQ(q.id);
    setView('edit');
  };

  const getDifficultyColor = (points) => {
    if (points <= 2) return 'easy';
    if (points <= 5) return 'medium';
    return 'hard';
  };

  const getDifficultyLabel = (points) => {
    if (points <= 2) return 'Easy';
    if (points <= 5) return 'Medium';
    return 'Hard';
  };

  const filteredQuestions = questions.filter(q => {
    const textMatch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = typeFilter === 'all' || q.type === typeFilter;
    return textMatch && typeMatch;
  });

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (loading) return <LecturerShell><div className="loading-screen">Loading...</div></LecturerShell>;

  /* Show create/edit form */
  if (view === 'create' || view === 'edit') {
    return (
      <LecturerShell>
        <QuestionForm
          bankId={bankId}
          bankTitle={bank?.title || 'Questions'}
          editing={view === 'edit' ? editingQ : null}
          initialForm={view === 'edit' ? editInitialForm : null}
          onSave={(addAnother) => {
            load();
            if (addAnother) {
              setView('create');
              setEditingQ(null);
              setEditInitialForm(null);
            } else {
              setView('list');
            }
          }}
          onCancel={() => { setView('list'); setEditingQ(null); }}
        />
      </LecturerShell>
    );
  }

  /* ── Question list ── */
  return (
    <LecturerShell>
      <div className="qbl-page">
        {/* Header Breadcrumb & Actions */}
        <header className="qbl-header">
          <div className="qbl-header__left">
            <div className="qbl-breadcrumb">
              <Link to="/banks" className="qbl-breadcrumb__link">Question Banks</Link>
              <ChevronRight size={14} className="qbl-breadcrumb__sep" />
              <span className="qbl-breadcrumb__active">{bank?.title || 'Questions'}</span>
            </div>
            <h1 className="qbl-title">{bank?.title || 'Question Set'}</h1>
            <p className="qbl-desc">{bank?.description || 'Manage the question set for this bank, edit content, and keep the answer key consistent.'}</p>
          </div>
          <button className="qbl-create-btn" onClick={() => setView('create')}>
            <Plus size={16} />
            <span>Add Question</span>
          </button>
        </header>

        {/* Info stats cards block */}
        <div className="qbl-stats">
          <div className="qbl-stat-card">
            <span className="qbl-stat-label">TOTAL QUESTIONS</span>
            <span className="qbl-stat-value">{questions.length}</span>
          </div>
          <div className="qbl-stat-card">
            <span className="qbl-stat-label">TOTAL WEIGHTAGE</span>
            <span className="qbl-stat-value text-indigo">{totalPoints} pts</span>
          </div>
        </div>

        {/* Toolbar & filters */}
        <div className="qbl-toolbar">
          <div className="qbl-search-wrap">
            <Search size={16} className="qbl-search-icon" />
            <input
              type="text"
              className="qbl-search-input"
              placeholder="Search question text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="qbl-filters">
            <div className="qbl-select-wrap">
              <select
                className="qbl-select"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="mcq">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
              </select>
              <ChevronDown size={14} className="qbl-select-icon" />
            </div>
          </div>
        </div>

        {/* Questions list Table */}
        <div className="qbl-table-card">
          {filteredQuestions.length === 0 ? (
            <div className="qbl-empty">
              {questions.length === 0 ? 'No questions in this bank yet. Click "Add Question" to get started.' : 'No questions match your filter query.'}
            </div>
          ) : (
            <div className="qbl-table-wrap">
              <table className="qbl-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                    <th>QUESTION DETAILS</th>
                    <th style={{ width: '130px', textAlign: 'center' }}>TYPE</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>MARKS</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>DIFFICULTY</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, idx) => (
                    <tr key={q.id}>
                      <td className="text-center font-semibold text-slate">{idx + 1}</td>
                      <td>
                        <div className="qbl-q-text">{q.questionText}</div>
                        {q.options && (
                          <div className="qbl-q-options-preview">
                            {q.options.split('\n').map((opt, oIdx) => (
                              <span key={oIdx} className="qbl-option-chip">{opt}</span>
                            ))}
                          </div>
                        )}
                        <div className="qbl-q-answer">
                          Answer: <strong className="text-indigo">{q.correctAnswer}</strong>
                          {q.explanation && <span className="qbl-q-explanation"> — {q.explanation}</span>}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`qbl-type-badge qbl-type-badge--${q.type}`}>
                          {q.type === 'mcq' ? 'MCQ' : 'Short Answer'}
                        </span>
                      </td>
                      <td className="text-center font-bold text-slate">{q.points} pt{q.points > 1 ? 's' : ''}</td>
                      <td className="text-center">
                        <span className={`czq-diff-badge czq-diff-badge--${getDifficultyColor(q.points)}`}>
                          {getDifficultyLabel(q.points)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="qbl-actions-cell">
                          <button className="qbl-action-btn" onClick={() => startEdit(q)} title="Edit Question">
                            <Pencil size={14} />
                          </button>
                          <button className="qbl-action-btn qbl-action-btn--danger" onClick={() => handleDelete(q.id)} title="Delete Question">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LecturerShell>
  );
}
