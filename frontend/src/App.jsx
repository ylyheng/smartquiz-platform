import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
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

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <NavLink to="/" className="nav-logo">SmartQuiz</NavLink>
      {user && (
        <div className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {user.role === 'lecturer' && (
            <>
              <NavLink to="/banks">Question Banks</NavLink>
              <NavLink to="/quizzes">Quizzes</NavLink>
              <NavLink to="/analytics">Analytics</NavLink>
            </>
          )}
        </div>
      )}
      <div className="nav-right">
        {user ? (
          <>
            <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <button className="nav-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>&copy; 2026 SmartQuiz Platform</span>
        <div className="footer-links">
          <span>About</span>
          <span>Privacy</span>
          <span>Contact</span>
        </div>
      </footer>
    </>
  );
}

import ProtectedRoute from './components/ProtectedRoute';

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
