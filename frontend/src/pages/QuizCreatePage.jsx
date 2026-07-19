import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Percent,
  Search,
  Filter,
  Check,
  Zap,
  Eye,
  HelpCircle,
  TrendingUp,
  Bookmark,
  ChevronDown
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passPercentage: 50,
    shuffle: false,
    showResults: true,
  });

  const load = async () => {
    try {
      const res = await api.get('/banks');
      setBanks(res.data.banks || []);
      if (res.data.banks && res.data.banks.length > 0) {
        setSelectedBank(res.data.banks[0].id);
        loadQuestions(res.data.banks[0].id);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const loadQuestions = async (bankId) => {
    if (!bankId) {
      setQuestions([]);
      return;
    }
    try {
      const res = await api.get(`/banks/${bankId}/questions`);
      setQuestions(res.data.questions || []);
    } catch (e) {
      alert(e.message);
    }
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

  const toggleAllQuestions = (filteredQ) => {
    const filteredIds = filteredQ.map(q => q.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const union = new Set([...prev, ...filteredIds]);
        return Array.from(union);
      });
    }
  };

  const handleSubmit = async (publish = true) => {
    if (!form.title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    if (selectedIds.length === 0) {
      alert('Please select at least one question');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/quizzes', {
        title: form.title,
        description: form.description,
        timeLimit: parseInt(form.timeLimit) || 30,
        shuffle: form.shuffle,
        showResults: publish, // Publish sets showResults to true, Draft sets to false
        questionIds: selectedIds,
      });
      navigate('/quizzes');
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Derive difficulty and category badge for display
  const getDifficulty = (points) => {
    if (points <= 2) return { label: 'Easy', color: 'easy' };
    if (points <= 5) return { label: 'Medium', color: 'medium' };
    return { label: 'Hard', color: 'hard' };
  };

  const getCategory = (qText) => {
    const text = qText.toLowerCase();
    if (text.includes('stack') || text.includes('queue') || text.includes('tree') || text.includes('linked list') || text.includes('data structure')) {
      return 'DATA STRUCTURES';
    }
    if (text.includes('complexity') || text.includes('big o') || text.includes('sorting') || text.includes('search')) {
      return 'ALGORITHMS ANALYSIS';
    }
    return 'GENERAL';
  };

  const filteredQuestions = questions.filter(q =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedQuestionsObjects = questions.filter(q => selectedIds.includes(q.id));
  const totalPoints = selectedQuestionsObjects.reduce((sum, q) => sum + q.points, 0);
  const estimatedTime = selectedIds.length * 9; // 9 mins per question estimation based on photo example (5 questions -> 45 mins)

  if (loading) {
    return (
      <LecturerShell>
        <div className="loading-screen">Loading...</div>
      </LecturerShell>
    );
  }

  return (
    <LecturerShell>
      <div className="czq-page">
        {/* Header */}
        <header className="czq-header">
          <button onClick={() => navigate('/quizzes')} className="czq-back-btn" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="czq-title">Create New Quiz</h1>
        </header>

        <div className="czq-layout">
          {/* Main content column */}
          <div className="czq-main">
            {/* Quiz Info Card */}
            <div className="czq-card">
              <div className="czq-section-title">QUIZ INFORMATION</div>

              <div className="czq-field">
                <label className="czq-label">Quiz Title</label>
                <input
                  type="text"
                  className="czq-input"
                  placeholder="e.g. Data Structures & Algorithms Foundations"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="czq-field">
                <label className="czq-label">Description</label>
                <textarea
                  className="czq-textarea"
                  rows={3}
                  placeholder="This assessment covers Linked Lists, Stacks, Queues, and basic Big O notation analysis."
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="czq-row">
                <div className="czq-field flex-1">
                  <label className="czq-label">Time Limit (Minutes)</label>
                  <div className="czq-input-icon-wrap">
                    <Clock size={16} className="czq-input-icon" />
                    <input
                      type="number"
                      min={1}
                      className="czq-input pl-10"
                      value={form.timeLimit}
                      onChange={e => setForm(p => ({ ...p, timeLimit: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="czq-field flex-1">
                  <label className="czq-label">Pass Percentage (%)</label>
                  <div className="czq-input-icon-wrap">
                    <Percent size={16} className="czq-input-icon" />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="czq-input pl-10"
                      value={form.passPercentage}
                      onChange={e => setForm(p => ({ ...p, passPercentage: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              <div className="czq-checkbox-group">
                <label className="czq-checkbox-label">
                  <input
                    type="checkbox"
                    className="czq-checkbox"
                    checked={form.shuffle}
                    onChange={e => setForm(p => ({ ...p, shuffle: e.target.checked }))}
                  />
                  <span>Shuffle Questions</span>
                </label>
                <label className="czq-checkbox-label">
                  <input
                    type="checkbox"
                    className="czq-checkbox"
                    checked={form.showResults}
                    onChange={e => setForm(p => ({ ...p, showResults: e.target.checked }))}
                  />
                  <span>Show results instantly after submission</span>
                </label>
              </div>
            </div>

            {/* Select Questions Card */}
            <div className="czq-card">
              <div className="czq-card-header">
                <div className="czq-section-title">SELECT QUESTIONS FROM BANK</div>
                
                <div className="czq-card-actions">
                  <div className="czq-bank-select-wrap">
                    <select
                      className="czq-bank-select"
                      value={selectedBank}
                      onChange={e => handleBankChange(e.target.value)}
                    >
                      <option value="">-- Select Bank --</option>
                      {banks.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.title} ({b._count?.questions ?? 0})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="czq-bank-select-icon" />
                  </div>

                  <div className="czq-search-wrap">
                    <Search size={16} className="czq-search-icon" />
                    <input
                      type="text"
                      className="czq-search-input"
                      placeholder="Filter questions..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="czq-filter-btn" type="button" title="Filter options">
                    <Filter size={16} />
                  </button>
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="czq-empty">
                  {selectedBank ? 'No questions match the filter.' : 'Please select a question bank to load questions.'}
                </div>
              ) : (
                <div className="czq-table-wrap">
                  <table className="czq-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>
                          <input
                            type="checkbox"
                            className="czq-checkbox"
                            checked={filteredQuestions.every(q => selectedIds.includes(q.id))}
                            onChange={() => toggleAllQuestions(filteredQuestions)}
                          />
                        </th>
                        <th>QUESTION DETAILS</th>
                        <th style={{ width: '100px', textAlign: 'center' }}>MARKS</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>DIFFICULTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map(q => {
                        const difficulty = getDifficulty(q.points);
                        const category = getCategory(q.questionText);
                        const isChecked = selectedIds.includes(q.id);
                        return (
                          <tr
                            key={q.id}
                            className={`czq-tr-interactive ${isChecked ? 'is-selected' : ''}`}
                            onClick={() => toggleQuestion(q.id)}
                          >
                            <td onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className="czq-checkbox"
                                checked={isChecked}
                                onChange={() => toggleQuestion(q.id)}
                              />
                            </td>
                            <td>
                              <div className="czq-q-text">{q.questionText}</div>
                              <span className="czq-category-tag">{category}</span>
                            </td>
                            <td className="text-center font-semibold" style={{ color: '#1e293b' }}>
                              {q.points}
                            </td>
                            <td className="text-center">
                              <span className={`czq-diff-badge czq-diff-badge--${difficulty.color}`}>
                                {difficulty.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar summary column */}
          <aside className="czq-sidebar">
            <div className="czq-card czq-summary-card">
              <div className="czq-section-title">ASSESSMENT SUMMARY</div>

              <div className="czq-summary-row">
                <span className="czq-summary-label">Selected Questions</span>
                <span className="czq-summary-value font-bold">{selectedIds.length}</span>
              </div>

              <div className="czq-summary-row mt-4">
                <span className="czq-summary-label">Total Marks</span>
                <span className="czq-summary-value text-xl font-extrabold" style={{ color: '#4f46e5' }}>
                  {totalPoints}
                </span>
              </div>

              <div className="czq-estimated-wrap mt-6">
                <Clock size={18} className="czq-estimated-icon" />
                <div className="czq-estimated-text">
                  Estimated Completion: <strong>{estimatedTime} mins</strong>
                </div>
              </div>

              <div className="czq-action-buttons mt-8">
                <button
                  type="button"
                  className="czq-btn-publish"
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                >
                  <Check size={16} />
                  <span>{submitting ? 'Publishing...' : 'Publish Quiz'}</span>
                </button>
                <button
                  type="button"
                  className="czq-btn-draft"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </LecturerShell>
  );
}
