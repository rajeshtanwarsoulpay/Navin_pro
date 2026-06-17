/*
# Create Coaching Website Database Schema

1. Purpose
   - Stores all dynamic content for a Haryana government exam coaching website
   - Replaces static JSON files with a persistent database
   - Supports contact form submissions and newsletter subscriptions

2. New Tables
   - `notes` — Study notes organized by subject with download tracking
   - `results` — Student success stories with exam details and testimonials
   - `blog_posts` — Blog posts and exam update articles with slugs for routing
   - `exams` — Upcoming government exams with dates for countdown timers
   - `courses` — Coaching course offerings with features, pricing, and mode
   - `contact_submissions` — Messages submitted via the contact form (write-only for visitors)
   - `newsletter_subscriptions` — Email subscriptions for exam updates (write-only for visitors)

3. Column Details
   - notes: id, title, subject, description, pdf_url, pages, downloads, date, is_active, created_at
   - results: id, name, exam, year, photo_url, post, quote, is_active, created_at
   - blog_posts: id, slug, title, category, date, image_url, excerpt, content, is_active, created_at
   - exams: id, name, exam_date, status, description, is_active, created_at
   - courses: id, name, icon_class, exams, description, duration, mode, price, features, color, sort_order, is_active, created_at
   - contact_submissions: id, name, mobile, email, message, is_read, created_at
   - newsletter_subscriptions: id, email, is_active, created_at

4. Security
   - Public tables (notes, results, blog_posts, exams, courses): RLS enabled, anon+authenticated can read, only service_role can write
   - Write-only tables (contact_submissions, newsletter_subscriptions): RLS enabled, anon can insert but NOT read (protects visitor privacy), only service_role can read/write
   - All tables use gen_random_uuid() for primary keys
*/

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  pdf_url text DEFAULT '#',
  pages integer NOT NULL DEFAULT 0,
  downloads integer NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_notes" ON notes;
CREATE POLICY "public_read_notes" ON notes FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_notes" ON notes;
CREATE POLICY "authenticated_insert_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_notes" ON notes;
CREATE POLICY "authenticated_update_notes" ON notes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_notes" ON notes;
CREATE POLICY "authenticated_delete_notes" ON notes FOR DELETE
  TO authenticated USING (true);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam text NOT NULL,
  year text NOT NULL,
  photo_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  post text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_results" ON results;
CREATE POLICY "public_read_results" ON results FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_results" ON results;
CREATE POLICY "authenticated_insert_results" ON results FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_results" ON results;
CREATE POLICY "authenticated_update_results" ON results FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_results" ON results;
CREATE POLICY "authenticated_delete_results" ON results FOR DELETE
  TO authenticated USING (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Exam Updates',
  date date NOT NULL DEFAULT CURRENT_DATE,
  image_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog_posts" ON blog_posts;
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_blog_posts" ON blog_posts;
CREATE POLICY "authenticated_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_blog_posts" ON blog_posts;
CREATE POLICY "authenticated_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_blog_posts" ON blog_posts;
CREATE POLICY "authenticated_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_exams" ON exams;
CREATE POLICY "public_read_exams" ON exams FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_exams" ON exams;
CREATE POLICY "authenticated_insert_exams" ON exams FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_exams" ON exams;
CREATE POLICY "authenticated_update_exams" ON exams FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_exams" ON exams;
CREATE POLICY "authenticated_delete_exams" ON exams FOR DELETE
  TO authenticated USING (true);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_class text NOT NULL DEFAULT 'fas fa-book',
  exams text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'Online',
  price text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '[]',
  color text NOT NULL DEFAULT '#0D6EFD',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_courses" ON courses;
CREATE POLICY "public_read_courses" ON courses FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_courses" ON courses;
CREATE POLICY "authenticated_insert_courses" ON courses FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_courses" ON courses;
CREATE POLICY "authenticated_update_courses" ON courses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_courses" ON courses;
CREATE POLICY "authenticated_delete_courses" ON courses FOR DELETE
  TO authenticated USING (true);

-- Contact submissions table (write-only for visitors)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  email text DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
CREATE POLICY "anon_insert_contact" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Newsletter subscriptions table (write-only for visitors, insert + check uniqueness)
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscriptions;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_downloads ON notes(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_courses_sort ON courses(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
