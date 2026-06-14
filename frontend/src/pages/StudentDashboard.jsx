import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <span className="role-badge student">Student</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Available Quizzes</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Average Grade</h3>
            <p className="stat-value">--</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>Best Score</h3>
            <p className="stat-value">--</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Performance Overview</h2>
        <div className="chart-placeholder">
          <div className="chart-bars">
            <div className="bar" style={{ height: '75%' }}><span>Quiz 1</span></div>
            <div className="bar" style={{ height: '60%' }}><span>Quiz 2</span></div>
            <div className="bar" style={{ height: '85%' }}><span>Quiz 3</span></div>
            <div className="bar" style={{ height: '50%' }}><span>Quiz 4</span></div>
            <div className="bar" style={{ height: '70%' }}><span>Quiz 5</span></div>
          </div>
          <p className="chart-label">Recent Quiz Scores (%)</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">📝</span>
            <span>Browse Quizzes</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">📋</span>
            <span>My Submissions</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">📊</span>
            <span>View Grades</span>
          </button>
          <button className="action-card" onClick={() => {}}>
            <span className="action-icon">⏳</span>
            <span>Pending Quizzes</span>
          </button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Submissions</h2>
        <div className="activity-placeholder">
          <p>No submissions yet. Start a quiz to see your results here.</p>
        </div>
      </div>
    </div>
  );
}
