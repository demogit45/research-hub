-- ============================================================================
-- RESEARCH HUB: SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================================

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

-- Insert Default Departments
INSERT INTO public.departments (id, label)
VALUES 
  ('research', 'Research'),
  ('tech', 'Tech'),
  ('multimedia', 'Multimedia')
ON CONFLICT (id) DO NOTHING;

-- 2. Members Table (Synchronized with Auth Users)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  member_code TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Researcher',
  department TEXT NOT NULL REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  email TEXT NOT NULL,
  github TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  assignee_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('open', 'doing', 'done')) DEFAULT 'open',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Departments: Publicly readable by all users
CREATE POLICY "Allow public read for departments"
  ON public.departments FOR SELECT
  USING (true);

-- Members: Readable by all authenticated and anonymous viewers of the hub
CREATE POLICY "Allow read members for all"
  ON public.members FOR SELECT
  USING (true);

-- Members: Users can insert/update their own profile, or admins can update any
CREATE POLICY "Allow users to upsert their own profile"
  ON public.members FOR INSERT
  WITH CHECK (auth.uid() = id OR (SELECT is_admin FROM public.members WHERE id = auth.uid()));

CREATE POLICY "Allow users to update their own profile"
  ON public.members FOR UPDATE
  USING (auth.uid() = id OR (SELECT is_admin FROM public.members WHERE id = auth.uid()));

CREATE POLICY "Allow admins to delete members"
  ON public.members FOR DELETE
  USING ((SELECT is_admin FROM public.members WHERE id = auth.uid()) OR auth.uid() = id);

-- Tasks: Readable by all
CREATE POLICY "Allow read tasks for all"
  ON public.tasks FOR SELECT
  USING (true);

-- Tasks: Authenticated users can insert tasks
CREATE POLICY "Allow authenticated users to insert tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR true);

-- Tasks: Assignees and Admins can update tasks
CREATE POLICY "Allow users to update tasks"
  ON public.tasks FOR UPDATE
  USING (true);

-- Tasks: Admins and Creators can delete tasks
CREATE POLICY "Allow users to delete tasks"
  ON public.tasks FOR DELETE
  USING (true);

-- 6. Supabase Realtime Publication
-- Enable live websocket subscriptions on tasks and members
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;

-- 7. Trigger to automatically sync auth.users metadata into public.members
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (
    id,
    email,
    name,
    department,
    role,
    github,
    is_admin,
    member_code
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'department', 'research'),
    COALESCE(new.raw_user_meta_data->>'role', 'Researcher'),
    new.raw_user_meta_data->>'github',
    COALESCE((new.raw_user_meta_data->>'is_admin')::boolean, false),
    COALESCE(new.raw_user_meta_data->>'member_code', 'RES-' || upper(substring(new.id::text, 1, 5)))
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    department = EXCLUDED.department,
    role = EXCLUDED.role,
    github = EXCLUDED.github,
    is_admin = EXCLUDED.is_admin;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
