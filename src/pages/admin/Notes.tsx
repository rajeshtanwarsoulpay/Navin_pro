import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface Note { id: string; title: string; subject: string; description: string; pdf_url: string; pages: number; downloads: number; date: string; is_active: boolean; }

const emptyNote = { title: '', subject: '', description: '', pdf_url: '#', pages: 0, downloads: 0, date: new Date().toISOString().slice(0, 10), is_active: true };

const subjectOptions = ['Haryana GK','Current Affairs','History','Geography','Polity','Constitution','Reasoning','Mathematics','English','Computer','Science'];

export default function AdminNotes() {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [form, setForm] = useState(emptyNote);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('notes').select('*').order('date', { ascending: false });
    if (data) setItems(data as Note[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => (!search || i.title.toLowerCase().includes(search.toLowerCase())) && (!filterSubject || i.subject === filterSubject));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { title: form.title, subject: form.subject, description: form.description, pdf_url: form.pdf_url, pages: form.pages, downloads: form.downloads, date: form.date, is_active: form.is_active };
    const { error: dbError } = editing ? await supabase.from('notes').update(payload).eq('id', editing) : await supabase.from('notes').insert(payload);
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setForm(emptyNote); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: Note) => {
    setForm({ title: item.title, subject: item.subject, description: item.description, pdf_url: item.pdf_url, pages: item.pages, downloads: item.downloads, date: item.date, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await supabase.from('notes').delete().eq('id', id); fetch(); };
  const handleToggle = async (item: Note) => { await supabase.from('notes').update({ is_active: !item.is_active }).eq('id', item.id); fetch(); };

  return (
    <div>
      <div className="admin-header"><h2>Manage Notes</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyNote); setEditing(null); setShowForm(true); }}><i className="fas fa-plus"></i> Add Note</button>
      </div>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div className="admin-search"><i className="fas fa-search"></i><input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="admin-form-input" style={{ width: 'auto', maxWidth: 200 }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Note' : 'Add Note'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group"><label>Title *</label><input className="admin-form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="col-md-6 admin-form-group"><label>Subject *</label>
                <select className="admin-form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select Subject</option>{subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-12 admin-form-group"><label>Description *</label><textarea className="admin-form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="col-md-4 admin-form-group"><label>PDF URL</label><input className="admin-form-input" value={form.pdf_url} onChange={e => setForm({ ...form, pdf_url: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Pages</label><input type="number" className="admin-form-input" value={form.pages} onChange={e => setForm({ ...form, pages: +e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Date</label><input type="date" className="admin-form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="col-md-4 admin-form-group"><label>Active</label><div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div></div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? <div className="text-center py-4 text-muted">No notes found</div> : (
        <div className="admin-table-wrapper"><table className="admin-table">
          <thead><tr><th>Title</th><th>Subject</th><th>Pages</th><th>Downloads</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
          <tbody>{filtered.map(item => (
            <tr key={item.id}>
              <td className="fw-bold">{item.title}</td>
              <td>{item.subject}</td><td>{item.pages}</td><td>{item.downloads.toLocaleString()}</td>
              <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
              <td><div className="d-flex gap-1"><button className="btn-table-action btn-edit" onClick={() => handleEdit(item)}><i className="fas fa-pen"></i></button><DeleteConfirm onConfirm={() => handleDelete(item.id)} /></div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
