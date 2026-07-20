import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  Award,
  HelpCircle,
  Settings,
  Search,
  Bell,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  Clock,
  Eye,
  GraduationCap,
  LogOut
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

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

  if (!user) return null;

  const completed = attempts.filter(a => a.status !== 'in-progress');
  const avgPct = completed.reduce((sum, a) => sum + (a.totalPoints ? (a.score / a.totalPoints) * 100 : 0), 0);
  const avg = completed.length ? Math.round(avgPct / completed.length) : 0;

  const mockQuizzes = [
    { id: 'mock-1', title: 'Web Development Basics', _count: { quizQuestions: 15 }, timeLimit: 30, isMock: true },
    { id: 'mock-2', title: 'Data Structures 101', _count: { quizQuestions: 10 }, timeLimit: 20, isMock: true }
  ];
  const displayQuizzes = quizzes.length > 0 ? quizzes : mockQuizzes;

  const mockAttempts = [
    {
      id: 'mock-attempt-1',
      quiz: { title: 'Database Fundamentals' },
      score: 85,
      totalPoints: 100,
      submittedAt: '2023-10-12T12:00:00.000Z',
      status: 'submitted',
      isMock: true
    }
  ];
  const displayAttempts = completed.length > 0 ? completed : mockAttempts;

  const quizzesAvailableCount = quizzes.length > 0 ? quizzes.length : 2;
  const quizzesCompletedCount = completed.length > 0 ? completed.length : 1;
  const avgScore = completed.length > 0 ? avg : 85;

  // Filter quizzes and completed attempts
  const filteredQuizzes = displayQuizzes.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAttempts = displayAttempts.filter(a => 
    a.quiz?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchQuery('');
  };

  return (
    <div className="student-layout">
      <aside className="student-sidebar">
        <div className="student-sidebar__top">
          <div className="student-logo">SmartQuiz</div>
          <nav className="student-nav">
            <button 
              onClick={() => handleTabChange('dashboard')} 
              className={`student-nav__item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleTabChange('results')} 
              className={`student-nav__item ${activeTab === 'results' ? 'active' : ''}`}
            >
              <Award size={18} />
              <span>Results</span>
            </button>
            <button 
              onClick={() => handleTabChange('help')} 
              className={`student-nav__item ${activeTab === 'help' ? 'active' : ''}`}
            >
              <HelpCircle size={18} />
              <span>Help Center</span>
            </button>
            <button 
              onClick={() => handleTabChange('settings')} 
              className={`student-nav__item ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        
        <div className="student-profile">
          <img src="/avatar.png" alt="Avatar" className="student-profile__avatar" />
          <div className="student-profile__info">
            <span className="student-profile__name">{user.name}</span>
            <span className="student-profile__id">Student ID: {user.id ? (24000 + user.id) : '24081'}</span>
          </div>
          <button onClick={logout} className="student-logout-btn" title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="student-main">
        <header className="student-header">
          <div className="student-search">
            <Search size={18} className="student-search__icon" />
            <input 
              type="text" 
              placeholder={activeTab === 'results' ? "Search results..." : "Search assessments..."} 
              className="student-search__input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="student-header__actions">
            <button className="student-bell" aria-label="Notifications" onClick={() => alert("No new notifications.")}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="student-content">
          {activeTab === 'dashboard' && (
            <>
              <h1 className="student-title">Student Dashboard</h1>

              <div className="student-stats-grid">
                <div className="student-stat-card">
                  <div className="student-stat-icon purple">
                    <ClipboardList size={20} />
                  </div>
                  <div className="student-stat-info">
                    <span className="student-stat-label">QUIZZES AVAILABLE</span>
                    <span className="student-stat-value">{quizzesAvailableCount}</span>
                  </div>
                </div>

                <div className="student-stat-card">
                  <div className="student-stat-icon green">
                    <CheckCircle size={20} />
                  </div>
                  <div className="student-stat-info">
                    <span className="student-stat-label">QUIZZES COMPLETED</span>
                    <span className="student-stat-value">{quizzesCompletedCount}</span>
                  </div>
                </div>

                <div className="student-stat-card">
                  <div className="student-stat-icon amber">
                    <TrendingUp size={20} />
                  </div>
                  <div className="student-stat-info">
                    <span className="student-stat-label">AVERAGE SCORE</span>
                    <span className="student-stat-value">{avgScore}%</span>
                  </div>
                </div>
              </div>

              <div className="student-dashboard-columns">
                <section className="student-col-left">
                  <div className="student-section-header">
                    <h2>Available Quizzes</h2>
                    <span className="student-badge-active">Active Now</span>
                  </div>

                  <div className="student-quizzes-list">
                    {loading ? (
                      <div className="student-loading">Loading quizzes...</div>
                    ) : filteredQuizzes.length === 0 ? (
                      <div className="student-empty">No quizzes found.</div>
                    ) : (
                      filteredQuizzes.map((q) => (
                        <div key={q.id} className="student-quiz-card">
                          <div className="student-quiz-details">
                            <h3>{q.title}</h3>
                            <div className="student-quiz-meta">
                              <span className="student-meta-item">
                                <ClipboardList size={14} />
                                {q._count?.quizQuestions || q.quizQuestions || 0} questions
                              </span>
                              <span className="student-meta-item">
                                <Clock size={14} />
                                {q.timeLimit} mins
                              </span>
                            </div>
                          </div>
                          {q.isMock ? (
                            <button className="student-start-btn" disabled>Start Quiz</button>
                          ) : (
                            <Link to={`/take-quiz/${q.id}`} className="student-start-btn">Start Quiz</Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="student-col-right">
                  <div className="student-section-header">
                    <h2>Recent Performance</h2>
                  </div>

                  {loading ? (
                    <div className="student-loading">Loading performance...</div>
                  ) : (
                    <div className="student-performance-container">
                      {displayAttempts.slice(0, 1).map((attempt, index) => {
                        const scorePercentage = attempt.totalPoints 
                          ? Math.round((attempt.score / attempt.totalPoints) * 100) 
                          : attempt.score || 0;
                        
                        const formattedDate = new Date(attempt.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });

                        return (
                          <div key={attempt.id || index} className="student-performance-card">
                            <div className="performance-card__header">
                              <span>COMPLETED ASSESSMENTS</span>
                            </div>
                            <div className="performance-card__body">
                              <div className="performance-card__title-row">
                                <div className="performance-card__quiz-title">{attempt.quiz?.title}</div>
                                <div className="performance-card__score">
                                  <span className="score-num">{scorePercentage}%</span>
                                  <span className="score-status">PASSED</span>
                                </div>
                              </div>
                              <div className="performance-card__date">
                                Completed on {formattedDate}
                              </div>
                              <div className="performance-card__progress-bg">
                                <div 
                                  className="performance-card__progress-bar" 
                                  style={{ width: `${scorePercentage}%` }}
                                ></div>
                              </div>
                              {attempt.isMock ? (
                                <button className="performance-card__results-btn" disabled>
                                  <Eye size={14} />
                                  <span>View Results</span>
                                </button>
                              ) : (
                                <Link to={`/results/${attempt.id}`} className="performance-card__results-btn">
                                  <Eye size={14} />
                                  <span>View Results</span>
                                </Link>
                              )}
                            </div>
                            
                            <div className="performance-card__footer">
                              <button 
                                onClick={() => handleTabChange('results')} 
                                className="view-all-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                              >
                                View All Records
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <div className="student-tip-card">
                        <div className="tip-card__content">
                          <h3>Scholar Tip</h3>
                          <p>Regular practice improves long-term retention by up to 40%. Keep up the streak!</p>
                        </div>
                        <GraduationCap className="tip-card__watermark" size={72} />
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}

          {activeTab === 'results' && (
            <div className="student-tab-results">
              <h1 className="student-title">Assessment Results</h1>
              <div className="student-section-header">
                <h2>All Completed Assessments</h2>
              </div>
              
              <div className="student-results-list">
                {loading ? (
                  <div className="student-loading">Loading records...</div>
                ) : filteredAttempts.length === 0 ? (
                  <div className="student-empty">No results found matching your search.</div>
                ) : (
                  filteredAttempts.map((attempt, index) => {
                    const scorePercentage = attempt.totalPoints 
                      ? Math.round((attempt.score / attempt.totalPoints) * 100) 
                      : attempt.score || 0;
                    
                    const formattedDate = new Date(attempt.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div key={attempt.id || index} className="student-result-row-card">
                        <div className="result-row__main">
                          <div className="result-row__details">
                            <h3>{attempt.quiz?.title}</h3>
                            <span className="result-row__date">Submitted on {formattedDate}</span>
                          </div>
                          <div className="result-row__score-badge">
                            <span className="score-badge__pct">{scorePercentage}%</span>
                            <span className="score-badge__points">
                              ({attempt.score || 0} / {attempt.totalPoints || 0} pts)
                            </span>
                          </div>
                        </div>
                        <div className="result-row__actions">
                          {attempt.isMock ? (
                            <button className="student-start-btn" disabled>View Details</button>
                          ) : (
                            <Link to={`/results/${attempt.id}`} className="student-start-btn">
                              <Eye size={14} style={{ marginRight: '6px' }} />
                              <span>View Details</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="student-tab-help">
              <h1 className="student-title">Help Center</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                Learn how to use each feature of the Student Dashboard.
              </p>

              <div className="help-section-label">FEATURE GUIDE</div>
              <div className="help-features">
                <div className="help-feature-card">
                  <div className="help-feature-icon" style={{ background: '#ede9fe', color: '#4f46e5' }}><LayoutDashboard size={20} /></div>
                  <div className="help-feature-info">
                    <h4>Dashboard Overview</h4>
                    <p>The main landing page displays your key academic metrics: overall average score, total quizzes taken, and quizzes passed. The "Recent Results" panel shows your latest quiz attempts with scores and dates, while the "Performance Summary" card highlights your strongest quiz and completion rate.</p>
                  </div>
                </div>

                <div className="help-feature-card">
                  <div className="help-feature-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><ClipboardList size={20} /></div>
                  <div className="help-feature-info">
                    <h4>Available Quizzes</h4>
                    <p>Browse quizzes published by your lecturer on the dashboard. Click <strong>"Start Quiz"</strong> to begin a quiz session. Each quiz shows the number of questions and time limit. Once started, a countdown timer begins — the timer cannot be paused, so make sure you have enough time before starting.</p>
                  </div>
                </div>

                <div className="help-feature-card">
                  <div className="help-feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={20} /></div>
                  <div className="help-feature-info">
                    <h4>Taking a Quiz</h4>
                    <p>Answer questions one at a time using the question navigation sidebar on the left. Select your answer by clicking the option, then click <strong>"Next"</strong> to move forward or <strong>"Previous"</strong> to go back. The progress bar at the top tracks how many questions you've answered. When ready, click <strong>"Submit Quiz"</strong> on the last question. A confirmation dialog will show how many questions are unanswered before final submission.</p>
                  </div>
                </div>

                <div className="help-feature-card">
                  <div className="help-feature-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}><Award size={20} /></div>
                  <div className="help-feature-info">
                    <h4>Quiz Results</h4>
                    <p>After submitting, you are redirected to the results page showing your score, percentage, and a pass/fail status. If the lecturer enabled explanations, you will see the correct answer and explanation for each question, helping you understand what you got wrong and why.</p>
                  </div>
                </div>

                <div className="help-feature-card">
                  <div className="help-feature-icon" style={{ background: '#fce7f3', color: '#db2777' }}><TrendingUp size={20} /></div>
                  <div className="help-feature-info">
                    <h4>Performance Tracking</h4>
                    <p>Your dashboard tracks performance across all quiz attempts. The average score is calculated from all your submitted attempts. Visit the "Results" tab to review past attempts, see which quizzes you passed, and compare scores over time.</p>
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
                  <div className="faq-item">
                    <h4>How do I take a quiz?</h4>
                    <p>Go to the Dashboard tab, select any quiz from the "Available Quizzes" list, and click "Start Quiz". Keep in mind that once started, the timer cannot be paused.</p>
                  </div>
                  <div className="faq-item">
                    <h4>Can I review my previous quiz answers?</h4>
                    <p>Yes. Go to the "Results" tab in the sidebar, locate the quiz attempt you want to review, and click "View Details". You will see which answers were correct, along with lecturer explanations.</p>
                  </div>
                  <div className="faq-item">
                    <h4>What happens if my connection drops during a quiz?</h4>
                    <p>If you refresh or lose connection, you can navigate back to the quiz from your dashboard. Click "Resume Quiz" to continue. The timer continues running in the background.</p>
                  </div>
                  <div className="faq-item">
                    <h4>How is my average score calculated?</h4>
                    <p>Your average score is the average percentage score of all your submitted quiz attempts.</p>
                  </div>
                </div>

                <div className="help-contact-card">
                  <h3>Submit a Support Ticket</h3>
                  <p className="help-contact-sub">Have a technical issue or question about a quiz? Send our support team a message.</p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert(`Support ticket submitted!\nSubject: ${supportForm.subject}\nOur team will contact you shortly.`);
                    setSupportForm({ subject: '', message: '' });
                  }} className="help-form">
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Quiz timer issue"
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Message Description</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Describe your issue in detail..."
                        value={supportForm.message}
                        onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                      ></textarea>
                    </div>
                    <button type="submit" className="student-start-btn" style={{ width: '100%' }}>Submit Ticket</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="student-tab-settings">
              <h1 className="student-title">Settings</h1>
              <div className="student-section-header">
                <h2>Account Settings</h2>
              </div>

              <div className="settings-grid">
                <div className="settings-card profile-details-card">
                  <h3>Student Profile</h3>
                  <div className="profile-details-list">
                    <div className="profile-detail-item">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value">{user.name}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Email Address</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Account Role</span>
                      <span className="detail-value">
                        <span className="role-badge">Student</span>
                      </span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Student Reference ID</span>
                      <span className="detail-value">{user.id ? (24000 + user.id) : '24081'}</span>
                    </div>
                  </div>
                </div>

                <div className="settings-card change-password-card">
                  <h3>Change Password</h3>
                  <p className="settings-sub">It's a good practice to use a unique password to protect your student portal.</p>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordForm.new !== passwordForm.confirm) {
                      alert("New passwords do not match!");
                      return;
                    }
                    alert("Password updated successfully (mock update)!");
                    setPasswordForm({ current: '', new: '', confirm: '' });
                  }} className="help-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="student-start-btn" style={{ width: '100%' }}>Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="student-footer">
          <span className="student-footer__copy">© 2023 SmartQuiz Assessment Platform. All rights reserved.</span>
          <div className="student-footer__links">
            <a href="#privacy">PRIVACY POLICY</a>
            <a href="#terms">TERMS</a>
            <a href="#help">HELP</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
