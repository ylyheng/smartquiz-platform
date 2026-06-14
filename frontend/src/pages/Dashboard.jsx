import { useAuth } from '../context/AuthContext';
import LecturerDashboard from './LecturerDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'lecturer' ? <LecturerDashboard /> : <StudentDashboard />;
}
