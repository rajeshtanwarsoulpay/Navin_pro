import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Counts {
  notes: number; exams: number; courses: number; blog_posts: number;
  results: number; gallery_items: number; testimonials: number;
  contact_submissions: number; newsletter_subscriptions: number;
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({
    notes: 0, exams: 0, courses: 0, blog_posts: 0,
    results: 0, gallery_items: 0, testimonials: 0,
    contact_submissions: 0, newsletter_subscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tables: (keyof Counts)[] = ['notes','exams','courses','blog_posts','results','gallery_items','testimonials','contact_submissions','newsletter_subscriptions'];
    Promise.all(tables.map(t => supabase.from(t).select('id', { count: 'exact', head: true }).then(({ count }) => [t, count || 0])))
      .then(results => {
        const c = {} as Counts;
        results.forEach(([k, v]) => { c[k as keyof Counts] = v as number; });
        setCounts(c);
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: 'Notes', count: counts.notes, icon: 'fas fa-book', color: '#0D6EFD', path: '/admin/notes' },
    { label: 'Exams', count: counts.exams, icon: 'fas fa-calendar-alt', color: '#FF9933', path: '/admin/exams' },
    { label: 'Courses', count: counts.courses, icon: 'fas fa-graduation-cap', color: '#138808', path: '/admin/courses' },
    { label: 'Blog Posts', count: counts.blog_posts, icon: 'fas fa-newspaper', color: '#dc3545', path: '/admin/blog' },
    { label: 'Results', count: counts.results, icon: 'fas fa-trophy', color: '#6f42c1', path: '/admin/results' },
    { label: 'Gallery', count: counts.gallery_items, icon: 'fas fa-images', color: '#0dcaf0', path: '/admin/gallery' },
    { label: 'Testimonials', count: counts.testimonials, icon: 'fas fa-quote-left', color: '#d63384', path: '/admin/testimonials' },
    { label: 'Messages', count: counts.contact_submissions, icon: 'fas fa-envelope', color: '#6610f2', path: '#' },
    { label: 'Subscribers', count: counts.newsletter_subscriptions, icon: 'fas fa-bell', color: '#198754', path: '#' },
  ];

  return (
    <div>
      <div className="admin-header">
        <h2>Dashboard</h2>
      </div>
      {loading ? <div className="loading-spinner"></div> : (
        <div className="row g-3">
          {cards.map(card => (
            <div className="col-lg-4 col-md-6 col-sm-6 col-6" key={card.label}>
              <Link to={card.path} style={{ textDecoration: 'none' }}>
                <div className="stat-card-sm">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-sm" style={{ background: card.color }}><i className={card.icon}></i></div>
                    <div>
                      <div className="stat-value">{card.count}</div>
                      <div className="stat-label-sm">{card.label}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
