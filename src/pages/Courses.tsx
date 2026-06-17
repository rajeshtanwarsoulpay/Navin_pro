import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  name: string;
  icon_class: string;
  exams: string;
  description: string;
  duration: string;
  mode: string;
  price: string;
  features: string[];
  color: string;
}

export default function Courses() {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order', { ascending: true }).then(({ data }) => {
      if (data) setCoursesData(data as Course[]);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHeader title="Our Courses" subtitle="Comprehensive coaching programs for every government exam" breadcrumb={[{ label: 'Courses' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          {loading ? <div className="loading-spinner"></div> : (
          <div className="row g-4">
            {coursesData.map((course) => (
              <div className="col-lg-4 col-md-6 fade-in" key={course.id}>
                <div className="course-card">
                  <div className="course-card-header">
                    <div className="course-icon" style={{ background: course.color }}><i className={course.icon_class}></i></div>
                    <h5 className="course-card-title">{course.name}</h5>
                    <p className="course-card-text">{course.exams}</p>
                  </div>
                  <div className="course-card-body">
                    <p className="course-card-text">{course.description}</p>
                    <ul className="course-features">{(course.features || []).map((f: string, j: number) => <li key={j}><i className="fas fa-check-circle"></i>{f}</li>)}</ul>
                  </div>
                  <div className="course-card-footer">
                    <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Duration</div><div className="fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-900)' }}>{course.duration}</div></div>
                    <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Fee</div><div className="fw-bold" style={{ fontSize: '0.85rem', color: course.color }}>{course.price}</div></div>
                  </div>
                  <div className="p-3 pt-0">
                    <Link to="/contact" className="btn-download w-100 justify-content-center">Enroll Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
      <section className="newsletter-section">
        <div className="container text-center">
          <h3 className="mb-2 fw-bold">Not Sure Which Course to Choose?</h3>
          <p className="mb-4" style={{ opacity: 0.85 }}>Get free counseling from our expert faculty.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/contact" className="btn-hero btn-hero-primary"><i className="fas fa-phone-alt"></i> Get Free Counseling</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener" className="btn-hero btn-hero-outline"><i className="fab fa-whatsapp"></i> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
