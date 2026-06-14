import { useAuth } from '../context/AuthContext';

export default function LecturerDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <span className="role-badge lecturer">Lecturer</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Quizzes</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Active Sessions</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Avg Score</h3>
            <p className="stat-value">--</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Analytics Overview</h2>
        <div className="chart-placeholder">
          <div className="chart-bars">
            <div className="bar" style={{ height: '70%' }}><span>Mon</span></div>
            <div className="bar" style={{ height: '45%' }}><span>Tue</span></div>
            <div className="bar" style={{ height: '90%' }}><span>Wed</span></div>
            <div className="bar" style={{ height: '55%' }}><span>Thu</span></div>
            <div className="bar" style={{ height: '80%' }}><span>Fri</span></div>
            <div className="bar" style={{ height: '30%' }}><span>Sat</span></div>
            <div className="bar" style={{ height: '60%' }}><span>Sun</span></div>
          </div>
          <p className="chart-label">Weekly Quiz Activity</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">➕</span>
            <span>Create Quiz</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">📋</span>
            <span>View All Quizzes</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">👨‍🎓</span>
            <span>Manage Students</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">📈</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-placeholder">
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
}
