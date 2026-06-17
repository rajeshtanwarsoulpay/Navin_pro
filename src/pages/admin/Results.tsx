import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface Result { id: string; name: string; exam: string; year: string; photo_url: string; post: string; quote: string; is_active: boolean; }

const emptyResult = { name: '', exam: '', year: new Date().getFullYear().toString(), photo_url: '', post: '', quote: '', is_active: true };

export default function AdminResults() {
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyResult);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('results').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as Result[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.exam.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { name: form.name, exam: form.exam, year: form.year, photo_url: form.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', post: form.post, quote: form.quote, is_active: form.is_active };
    const { error: dbError } = editing ? await supabase.from('results').update(payload).eq('id', editing) : await supabase.from('results').insert(payload);
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setForm(emptyResult); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: Result) => {
    setForm({ name: item.name, exam: item.exam, year: item.year, photo_url: item.photo_url, post: item.post, quote: item.quote, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('results').delete().eq('id', id); fetch(); };
  const handleToggle = async (item: Result) => { await supabase.from('results').update({ is_active: !item.is_active }).eq('id', item.id); fetch(); };

  return (
    <div>
      <div className="admin-header"><h2>Manage Results</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyResult); setEditing(null); setShowForm(true); }}><i className="fas fa-plus"></i> Add Result</button>
      </div>
      <div className="admin-search mb-3"><i className="fas fa-search"></i><input placeholder="Search by name or exam..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Result' : 'Add Result'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group"><label>Name *</label><input className="admin-form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-6 admin-form-group"><label>Exam *</label><input className="admin-form-input" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} required /></div>
              <div className="col-md-4 admin-form-group"><label>Year</label><input className="admin-form-input" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Post</label><input className="admin-form-input" value={form.post} onChange={e => setForm({ ...form, post: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Photo URL</label><input className="admin-form-input" value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} /></div>
              <div className="col-12 admin-form-group"><label>Quote</label><textarea className="admin-form-input" value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Active</label><div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? <div className="text-center py-4 text-muted">No results found</div> : (
        <div className="admin-table-wrapper"><table className="admin-table">
          <thead><tr><th>Name</th><th>Exam</th><th>Year</th><th>Post</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
          <tbody>{filtered.map(item => (
            <tr key={item.id}>
              <td><div className="d-flex align-items-center gap-2"><img src={item.photo_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /><span className="fw-bold">{item.name}</span></div></td>
              <td>{item.exam}</td><td>{item.year}</td><td>{item.post}</td>
              <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
              <td><div className="d-flex gap-1"><button className="btn-table-action btn-edit" onClick={() => handleEdit(item)}><i className="fas fa-pen"></i></button><DeleteConfirm onConfirm={() => handleDelete(item.id)} /></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
