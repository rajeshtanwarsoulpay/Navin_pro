import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image_url: string;
  content: string;
}

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  image_url: string;
}

const catStyles: Record<string, { bg: string; color: string }> = {
  'Exam Updates': { bg: 'rgba(13,110,253,0.1)', color: '#0D6EFD' },
  'Admit Cards': { bg: 'rgba(255,153,51,0.1)', color: '#FF9933' },
  'Results': { bg: 'rgba(25,135,84,0.1)', color: '#198754' },
  'Current Affairs': { bg: 'rgba(220,53,69,0.1)', color: '#dc3545' },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('is_active', true).maybeSingle().then(({ data }) => {
      if (data) {
        setPost(data as BlogPostData);
        supabase.from('blog_posts').select('id,slug,title,date,image_url').neq('id', data.id).eq('is_active', true).order('date', { ascending: false }).limit(2).then(({ data: rel }) => {
          if (rel) setRelated(rel as RelatedPost[]);
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="loading-spinner" style={{ marginTop: 120 }}></div>;

  if (!post) {
    return (
      <div className="page-header"><div className="container"><h1 className="page-header-title">Post Not Found</h1><Link to="/blog" className="btn-hero btn-hero-outline mt-3"><i className="fas fa-arrow-left"></i> Back to Blog</Link></div></div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="blog-category" style={{ background: catStyles[post.category]?.bg || 'rgba(13,110,253,0.1)', color: catStyles[post.category]?.color || '#0D6EFD' }}>{post.category}</span>
          <h1 className="page-header-title" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{post.title}</h1>
          <p className="page-header-subtitle"><i className="fas fa-calendar-alt me-1"></i>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <nav className="breadcrumb-custom"><ol className="breadcrumb mb-0"><li className="breadcrumb-item"><Link to="/">Home</Link></li><li className="breadcrumb-item"><Link to="/blog">Blog</Link></li><li className="breadcrumb-item active">{post.title}</li></ol></nav>
        </div>
      </div>
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <img src={post.image_url} alt={post.title} className="w-100 rounded-4 mb-4" style={{ height: 350, objectFit: 'cover' }} />
              <div className="blog-post-content">
                {post.content.split('\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--gray-200)' }}>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/blog" className="btn-download"><i className="fas fa-arrow-left"></i> Back to Blog</Link>
                  <Link to="/notes" className="btn-download" style={{ background: 'var(--secondary)' }}><i className="fas fa-download"></i> Download Related Notes</Link>
                </div>
              </div>
              {related.length > 0 && (
              <div className="mt-5">
                <h4 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>Related Updates</h4>
                <div className="row g-3">
                  {related.map(r => (
                    <div className="col-md-6" key={r.id}>
                      <Link to={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                        <div className="blog-card">
                          <img src={r.image_url} alt={r.title} className="blog-card-image" style={{ height: 150 }} />
                          <div className="blog-card-body">
                            <h6 className="blog-card-title" style={{ fontSize: '0.95rem' }}>{r.title}</h6>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
