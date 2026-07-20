import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  HelpCircle,
  Settings,
  Bell,
  Search,
  LogOut,
  Plus,
  Target,
  Users,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronRight,
  Key,
  User,
  Mail,
  Shield,
  GraduationCap,
  CheckCircle,
  Pencil,
  Trash2,
  Bold,
  Italic,
  List,
  Sigma,
  Code,
  ImagePlay,
  Tag,
  Save,
  X,
  Percent,
  Check,
  Clock
} from 'lucide-react';

/* ─── FAQ list for Help tab ─── */
const FAQS = [
  { q: 'How do I create a new quiz?', a: 'Navigate to "Create Quiz" tab. Select questions from your Question Banks, set a time limit, and configure options.' },
  { q: 'How do I add questions to a question bank?', a: 'Go to the "Question Bank" tab, open or create a bank, then click "Add Question".' },
  { q: 'Can I see which students completed a quiz?', a: 'Yes. Go to the "Analytics" tab, select a quiz from the dropdown, and you will see each student\'s score.' },
  { q: 'How is the average score calculated?', a: 'The average score is the mean percentage across all submitted attempts for all your quizzes combined.' },
  { q: 'Can I delete a quiz?', a: 'Yes. In the "Quizzes" tab, locate the quiz and click the trash icon. This will also remove student attempt records.' },
];

const SUBJECTS = [
  'World History', 'Mathematics', 'Computer Science', 'Physics',
  'Chemistry', 'Biology', 'Literature', 'Economics', 'Other',
];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const emptyOption = (label) => ({ label, text: '' });

export default function LecturerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  /* Shared data */
  const [overview, setOverview] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [banks, setBanks] = useState([]);

  /* ────────────────────────────────────────────────────────
     QUESTION BANK MANAGEMENT STATE
     ──────────────────────────────────────────────────────── */
  const [bankView, setBankView] = useState('banks-list'); // 'banks-list' | 'questions-list' | 'create-question' | 'edit-question'
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [showCreateBankForm, setShowCreateBankForm] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm, setBankForm] = useState({ title: '', description: '' });

  /* Question Editor Form State */
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    type: 'mcq',
    questionText: '',
    options: [emptyOption('A'), emptyOption('B'), emptyOption('C'), emptyOption('D')],
    correctAnswer: 'A',
    explanation: '',
    mediaUrl: '',
    points: 1,
    subject: 'Computer Science',
    difficulty: 'Medium',
    tags: ['Exam Prep'],
    tagInput: '',
  });
  const [questionSaving, setQuestionSaving] = useState(false);
  const [showQuestionPreview, setShowQuestionPreview] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);

  /* ────────────────────────────────────────────────────────
     CREATE QUIZ STATE
     ──────────────────────────────────────────────────────── */
  const [quizCreateForm, setQuizCreateForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    passPercentage: 50,
    shuffle: false,
    showResults: true,
  });
  const [quizSelectedBankId, setQuizSelectedBankId] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizSelectedIds, setQuizSelectedIds] = useState([]);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  /* ────────────────────────────────────────────────────────
     ANALYTICS STATE
     ──────────────────────────────────────────────────────── */
  const [analyticsQuizId, setAnalyticsQuizId] = useState('');
  const [analyticsScores, setAnalyticsScores] = useState([]);
  const [analyticsBreakdown, setAnalyticsBreakdown] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  /* ────────────────────────────────────────────────────────
     HELP / SETTINGS STATE
     ──────────────────────────────────────────────────────── */
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Sync Tab state with URL path ── */
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/banks/')) {
      setActiveTab('banks');
      setBankView('questions-list');
      const bId = parseInt(params.bankId);
      if (bId) {
        setSelectedBankId(bId);
        loadBankQuestions(bId);
      }
    } else if (path === '/banks') {
      setActiveTab('banks');
      setBankView('banks-list');
    } else if (path === '/quizzes/create') {
      setActiveTab('create-quiz');
    } else if (path.startsWith('/analytics')) {
      setActiveTab('analytics');
      if (params.quizId) {
        setAnalyticsQuizId(params.quizId);
      }
    } else if (path === '/help') {
      setActiveTab('help');
    } else if (path === '/quizzes') {
      setActiveTab('quizzes');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname, params.bankId, params.quizId]);

  /* ── Load initial data ── */
  const loadInitialData = async () => {
    try {
      const [o, q, b] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/quizzes'),
        api.get('/banks'),
      ]);
      setOverview(o.data);
      setQuizzes(q.data.quizzes || []);
      setBanks(b.data.banks || []);

      // If analytics quiz is not set yet, set it to the first quiz
      if (!analyticsQuizId && q.data.quizzes && q.data.quizzes.length > 0) {
        setAnalyticsQuizId(String(q.data.quizzes[0].id));
      }
      if (b.data.banks && b.data.banks.length > 0) {
        setQuizSelectedBankId(b.data.banks[0].id);
        loadQuizQuestions(b.data.banks[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  /* Load questions for selected bank in main Bank tab */
  const loadBankQuestions = async (bId) => {
    try {
      const res = await api.get(`/banks/${bId}/questions`);
      setBankQuestions(res.data.questions || []);
    } catch (e) {
      alert(e.message);
    }
  };

  /* Load questions for quiz builder bank select */
  const loadQuizQuestions = async (bId) => {
    if (!bId) {
      setQuizQuestions([]);
      return;
    }
    try {
      const res = await api.get(`/banks/${bId}/questions`);
      setQuizQuestions(res.data.questions || []);
    } catch (e) {
      alert(e.message);
    }
  };

  /* Load analytics details when selected quiz changes */
  useEffect(() => {
    if (!analyticsQuizId) return;
    setAnalyticsLoading(true);
    (async () => {
      try {
        const [s, b] = await Promise.all([
          api.get(`/analytics/quiz/${analyticsQuizId}/scores`),
          api.get(`/analytics/quiz/${analyticsQuizId}/breakdown`),
        ]);
        setAnalyticsScores(s.data.scores || []);
        setAnalyticsBreakdown(b.data.breakdown || []);
      } catch (e) {
        console.error(e);
      } finally {
        setAnalyticsLoading(false);
      }
    })();
  }, [analyticsQuizId]);

  if (!user) return null;

  /* Helper constants */
  const totalStudents = overview?.totalStudents ?? 0;
  const activeQuizzes = quizzes.filter(q => q.showResults !== false).length;
  const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentQuizzes = sortedQuizzes.slice(0, 4);

  const getStatus = (quiz) => {
    if (quiz.showResults === false) return { label: 'Closed', tone: 'closed' };
    if ((quiz._count?.attempts ?? 0) === 0) return { label: 'Draft', tone: 'draft' };
    return { label: 'Active', tone: 'active' };
  };

  const getParticipation = (quiz) => {
    if (!totalStudents) return 0;
    return Math.min(100, Math.round(((quiz._count?.attempts ?? 0) / totalStudents) * 100));
  };

  const formatDate = (v) => v ? new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'LC';

  /* ────────────────────────────────────────────────────────
     QUESTION BANK OPERATIONS
     ──────────────────────────────────────────────────────── */
  const handleCreateBank = async (e) => {
    e.preventDefault();
    if (!bankForm.title.trim()) return;
    try {
      await api.post('/banks', bankForm);
      setBankForm({ title: '', description: '' });
      setShowCreateBankForm(false);
      loadInitialData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUpdateBank = async (e) => {
    e.preventDefault();
    if (!bankForm.title.trim() || !editingBank) return;
    try {
      await api.put(`/banks/${editingBank.id}`, bankForm);
      setBankForm({ title: '', description: '' });
      setEditingBank(null);
      setShowCreateBankForm(false);
      loadInitialData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteBank = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this question bank and all its questions?')) return;
    try {
      await api.delete(`/banks/${id}`);
      loadInitialData();
    } catch (e) {
      alert(e.message);
    }
  };

  const selectBank = (id) => {
    navigate(`/banks/${id}`);
  };

  const startEditBank = (e, bankObj) => {
    e.stopPropagation();
    setBankForm({ title: bankObj.title, description: bankObj.description || '' });
    setEditingBank(bankObj);
    setShowCreateBankForm(true);
  };

  /* ────────────────────────────────────────────────────────
     QUESTION CREATION & EDITING OPERATIONS
     ──────────────────────────────────────────────────────── */
  const startCreateQuestion = () => {
    setQuestionForm({
      type: 'mcq',
      questionText: '',
      options: [emptyOption('A'), emptyOption('B'), emptyOption('C'), emptyOption('D')],
      correctAnswer: 'A',
      explanation: '',
      mediaUrl: '',
      points: 1,
      subject: 'Computer Science',
      difficulty: 'Medium',
      tags: ['Exam Prep'],
      tagInput: '',
    });
    setEditingQuestionId(null);
    setBankView('create-question');
  };

  const startEditQuestion = (q) => {
    let parsedOptions = [];
    if (q.type === 'mcq' && q.options) {
      parsedOptions = q.options.split('\n').map(line => {
        const match = line.match(/^([A-J])\.\s*(.*)/);
        return match ? { label: match[1], text: match[2] } : { label: '?', text: line };
      });
    }
    setQuestionForm({
      type: q.type,
      questionText: q.questionText,
      options: parsedOptions.length > 0 ? parsedOptions : [emptyOption('A'), emptyOption('B')],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      mediaUrl: q.mediaUrl || '',
      points: q.points,
      subject: 'Computer Science',
      difficulty: q.points <= 2 ? 'Easy' : q.points <= 5 ? 'Medium' : 'Hard',
      tags: ['Exam Prep'],
      tagInput: '',
    });
    setEditingQuestionId(q.id);
    setBankView('edit-question');
  };

  const handleSaveQuestion = async (addAnother = false) => {
    if (!questionForm.questionText.trim()) {
      alert('Please type the question text.');
      return;
    }
    setQuestionSaving(true);
    try {
      let payload;
      if (questionForm.type === 'mcq') {
        const optionsStr = questionForm.options.map(o => `${o.label}. ${o.text}`).join('\n');
        payload = {
          type: 'mcq',
          questionText: questionForm.questionText,
          options: optionsStr,
          correctAnswer: questionForm.correctAnswer,
          explanation: questionForm.explanation,
          mediaUrl: questionForm.mediaUrl || null,
          points: parseInt(questionForm.points) || 1,
        };
      } else {
        payload = {
          type: 'true-false',
          questionText: questionForm.questionText,
          options: null,
          correctAnswer: questionForm.correctAnswer,
          explanation: questionForm.explanation,
          mediaUrl: questionForm.mediaUrl || null,
          points: parseInt(questionForm.points) || 1,
        };
      }

      if (editingQuestionId) {
        await api.put(`/banks/${selectedBankId}/questions/${editingQuestionId}`, payload);
      } else {
        await api.post(`/banks/${selectedBankId}/questions`, payload);
      }

      loadBankQuestions(selectedBankId);
      loadInitialData();

      if (addAnother) {
        startCreateQuestion();
      } else {
        setBankView('questions-list');
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setQuestionSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/banks/${selectedBankId}/questions/${qId}`);
      loadBankQuestions(selectedBankId);
      loadInitialData();
    } catch (e) {
      alert(e.message);
    }
  };

  /* Question Editor Form Helpers */
  const setQuestionField = (key, val) => setQuestionForm(f => ({ ...f, [key]: val }));

  const setQuestionOptionText = (idx, text) => {
    const opts = questionForm.options.map((o, i) => i === idx ? { ...o, text } : o);
    setQuestionField('options', opts);
  };

  const addQuestionOption = () => {
    const labels = 'ABCDEFGHIJ';
    const next = labels[questionForm.options.length] || String(questionForm.options.length + 1);
    setQuestionField('options', [...questionForm.options, emptyOption(next)]);
  };

  const removeQuestionOption = (idx) => {
    const opts = questionForm.options.filter((_, i) => i !== idx);
    setQuestionField('options', opts);
    if (questionForm.correctAnswer === questionForm.options[idx]?.label) {
      setQuestionField('correctAnswer', opts[0]?.label || '');
    }
  };

  const addQuestionTag = (e) => {
    if (e.key === 'Enter' && questionForm.tagInput.trim()) {
      e.preventDefault();
      if (!questionForm.tags.includes(questionForm.tagInput.trim())) {
        setQuestionField('tags', [...questionForm.tags, questionForm.tagInput.trim()]);
      }
      setQuestionField('tagInput', '');
    }
  };

  const removeQuestionTag = (t) => setQuestionForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  const uploadMedia = async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only image files (jpg, png, gif, webp) are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }
    setMediaUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setQuestionField('mediaUrl', data.data.url);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      setMediaUploading(false);
    }
  };

  /* ────────────────────────────────────────────────────────
     QUIZ BUILDER OPERATIONS
     ──────────────────────────────────────────────────────── */
  const handleQuizBankChange = (bId) => {
    setQuizSelectedBankId(bId);
    setQuizSelectedIds([]);
    loadQuizQuestions(bId);
  };

  const toggleQuizQuestion = (qId) => {
    setQuizSelectedIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const toggleAllQuizQuestions = (filteredQ) => {
    const filteredIds = filteredQ.map(q => q.id);
    const allSelected = filteredIds.every(id => quizSelectedIds.includes(id));
    if (allSelected) {
      setQuizSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setQuizSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleCreateQuizSubmit = async (publish = true) => {
    if (!quizCreateForm.title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    if (quizSelectedIds.length === 0) {
      alert('Please select at least one question.');
      return;
    }
    setQuizSubmitting(true);
    try {
      await api.post('/quizzes', {
        title: quizCreateForm.title,
        description: quizCreateForm.description,
        timeLimit: parseInt(quizCreateForm.timeLimit) || 30,
        shuffle: quizCreateForm.shuffle,
        showResults: publish,
        questionIds: quizSelectedIds,
      });
      /* Clear Form */
      setQuizCreateForm({
        title: '',
        description: '',
        timeLimit: 30,
        passPercentage: 50,
        shuffle: false,
        showResults: true,
      });
      setQuizSelectedIds([]);
      loadInitialData();
      navigate('/dashboard');
    } catch (e) {
      alert(e.message);
    } finally {
      setQuizSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────────────────
     UI DERIVATIONS
     ──────────────────────────────────────────────────────── */
  const activeBankObj = banks.find(b => b.id === selectedBankId);
  const totalWeightagePoints = bankQuestions.reduce((sum, q) => sum + q.points, 0);

  // Search/Filters matching
  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBanks = banks.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBankQuestions = bankQuestions.filter(q =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuizQuestions = quizQuestions.filter(q =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedQuestionsForQuiz = quizQuestions.filter(q => quizSelectedIds.includes(q.id));
  const selectedQuizPoints = selectedQuestionsForQuiz.reduce((sum, q) => sum + q.points, 0);

  /* Analytics derived stats for selected quiz */
  const submitted = analyticsScores.filter(s => s.totalPoints > 0);
  const avgScore = submitted.length
    ? Math.round(submitted.reduce((a, s) => a + s.percentage, 0) / submitted.length)
    : null;
  const completionRate = totalStudents
    ? Math.min(100, Math.round((submitted.length / totalStudents) * 100))
    : null;
  const selectedQuiz = quizzes.find(q => String(q.id) === String(analyticsQuizId));

  // Difficulty derivations
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

  const handleTabClick = (tabId) => {
    if (tabId === 'dashboard') navigate('/dashboard');
    else if (tabId === 'banks') navigate('/banks');
    else if (tabId === 'create-quiz') navigate('/quizzes/create');
    else if (tabId === 'analytics') navigate('/analytics');
    else if (tabId === 'help') navigate('/help');
  };

  return (
    <div className="student-layout">
      {/* ── Sidebar Navigation ── */}
      <aside className="student-sidebar">
        <div className="student-sidebar__top">
          <div className="student-logo">SmartQuiz</div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '1.5rem', marginTop: '-12px', paddingLeft: '4px' }}>
            ARCHITECT MODE
          </div>
          <nav className="student-nav">
            {[
              { id: 'dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'banks',       icon: BookOpen,        label: 'Question Bank' },
              { id: 'create-quiz', icon: Plus,            label: 'Create Quiz' },
              { id: 'analytics',   icon: BarChart3,       label: 'Analytics' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`student-nav__item${activeTab === id ? ' active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom profile info */}
        <div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`student-nav__item${activeTab === 'settings' ? ' active' : ''}`}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="student-profile" style={{ marginTop: '10px' }}>
            <div className="lecturer-profile-card__avatar" style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>{initials}</div>
            <div className="student-profile__info">
              <span className="student-profile__name">{user.name}</span>
              <span className="student-profile__id">CS Department</span>
            </div>
            <button onClick={logout} className="student-logout-btn" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="student-main">
        {/* Only render toolbar if not in creating-question mode */}
        {!(activeTab === 'banks' && (bankView === 'create-question' || bankView === 'edit-question')) && (
          <header className="student-header">
            <div className="student-search">
              <Search size={18} className="student-search__icon" />
              <input
                type="text"
                placeholder="Search..."
                className="student-search__input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="student-header__actions">
              <button className="student-bell" aria-label="Notifications" onClick={() => alert('No new notifications.')}>
                <Bell size={20} />
              </button>
              <button className="student-bell" title="Help FAQ" onClick={() => handleTabClick('help')}>
                <HelpCircle size={20} />
              </button>
            </div>
          </header>
        )}

        <main className="student-content">
          {loading ? (
            <div className="student-loading">Loading...</div>
          ) : (
            <>
              {/* ────────────────────────────────────────────────────────
                 1. DASHBOARD TAB
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'dashboard' && (
                <>
                  <h1 className="student-title">Lecturer Dashboard</h1>

                  {/* Stat Cards */}
                  <div className="student-stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                    <div className="student-stat-card">
                      <div className="student-stat-icon purple"><ClipboardList size={20} /></div>
                      <div className="student-stat-info">
                        <span className="student-stat-label">TOTAL QUIZZES</span>
                        <span className="student-stat-value">{quizzes.length}</span>
                      </div>
                    </div>
                    <div className="student-stat-card">
                      <div className="student-stat-icon green"><Users size={20} /></div>
                      <div className="student-stat-info">
                        <span className="student-stat-label">TOTAL STUDENTS</span>
                        <span className="student-stat-value">{totalStudents}</span>
                      </div>
                    </div>
                    <div className="student-stat-card">
                      <div className="student-stat-icon amber"><Sparkles size={20} /></div>
                      <div className="student-stat-info">
                        <span className="student-stat-label">AVERAGE SCORE</span>
                        <span className="student-stat-value">{overview?.averageScore != null ? `${overview.averageScore}%` : '–'}</span>
                      </div>
                    </div>
                    <div className="student-stat-card">
                      <div className="student-stat-icon" style={{ background: '#cffafe', color: '#0f766e' }}><Zap size={20} /></div>
                      <div className="student-stat-info">
                        <span className="student-stat-label">ACTIVE QUIZZES</span>
                        <span className="student-stat-value">{activeQuizzes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="student-dashboard-columns">
                    {/* Left: Recent Quizzes */}
                    <section className="student-col-left">
                      <div className="student-section-header">
                        <h2>Recent Assessments</h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentQuizzes.map(quiz => {
                          const status = getStatus(quiz);
                          const participation = getParticipation(quiz);
                          return (
                            <div key={quiz.id} className="student-quiz-card">
                              <div className="student-quiz-details">
                                <h3>{quiz.title}</h3>
                                <div className="student-quiz-meta">
                                  <span className="student-meta-item"><ClipboardList size={13} />{quiz._count?.quizQuestions ?? 0} questions</span>
                                  <span className={`lecturer-status lecturer-status--${status.tone}`}>{status.label}</span>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: 4 }}>
                                    <span>Participation</span><span>{participation}%</span>
                                  </div>
                                  <div className="lecturer-progress">
                                    <div className="lecturer-progress__fill" style={{ width: `${participation}%` }} />
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => navigate(`/analytics/quiz/${quiz.id}`)} className="student-start-btn" style={{ flexShrink: 0 }}>
                                <Eye size={14} style={{ marginRight: 4 }} />Analytics
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* Right: Quick Performance card */}
                    <section className="student-col-right">
                      <div className="student-section-header"><h2>Platform Overview</h2></div>
                      <div className="student-performance-container">
                        <div className="student-performance-card">
                          <div className="performance-card__header"><span>SUBMISSIONS OVERVIEW</span></div>
                          <div className="performance-card__body">
                            <div className="performance-card__title-row">
                              <div className="performance-card__quiz-title">Total Submissions</div>
                              <div className="performance-card__score"><span className="score-num">{overview?.totalAttempts ?? 0}</span></div>
                            </div>
                            <div className="performance-card__date">Across all assessments</div>
                            <div className="performance-card__progress-bg">
                              <div className="performance-card__progress-bar" style={{ width: `${overview?.averageScore ?? 0}%` }} />
                            </div>
                            <button onClick={() => navigate('/analytics')} className="performance-card__results-btn">
                              <BarChart3 size={14} /><span>View Analytics</span>
                            </button>
                          </div>
                        </div>
                        <div className="student-tip-card">
                          <div className="tip-card__content">
                            <h3>Lecturer Tip</h3>
                            <p>Shuffling options and questions reduces academic integrity risks by up to 60%. Try configuring shuffle settings on your quizzes.</p>
                          </div>
                          <GraduationCap className="tip-card__watermark" size={72} />
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}

              {/* ────────────────────────────────────────────────────────
                 2. QUESTION BANK TAB
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'banks' && (
                <>
                  {/* Mode A: Question Banks listing */}
                  {bankView === 'banks-list' && (
                    <div className="qbl-page">
                      <header className="qbl-header" style={{ marginBottom: '0.5rem' }}>
                        <div className="qbl-header__left">
                          <h1 className="qbl-title" style={{ margin: 0 }}>Question Banks</h1>
                          <p className="qbl-desc">Organize questions into specialized question banks for reuse.</p>
                        </div>
                        <button className="qbl-create-btn" onClick={() => { setBankForm({ title: '', description: '' }); setEditingBank(null); setShowCreateBankForm(true); }}>
                          <Plus size={16} /><span>Create New Bank</span>
                        </button>
                      </header>

                      {showCreateBankForm && (
                        <div className="cq-card" style={{ marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 700 }}>{editingBank ? 'Edit Bank Info' : 'Create Question Bank'}</h3>
                            <button className="cq-option__remove" onClick={() => setShowCreateBankForm(false)}><X size={16} /></button>
                          </div>
                          <form onSubmit={editingBank ? handleUpdateBank : handleCreateBank} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="czq-field">
                              <label className="czq-label">Bank Title</label>
                              <input className="czq-input" value={bankForm.title} onChange={e => setBankForm({ ...bankForm, title: e.target.value })} required />
                            </div>
                            <div className="czq-field">
                              <label className="czq-label">Description</label>
                              <textarea className="czq-textarea" rows={2} value={bankForm.description} onChange={e => setBankForm({ ...bankForm, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button type="submit" className="czq-btn-publish" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{editingBank ? 'Update' : 'Create'}</button>
                              <button type="button" className="czq-btn-draft" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setShowCreateBankForm(false)}>Cancel</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="qbl-table-card">
                        {filteredBanks.length === 0 ? (
                          <div className="qbl-empty">No banks found. Create a bank to add questions.</div>
                        ) : (
                          <div className="qbl-table-wrap">
                            <table className="qbl-table">
                              <thead>
                                <tr>
                                  <th>BANK NAME</th>
                                  <th>DESCRIPTION</th>
                                  <th style={{ width: '130px', textAlign: 'center' }}>QUESTIONS</th>
                                  <th style={{ width: '120px', textAlign: 'center' }}>CREATED</th>
                                  <th style={{ width: '100px', textAlign: 'center' }}>ACTIONS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredBanks.map(b => (
                                  <tr key={b.id} className="czq-tr-interactive" onClick={() => selectBank(b.id)}>
                                    <td className="font-semibold" style={{ color: '#1e293b' }}>{b.title}</td>
                                    <td className="text-slate" style={{ fontSize: '0.85rem' }}>{b.description || '–'}</td>
                                    <td className="text-center font-bold text-indigo">{b._count?.questions ?? 0}</td>
                                    <td className="text-slate">{formatDate(b.createdAt)}</td>
                                    <td className="text-center" onClick={e => e.stopPropagation()}>
                                      <div className="qbl-actions-cell">
                                        <button className="qbl-action-btn" onClick={e => startEditBank(e, b)}><Pencil size={14} /></button>
                                        <button className="qbl-action-btn qbl-action-btn--danger" onClick={e => handleDeleteBank(e, b.id)}><Trash2 size={14} /></button>
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
                  )}

                  {/* Mode B: Questions list table within a bank */}
                  {bankView === 'questions-list' && (
                    <div className="qbl-page">
                      <header className="qbl-header">
                        <div className="qbl-header__left">
                          <div className="qbl-breadcrumb">
                            <span className="qbl-breadcrumb__link" style={{ cursor: 'pointer' }} onClick={() => navigate('/banks')}>Question Banks</span>
                            <ChevronRight size={14} className="qbl-breadcrumb__sep" />
                            <span className="qbl-breadcrumb__active">{activeBankObj?.title}</span>
                          </div>
                          <h1 className="qbl-title">{activeBankObj?.title}</h1>
                          <p className="qbl-desc">{activeBankObj?.description || 'Manage the question set for this bank, edit content, and keep the answer key consistent.'}</p>
                        </div>
                        <button className="qbl-create-btn" onClick={startCreateQuestion}>
                          <Plus size={16} /><span>Add Question</span>
                        </button>
                      </header>

                      <div className="qbl-stats">
                        <div className="qbl-stat-card">
                          <span className="qbl-stat-label">TOTAL QUESTIONS</span>
                          <span className="qbl-stat-value">{bankQuestions.length}</span>
                        </div>
                        <div className="qbl-stat-card">
                          <span className="qbl-stat-label">TOTAL WEIGHTAGE</span>
                          <span className="qbl-stat-value text-indigo">{totalWeightagePoints} pts</span>
                        </div>
                      </div>

                      <div className="qbl-table-card">
                        {filteredBankQuestions.length === 0 ? (
                          <div className="qbl-empty">No questions in this bank yet. Click "Add Question" to get started.</div>
                        ) : (
                          <div className="qbl-table-wrap">
                            <table className="qbl-table">
                              <thead>
                                <tr>
                                  <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                                  <th>QUESTION DETAILS</th>
                                  <th style={{ width: '130px', textAlign: 'center' }}>TYPE</th>
                                  <th style={{ width: '100px', textAlign: 'center' }}>MARKS</th>
                                  <th style={{ width: '120px', textAlign: 'center' }}>DIFFICULTY</th>
                                  <th style={{ width: '100px', textAlign: 'center' }}>ACTIONS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredBankQuestions.map((q, idx) => (
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
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <span className={`qbl-type-badge qbl-type-badge--${q.type}`}>
                                        {q.type === 'mcq' ? 'MCQ' : 'True/False'}
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
                                        <button className="qbl-action-btn" onClick={() => startEditQuestion(q)}><Pencil size={14} /></button>
                                        <button className="qbl-action-btn qbl-action-btn--danger" onClick={() => handleDeleteQuestion(q.id)}><Trash2 size={14} /></button>
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
                  )}

                  {/* Mode C: Create/Edit Question form (Matches the exact photo design layout) */}
                  {(bankView === 'create-question' || bankView === 'edit-question') && (
                    <div className="cq-page">
                      {/* Top bar */}
                      <div className="cq-topbar">
                        <div className="cq-topbar__left">
                          <div className="cq-breadcrumb">
                            <span className="cq-breadcrumb__link" style={{ cursor: 'pointer' }} onClick={() => navigate('/banks')}>Question Bank</span>
                            <ChevronRight size={14} className="cq-breadcrumb__sep" />
                            <span className="cq-breadcrumb__link" style={{ cursor: 'pointer' }} onClick={() => setBankView('questions-list')}>{activeBankObj?.title}</span>
                            <ChevronRight size={14} className="cq-breadcrumb__sep" />
                            <span className="cq-breadcrumb__active">{editingQuestionId ? 'Edit Question' : 'Create Question'}</span>
                          </div>
                          <h1 className="cq-title">{editingQuestionId ? 'Edit Question' : 'Create New Question'}</h1>
                        </div>
                        <button className="cq-preview-btn" type="button" onClick={() => setShowQuestionPreview(v => !v)}>
                          <Eye size={15} />
                          {showQuestionPreview ? 'Hide Preview' : 'Preview Question'}
                        </button>
                      </div>

                      {/* Layout */}
                      <div className="cq-layout">
                        {/* Main fields (Left) */}
                        <div className="cq-main">
                          <div className="cq-card">
                            <div className="cq-card__title">Question Details</div>

                            <div className="cq-field">
                              <label className="cq-label">Question Type</label>
                              <div className="cq-type-row">
                                <button
                                  type="button"
                                  className={`cq-type-btn${questionForm.type === 'mcq' ? ' is-active' : ''}`}
                                  onClick={() => setQuestionField('type', 'mcq')}
                                >
                                  <span className="cq-type-btn__radio" />
                                  <span className="cq-type-btn__text">Multiple Choice</span>
                                </button>
                                <button
                                  type="button"
                                  className={`cq-type-btn${questionForm.type === 'true-false' ? ' is-active' : ''}`}
                                  onClick={() => setQuestionField('type', 'true-false')}
                                >
                                  <span className="cq-type-btn__lines">T/F</span>
                                  <span className="cq-type-btn__text">True or False</span>
                                </button>
                              </div>
                            </div>

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
                                  value={questionForm.questionText}
                                  onChange={e => setQuestionField('questionText', e.target.value)}
                                  placeholder="Type your question prompt here..."
                                  rows={5}
                                  required
                                />
                              </div>
                            </div>

                            {questionForm.mediaUrl ? (
                              <div className="cq-media-preview">
                                <img src={questionForm.mediaUrl} alt="Question media" className="cq-media-preview__img" />
                                <button
                                  type="button"
                                  className="cq-media-preview__remove"
                                  onClick={() => setQuestionField('mediaUrl', '')}
                                >
                                  <X size={14} /> Remove Image
                                </button>
                              </div>
                            ) : (
                              <label
                                className="cq-media-zone"
                                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('is-dragover'); }}
                                onDragLeave={e => e.currentTarget.classList.remove('is-dragover')}
                                onDrop={e => {
                                  e.preventDefault();
                                  e.currentTarget.classList.remove('is-dragover');
                                  if (e.dataTransfer.files.length > 0) uploadMedia(e.dataTransfer.files[0]);
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                  className="cq-media-zone__input"
                                  onChange={e => { if (e.target.files.length > 0) uploadMedia(e.target.files[0]); }}
                                />
                                <ImagePlay size={28} className="cq-media-zone__icon" />
                                <div className="cq-media-zone__title">{mediaUploading ? 'Uploading...' : 'Add Image'}</div>
                                <div className="cq-media-zone__sub">Drag and drop or click to browse (jpg, png, gif, webp — max 5MB)</div>
                              </label>
                            )}
                          </div>

                          <div className="cq-card">
                            <div className="cq-card__header">
                              <div className="cq-card__title">Answer Options</div>
                              <span className="cq-card__hint">Select the correct answer using the radio buttons</span>
                            </div>

                            {questionForm.type === 'mcq' ? (
                              <>
                                <div className="cq-options-list">
                                  {questionForm.options.map((opt, idx) => (
                                    <div key={idx} className="cq-option">
                                      <button
                                        type="button"
                                        className={`cq-option__radio${questionForm.correctAnswer === opt.label ? ' is-selected' : ''}`}
                                        onClick={() => setQuestionField('correctAnswer', opt.label)}
                                      />
                                      <input
                                        className="cq-option__input"
                                        value={opt.text}
                                        onChange={e => setQuestionOptionText(idx, e.target.value)}
                                        placeholder={`Option ${opt.label}`}
                                      />
                                      {questionForm.options.length > 2 && (
                                        <button type="button" className="cq-option__remove" onClick={() => removeQuestionOption(idx)}>
                                          <X size={14} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {questionForm.options.length < 8 && (
                                  <button type="button" className="cq-add-choice" onClick={addQuestionOption}>
                                    <Plus size={15} /> Add another choice
                                  </button>
                                )}
                                <label className="cq-label" style={{ marginTop: '1rem' }}>Explanation (optional)</label>
                                <textarea
                                  className="cq-input"
                                  value={questionForm.explanation}
                                  onChange={e => setQuestionField('explanation', e.target.value)}
                                  placeholder="Why is this the correct answer?"
                                  rows={3}
                                />
                              </>
                            ) : (
                              <div className="cq-field">
                                <label className="cq-label">Correct Answer</label>
                                <div className="cq-options-list">
                                  <div className="cq-option">
                                    <button
                                      type="button"
                                      className={`cq-option__radio${questionForm.correctAnswer === 'True' ? ' is-selected' : ''}`}
                                      onClick={() => setQuestionField('correctAnswer', 'True')}
                                    />
                                    <span className="cq-option__text">True</span>
                                  </div>
                                  <div className="cq-option">
                                    <button
                                      type="button"
                                      className={`cq-option__radio${questionForm.correctAnswer === 'False' ? ' is-selected' : ''}`}
                                      onClick={() => setQuestionField('correctAnswer', 'False')}
                                    />
                                    <span className="cq-option__text">False</span>
                                  </div>
                                </div>
                                <label className="cq-label" style={{ marginTop: '1rem' }}>Explanation (optional)</label>
                                <textarea
                                  className="cq-input"
                                  value={questionForm.explanation}
                                  onChange={e => setQuestionField('explanation', e.target.value)}
                                  placeholder="Why is this the correct answer?"
                                  rows={3}
                                />
                              </div>
                            )}
                          </div>

                          {showQuestionPreview && (
                            <div className="cq-card cq-preview">
                              <div className="cq-card__title">Preview</div>
                              <div className="cq-preview__stem">{questionForm.questionText || <em>No prompt entered.</em>}</div>
                              {questionForm.mediaUrl && (
                                <div className="cq-preview__media">
                                  <img src={questionForm.mediaUrl} alt="Question media" />
                                </div>
                              )}
                              {questionForm.type === 'mcq' && (
                                <div className="cq-preview__options">
                                  {questionForm.options.map((opt, i) => (
                                    <div key={i} className={`cq-preview__option${questionForm.correctAnswer === opt.label ? ' is-correct' : ''}`}>
                                      <span className="cq-preview__opt-label">{opt.label}.</span>
                                      <span>{opt.text || <em>Empty</em>}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Metadata Sidebar (Right) */}
                        <aside className="cq-sidebar">
                          <div className="cq-card">
                            <div className="cq-card__title">Metadata</div>

                            <div className="cq-field">
                              <label className="cq-label">Subject/Topic</label>
                              <div className="cq-select-wrap">
                                <select
                                  className="cq-select"
                                  value={questionForm.subject}
                                  onChange={e => setQuestionField('subject', e.target.value)}
                                >
                                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                </select>
                              </div>
                            </div>

                            <div className="cq-field">
                              <label className="cq-label">Difficulty Level</label>
                              <div className="cq-difficulty-row">
                                {DIFFICULTIES.map(d => (
                                  <button
                                    key={d}
                                    type="button"
                                    className={`cq-diff-btn${questionForm.difficulty === d ? ' is-active' : ''}`}
                                    onClick={() => setQuestionField('difficulty', d)}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="cq-field">
                              <label className="cq-label">Points/Weightage</label>
                              <div className="cq-points-row">
                                <input
                                  type="number"
                                  className="cq-points-input"
                                  min={1}
                                  value={questionForm.points}
                                  onChange={e => setQuestionField('points', e.target.value)}
                                />
                                <span className="cq-points-unit">pts</span>
                              </div>
                            </div>

                            <div className="cq-field">
                              <label className="cq-label">Tags</label>
                              <div className="cq-tags-wrap">
                                {questionForm.tags.map(t => (
                                  <span key={t} className="cq-tag">
                                    {t}
                                    <button type="button" className="cq-tag__remove" onClick={() => removeQuestionTag(t)}>×</button>
                                  </span>
                                ))}
                              </div>
                              <div className="cq-tag-input-wrap">
                                <Tag size={14} />
                                <input
                                  className="cq-tag-input"
                                  value={questionForm.tagInput}
                                  onChange={e => setQuestionField('tagInput', e.target.value)}
                                  onKeyDown={addQuestionTag}
                                  placeholder="Add tag..."
                                />
                              </div>
                            </div>
                          </div>
                        </aside>
                      </div>

                      {/* Footer buttons */}
                      <div className="cq-footer">
                        <button type="button" className="cq-footer-cancel" onClick={() => setBankView('questions-list')}>
                          Cancel
                        </button>
                        <div className="cq-footer-right">
                          <button
                            type="button"
                            className="cq-footer-add-another"
                            onClick={() => handleSaveQuestion(true)}
                            disabled={questionSaving}
                          >
                            Save &amp; Add Another
                          </button>
                          <button
                            type="button"
                            className="cq-footer-save"
                            onClick={() => handleSaveQuestion(false)}
                            disabled={questionSaving}
                          >
                            <Save size={15} />
                            {questionSaving ? 'Saving...' : 'Save to Bank'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ────────────────────────────────────────────────────────
                 3. CREATE QUIZ TAB (Redesigned)
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'create-quiz' && (
                <div className="czq-page">
                  <header className="czq-header">
                    <h1 className="czq-title">Create New Quiz</h1>
                  </header>

                  <div className="czq-layout">
                    <div className="czq-main">
                      <div className="czq-card">
                        <div className="czq-section-title">QUIZ INFORMATION</div>
                        <div className="czq-field">
                          <label className="czq-label">Quiz Title</label>
                          <input
                            type="text"
                            className="czq-input"
                            placeholder="e.g. Data Structures & Algorithms Foundations"
                            value={quizCreateForm.title}
                            onChange={e => setQuizCreateForm({ ...quizCreateForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="czq-field">
                          <label className="czq-label">Description</label>
                          <textarea
                            className="czq-textarea"
                            rows={3}
                            placeholder="This assessment covers Linked Lists, Stacks, Queues, and basic Big O notation analysis."
                            value={quizCreateForm.description}
                            onChange={e => setQuizCreateForm({ ...quizCreateForm, description: e.target.value })}
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
                                value={quizCreateForm.timeLimit}
                                onChange={e => setQuizCreateForm({ ...quizCreateForm, timeLimit: parseInt(e.target.value) || 0 })}
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
                                value={quizCreateForm.passPercentage}
                                onChange={e => setQuizCreateForm({ ...quizCreateForm, passPercentage: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="czq-checkbox-group">
                          <label className="czq-checkbox-label">
                            <input
                              type="checkbox"
                              className="czq-checkbox"
                              checked={quizCreateForm.shuffle}
                              onChange={e => setQuizCreateForm({ ...quizCreateForm, shuffle: e.target.checked })}
                            />
                            <span>Shuffle Questions</span>
                          </label>
                          <label className="czq-checkbox-label">
                            <input
                              type="checkbox"
                              className="czq-checkbox"
                              checked={quizCreateForm.showResults}
                              onChange={e => setQuizCreateForm({ ...quizCreateForm, showResults: e.target.checked })}
                            />
                            <span>Show results instantly after submission</span>
                          </label>
                        </div>
                      </div>

                      <div className="czq-card">
                        <div className="czq-card-header">
                          <div className="czq-section-title">SELECT QUESTIONS FROM BANK</div>
                          <div className="czq-card-actions">
                            <div className="czq-bank-select-wrap">
                              <select
                                className="czq-bank-select"
                                value={quizSelectedBankId}
                                onChange={e => handleQuizBankChange(e.target.value)}
                              >
                                <option value="">-- Select Bank --</option>
                                {banks.map(b => (
                                  <option key={b.id} value={b.id}>{b.title} ({b._count?.questions ?? 0})</option>
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
                          </div>
                        </div>

                        {filteredQuizQuestions.length === 0 ? (
                          <div className="czq-empty">No questions found matching your filter query.</div>
                        ) : (
                          <div className="czq-table-wrap">
                            <table className="czq-table">
                              <thead>
                                <tr>
                                  <th style={{ width: '40px' }}>
                                    <input
                                      type="checkbox"
                                      className="czq-checkbox"
                                      checked={filteredQuizQuestions.every(q => quizSelectedIds.includes(q.id))}
                                      onChange={() => toggleAllQuizQuestions(filteredQuizQuestions)}
                                    />
                                  </th>
                                  <th>QUESTION DETAILS</th>
                                  <th style={{ width: '100px', textAlign: 'center' }}>MARKS</th>
                                  <th style={{ width: '120px', textAlign: 'center' }}>DIFFICULTY</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredQuizQuestions.map(q => {
                                  const isChecked = quizSelectedIds.includes(q.id);
                                  return (
                                    <tr
                                      key={q.id}
                                      className={`czq-tr-interactive ${isChecked ? 'is-selected' : ''}`}
                                      onClick={() => toggleQuizQuestion(q.id)}
                                    >
                                      <td onClick={e => e.stopPropagation()}>
                                        <input
                                          type="checkbox"
                                          className="czq-checkbox"
                                          checked={isChecked}
                                          onChange={() => toggleQuizQuestion(q.id)}
                                        />
                                      </td>
                                      <td>
                                        <div className="czq-q-text">{q.questionText}</div>
                                        <span className="czq-category-tag">{q.type === 'mcq' ? 'MCQ' : 'SHORT ANSWER'}</span>
                                      </td>
                                      <td className="text-center font-semibold">{q.points}</td>
                                      <td className="text-center">
                                        <span className="czq-diff-badge czq-diff-badge--easy">Easy</span>
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

                    <aside className="czq-sidebar">
                      <div className="czq-card czq-summary-card">
                        <div className="czq-section-title">ASSESSMENT SUMMARY</div>
                        <div className="czq-summary-row">
                          <span className="czq-summary-label">Selected Questions</span>
                          <span className="czq-summary-value font-bold">{quizSelectedIds.length}</span>
                        </div>
                        <div className="czq-summary-row mt-4">
                          <span className="czq-summary-label">Total Marks</span>
                          <span className="czq-summary-value text-xl font-extrabold" style={{ color: '#4f46e5' }}>{selectedQuizPoints}</span>
                        </div>
                        <div className="czq-estimated-wrap mt-6">
                          <Clock size={18} className="czq-estimated-icon" />
                          <div className="czq-estimated-text">
                            Estimated Completion: <strong>{quizSelectedIds.length * 9} mins</strong>
                          </div>
                        </div>

                        <div className="czq-action-buttons mt-8">
                          <button
                            type="button"
                            className="czq-btn-publish"
                            onClick={() => handleCreateQuizSubmit(true)}
                            disabled={quizSubmitting}
                          >
                            <Check size={16} />
                            <span>{quizSubmitting ? 'Publishing...' : 'Publish Quiz'}</span>
                          </button>
                          <button
                            type="button"
                            className="czq-btn-draft"
                            onClick={() => handleCreateQuizSubmit(false)}
                            disabled={quizSubmitting}
                          >
                            Save as Draft
                          </button>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                 4. ANALYTICS TAB
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'analytics' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h1 className="student-title" style={{ margin: '0 0 4px' }}>Analytics</h1>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>Comprehensive performance breakdown for current cohorts.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Assessment</span>
                      <div className="aq-select-wrap">
                        <select className="aq-select" value={analyticsQuizId} onChange={e => setAnalyticsQuizId(e.target.value)}>
                          {quizzes.length === 0 && <option>No quizzes yet</option>}
                          {quizzes.map(q => <option key={q.id} value={String(q.id)}>{q.title}</option>)}
                        </select>
                        <ChevronDown size={16} className="aq-select-icon" />
                      </div>
                    </div>
                  </div>

                  <div className="aq-stat-grid">
                    {[
                      { label: 'AVERAGE SCORE', value: avgScore != null ? `${avgScore}%` : '–', color: '#4f46e5' },
                      { label: 'COMPLETION RATE', value: completionRate != null ? `${completionRate}%` : '–', sub: `${submitted.length}/${totalStudents || '–'}` },
                      { label: 'TIME LIMIT', value: selectedQuiz?.timeLimit ? `${selectedQuiz.timeLimit}m` : '–', sub: 'per session' },
                      { label: 'DIFFICULTY', value: avgScore == null ? '–' : avgScore >= 80 ? 'Easy' : avgScore >= 55 ? 'Medium' : 'Hard', color: '#b45309' },
                    ].map((s, i) => (
                      <div key={i} className="aq-stat-card">
                        <div className="aq-stat-card__label">{s.label}</div>
                        <div className="aq-stat-card__value" style={s.color ? { color: s.color } : {}}>
                          {s.value}
                          {s.sub && <span className="aq-stat-sub">{s.sub}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {analyticsLoading ? (
                    <div className="student-loading">Loading quiz data...</div>
                  ) : (
                    <>
                      <div className="aq-panel" style={{ marginBottom: '1.5rem' }}>
                        <div className="aq-panel__header"><h2 className="aq-panel__title">Student Performance</h2></div>
                        {analyticsScores.length === 0 ? (
                          <div className="aq-empty">No submissions yet for this quiz.</div>
                        ) : (
                          <div className="aq-table-wrap">
                            <table className="aq-table">
                              <thead><tr><th>STUDENT NAME</th><th>SCORE</th><th>PERCENTAGE</th><th>STATUS</th></tr></thead>
                              <tbody>
                                {analyticsScores.map(s => (
                                  <tr key={s.id}>
                                    <td className="aq-td-name">{s.student.name}</td>
                                    <td>{s.score}/{s.totalPoints}</td>
                                    <td>
                                      <div className="aq-bar-wrap">
                                        <div className="aq-bar">
                                          <div className="aq-bar__fill" style={{ width: `${s.percentage}%`, background: s.percentage >= 70 ? '#16a34a' : s.percentage >= 50 ? '#ca8a04' : '#dc2626' }} />
                                        </div>
                                        <span className="aq-bar__pct">{s.percentage}%</span>
                                      </div>
                                    </td>
                                    <td><span className={`aq-status-badge aq-status-badge--${s.percentage >= 50 ? 'pass' : 'fail'}`}>{s.percentage >= 50 ? 'PASSED' : 'FAILED'}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {analyticsBreakdown.length > 0 && (
                        <div className="aq-panel">
                          <div className="aq-panel__header"><h2 className="aq-panel__title">Question Breakdown</h2></div>
                          <div className="aq-table-wrap">
                            <table className="aq-table">
                              <thead><tr><th>QUESTION TEXT</th><th>% CORRECT</th></tr></thead>
                              <tbody>
                                {analyticsBreakdown.map(q => (
                                  <tr key={q.id}>
                                    <td>
                                      <div className="aq-q-text">{q.questionText.length > 80 ? q.questionText.slice(0, 80) + '…' : q.questionText}</div>
                                      <div className="aq-q-meta">{q.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}</div>
                                    </td>
                                    <td>
                                      {q.correctPercentage != null ? (
                                        <div className="aq-bar-wrap">
                                          <div className="aq-bar">
                                            <div className="aq-bar__fill" style={{ width: `${q.correctPercentage}%`, background: q.correctPercentage >= 70 ? '#16a34a' : q.correctPercentage >= 45 ? '#ca8a04' : '#dc2626' }} />
                                          </div>
                                          <span className="aq-bar__pct">{q.correctPercentage}%</span>
                                        </div>
                                      ) : <span className="aq-td-muted">No data</span>}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                 5. HELP CENTER TAB
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'help' && (
                <div className="student-tab-help">
                  <h1 className="student-title">Help Center</h1>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                    Learn how to use each feature of the Lecturer Dashboard.
                  </p>

                  <div className="help-section-label">FEATURE GUIDE</div>
                  <div className="help-features">
                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#ede9fe', color: '#4f46e5' }}><LayoutDashboard size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Dashboard Overview</h4>
                        <p>The main landing page shows your key metrics at a glance: total quizzes, total students, average score, and active quizzes. The "Recent Assessments" panel lists your latest quizzes with participation progress bars, and the "Platform Overview" card summarizes total submissions across all quizzes.</p>
                      </div>
                    </div>

                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}><BookOpen size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Question Bank Management</h4>
                        <p>Create and organize question banks to reuse across multiple quizzes. Click <strong>"Create New Bank"</strong> to start a new bank. Open a bank to view, add, edit, or delete questions. Each question supports <strong>Multiple Choice (MCQ)</strong> or <strong>True/False</strong> types, with optional explanations, image media, point values, and tags.</p>
                      </div>
                    </div>

                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><Plus size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Creating Questions</h4>
                        <p>Click <strong>"Add Question"</strong> inside a bank to open the question editor. Choose between MCQ (2-8 options) or True/False. For MCQ, type each option and select the correct answer using the radio button. You can add an optional <strong>explanation</strong> that students will see after submitting. Upload images up to 5MB and set point values in the metadata sidebar.</p>
                      </div>
                    </div>

                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}><ClipboardList size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Creating Quizzes</h4>
                        <p>Navigate to <strong>"Create Quiz"</strong> in the sidebar. Enter a title and description, set a time limit (in minutes), and configure options like shuffling questions and showing instant results. Select a question bank from the dropdown, then check the questions you want to include. The sidebar shows a live summary of selected count and total marks. Click <strong>"Publish Quiz"</strong> to make it available to students, or <strong>"Save as Draft"</strong> to edit later.</p>
                      </div>
                    </div>

                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#fce7f3', color: '#db2777' }}><BarChart3 size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Analytics</h4>
                        <p>Select a quiz from the dropdown to view detailed analytics. The stat cards show average score, completion rate, time limit, and difficulty. The <strong>"Student Performance"</strong> table lists each student's score, percentage with a color-coded bar, and pass/fail status. The <strong>"Question Breakdown"</strong> table shows the percentage of students who answered each question correctly, helping you identify weak areas.</p>
                      </div>
                    </div>

                    <div className="help-feature-card">
                      <div className="help-feature-icon" style={{ background: '#f1f5f9', color: '#475569' }}><Settings size={20} /></div>
                      <div className="help-feature-info">
                        <h4>Settings</h4>
                        <p>Access account settings from the sidebar. View your profile details (name, email, role) and change your password by entering your current password and confirming a new one.</p>
                      </div>
                    </div>
                  </div>

                  <div className="help-section-label" style={{ marginTop: '2rem' }}>FREQUENTLY ASKED QUESTIONS</div>
                  <div className="help-grid">
                    <div className="help-faqs">
                      {FAQS.map((item, idx) => (
                        <div key={idx} className="faq-item" style={{ cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 style={{ margin: 0 }}>{item.q}</h4>
                            <ChevronDown size={16} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                          </div>
                          {openFaq === idx && <p style={{ marginTop: 10, marginBottom: 0 }}>{item.a}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="help-contact-card">
                      <h3>Submit a Support Ticket</h3>
                      <p className="help-contact-sub">Having technical issues? Send our support team a ticket message.</p>
                      <form onSubmit={e => {
                        e.preventDefault();
                        alert(`Support ticket submitted!\nSubject: ${supportForm.subject}`);
                        setSupportForm({ subject: '', message: '' });
                      }} className="help-form">
                        <div className="form-group"><label>Subject</label><input type="text" required value={supportForm.subject} onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })} /></div>
                        <div className="form-group"><label>Message</label><textarea rows={3} required value={supportForm.message} onChange={e => setSupportForm({ ...supportForm, message: e.target.value })} /></div>
                        <button type="submit" className="student-start-btn" style={{ width: '100%' }}>Submit Ticket</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                 6. SETTINGS TAB
                 ──────────────────────────────────────────────────────── */}
              {activeTab === 'settings' && (
                <div className="student-tab-settings">
                  <h1 className="student-title">Settings</h1>
                  <div className="student-section-header"><h2>Account Details</h2></div>
                  <div className="settings-grid">
                    <div className="settings-card profile-details-card">
                      <h3>Lecturer Profile</h3>
                      <div className="profile-details-list">
                        <div className="profile-detail-item"><span className="detail-label">Full Name</span><span className="detail-value">{user.name}</span></div>
                        <div className="profile-detail-item"><span className="detail-label">Email Address</span><span className="detail-value">{user.email}</span></div>
                        <div className="profile-detail-item"><span className="detail-label">Account Role</span><span className="detail-value"><span className="role-badge" style={{ background: '#ede9fe', color: '#4f46e5' }}>Lecturer</span></span></div>
                      </div>
                    </div>
                    <div className="settings-card change-password-card">
                      <h3>Change Password</h3>
                      <form onSubmit={e => {
                        e.preventDefault();
                        if (passwordForm.next !== passwordForm.confirm) { alert('Passwords mismatch!'); return; }
                        alert('Password updated!');
                        setPasswordForm({ current: '', next: '', confirm: '' });
                      }} className="help-form">
                        <div className="form-group"><label>Current Password</label><input type="password" required value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} /></div>
                        <div className="form-group"><label>New Password</label><input type="password" required value={passwordForm.next} onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })} /></div>
                        <div className="form-group"><label>Confirm Password</label><input type="password" required value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} /></div>
                        <button type="submit" className="student-start-btn" style={{ width: '100%' }}>Save Changes</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="student-footer">
          <span className="student-footer__copy">© 2026 SmartQuiz Assessment Platform. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}
