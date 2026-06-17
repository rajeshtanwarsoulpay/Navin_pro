import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollAnimator from './components/ScrollAnimator';
import Preloader from './components/Preloader';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Notes from './pages/Notes';
import Courses from './pages/Courses';
import Results from './pages/Results';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminExams from './pages/admin/Exams';
import AdminNotes from './pages/admin/Notes';
import AdminCourses from './pages/admin/Courses';
import AdminBlog from './pages/admin/Blog';
import AdminResults from './pages/admin/Results';
import AdminGallery from './pages/admin/Gallery';
import AdminTestimonials from './pages/admin/Testimonials';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Preloader />
        <ScrollAnimator />
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>

          {/* Public routes */}
          <Route path="*" element={
            <>
              <Navbar />
              <main style={{ paddingTop: '76px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
