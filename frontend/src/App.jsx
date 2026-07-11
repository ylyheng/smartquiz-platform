import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuestionBankPage from './pages/QuestionBankPage';
import QuestionListPage from './pages/QuestionListPage';
import QuizCreatePage from './pages/QuizCreatePage';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__logo">SmartQuiz</NavLink>

        <nav className="site-header__nav">
          {user ? (
            /* ── Authenticated nav ── */
            <>
              <NavLink to="/dashboard" className={({ isActive }) => 'site-nav__link' + (isActive ? ' site-nav__link--active' : '')}>
                Dashboard
              </NavLink>
              {user.role === 'lecturer' && (
                <>
                  <NavLink to="/banks" className={({ isActive }) => 'site-nav__link' + (isActive ? ' site-nav__link--active' : '')}>
                    Question Banks
                  </NavLink>
                  <NavLink to="/quizzes" className={({ isActive }) => 'site-nav__link' + (isActive ? ' site-nav__link--active' : '')}>
                    Quizzes
                  </NavLink>
                  <NavLink to="/analytics" className={({ isActive }) => 'site-nav__link' + (isActive ? ' site-nav__link--active' : '')}>
                    Analytics
                  </NavLink>
                </>
              )}
              <div className="site-header__avatar">{user.name.charAt(0).toUpperCase()}</div>
              <button className="site-header__logout" onClick={logout}>Logout</button>
            </>
          ) : (
            /* ── Public nav (matches design) ── */
            <>
              <NavLink to="/" end className={({ isActive }) => 'site-nav__link' + (isActive ? ' site-nav__link--active' : '')}>
                Home
              </NavLink>
              <span className="site-nav__link">Features</span>
              <span className="site-nav__link">Enterprise</span>
              <button className="site-header__help" aria-label="Help">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return (
    <footer className="site-footer">
      <span className="site-footer__brand">SmartQuiz &nbsp;
        <span className="site-footer__copy">© 2026 SmartQuiz Systems Inc.</span>
      </span>
      <div className="site-footer__links">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Support</span>
      </div>
    </footer>
  );
}

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <>
      <Navbar />
      <main className={isHome ? 'main--home' : 'main--inner'}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/banks" element={<ProtectedRoute roles={['lecturer']}><QuestionBankPage /></ProtectedRoute>} />
            <Route path="/banks/:bankId" element={<ProtectedRoute roles={['lecturer']}><QuestionListPage /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><div>Quiz list coming soon</div></ProtectedRoute>} />
            <Route path="/quizzes/create" element={<ProtectedRoute roles={['lecturer']}><QuizCreatePage /></ProtectedRoute>} />
            <Route path="/take-quiz/:quizId" element={<ProtectedRoute roles={['student']}><TakeQuizPage /></ProtectedRoute>} />
            <Route path="/results/:attemptId" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute roles={['lecturer']}><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/analytics/quiz/:quizId" element={<ProtectedRoute roles={['lecturer']}><AnalyticsPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
