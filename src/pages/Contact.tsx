import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

const contactInfo = [
  { icon: 'fas fa-map-marker-alt', title: 'Our Address', text: 'Sector 12, Near Bus Stand, Karnal, Haryana - 132001', color: '#0D6EFD' },
  { icon: 'fas fa-phone-alt', title: 'Phone Number', text: '+91 98765 43210', link: 'tel:+919876543210', color: '#FF9933' },
  { icon: 'fas fa-envelope', title: 'Email Address', text: 'info@haryanacoachpro.com', link: 'mailto:info@haryanacoachpro.com', color: '#138808' },
  { icon: 'fab fa-whatsapp', title: 'WhatsApp', text: '+91 98765 43210', link: 'https://wa.me/919876543210', color: '#25D366' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email || null,
        message: formData.message,
      });
      if (dbError) throw dbError;
      setSubmitted(true);
      setFormData({ name: '', mobile: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Get in touch for admissions, queries, or free counseling" breadcrumb={[{ label: 'Contact' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="row g-4 mb-5">
            {contactInfo.map((info, i) => (
              <div className="col-lg-3 col-md-6 fade-in" key={i}>
                <div className="contact-info-card">
                  <div className="contact-info-icon" style={{ background: info.color }}><i className={info.icon}></i></div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--gray-900)' }}>{info.title}</h6>
                  {info.link ? (
                    <a href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel="noopener" style={{ color: 'var(--gray-600)', fontSize: '0.9rem', textDecoration: 'none' }}>{info.text}</a>
                  ) : (
                    <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{info.text}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="row g-5">
            <div className="col-lg-7 fade-in-left">
              <div className="contact-form">
                <h4 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>Send Us a Message</h4>
                <p className="text-muted mb-4">Fill the form below and we'll get back to you within 24 hours</p>
                {submitted ? (
                  <div className="alert alert-success-custom"><i className="fas fa-check-circle me-2"></i>Thank you! Your message has been sent successfully.</div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Full Name *</label>
                        <input type="text" className="form-input" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Mobile Number *</label>
                        <input type="tel" className="form-input" placeholder="Enter your mobile number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Email Address</label>
                        <input type="email" className="form-input" placeholder="Enter your email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>Your Message *</label>
                        <textarea className="form-input" rows={5} placeholder="Write your query or message here..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn-submit" disabled={loading}>
                          {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Sending...</> : <><i className="fas fa-paper-plane me-2"></i>Send Message</>}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
            <div className="col-lg-5 fade-in-right">
              <div className="rounded-4 overflow-hidden mb-4" style={{ height: 300, border: '1px solid var(--gray-200)' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27832.96847384469!2d76.96!3d29.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e3daf7a6b1c0d%3A0x2e5e2b1c0c5e1f1!2sKarnal%2C%20Haryana!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location Map"></iframe>
              </div>
              <div className="p-4 rounded-4" style={{ background: 'var(--light)', border: '1px solid var(--gray-200)' }}>
                <h5 className="fw-bold mb-3" style={{ color: 'var(--gray-900)' }}>Follow Us on Social Media</h5>
                <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Stay connected for daily updates, free classes, and study tips</p>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="#" className="social-link youtube" style={{ background: 'rgba(255,0,0,0.1)', color: '#FF0000' }}><i className="fab fa-youtube"></i></a>
                  <a href="#" className="social-link facebook" style={{ background: 'rgba(24,119,242,0.1)', color: '#1877F2' }}><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="social-link instagram" style={{ background: 'rgba(228,64,95,0.1)', color: '#E4405F' }}><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-link telegram" style={{ background: 'rgba(0,136,204,0.1)', color: '#0088cc' }}><i className="fab fa-telegram-plane"></i></a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener" className="social-link whatsapp" style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}><i className="fab fa-whatsapp"></i></a>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #0D6EFD, #0a58ca)', color: 'white' }}>
                <h5 className="fw-bold mb-2"><i className="fas fa-clock me-2"></i>Office Hours</h5>
                <div className="d-flex flex-column gap-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  <div className="d-flex justify-content-between"><span>Monday - Saturday</span><span className="fw-bold">8:00 AM - 7:00 PM</span></div>
                  <div className="d-flex justify-content-between"><span>Sunday</span><span className="fw-bold">9:00 AM - 2:00 PM</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
