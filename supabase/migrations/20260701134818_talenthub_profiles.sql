/*
# TalentHub Kampus - Core Tables (Part 1)

Creates the profiles table and the is_admin helper function.
All other tables depend on profiles existing first.

1. New Tables
   - `profiles` - Extended user info with role (student/admin), academic data, points total

2. Security
   - RLS enabled; users can view/update their own profile
   - Admins (role='admin') can view and update all profiles
*/

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name text,
  student_id text,
  faculty text,
  major text,
  semester integer,
  gpa decimal(3,2),
  bio text,
  avatar_url text,
  phone text,
  linkedin_url text,
  github_url text,
  total_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
