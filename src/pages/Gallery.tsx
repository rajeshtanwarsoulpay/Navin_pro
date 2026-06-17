import { useState } from 'react';
import { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../lib/supabase';

interface GalleryItem { id: string; title: string; image_url: string; category: string; }

const categories = ['All', 'Classroom', 'Seminars', 'Workshops', 'Events', 'Celebrations'];

const fallbackImages: GalleryItem[] = [
  { id: '1', title: 'Main Classroom Session', image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Classroom' },
  { id: '2', title: 'Interactive Learning', image_url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Classroom' },
  { id: '3', title: 'Study Group Discussion', image_url: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Classroom' },
  { id: '4', title: 'Annual Seminar 2025', image_url: 'https://images.pexels.com/photos/1457567/pexels-photo-1457567.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Seminars' },
  { id: '5', title: 'Exam Strategy Seminar', image_url: 'https://images.pexels.com/photos/840996/pexels-photo-840996.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Seminars' },
  { id: '6', title: 'Guest Lecture Session', image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Seminars' },
  { id: '7', title: 'Reasoning Workshop', image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Workshops' },
  { id: '8', title: 'Mathematics Speed Workshop', image_url: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Workshops' },
  { id: '9', title: 'English Grammar Workshop', image_url: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Workshops' },
  { id: '10', title: 'Republic Day Celebration', image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Events' },
  { id: '11', title: 'Annual Day Event', image_url: 'https://images.pexels.com/photos/2608024/pexels-photo-2608024.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Events' },
  { id: '12', title: 'Student Felicitation', image_url: 'https://images.pexels.com/photos/1546929/pexels-photo-1546929.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Events' },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('gallery_items').select('*').eq('is_active', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setGalleryImages(data as GalleryItem[]);
      else setGalleryImages(fallbackImages);
      setLoading(false);
    });
  }, []);

  const filtered = activeFilter === 'All' ? galleryImages : galleryImages.filter(img => img.category === activeFilter);

  return (
    <>
      <PageHeader title="Gallery" subtitle="Glimpses of our vibrant learning community and celebrations" breadcrumb={[{ label: 'Gallery' }]} />
      <section className="py-5" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="text-center mb-4 fade-in">
            {categories.map(cat => (
              <button key={cat} className={`gallery-filter-btn ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
            ))}
          </div>
          {loading ? <div className="loading-spinner"></div> : (
          <div className="row g-3">
            {filtered.map((img, i) => (
              <div className="col-lg-4 col-md-6 fade-in" key={img.id}>
                <div className="gallery-item" onClick={() => setLightbox(img.image_url.replace('w=400', 'w=800'))}>
                  <img src={img.image_url} alt={img.title} />
                  <div className="gallery-item-overlay">
                    <div className="text-center text-white"><i className="fas fa-search-plus mb-1"></i><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{img.title}</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><i className="fas fa-times"></i></button>
          <img src={lightbox} alt="Full view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
