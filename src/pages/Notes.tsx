import { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

interface Note {
  id: string;
  title: string;
  subject: string;
  description: string;
  pdf_url: string;
  pages: number;
  downloads: number;
  date: string;
}

const subjectColors: Record<string, { bg: string; color: string }> = {
  'Haryana GK': { bg: 'rgba(13,110,253,0.1)', color: '#0D6EFD' },
  'Current Affairs': { bg: 'rgba(255,153,51,0.1)', color: '#FF9933' },
  'History': { bg: 'rgba(19,136,8,0.1)', color: '#138808' },
  'Geography': { bg: 'rgba(0,191,111,0.1)', color: '#00bf6f' },
  'Polity': { bg: 'rgba(111,66,193,0.1)', color: '#6f42c1' },
  'Constitution': { bg: 'rgba(220,53,69,0.1)', color: '#dc3545' },
  'Reasoning': { bg: 'rgba(13,202,240,0.1)', color: '#0dcaf0' },
  'Mathematics': { bg: 'rgba(25,135,84,0.1)', color: '#198754' },
  'English': { bg: 'rgba(108,117,125,0.1)', color: '#6c757d' },
  'Computer': { bg: 'rgba(102,16,242,0.1)', color: '#6610f2' },
  'Science': { bg: 'rgba(214,51,132,0.1)', color: '#d63384' },
};

export default function Notes() {
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'downloads'>('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('notes').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setNotesData(data as Note[]);
      setLoading(false);
    });
  }, []);

  const subjects = ['All', ...Array.from(new Set(notesData.map(n => n.subject)))];

  const filtered = useMemo(() => {
    let result = notesData;
    if (filter !== 'All') result = result.filter(n => n.subject === filter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(s) || n.subject.toLowerCase().includes(s) || n.description.toLowerCase().includes(s));
    }
    if (sortBy === 'date') result = [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else result = [...result].sort((a, b) => b.downloads - a.downloads);
    return result;
  }, [filter, search, sortBy, notesData]);

  const handleDownload = async (noteId: string) => {
    const c = parseInt(localStorage.getItem('downloadCount') || '15420');
    localStorage.setItem('downloadCount', String(c + 1));
    await supabase.from('notes').update({ downloads: (notesData.find(n => n.id === noteId)?.downloads || 0) + 1 }).eq('id', noteId);
  };

  return (
    <>
      <PageHeader title="Study Notes" subtitle="Download comprehensive study notes for all subjects and exams" breadcrumb={[{ label: 'Study Notes' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div className="search-box"><i className="fas fa-search"></i><input type="text" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="d-flex align-items-center gap-2 ms-auto">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Sort by:</span>
              <select className="form-select form-select-sm" style={{ width: 'auto', borderRadius: 50, fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'downloads')}>
                <option value="date">Latest First</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>
          </div>
          <div className="notes-filter">
            {subjects.map(subject => (
              <button key={subject} className={`filter-btn ${filter === subject ? 'active' : ''}`} onClick={() => setFilter(subject)}>{subject}</button>
            ))}
          </div>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
          <div className="row g-4">
            {filtered.length === 0 ? (
              <div className="col-12 text-center py-5"><i className="fas fa-search text-muted" style={{ fontSize: '3rem' }}></i><h5 className="mt-3 fw-bold" style={{ color: 'var(--gray-900)' }}>No notes found</h5><p className="text-muted">Try adjusting your search or filter criteria</p></div>
            ) : (
              filtered.map((note) => (
                <div className="col-lg-4 col-md-6 fade-in" key={note.id}>
                  <div className="note-card">
                    <span className="note-subject" style={{ background: subjectColors[note.subject]?.bg || 'rgba(13,110,253,0.1)', color: subjectColors[note.subject]?.color || '#0D6EFD' }}>{note.subject}</span>
                    <h5 className="note-title">{note.title}</h5>
                    <p className="note-desc">{note.description}</p>
                    <div className="note-meta">
                      <span><i className="fas fa-file-alt me-1"></i>{note.pages} pages</span>
                      <span className="download-badge"><i className="fas fa-download me-1"></i>{note.downloads.toLocaleString()}</span>
                    </div>
                    <button className="btn-download" onClick={() => handleDownload(note.id)}>
                      <i className="fas fa-download"></i> Download PDF
                    </button>
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
