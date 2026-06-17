import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

interface Student {
  id: string;
  name: string;
  exam: string;
  year: string;
  photo_url: string;
  post: string;
  quote: string;
}

const examStats = [
  { exam: 'SSC CGL', count: 180, color: '#0D6EFD' },
  { exam: 'SSC CHSL', count: 220, color: '#FF9933' },
  { exam: 'HSSC', count: 310, color: '#138808' },
  { exam: 'CET Haryana', count: 250, color: '#6f42c1' },
  { exam: 'Haryana Police', count: 120, color: '#dc3545' },
  { exam: 'HTET', count: 80, color: '#0dcaf0' },
  { exam: 'Railway', count: 60, color: '#6610f2' },
  { exam: 'Banking', count: 45, color: '#d63384' },
];

export default function Results() {
  const [resultsData, setResultsData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('results').select('*').eq('is_active', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setResultsData(data as Student[]);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader title="Our Results" subtitle="Celebrating the success of our students across all government exams" breadcrumb={[{ label: 'Results' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Success Rate</span>
            <h2 className="section-title">Exam-wise Selections</h2>
            <p className="section-subtitle">A breakdown of our 1200+ successful selections</p>
          </div>
          <div className="row g-4">
            {examStats.map((stat, i) => (
              <div className="col-lg-3 col-md-4 col-6 fade-in" key={i}>
                <div className="stat-card"><div className="stat-icon" style={{ background: stat.color }}><i className="fas fa-trophy"></i></div><div className="stat-number">{stat.count}+</div><div className="stat-label">{stat.exam}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header fade-in"><span className="section-badge">Stars</span><h2 className="section-title">Our Star Students</h2></div>
          {loading ? <div className="loading-spinner"></div> : (
          <div className="row g-4">
            {resultsData.map((student) => (
              <div className="col-lg-3 col-md-4 col-sm-6 fade-in" key={student.id}>
                <div className="result-card">
                  <img src={student.photo_url} alt={student.name} className="result-photo" />
                  <div className="result-info">
                    <h5 className="result-name">{student.name}</h5>
                    <div className="result-exam">{student.exam}</div>
                    <div className="result-post">{student.post}</div>
                    <div className="result-year">{student.year}</div>
                    <p className="result-quote">"{student.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
      <section className="newsletter-section">
        <div className="container text-center"><h3 className="mb-2 fw-bold">Your Name Could Be Next!</h3><p className="mb-4" style={{ opacity: 0.85 }}>Join thousands of successful students.</p><a href="/courses" className="btn-hero btn-hero-primary"><i className="fas fa-rocket"></i> Start Your Journey</a></div>
      </section>
    </>
  );
}
