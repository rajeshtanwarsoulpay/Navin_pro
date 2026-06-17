import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/notes', label: 'Study Notes' },
  { path: '/courses', label: 'Courses' },
  { path: '/results', label: 'Results' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          Haryana<i className="fas fa-graduation-cap"></i>Coach<span>Pro</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-primary`}></i>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link className={`nav-link nav-link-custom ${location.pathname === item.path ? 'active' : ''}`} to={item.path}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
