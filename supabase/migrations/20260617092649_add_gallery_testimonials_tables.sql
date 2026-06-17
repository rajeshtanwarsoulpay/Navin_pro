/*
# Add gallery & testimonials tables, update RLS for admin CRUD

1. New Tables
- `gallery_items` — Photo gallery entries with category, title, image URL, and active toggle
- `testimonials` — Student testimonials shown on the homepage with name, exam, quote, photo, and active toggle

2. RLS Policy Updates
- Existing public tables (notes, results, blog_posts, exams, courses) already have authenticated write policies.
- New tables get the same pattern: anon+authenticated read (is_active only), authenticated full write.
- contact_submissions and newsletter_subscriptions remain unchanged (insert-only for anon).

3. Column Details
- gallery_items: id, title, image_url, category, is_active, created_at
- testimonials: id, name, exam, quote, photo_url, is_active, created_at

4. Important Notes
- 1. gallery_items uses simple categories (Classroom, Seminars, Workshops, Events, Celebrations)
- 2. testimonials are separate from results — they appear on the homepage hero section
- 3. All policies use DROP IF EXISTS before CREATE for idempotency
*/

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'Classroom',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_items" ON gallery_items;
CREATE POLICY "public_read_gallery_items" ON gallery_items FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_gallery_items" ON gallery_items;
CREATE POLICY "authenticated_insert_gallery_items" ON gallery_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_gallery_items" ON gallery_items;
CREATE POLICY "authenticated_update_gallery_items" ON gallery_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_gallery_items" ON gallery_items;
CREATE POLICY "authenticated_delete_gallery_items" ON gallery_items FOR DELETE
  TO authenticated USING (true);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam text NOT NULL,
  quote text NOT NULL,
  photo_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_testimonials" ON testimonials;
CREATE POLICY "authenticated_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_testimonials" ON testimonials;
CREATE POLICY "authenticated_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_testimonials" ON testimonials;
CREATE POLICY "authenticated_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);
