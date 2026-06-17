import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirm from '../../components/DeleteConfirm';
import ToggleActive from '../../components/ToggleActive';

interface Exam { id: string; name: string; exam_date: string; status: string; description: string; is_active: boolean; }

const emptyExam = { name: '', exam_date: '', status: 'upcoming', description: '', is_active: true };

export default function AdminExams() {
  const [items, setItems] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyExam);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('exams').select('*').order('exam_date', { ascending: true });
    if (data) setItems(data as Exam[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { name: form.name, exam_date: form.exam_date, status: form.status, description: form.description, is_active: form.is_active };
    const { error: dbError } = editing
      ? await supabase.from('exams').update(payload).eq('id', editing)
      : await supabase.from('exams').insert(payload);
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setForm(emptyExam); setEditing(null); setShowForm(false); setSaving(false); fetch();
  };

  const handleEdit = (item: Exam) => {
    setForm({ name: item.name, exam_date: item.exam_date.slice(0, 16), status: item.status, description: item.description, is_active: item.is_active });
    setEditing(item.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('exams').delete().eq('id', id); fetch();
  };

  const handleToggle = async (item: Exam) => {
    await supabase.from('exams').update({ is_active: !item.is_active }).eq('id', item.id); fetch();
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Manage Exams</h2>
        <button className="btn-admin-primary" onClick={() => { setForm(emptyExam); setEditing(null); setShowForm(true); }}>
          <i className="fas fa-plus"></i> Add Exam
        </button>
      </div>
      <div className="admin-search mb-3">
        <i className="fas fa-search"></i>
        <input placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showForm && (
        <div className="admin-form-card mb-3">
          <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>{editing ? 'Edit Exam' : 'Add Exam'}</h5>
          {error && <div className="alert-danger-custom mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group">
                <label>Exam Name *</label>
                <input className="admin-form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6 admin-form-group">
                <label>Exam Date *</label>
                <input type="datetime-local" className="admin-form-input" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} required />
              </div>
              <div className="col-md-6 admin-form-group">
                <label>Status</label>
                <select className="admin-form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-md-6 admin-form-group">
                <label>Active</label>
                <div className="pt-1"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="me-2" />Active</label></div>
              </div>
              <div className="col-12 admin-form-group">
                <label>Description</label>
                <textarea className="admin-form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn-table-action btn-cancel" onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? <div className="loading-spinner"></div> : filtered.length === 0 ? (
        <div className="text-center py-4 text-muted">No exams found</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Date</th><th>Status</th><th>Active</th><th style={{ width: 120 }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.name}</td>
                  <td>{new Date(item.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td><span className={`admin-badge ${item.status}`}>{item.status}</span></td>
                  <td><ToggleActive active={item.is_active} onToggle={() => handleToggle(item)} /></td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn-table-action btn-edit" onClick={() => handleEdit(item)} title="Edit"><i className="fas fa-pen"></i></button>
                      <DeleteConfirm onConfirm={() => handleDelete(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
