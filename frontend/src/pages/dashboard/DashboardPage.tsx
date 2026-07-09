import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSchedules } from '../../store/slices/scheduleSlice';
import { scheduleApi, userApi, masterDataApi } from '../../api/endpoints';
import '../../styles/pages/dashboard.css';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [recentSchedules, setRecentSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user stats
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        const statsResponse = await userApi.getUserStats();
        setStats(statsResponse.data.data);
      }

      // Load recent schedules
      const schedulesResponse = await scheduleApi.getAllSchedules(1, 5);
      setRecentSchedules(schedulesResponse.data.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Selamat datang, {user?.name}!</p>
      </div>

      {/* Stats Section */}
      {stats && (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <p className="stat-value">{stats.admin}</p>
          </div>
          <div className="stat-card">
            <h3>Teachers</h3>
            <p className="stat-value">{stats.teacher}</p>
          </div>
          <div className="stat-card">
            <h3>Viewers</h3>
            <p className="stat-value">{stats.student}</p>
          </div>
        </div>
      )}

      {/* Recent Schedules */}
      <div className="recent-schedules">
        <h2>Recent Schedules</h2>
        {recentSchedules.length > 0 ? (
          <table className="schedules-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Quality</th>
                <th>Conflicts</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>
                    <span className={`status-badge ${schedule.status.toLowerCase()}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td>{schedule.quality}%</td>
                  <td>{schedule.conflictCount}</td>
                  <td>{new Date(schedule.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No schedules found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
