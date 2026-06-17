import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface Course { id: string; name: string; icon_class: string; exams: string; description: string; duration: string; mode: string; price: string; features: string[]; color: string; sort_order: number; is_active: boolean; }

const emptyCourse = { name: '', icon_class: 'fas fa-book', exams: '', description: '', duration: '', mode: 'Online', price: '', features: [] as string[], color: '#0D6EFD', sort_order: 0, is_active: true };

export default function AdminCourses() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyCourse);
  const [featInput, setFeatInput] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('courses').select('*').order('sort_order', { ascending: true });
    if (data) setItems(data as Course[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const addFeature = () => { if (featInput.trim()) { setForm({ ...form, features: [...form.features, featInput.trim()] }); setFeatInput(''); } };
  const removeFeature = (idx: number) => { setForm({ ...form, features: form.features.filter((_, i) => i !== idx) }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { name: form.name, icon_class: form.icon_class, exams: form.exams, description: form.description, duration: form.duration, mode: form.mode, price: form.price, features: form.features, color: form.color, sort_order: form.sort_order, is_active: form.is_active };
    const { error: dbError } = editing ? await supabase.from('courses').update(payload).eq('id', editing) : await supabase.from('courses').insert(payload);
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setForm(emptyCourse); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: Course) => {
    setForm({ name: item.name, icon_class: item.icon_class, exams: item.exams, description: item.description, duration: item.duration, mode: item.mode, price: item.price, features: item.features || [], color: item.color, sort_order: item.sort_order, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('courses').delete().eq('id', id); fetch(); };
  const handleToggle = async (item: Course) => { await supabase.from('courses').update({ is_active: !item.is_active }).eq('id', item.id); fetch(); };

  return (
    <div>
      <div className="admin-header"><h2>Manage Courses</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyCourse); setEditing(null); setShowForm(true); }}><i className="fas fa-plus"></i> Add Course</button>
      </div>
      <div className="admin-search mb-3"><i className="fas fa-search"></i><input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Course' : 'Add Course'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group"><label>Course Name *</label><input className="admin-form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-6 admin-form-group"><label>Exams Covered *</label><input className="admin-form-input" value={form.exams} onChange={e => setForm({ ...form, exams: e.target.value })} required /></div>
              <div className="col-12 admin-form-group"><label>Description</label><textarea className="admin-form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Duration</label><input className="admin-form-input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Mode</label><input className="admin-form-input" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Price</label><input className="admin-form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Icon Class</label><input className="admin-form-input" value={form.icon_class} onChange={e => setForm({ ...form, icon_class: e.target.value })} placeholder="fas fa-book" /></div>
              <div className="col-md-4 admin-form-group"><label>Color</label><input type="color" className="admin-form-input" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ height: 38, padding: 2 }} /></div>
              <div className="col-md-4 admin-form-group"><label>Sort Order</label><input type="number" className="admin-form-input" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} /></div>
              <div className="col-12 admin-form-group">
                <label>Features</label>
                <div className="d-flex gap-2 mb-2">
                  <input className="admin-form-input" value={featInput} onChange={e => setFeatInput(e.target.value)} placeholder="Add feature..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <button type="button" className="btn-admin-primary" onClick={addFeature}><i className="fas fa-plus"></i></button>
                </div>
                <div className="d-flex flex-wrap gap-1">{form.features.map((f, i) => (
                  <span key={i} className="admin-badge active" style={{ cursor: 'pointer' }} onClick={() => removeFeature(i)}>{f} <i className="fas fa-times ms-1"></i></span>
                ))}</div>
              </div>
              <div className="col-md-4 admin-form-group"><label>Active</label><div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? <div className="text-center py-4 text-muted">No courses found</div> : (
        <div className="admin-table-wrapper"><table className="admin-table">
          <thead><tr><th>Name</th><th>Exams</th><th>Mode</th><th>Price</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
          <tbody>{filtered.map(item => (
            <tr key={item.id}>
              <td><div className="d-flex align-items-center gap-2"><span style={{ width: 28, height: 28, borderRadius: 6, background: item.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem' }}><i className={item.icon_class}></i></span><span className="fw-bold">{item.name}</span></div></td>
              <td>{item.exams}</td><td>{item.mode}</td><td>{item.price}</td>
              <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
              <td><div className="d-flex gap-1"><button className="btn-table-action btn-edit" onClick={() => handleEdit(item)}><i className="fas fa-pen"></i></button><DeleteConfirm onConfirm={() => handleDelete(item.id)} /></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
