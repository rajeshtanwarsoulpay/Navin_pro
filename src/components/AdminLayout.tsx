import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { path: '/admin/exams', label: 'Exams', icon: 'fas fa-calendar-alt' },
  { path: '/admin/notes', label: 'Notes', icon: 'fas fa-book' },
  { path: '/admin/courses', label: 'Courses', icon: 'fas fa-graduation-cap' },
  { path: '/admin/blog', label: 'Blog', icon: 'fas fa-newspaper' },
  { path: '/admin/results', label: 'Results', icon: 'fas fa-trophy' },
  { path: '/admin/gallery', label: 'Gallery', icon: 'fas fa-images' },
  { path: '/admin/testimonials', label: 'Testimonials', icon: 'fas fa-quote-left' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <div className="admin-logo">
              Haryana<i className="fas fa-graduation-cap"></i>Coach<span>Pro</span>
            </div>
            <div className="admin-logo-sub">Admin Panel</div>
          </Link>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item" target="_blank">
            <i className="fas fa-external-link-alt"></i>
            <span>View Site</span>
          </Link>
          <button className="admin-nav-item" onClick={signOut}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="admin-topbar-title">
            {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
          </div>
          <div className="admin-topbar-user">
            <i className="fas fa-user-circle me-1"></i>
            <span style={{ fontSize: '0.85rem' }}>{user?.email}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
