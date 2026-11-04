-- ==============================================================================
-- SUPABASE / POSTGRESQL SCHEMA FOR FERRY PORTFOLIO
-- Compatible with PostgreSQL 15+ and Supabase Cloud
-- ==============================================================================

-- 1. EXTENSIONS
-- Ekstensi untuk menghasilkan UUID acak secara native di Postgres
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MASTER DATA TABLES
-- ==============================================================================

-- 2.1 Kategori Proyek (Company Profile, Web Application, Mobile App, dll.)
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Kategori Tech Stack (Frontend, Backend, Mobile, DevOps, dll.)
CREATE TABLE IF NOT EXISTS tech_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Item Teknologi / Tech Stack
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES tech_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    icon_key VARCHAR(100) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PROJECTS & RELATIONS (MANY-TO-MANY)
-- ==============================================================================

-- 3.1 Tabel Utama Proyek
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    problem TEXT,
    solution TEXT,
    contribution TEXT,
    role VARCHAR(150),
    year VARCHAR(10),
    status VARCHAR(50) DEFAULT 'Completed',
    featured BOOLEAN DEFAULT FALSE,
    cover_image TEXT,
    preview_images TEXT[] DEFAULT '{}',
    demo_url TEXT,
    repo_url TEXT,
    highlights TEXT[] DEFAULT '{}',
    architecture TEXT[] DEFAULT '{}',
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Tabel Pivot Penghubung Projects dan Technologies (Many-to-Many)
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

-- ==============================================================================
-- 4. CREDENTIALS, EXPERIENCES, & SITE SETTINGS
-- ==============================================================================

-- 4.1 Sertifikasi & Lisensi
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    credential_id VARCHAR(150),
    credential_url TEXT,
    summary TEXT,
    skills TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Pengalaman Kerja & Pendidikan
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    organization_url TEXT,
    location VARCHAR(150),
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50),
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    highlights TEXT[] DEFAULT '{}',
    type VARCHAR(50) DEFAULT 'experience', -- 'work', 'internship', 'education', 'organization'
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Pengaturan Global & Social Media (Key-Value JSONB)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. INDEXES UNTUK OPTIMASI PERFORMA QUERY
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_technologies_category_id ON technologies(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_certificates_category ON certificates(category);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6.1 Policies: PUBLIC READ (Pengunjung umum hanya bisa membaca / SELECT)
-- ------------------------------------------------------------------------------
CREATE POLICY "Allow public read on project_categories" ON project_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on tech_categories" ON tech_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on project_technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read on certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 6.2 Policies: ADMIN FULL ACCESS (User login/authenticated bisa CRUD)
-- ------------------------------------------------------------------------------
CREATE POLICY "Allow admin full access on project_categories" ON project_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on tech_categories" ON tech_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on technologies" ON technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on project_technologies" ON project_technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on certificates" ON certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET (PORTFOLIO-ASSETS)
-- ==============================================================================

-- Buat bucket penyimpanan gambar jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Siapapun bisa melihat gambar (Public Read)
CREATE POLICY "Public Read Portfolio Assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Policy Storage: Hanya admin terautentikasi yang bisa upload & hapus
CREATE POLICY "Admin Upload Portfolio Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin Delete Portfolio Assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets');
