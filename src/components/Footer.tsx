import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">Haryana<i className="fas fa-graduation-cap"></i>Coach<span>Pro</span></div>
            <p className="footer-text">Leading coaching institute for Haryana and Central Government exam preparation. Expert faculty, comprehensive notes, and proven results since 2012.</p>
            <div className="d-flex gap-2">
              <a href="#" className="social-link youtube" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="#" className="social-link facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link telegram" aria-label="Telegram"><i className="fab fa-telegram-plane"></i></a>
              <a href="#" className="social-link whatsapp" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-title">Quick Links</h6>
            <div className="d-flex flex-column">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/notes" className="footer-link">Study Notes</Link>
              <Link to="/courses" className="footer-link">Courses</Link>
              <Link to="/results" className="footer-link">Results</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-title">Exams We Cover</h6>
            <div className="d-flex flex-column">
              <Link to="/courses" className="footer-link">SSC CGL / CHSL / MTS</Link>
              <Link to="/courses" className="footer-link">CET Haryana</Link>
              <Link to="/courses" className="footer-link">HSSC Exams</Link>
              <Link to="/courses" className="footer-link">Haryana Police</Link>
              <Link to="/courses" className="footer-link">HTET</Link>
              <Link to="/courses" className="footer-link">Railway / Banking</Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-title">Contact Info</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-start gap-2">
                <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                <span className="footer-text mb-0">Sector 12, Near Bus Stand, Karnal, Haryana - 132001</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-phone text-primary"></i>
                <a href="tel:+919876543210" className="footer-link">+91 98765 43210</a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                <a href="mailto:info@haryanacoachpro.com" className="footer-link">info@haryanacoachpro.com</a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fab fa-whatsapp text-success"></i>
                <a href="https://wa.me/919876543210" className="footer-link" target="_blank" rel="noopener">WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} HaryanaCoachPro. All Rights Reserved. | Designed with <i className="fas fa-heart text-danger"></i> for Haryana Aspirants</p>
        </div>
      </div>
    </footer>
  );
}
