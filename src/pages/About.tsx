import PageHeader from '../components/PageHeader';

const timeline = [
  { year: '2012', title: 'Started Teaching Career', text: 'Began coaching students for Haryana government exams with a small batch of 15 students in Karnal.' },
  { year: '2014', title: 'First 50 Selections', text: 'Achieved the milestone of 50 successful selections across SSC and HSSC exams.' },
  { year: '2016', title: 'Expanded to Online Teaching', text: 'Launched online classes to reach students across all districts of Haryana.' },
  { year: '2018', title: '500+ Selections Milestone', text: 'Crossed 500 total selections with students cracking SSC CGL, HSSC, and CET exams.' },
  { year: '2020', title: 'YouTube Channel Launch', text: 'Started free YouTube classes reaching lakhs of students.' },
  { year: '2022', title: '1000+ Selections Achievement', text: 'Reached the historic milestone of 1000+ government job selections.' },
  { year: '2024', title: 'State-Level Recognition', text: 'Recognized as one of the top coaching institutes in Haryana.' },
  { year: '2025', title: '1200+ Selections & Growing', text: 'Continuing the legacy with 1200+ selections and expanding to more exam categories.' },
];

const achievements = [
  { icon: 'fas fa-award', value: '1200+', label: 'Successful Selections', color: '#0D6EFD' },
  { icon: 'fas fa-users', value: '5000+', label: 'Students Trained', color: '#FF9933' },
  { icon: 'fas fa-video', value: '50K+', label: 'YouTube Subscribers', color: '#dc3545' },
  { icon: 'fas fa-book', value: '500+', label: 'Study Materials', color: '#138808' },
  { icon: 'fas fa-clock', value: '12+', label: 'Years Experience', color: '#6f42c1' },
  { icon: 'fas fa-star', value: '4.8/5', label: 'Student Rating', color: '#FF9933' },
];

const certificates = [
  { title: 'Best Coaching Institute Award 2024', image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { title: 'Excellence in Education Award', image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { title: 'Top Haryana GK Resource', image: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { title: 'Digital Education Pioneer', image: 'https://images.pexels.com/photos/1457567/pexels-photo-1457567.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function About() {
  return (
    <>
      <PageHeader title="About Us" subtitle="Meet your mentor - 12+ years of dedicated coaching for Haryana government exams" breadcrumb={[{ label: 'About Us' }]} />

      <section className="about-intro">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 fade-in-left">
              <div className="about-image-wrapper">
                <img src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Teacher" />
                <div className="about-image-badge"><i className="fas fa-award me-1"></i>12+ Years Experience</div>
              </div>
            </div>
            <div className="col-lg-6 fade-in-right">
              <span className="section-badge">Our Founder</span>
              <h2 className="section-title text-start">Rajesh Kumar Sharma</h2>
              <p className="text-muted mb-3">A passionate educator and mentor who has dedicated over 12 years to helping students achieve their dream of securing a government job in Haryana and Central Government departments.</p>
              <p className="text-muted mb-3">With an M.A. in History and B.Ed from Kurukshetra University, Rajesh Sir brings deep subject knowledge combined with practical exam strategies. His teaching methodology focuses on building strong fundamentals while developing speed and accuracy required for competitive exams.</p>
              <p className="text-muted mb-4">Under his guidance, over 1200 students have successfully cracked various government exams including SSC CGL, HSSC Clerk, CET Haryana, Haryana Police, HTET, and many more.</p>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center gap-2"><i className="fas fa-graduation-cap text-primary"></i><span className="fw-bold">M.A. History, B.Ed</span></div>
                <div className="d-flex align-items-center gap-2"><i className="fas fa-university text-primary"></i><span className="fw-bold">Kurukshetra University</span></div>
                <div className="d-flex align-items-center gap-2"><i className="fas fa-certificate text-primary"></i><span className="fw-bold">CTET & HTET Qualified</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6 fade-in">
              <div className="p-4 rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #0D6EFD, #0a58ca)', color: 'white' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}><i className="fas fa-bullseye"></i></div>
                  <h4 className="fw-bold mb-0">Our Mission</h4>
                </div>
                <p className="mb-0" style={{ opacity: 0.9, lineHeight: 1.7 }}>To provide affordable, high-quality coaching to every aspirant in Haryana, ensuring no student is left behind due to financial constraints or geographic limitations.</p>
              </div>
            </div>
            <div className="col-lg-6 fade-in">
              <div className="p-4 rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #FF9933, #e68a00)', color: 'var(--gray-900)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}><i className="fas fa-eye"></i></div>
                  <h4 className="fw-bold mb-0">Our Vision</h4>
                </div>
                <p className="mb-0" style={{ lineHeight: 1.7 }}>To become Haryana's most trusted and result-oriented coaching institute, known for transforming aspirants into government officers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Achievements</span>
            <h2 className="section-title">Our Impact in Numbers</h2>
          </div>
          <div className="row g-4">
            {achievements.map((item, i) => (
              <div className="col-lg-2 col-md-4 col-6 fade-in" key={i}>
                <div className="text-center">
                  <div style={{ width: 65, height: 65, borderRadius: 16, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', color: 'white', fontSize: '1.3rem' }}><i className={item.icon}></i></div>
                  <div className="fw-bold fs-4" style={{ color: 'var(--gray-900)' }}>{item.value}</div>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Journey</span>
            <h2 className="section-title">Our Journey So Far</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="timeline fade-in">
                {timeline.map((item, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-text">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Recognition</span>
            <h2 className="section-title">Certificates & Awards</h2>
          </div>
          <div className="row g-4">
            {certificates.map((cert, i) => (
              <div className="col-lg-3 col-md-6 fade-in" key={i}>
                <div className="certificate-card">
                  <img src={cert.image} alt={cert.title} />
                  <div className="text-center mt-2"><small className="fw-bold" style={{ color: 'var(--gray-700)' }}>{cert.title}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 fade-in-left">
              <span className="section-badge">Philosophy</span>
              <h2 className="section-title text-start">Teaching Philosophy</h2>
              <p className="text-muted mb-3 fst-italic">"Every student has the potential to crack government exams. The key lies in structured preparation, consistent practice, and unwavering belief."</p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(13,110,253,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}><i className="fas fa-lightbulb"></i></div>
                  <div><h6 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>Concept-First Approach</h6><small className="text-muted">Build strong fundamentals before shortcuts. Understanding beats memorization.</small></div>
                </div>
                <div className="d-flex gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,153,51,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', flexShrink: 0 }}><i className="fas fa-chart-line"></i></div>
                  <div><h6 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>Data-Driven Preparation</h6><small className="text-muted">Track progress through regular tests and analytics. Focus on weak areas.</small></div>
                </div>
                <div className="d-flex gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(19,136,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><i className="fas fa-hands-helping"></i></div>
                  <div><h6 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>Mentorship Over Lecturing</h6><small className="text-muted">Every student gets personal attention. We mentor, not just teach.</small></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 fade-in-right">
              <div className="p-4 rounded-4" style={{ background: 'white', border: '1px solid var(--gray-200)' }}>
                <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}><i className="fas fa-quote-left text-primary me-2"></i>From Rajesh Sir</h5>
                <p className="text-muted fst-italic" style={{ lineHeight: 1.8 }}>"I started this institute with a simple belief - that quality education for competitive exams should be accessible to every student in Haryana, regardless of their background or financial status. Over 12 years, I've seen thousands of students transform their lives through government jobs. Each success story fuels my passion to keep going, keep improving, and keep reaching more students."</p>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <img src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=80" alt="Rajesh Sir" style={{ width: 50, height: 50, borderRadius: 50, objectFit: 'cover' }} />
                  <div><div className="fw-bold" style={{ color: 'var(--gray-900)' }}>Rajesh Kumar Sharma</div><small className="text-muted">Founder & Lead Faculty</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
