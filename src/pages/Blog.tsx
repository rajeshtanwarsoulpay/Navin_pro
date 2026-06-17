import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image_url: string;
  excerpt: string;
}

const categories = ['All', 'Exam Updates', 'Admit Cards', 'Results', 'Current Affairs'];
const catStyles: Record<string, { bg: string; color: string }> = {
  'Exam Updates': { bg: 'rgba(13,110,253,0.1)', color: '#0D6EFD' },
  'Admit Cards': { bg: 'rgba(255,153,51,0.1)', color: '#FF9933' },
  'Results': { bg: 'rgba(25,135,84,0.1)', color: '#198754' },
  'Current Affairs': { bg: 'rgba(220,53,69,0.1)', color: '#dc3545' },
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('id,slug,title,category,date,image_url,excerpt').eq('is_active', true).order('date', { ascending: false }).then(({ data }) => {
      if (data) setBlogData(data);
      setLoading(false);
    });
  }, []);

  const filtered = blogData.filter(post => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <PageHeader title="Blog & Exam Updates" subtitle="Stay updated with latest exam notifications, admit cards, results, and current affairs" breadcrumb={[{ label: 'Blog' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div className="search-box"><i className="fas fa-search"></i><input type="text" placeholder="Search blog posts..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          </div>
          <div className="notes-filter mb-4">
            {categories.map(cat => (
              <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          {loading ? <div className="loading-spinner"></div> : (
          <div className="row g-4">
            {filtered.length === 0 ? (
              <div className="col-12 text-center py-5"><i className="fas fa-newspaper text-muted" style={{ fontSize: '3rem' }}></i><h5 className="mt-3 fw-bold" style={{ color: 'var(--gray-900)' }}>No posts found</h5><p className="text-muted">Try adjusting your search or filter</p></div>
            ) : (
              filtered.map((post) => (
                <div className="col-lg-4 col-md-6 fade-in" key={post.id}>
                  <div className="blog-card">
                    <img src={post.image_url} alt={post.title} className="blog-card-image" />
                    <div className="blog-card-body">
                      <span className="blog-category" style={{ background: catStyles[post.category]?.bg || 'rgba(13,110,253,0.1)', color: catStyles[post.category]?.color || '#0D6EFD' }}>{post.category}</span>
                      <h5 className="blog-card-title">{post.title}</h5>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-card-footer">
                        <span><i className="fas fa-calendar-alt me-1"></i>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <Link to={`/blog/${post.slug}`} className="blog-read-more">Read More <i className="fas fa-arrow-right"></i></Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
