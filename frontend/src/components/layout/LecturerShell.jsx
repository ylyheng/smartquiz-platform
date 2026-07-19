import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  LogOut,
  Plus,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LecturerShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="lecturer-dashboard">
      <aside className="lecturer-dashboard__sidebar">
        <div>
          <div className="lecturer-brand">
            <div className="lecturer-brand__name">SmartQuiz</div>
            <div className="lecturer-brand__mode">Architect Mode</div>
          </div>

          <nav className="lecturer-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <BarChart3 size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/banks" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <BookOpen size={17} />
              <span>Question Bank</span>
            </NavLink>
            <NavLink to="/quizzes" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <ClipboardList size={17} />
              <span>Quizzes</span>
            </NavLink>
            <NavLink to="/quizzes/create" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <Plus size={17} />
              <span>Create Quiz</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <FileText size={17} />
              <span>Analytics</span>
            </NavLink>
          </nav>
        </div>

        <div className="lecturer-profile-card">
          <div className="lecturer-profile-card__avatar">{user?.name?.charAt(0)?.toUpperCase() || 'L'}</div>
          <div>
            <div className="lecturer-profile-card__name">{user?.name || 'Lecturer'}</div>
            <div className="lecturer-profile-card__role">Computer Science Dept.</div>
          </div>
        </div>

        <div className="lecturer-sidebar__footer">
          <button type="button" className="lecturer-sidebar__utility lecturer-sidebar__utility--button">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="lecturer-sidebar__utility lecturer-sidebar__utility--button" type="button" onClick={logout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <section className="lecturer-dashboard__main">
        {children}
      </section>
    </div>
  );
}
