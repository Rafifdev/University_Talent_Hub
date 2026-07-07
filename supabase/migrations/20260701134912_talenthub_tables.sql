/*
# TalentHub Kampus - Helper Function and Remaining Tables (Part 2)

Now that profiles exists, we create the is_admin() helper and all other tables.

1. New Function
   - `is_admin()` - returns true if current user has role='admin' in profiles

2. New Tables
   - `skills`, `certificates`, `portfolios` - student talent data
   - `submissions` - verification workflow
   - `point_history` - point transaction log
   - `rewards`, `reward_redemptions` - reward system
   - `opportunities`, `opportunity_applications` - opportunity board
   - `notifications` - user notifications

3. Security
   - All tables have RLS enabled
   - Students own their data; admins see everything
   - Public read on rewards and opportunities

4. Seed Data
   - 6 sample rewards
   - 6 sample opportunities
*/

-- ============================================================
-- HELPER FUNCTION: Check if current user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Update profiles policies to allow admin access
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id OR is_admin()) WITH CHECK (auth.uid() = id OR is_admin());

-- ============================================================
-- TABLE: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  description text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own skills" ON skills;
CREATE POLICY "Students can view own skills" ON skills FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can insert own skills" ON skills;
CREATE POLICY "Students can insert own skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own skills" ON skills;
CREATE POLICY "Students can update own skills" ON skills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can delete own skills" ON skills;
CREATE POLICY "Students can delete own skills" ON skills FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  description text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own certificates" ON certificates;
CREATE POLICY "Students can view own certificates" ON certificates FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can insert own certificates" ON certificates;
CREATE POLICY "Students can insert own certificates" ON certificates FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own certificates" ON certificates;
CREATE POLICY "Students can update own certificates" ON certificates FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can delete own certificates" ON certificates;
CREATE POLICY "Students can delete own certificates" ON certificates FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TABLE: portfolios
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  project_url text,
  repo_url text,
  tech_stack text[] DEFAULT '{}',
  thumbnail_url text,
  type text NOT NULL DEFAULT 'project' CHECK (type IN ('project', 'design', 'research', 'other')),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own portfolios" ON portfolios;
CREATE POLICY "Students can view own portfolios" ON portfolios FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can insert own portfolios" ON portfolios;
CREATE POLICY "Students can insert own portfolios" ON portfolios FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own portfolios" ON portfolios;
CREATE POLICY "Students can update own portfolios" ON portfolios FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can delete own portfolios" ON portfolios;
CREATE POLICY "Students can delete own portfolios" ON portfolios FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TABLE: submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('skill', 'certificate', 'portfolio')),
  reference_id uuid NOT NULL,
  reference_name text NOT NULL,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('draft', 'waiting', 'approved', 'rejected')),
  notes text,
  rejection_reason text,
  points_awarded integer DEFAULT 0,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own submissions" ON submissions;
CREATE POLICY "Students can view own submissions" ON submissions FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can insert own submissions" ON submissions;
CREATE POLICY "Students can insert own submissions" ON submissions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update submissions" ON submissions;
CREATE POLICY "Users can update submissions" ON submissions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Students can delete draft submissions" ON submissions;
CREATE POLICY "Students can delete draft submissions" ON submissions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: point_history
-- ============================================================
CREATE TABLE IF NOT EXISTS point_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('earned', 'spent')),
  points integer NOT NULL,
  description text NOT NULL,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE point_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own point history" ON point_history;
CREATE POLICY "Users can view own point history" ON point_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Allow insert point history" ON point_history;
CREATE POLICY "Allow insert point history" ON point_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

-- ============================================================
-- TABLE: rewards
-- ============================================================
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  quantity integer NOT NULL DEFAULT -1,
  remaining_quantity integer DEFAULT -1,
  image_url text,
  category text DEFAULT 'general',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view rewards" ON rewards;
CREATE POLICY "Anyone can view rewards" ON rewards FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert rewards" ON rewards;
CREATE POLICY "Admins can insert rewards" ON rewards FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update rewards" ON rewards;
CREATE POLICY "Admins can update rewards" ON rewards FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete rewards" ON rewards;
CREATE POLICY "Admins can delete rewards" ON rewards FOR DELETE
  TO authenticated USING (is_admin());

-- ============================================================
-- TABLE: reward_redemptions
-- ============================================================
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id),
  reward_name text NOT NULL,
  points_spent integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'fulfilled', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own redemptions" ON reward_redemptions;
CREATE POLICY "Users can view own redemptions" ON reward_redemptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can insert own redemptions" ON reward_redemptions;
CREATE POLICY "Users can insert own redemptions" ON reward_redemptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update redemptions" ON reward_redemptions;
CREATE POLICY "Admins can update redemptions" ON reward_redemptions FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE: opportunities
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'internship' CHECK (type IN ('internship', 'competition', 'scholarship', 'event', 'research')),
  company text,
  location text,
  deadline date,
  requirements text[] DEFAULT '{}',
  link text,
  active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view opportunities" ON opportunities;
CREATE POLICY "Anyone can view opportunities" ON opportunities FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert opportunities" ON opportunities;
CREATE POLICY "Admins can insert opportunities" ON opportunities FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update opportunities" ON opportunities;
CREATE POLICY "Admins can update opportunities" ON opportunities FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete opportunities" ON opportunities;
CREATE POLICY "Admins can delete opportunities" ON opportunities FOR DELETE
  TO authenticated USING (is_admin());

-- ============================================================
-- TABLE: opportunity_applications
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunity_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'accepted', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own applications" ON opportunity_applications;
CREATE POLICY "Users can view own applications" ON opportunity_applications FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can insert own applications" ON opportunity_applications;
CREATE POLICY "Users can insert own applications" ON opportunity_applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update applications" ON opportunity_applications;
CREATE POLICY "Admins can update applications" ON opportunity_applications FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system' CHECK (type IN ('submission', 'reward', 'opportunity', 'system')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow insert notifications" ON notifications;
CREATE POLICY "Allow insert notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_point_history_user_id ON point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_applications_user_id ON opportunity_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================
-- SEED: Default rewards and opportunities
-- ============================================================
INSERT INTO rewards (name, description, points_required, quantity, remaining_quantity, category)
SELECT * FROM (VALUES
  ('Voucher Canteen Rp 50.000', 'Voucher makan gratis di kantin kampus senilai Rp 50.000', 500, 50, 50, 'food'),
  ('Voucher Buku Rp 100.000', 'Voucher pembelian buku di toko buku kampus', 1000, 30, 30, 'education'),
  ('Free Access Premium Course 1 Bulan', 'Akses premium ke platform kursus online selama 1 bulan', 2000, -1, -1, 'education'),
  ('Sertifikat Apresiasi', 'Sertifikat penghargaan atas prestasi mahasiswa', 300, -1, -1, 'achievement'),
  ('Merchandise Kampus', 'Merchandise eksklusif kampus (kaos, mug, tote bag)', 800, 100, 100, 'merchandise'),
  ('Beasiswa Partial 1 Semester', 'Potongan SPP 10% untuk satu semester', 5000, 5, 5, 'scholarship')
) AS v(name, description, points_required, quantity, remaining_quantity, category)
WHERE NOT EXISTS (SELECT 1 FROM rewards LIMIT 1);

INSERT INTO opportunities (title, description, type, company, location, deadline, requirements)
SELECT * FROM (VALUES
  ('Software Engineer Intern', 'Bergabunglah dengan tim engineering kami sebagai software engineer intern. Kesempatan untuk bekerja pada produk yang digunakan jutaan pengguna.', 'internship', 'Gojek', 'Jakarta (Hybrid)', '2025-03-31'::date, ARRAY['React', 'TypeScript', 'Node.js']),
  ('UI/UX Design Intern', 'Bantu kami menciptakan pengalaman pengguna yang luar biasa. Kamu akan bekerja langsung dengan desainer senior.', 'internship', 'Tokopedia', 'Jakarta', '2025-02-28'::date, ARRAY['Figma', 'Adobe XD', 'Design Thinking']),
  ('Hackathon AI Innovation 2025', 'Kompetisi hackathon nasional bertema Artificial Intelligence for Social Good. Hadiah total Rp 100 juta.', 'competition', 'Kemenkominfo', 'Online', '2025-04-15'::date, ARRAY['Machine Learning', 'Python', 'Problem Solving']),
  ('Beasiswa LPDP 2025', 'Program beasiswa penuh untuk studi S2/S3 dalam dan luar negeri dari Lembaga Pengelola Dana Pendidikan.', 'scholarship', 'LPDP', 'Seluruh Indonesia', '2025-05-30'::date, ARRAY['IPK min 3.5', 'English Proficiency', 'Leadership']),
  ('Research Assistant - AI Lab', 'Bergabung sebagai research assistant di AI Lab kampus. Fokus penelitian pada NLP dan Computer Vision.', 'research', 'AI Lab BINUS', 'Jakarta', '2025-02-15'::date, ARRAY['Python', 'PyTorch', 'Research Paper Writing']),
  ('Workshop Web3 & Blockchain', 'Workshop 2 hari tentang pengembangan aplikasi Web3 menggunakan Solidity dan Ethereum.', 'event', 'Blockchain Indonesia', 'Bandung', '2025-03-10'::date, ARRAY[]::text[])
) AS v(title, description, type, company, location, deadline, requirements)
WHERE NOT EXISTS (SELECT 1 FROM opportunities LIMIT 1);
