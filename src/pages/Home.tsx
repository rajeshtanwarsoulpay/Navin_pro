import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatCard({ icon, value, suffix, label, color }: { icon: string; value: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="stat-card fade-in" ref={ref}>
      <div className="stat-icon" style={{ background: color }}><i className={icon}></i></div>
      <div className="stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ExamCountdown({ exam }: { exam: { date: string; name: string; description: string } }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(exam.date).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [exam.date]);

  return (
    <div className="countdown">
      <div className="countdown-item"><div className="countdown-value">{timeLeft.days}</div><div className="countdown-label">Days</div></div>
      <div className="countdown-item"><div className="countdown-value">{timeLeft.hours}</div><div className="countdown-label">Hours</div></div>
      <div className="countdown-item"><div className="countdown-value">{timeLeft.minutes}</div><div className="countdown-label">Mins</div></div>
      <div className="countdown-item"><div className="countdown-value">{timeLeft.seconds}</div><div className="countdown-label">Secs</div></div>
    </div>
  );
}

const courses = [
  { name: 'SSC', icon: 'fas fa-university', desc: 'CGL, CHSL, MTS, GD & Stenographer', mode: 'online', features: ['Complete Syllabus Coverage', 'Weekly Mock Tests', 'Previous Year Papers', 'Doubt Sessions'] },
  { name: 'HSSC', icon: 'fas fa-landmark', desc: 'Clerk, Patwari, Group C & D', mode: 'offline', features: ['Haryana GK Special', 'Subject-wise Tests', 'Interview Preparation', 'Study Material'] },
  { name: 'CET Haryana', icon: 'fas fa-file-alt', desc: 'Common Eligibility Test for all Group posts', mode: 'online', features: ['CET Pattern Tests', 'Bilingual Notes', 'Regular Revision', 'Performance Analysis'] },
  { name: 'Haryana Police', icon: 'fas fa-shield-alt', desc: 'Constable & Sub-Inspector', mode: 'offline', features: ['Physical Fitness Tips', 'Written Exam Prep', 'Mock Interviews', 'Medical Guidance'] },
  { name: 'Railway', icon: 'fas fa-train', desc: 'RRB NTPC, Group D & ALP', mode: 'online', features: ['Railway Pattern Tests', 'Speed & Accuracy', 'Current Affairs', 'General Science'] },
  { name: 'Banking', icon: 'fas fa-building', desc: 'IBPS, SBI & RBI Exams', mode: 'online', features: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'Financial Awareness'] },
];

const whyItems = [
  { icon: 'fas fa-chalkboard-teacher', title: 'Experienced Faculty', text: '10+ years of teaching experience with deep knowledge of exam patterns and trends.', color: '#0D6EFD' },
  { icon: 'fas fa-book-open', title: 'Updated Notes', text: 'Regularly updated study material based on latest syllabus and previous year patterns.', color: '#FF9933' },
  { icon: 'fas fa-clipboard-check', title: 'Regular Tests', text: 'Weekly mock tests and practice sessions with detailed performance analysis.', color: '#138808' },
  { icon: 'fas fa-user-friends', title: 'Personal Guidance', text: 'Individual attention and mentoring to track and improve every student\'s progress.', color: '#dc3545' },
  { icon: 'fas fa-rupee-sign', title: 'Affordable Fees', text: 'Quality education at reasonable fees with flexible payment options available.', color: '#6f42c1' },
  { icon: 'fas fa-mobile-alt', title: 'Online + Offline', text: 'Both online and offline classes available for maximum convenience and flexibility.', color: '#0dcaf0' },
];

const testimonials = [
  { name: 'Amit Verma', exam: 'SSC CGL 2025', text: 'The structured approach and comprehensive notes made my preparation journey smooth. Selected as Tax Assistant in first attempt!', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Suman Rani', exam: 'HSSC Clerk 2025', text: 'Best coaching for Haryana exams! The Haryana GK notes were incredibly detailed and up-to-date. Highly recommended!', photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Raj Kumar', exam: 'CET Haryana 2024', text: 'Regular mock tests and personal doubt sessions made all the difference. Got selected for Group C post.', photo: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Neha Singh', exam: 'HTET 2024', text: 'The pedagogy and child development notes were exactly what I needed. Cleared HTET Level 2 with good marks.', photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Deepak Yadav', exam: 'Railway Group D', text: 'From zero preparation to getting selected in just 8 months. The test series here is the best in the region.', photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Pooja Sharma', exam: 'Haryana Police 2024', text: 'Complete preparation package - written exam plus physical guidance. Everything under one roof. Thank you!', photo: 'https://images.pexels.com/photos/1065056/pexels-photo-1065056.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

const faqs = [
  { q: 'Which exams do you prepare students for?', a: 'We prepare students for SSC CGL, CHSL, MTS, GD, HSSC, CET Haryana, Haryana Police, HTET, Haryana Patwari, Railway, Banking, and all other Haryana and Central Government recruitment exams.' },
  { q: 'Do you provide online classes?', a: 'Yes, we offer both online and offline classes. Our online classes are conducted via live video sessions with recorded backup, study material access, and regular mock tests.' },
  { q: 'How frequently are mock tests conducted?', a: 'We conduct weekly mock tests for all subjects and full-length mock tests every fortnight. Detailed performance analysis with percentile ranking is provided after each test.' },
  { q: 'Is study material included in the course fee?', a: 'Yes, comprehensive study material including notes, practice sets, and previous year question papers are included in the course fee. No extra charges.' },
  { q: 'What is the duration of courses?', a: 'Course durations vary from 3 months to 12 months depending on the exam. We also offer crash courses of 1-2 months for specific exams.' },
  { q: 'Do you provide doubt clearing sessions?', a: 'Yes, we have dedicated doubt clearing sessions every week. Students can also reach out to faculty personally via WhatsApp or during office hours.' },
];

const tickerMessages = [
  'CET Haryana 2026 Notification Released - Apply Before Feb 28',
  'SSC CGL 2026 Tier-1 Exam from Feb 1 - Download Admit Card Now',
  'HTET 2026 Applications Open - Last Date Feb 10',
  'Haryana Police 2026 Recruitment Expected Soon',
  'New Notes Added: Current Affairs January 2026',
  'Free Mock Test Every Sunday - Register Now',
];

const catStyles: Record<string, { bg: string; color: string }> = {
  'Exam Updates': { bg: 'rgba(13,110,253,0.1)', color: '#0D6EFD' },
  'Admit Cards': { bg: 'rgba(255,153,51,0.1)', color: '#FF9933' },
  'Results': { bg: 'rgba(25,135,84,0.1)', color: '#198754' },
  'Current Affairs': { bg: 'rgba(220,53,69,0.1)', color: '#dc3545' },
};

interface BlogPost { id: string; slug: string; title: string; category: string; date: string; image_url: string; excerpt: string; }
interface Exam { id: string; name: string; exam_date: string; status: string; description: string; }
interface Course { id: string; name: string; icon_class: string; exams: string; description: string; duration: string; mode: string; price: string; features: string[]; color: string; }
interface TestimonialData { id: string; name: string; exam: string; quote: string; photo_url: string; }

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [downloadCount, setDownloadCount] = useState(() => parseInt(localStorage.getItem('downloadCount') || '15420'));
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [examsData, setExamsData] = useState<Exam[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialData[]>([]);

  useEffect(() => {
    supabase.from('blog_posts').select('id,slug,title,category,date,image_url,excerpt').eq('is_active', true).order('date', { ascending: false }).limit(3).then(({ data }) => { if (data && data.length > 0) setBlogData(data); });
    supabase.from('exams').select('*').eq('is_active', true).order('exam_date', { ascending: true }).limit(3).then(({ data }) => { if (data && data.length > 0) setExamsData(data as Exam[]); });
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order', { ascending: true }).limit(6).then(({ data }) => { if (data && data.length > 0) setCoursesData(data as Course[]); });
    supabase.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6).then(({ data }) => { if (data && data.length > 0) setTestimonialsData(data as TestimonialData[]); });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const { error } = await supabase.from('newsletter_subscriptions').insert({ email });
      if (!error || error.code === '23505') {
        setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000);
      }
    }
  };

  const handleDownload = () => {
    const c = downloadCount + 1;
    setDownloadCount(c);
    localStorage.setItem('downloadCount', String(c));
  };


  return (
    <>
      <div className="notification-ticker">
        <div className="container-fluid d-flex align-items-center">
          <span className="ticker-label"><i className="fas fa-bell me-1"></i>LATEST</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <span className="ticker-content">
              {tickerMessages.map((msg, i) => <span key={i} className="me-5">{msg} &bull; </span>)}
            </span>
          </div>
        </div>
      </div>

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <div className="hero-badge"><i className="fas fa-star me-1"></i> Trusted by 5000+ Students Across Haryana</div>
              <h1 className="hero-title">Expert Guidance for <span className="highlight">SSC, HSSC & Haryana Govt Exams</span></h1>
              <p className="hero-subtitle">Join Haryana's most trusted coaching institute. Comprehensive preparation with expert faculty, updated notes, and proven results.</p>
              <div className="hero-buttons">
                <Link to="/notes" className="btn-hero btn-hero-primary" onClick={handleDownload}><i className="fas fa-download"></i> Download Notes</Link>
                <Link to="/contact" className="btn-hero btn-hero-outline"><i className="fas fa-phone-alt"></i> Contact Now</Link>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener" className="btn-hero btn-hero-success"><i className="fab fa-whatsapp"></i> Join WhatsApp</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-wrapper">
                <div className="hero-image-frame">
                  <img src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Classroom" />
                </div>
                <div className="hero-float-card card-1">
                  <div className="card-icon" style={{ background: 'var(--primary)' }}><i className="fas fa-users"></i></div>
                  <div className="card-value">5000+</div>
                  <div className="card-label">Students Taught</div>
                </div>
                <div className="hero-float-card card-2">
                  <div className="card-icon" style={{ background: 'var(--success)' }}><i className="fas fa-trophy"></i></div>
                  <div className="card-value">1200+</div>
                  <div className="card-label">Selections</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6"><StatCard icon="fas fa-users" value={5000} suffix="+" label="Students Taught" color="#0D6EFD" /></div>
            <div className="col-lg-3 col-md-6"><StatCard icon="fas fa-clock" value={12} suffix=" Yrs" label="Years of Experience" color="#FF9933" /></div>
            <div className="col-lg-3 col-md-6"><StatCard icon="fas fa-trophy" value={1200} suffix="+" label="Successful Selections" color="#138808" /></div>
            <div className="col-lg-3 col-md-6"><StatCard icon="fas fa-book" value={500} suffix="+" label="Notes & Study Material" color="#dc3545" /></div>
          </div>
          <div className="text-center mt-3"><span className="download-badge"><i className="fas fa-download me-1"></i>{downloadCount.toLocaleString()} total downloads</span></div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Our Courses</span>
            <h2 className="section-title">Prepare for Every Government Exam</h2>
            <p className="section-subtitle">Comprehensive coaching programs designed to help you crack SSC, HSSC, CET, and all Haryana government exams</p>
          </div>
          <div className="row g-4">
            {(coursesData.length > 0 ? coursesData : courses).map((course, i) => (
              <div className="col-lg-4 col-md-6 fade-in" key={i}>
                <div className="course-card">
                  <div className="course-card-header">
                    <div className="course-icon" style={{ background: course.color || `hsl(${i * 55 + 200}, 70%, 50%)` }}><i className={course.icon_class || course.icon}></i></div>
                    <h5 className="course-card-title">{course.name}</h5>
                    <p className="course-card-text">{course.exams || course.desc}</p>
                  </div>
                  <div className="course-card-body">
                    <ul className="course-features">{(course.features || []).map((f: string, j: number) => <li key={j}><i className="fas fa-check-circle"></i>{f}</li>)}</ul>
                  </div>
                  <div className="course-card-footer">
                    <span className={`course-mode ${(course.mode || course.modeRef || 'online').toLowerCase().includes('online') ? 'online' : 'offline'}`}><i className={`fas ${(course.mode || '').toLowerCase().includes('online') ? 'fa-laptop' : 'fa-building'} me-1`}></i>{course.mode || 'Online'}</span>
                    <Link to="/courses" className="btn-download btn-sm">Enroll Now <i className="fas fa-arrow-right"></i></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">What Makes Us Different</h2>
            <p className="section-subtitle">We go beyond traditional coaching to ensure every student achieves their government job dream</p>
          </div>
          <div className="row g-4">
            {whyItems.map((item, i) => (
              <div className="col-lg-4 col-md-6 fade-in" key={i}>
                <div className="why-card">
                  <div className="why-icon" style={{ background: item.color }}><i className={item.icon}></i></div>
                  <h5 className="why-title">{item.title}</h5>
                  <p className="why-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Testimonials</span>
            <h2 className="section-title" style={{ color: 'white' }}>Our Students Speak</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>Hear from students who achieved their dreams with our guidance</p>
          </div>
          <div className="row g-4">
            {(testimonialsData.length > 0 ? testimonialsData : testimonials).slice(0, 3).map((t, i) => (
              <div className="col-lg-4 col-md-6 fade-in" key={i}>
                <div className="testimonial-card">
                  <div className="testimonial-stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                  <p className="testimonial-text">"{t.quote || t.text}"</p>
                  <div className="testimonial-author">
                    <img src={t.photo_url || t.photo} alt={t.name} className="testimonial-avatar" />
                    <div><div className="testimonial-name">{t.name}</div><div className="testimonial-exam">{t.exam}</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Upcoming Exams</span>
            <h2 className="section-title">Don't Miss Important Dates</h2>
            <p className="section-subtitle">Stay updated with upcoming exam schedules and start your preparation on time</p>
          </div>
          <div className="row g-4">
            {examsData.slice(0, 3).map((exam) => (
              <div className="col-lg-4 col-md-6 fade-in" key={exam.id}>
                <div className="exam-card">
                  <span className="exam-badge" style={{ background: 'rgba(13,110,253,0.1)', color: 'var(--primary)' }}>Upcoming</span>
                  <h5 className="exam-name">{exam.name}</h5>
                  <p className="exam-desc">{exam.description}</p>
                  <ExamCountdown exam={{ date: exam.exam_date, name: exam.name, description: exam.description }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">Latest Updates</span>
            <h2 className="section-title">Exam Notifications & Updates</h2>
            <p className="section-subtitle">Stay informed about the latest exam notifications, admit cards, and result announcements</p>
          </div>
          <div className="row g-4">
            {blogData.slice(0, 3).map((post) => (
              <div className="col-lg-4 col-md-6 fade-in" key={post.id}>
                <div className="blog-card">
                  <img src={post.image_url} alt={post.title} className="blog-card-image" />
                  <div className="blog-card-body">
                    <span className="blog-category" style={{ background: catStyles[post.category]?.bg || 'rgba(13,110,253,0.1)', color: catStyles[post.category]?.color || '#0D6EFD' }}>{post.category}</span>
                    <h5 className="blog-card-title">{post.title}</h5>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span><i className="fas fa-calendar-alt me-1"></i>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <Link to={`/blog/${post.slug}`} className="blog-read-more">Read More <i className="fas fa-arrow-right"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 fade-in"><Link to="/blog" className="btn-hero btn-hero-primary">View All Updates <i className="fas fa-arrow-right ms-1"></i></Link></div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header fade-in">
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Get answers to common questions about our coaching programs</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, i) => (
                  <div className="accordion-item accordion-item-custom fade-in" key={i}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button accordion-button-custom ${activeFaq !== i ? 'collapsed' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)} type="button">{faq.q}</button>
                    </h2>
                    <div className={`accordion-collapse collapse ${activeFaq === i ? 'show' : ''}`}>
                      <div className="accordion-body accordion-body-custom">{faq.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container text-center">
          <h3 className="mb-2 fw-bold">Get Exam Updates in Your Inbox</h3>
          <p className="mb-4" style={{ opacity: 0.85 }}>Subscribe to receive latest exam notifications, study tips, and free notes directly in your email</p>
          {subscribed ? (
            <div className="alert alert-success-custom d-inline-block"><i className="fas fa-check-circle me-2"></i>Successfully subscribed!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-input-group d-flex">
              <input type="email" className="newsletter-input" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="newsletter-btn">Subscribe <i className="fas fa-paper-plane ms-1"></i></button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
