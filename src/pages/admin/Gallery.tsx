import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface GalleryItem { id: string; title: string; image_url: string; category: string; is_active: boolean; }

const emptyItem = { title: '', image_url: '', category: 'Classroom', is_active: true };
const catOptions = ['Classroom', 'Seminars', 'Workshops', 'Events', 'Celebrations'];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [form, setForm] = useState(emptyItem);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => (!search || i.title.toLowerCase().includes(search.toLowerCase())) && (!filterCat || i.category === filterCat));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { title: form.title, image_url: form.image_url, category: form.category, is_active: form.is_active };
    const { error: dbError } = editing ? await supabase.from('gallery_items').update(payload).eq('id', editing) : await supabase.from('gallery_items').insert(payload);
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setForm(emptyItem); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: GalleryItem) => {
    setForm({ title: item.title, image_url: item.image_url, category: item.category, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('gallery_items').delete().eq('id', id); fetch(); };
  const handleToggle = async (item: GalleryItem) => { await supabase.from('gallery_items').update({ is_active: !item.is_active }).eq('id', item.id); fetch(); };

  return (
    <div>
      <div className="admin-header"><h2>Manage Gallery</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyItem); setEditing(null); setShowForm(true); }}><i className="fas fa-plus"></i> Add Image</button>
      </div>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div className="admin-search"><i className="fas fa-search"></i><input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="admin-form-input" style={{ width: 'auto', maxWidth: 200 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>{catOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Image' : 'Add Image'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group"><label>Title *</label><input className="admin-form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="col-md-6 admin-form-group"><label>Category</label><select className="admin-form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{catOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="col-12 admin-form-group"><label>Image URL *</label><input className="admin-form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} required /></div>
              {form.image_url && <div className="col-12"><img src={form.image_url} alt="Preview" style={{ height: 120, borderRadius: 8, objectFit: 'cover' }} /></div>}
              <div className="col-md-4 admin-form-group"><label>Active</label><div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? <div className="text-center py-4 text-muted">No gallery items found</div> : (
        <div className="admin-table-wrapper"><table className="admin-table">
          <thead><tr><th style={{ width: 60 }}>Image</th><th>Title</th><th>Category</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
          <tbody>{filtered.map(item => (
            <tr key={item.id}>
              <td><img src={item.image_url} alt="" style={{ width: 48, height: 36, borderRadius: 4, objectFit: 'cover' }} /></td>
              <td className="fw-bold">{item.title}</td><td>{item.category}</td>
              <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
              <td><div className="d-flex gap-1"><button className="btn-table-action btn-edit" onClick={() => handleEdit(item)}><i className="fas fa-pen"></i></button><DeleteConfirm onConfirm={() => handleDelete(item.id)} /></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
