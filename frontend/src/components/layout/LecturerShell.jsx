import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  HelpCircle,
  LogOut,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LecturerShell({ children }) {
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully (mock)!');
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

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
            <NavLink to="/help" className={({ isActive }) => `lecturer-nav__item${isActive ? ' is-active' : ''}`}>
              <HelpCircle size={17} />
              <span>Help Center</span>
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
          <button type="button" className="lecturer-sidebar__utility lecturer-sidebar__utility--button" onClick={() => setShowSettings(true)}>
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

      {/* Settings Side Panel */}
      {showSettings && (
        <div className="lecturer-settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="lecturer-settings-panel" onClick={e => e.stopPropagation()}>
            <div className="lecturer-settings-panel__header">
              <h2>Account Settings</h2>
              <button className="lecturer-settings-close" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="lecturer-settings-panel__body">
              {/* Profile Info */}
              <section className="lecturer-settings-section">
                <h3>Profile</h3>
                <div className="lecturer-settings-profile">
                  <div className="lecturer-settings-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'L'}</div>
                  <div>
                    <div className="lecturer-settings-profile__name">{user?.name}</div>
                    <div className="lecturer-settings-profile__role">Lecturer · Computer Science Dept.</div>
                  </div>
                </div>
                <div className="lecturer-settings-detail-list">
                  <div className="lecturer-settings-detail">
                    <span className="lecturer-settings-detail__label">Full Name</span>
                    <span className="lecturer-settings-detail__value">{user?.name}</span>
                  </div>
                  <div className="lecturer-settings-detail">
                    <span className="lecturer-settings-detail__label">Email Address</span>
                    <span className="lecturer-settings-detail__value">{user?.email}</span>
                  </div>
                  <div className="lecturer-settings-detail">
                    <span className="lecturer-settings-detail__label">Role</span>
                    <span className="lecturer-settings-detail__value">
                      <span className="lecturer-role-badge">Lecturer</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* Password Change */}
              <section className="lecturer-settings-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="lecturer-settings-form">
                  <div className="lecturer-form-group">
                    <label>Current Password</label>
                    <input type="password" required value={passwordForm.current}
                      onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} />
                  </div>
                  <div className="lecturer-form-group">
                    <label>New Password</label>
                    <input type="password" required value={passwordForm.next}
                      onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })} />
                  </div>
                  <div className="lecturer-form-group">
                    <label>Confirm New Password</label>
                    <input type="password" required value={passwordForm.confirm}
                      onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
                  </div>
                  <button type="submit" className="lecturer-settings-save-btn">Save Changes</button>
                </form>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
