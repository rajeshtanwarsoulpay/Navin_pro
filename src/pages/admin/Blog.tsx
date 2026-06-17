import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface BlogPost { id: string; slug: string; title: string; category: string; date: string; image_url: string; excerpt: string; content: string; is_active: boolean; }

const emptyPost = { slug: '', title: '', category: 'Exam Updates', date: new Date().toISOString().slice(0, 10), image_url: '', excerpt: '', content: '', is_active: true };

const categories = ['Exam Updates', 'Admit Cards', 'Results', 'Current Affairs'];

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export default function AdminBlog() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [form, setForm] = useState(emptyPost);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
    if (data) setItems(data as BlogPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => (!search || i.title.toLowerCase().includes(search.toLowerCase())) && (!filterCat || i.category === filterCat));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const slug = form.slug || slugify(form.title);
    const payload = { slug, title: form.title, category: form.category, date: form.date, image_url: form.image_url || 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600', excerpt: form.excerpt, content: form.content, is_active: form.is_active };
    const { error: dbError } = editing ? await supabase.from('blog_posts').update(payload).eq('id', editing) : await supabase.from('blog_posts').insert(payload);
    if (dbError) { setError(dbError.code === '23505' ? 'A post with this slug already exists' : dbError.message); setSaving(false); return; }
    setForm(emptyPost); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: BlogPost) => {
    setForm({ slug: item.slug, title: item.title, category: item.category, date: item.date, image_url: item.image_url, excerpt: item.excerpt, content: item.content, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('blog_posts').delete().eq('id', id); fetch(); };
  const handleToggle = async (item: BlogPost) => { await supabase.from('blog_posts').update({ is_active: !item.is_active }).eq('id', item.id); fetch(); };

  return (
    <div>
      <div className="admin-header"><h2>Manage Blog Posts</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyPost); setEditing(null); setShowForm(true); }}><i className="fas fa-plus"></i> Add Post</button>
      </div>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div className="admin-search"><i className="fas fa-search"></i><input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="admin-form-input" style={{ width: 'auto', maxWidth: 200 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Post' : 'Add Post'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8 admin-form-group"><label>Title *</label><input className="admin-form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} required /></div>
              <div className="col-md-4 admin-form-group"><label>Slug</label><input className="admin-form-input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated" /></div>
              <div className="col-md-4 admin-form-group"><label>Category</label><select className="admin-form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="col-md-4 admin-form-group"><label>Date</label><input type="date" className="admin-form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Image URL</label><input className="admin-form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
              <div className="col-12 admin-form-group"><label>Excerpt *</label><textarea className="admin-form-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required /></div>
              <div className="col-12 admin-form-group"><label>Content *</label><textarea className="admin-form-input" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
              <div className="col-md-4 admin-form-group"><label>Active</label><div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? <div className="text-center py-4 text-muted">No posts found</div> : (
        <div className="admin-table-wrapper"><table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
          <tbody>{filtered.map(item => (
            <tr key={item.id}>
              <td className="fw-bold" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</td>
              <td>{item.category}</td>
              <td>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
              <td><div className="d-flex gap-1"><button className="btn-table-action btn-edit" onClick={() => handleEdit(item)}><i className="fas fa-pen"></i></button><DeleteConfirm onConfirm={() => handleDelete(item.id)} /></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
