import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/sidebar.css';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/schedules', label: 'Schedules', icon: '📅', roles: ['ADMIN', 'SUPER_ADMIN', 'GURU'] },
    { path: '/users', label: 'Users', icon: '👥', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { path: '/master-data', label: 'Master Data', icon: '⚙️', roles: ['SUPER_ADMIN', 'ADMIN'] },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const filteredMenuItems = menuItems.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>JPO</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item.path) ? 'active' : ''}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
