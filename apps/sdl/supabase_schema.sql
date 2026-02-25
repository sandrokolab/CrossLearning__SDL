-- Create sites table
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone logged in can read sites
CREATE POLICY "Allow authenticated users to read sites" 
ON sites FOR SELECT 
TO authenticated 
USING (true);

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT,
    role TEXT CHECK (role IN ('Student', 'Educator', 'Content Creator', 'Administrator')),
    site_id UUID REFERENCES sites(id),
    academy_id UUID, -- Will link to academies table later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Academies
CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read academies" ON academies FOR SELECT TO authenticated USING (true);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail TEXT,
    site_id UUID REFERENCES sites(id),
    academy_id UUID REFERENCES academies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read courses for their site" 
ON courses FOR SELECT 
TO authenticated 
USING (site_id IS NULL OR site_id = (SELECT site_id FROM profiles WHERE id = auth.uid()));

-- Insert initial sites
INSERT INTO sites (name) VALUES 
('Planta Monterrey - Ensamble A'),
('Planta CDMX - Fundición'),
('Planta Guadalajara - Logística');
