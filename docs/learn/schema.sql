-- ==============================================================================
-- SUPABASE / POSTGRESQL SCHEMA FOR FERRY PORTFOLIO
-- Compatible with PostgreSQL 15+ and Supabase Cloud
-- ==============================================================================

-- ==============================================================================
-- MIGRATION SCRIPT (ALTER TABLE)
-- Jika Anda sudah menjalankan skema sebelumnya di Supabase, jalankan blok ini:
-- ==============================================================================
/*
-- 1. Hapus kolom priority dari project_categories & technologies (tidak diperlukan)
ALTER TABLE project_categories DROP COLUMN IF EXISTS priority;
ALTER TABLE technologies DROP COLUMN IF EXISTS priority;

-- 2. Pastikan deskripsi ada di kategori tech & sertifikat
ALTER TABLE tech_categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE certificate_categories ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Pembaruan tabel EXPERIENCES (sesuai referensi UI profesional):
-- Ganti location menjadi industry (sektor industri, e.g. 'Software Developer Agency')
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS industry VARCHAR(150);
-- Tambahkan array technologies untuk tag tech stack di bawah kartu
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS organization_url TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS priority INT DEFAULT 1;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Migrasikan data location lama ke industry jika ada
UPDATE experiences SET industry = location WHERE industry IS NULL AND location IS NOT NULL;
*/

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MASTER DATA TABLES
-- ==============================================================================

-- 2.1 Kategori Proyek (Company Profile, Web Application, Mobile App, dll.)
-- Catatan: Kategori proyek diurutkan secara alfabetis (A-Z) berdasarkan nama.
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
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

-- 4.1 Kategori Sertifikasi & Kredensial
CREATE TABLE IF NOT EXISTS certificate_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Sertifikasi & Lisensi
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

-- 4.3 Pengalaman Kerja (Career History)
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(255) NOT NULL,                  -- Posisi/Jabatan (e.g. 'Co-founder · Full-Stack Developer')
    organization VARCHAR(255) NOT NULL,          -- Perusahaan/Agensi (e.g. 'JDNirwana')
    organization_url TEXT,                       -- Link web perusahaan (e.g. 'https://nirwana.biz.id')
    industry VARCHAR(150),                       -- Sektor Industri (e.g. 'Software Developer Agency')
    start_date DATE NOT NULL,                    -- Tanggal mulai (tipe DATE)
    end_date DATE,                               -- Tanggal selesai (tipe DATE, NULLABLE jika is_current / aktif)
    is_current BOOLEAN DEFAULT FALSE,            -- Jika true atau end_date NULL, tampil sebagai 'Present'
    description TEXT,                            -- Ringkasan peran / summary
    highlights TEXT[] DEFAULT '{}',              -- Key Focus & Responsibilities (point list dinamis)
    technologies TEXT[] DEFAULT '{}',            -- Tags teknologi yang digunakan
    priority INT DEFAULT 1,                      -- Prioritas tampil (angka terkecil = nomor 1 & auto-open di landing page)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Riwayat Pendidikan (Formal Education & Academics)
CREATE TABLE IF NOT EXISTS educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(255) NOT NULL,          -- Universitas / Institusi (e.g. 'Horizon University Indonesia')
    major VARCHAR(255) NOT NULL,                -- Jurusan / Bidang Studi (e.g. 'Information Systems')
    program VARCHAR(100),                       -- Jenjang / Program (e.g. 'Bachelor''s Degree', 'Senior High School', 'Diploma')
    gpa VARCHAR(50),                            -- Nilai / IPK (e.g. '3.96 / 4.00')
    start_date DATE NOT NULL,                   -- Tanggal mulai studi (tipe DATE)
    end_date DATE,                              -- Tanggal kelulusan (tipe DATE, NULLABLE jika is_current / aktif)
    is_current BOOLEAN DEFAULT FALSE,           -- Jika true atau end_date NULL, tampil sebagai 'Present'
    description TEXT,                           -- Ringkasan fokus studi / program
    achievements TEXT[] DEFAULT '{}',           -- Key Distinctions & Honors (poin prestasi/penghargaan dinamis)
    priority INT DEFAULT 1,                     -- Prioritas urutan tampil (angka 1 = nomor 1 & auto-open di landing page)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.5 Pengaturan Global & Social Media (Key-Value JSONB)
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
CREATE INDEX IF NOT EXISTS idx_experiences_priority ON experiences(priority);
CREATE INDEX IF NOT EXISTS idx_educations_priority ON educations(priority);

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
ALTER TABLE certificate_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Allow public read on certificate_categories" ON certificate_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on educations" ON educations FOR SELECT USING (true);
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
CREATE POLICY "Allow admin full access on certificate_categories" ON certificate_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on educations" ON educations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. MIGRATION COMMANDS (Jalankan ini di Supabase SQL Editor jika tabel sudah ada)
-- ==============================================================================
/*
-- 1. Buat tabel terpisah 'educations'
CREATE TABLE IF NOT EXISTS educations (
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
    priority INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on educations" ON educations FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on educations" ON educations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Migrasikan riwayat pendidikan dari 'experiences' lama (jika sebelumnya tersimpan di experiences dengan type='education')
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'type'
    ) THEN
        INSERT INTO educations (role, organization, organization_url, location, start_date, end_date, is_current, description, highlights, priority, created_at)
        SELECT role, organization, organization_url, location, start_date, end_date, is_current, description, highlights, priority, created_at
        FROM experiences WHERE type = 'education';

        DELETE FROM experiences WHERE type = 'education';
    END IF;
END $$;

-- 3. Rapikan tabel 'experiences' murni untuk pekerjaan/karir:
--    - Ubah kolom location menjadi industry
--    - Tambahkan kolom technologies
--    - Hapus kolom type
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS industry VARCHAR(150);
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'location'
    ) THEN
        UPDATE experiences SET industry = location WHERE industry IS NULL AND location IS NOT NULL;
        ALTER TABLE experiences DROP COLUMN location;
    END IF;
END $$;

ALTER TABLE experiences DROP COLUMN IF EXISTS type;

-- 4. Ubah tipe data start_date dan end_date menjadi DATE (nullable untuk end_date)
--    Konversi aman menangani format string lama seperti '2026' atau 'Dec 2023'
ALTER TABLE experiences 
    ALTER COLUMN start_date TYPE DATE 
    USING (
        CASE 
            WHEN start_date::text ~ '^\d{4}-\d{2}-\d{2}' THEN start_date::DATE
            WHEN start_date::text ~ '^\d{4}' THEN (start_date || '-01-01')::DATE
            ELSE NOW()::DATE
        END
    );

ALTER TABLE experiences 
    ALTER COLUMN end_date DROP NOT NULL,
    ALTER COLUMN end_date TYPE DATE 
    USING (
        CASE 
            WHEN end_date IS NULL OR end_date::text = '' OR end_date::text ILIKE '%present%' THEN NULL
            WHEN end_date::text ~ '^\d{4}-\d{2}-\d{2}' THEN end_date::DATE
            WHEN end_date::text ~ '^\d{4}' THEN (end_date || '-01-01')::DATE
            ELSE NULL
        END
    );

-- 5. Perbarui struktur tabel 'educations' ke skema mutakhir:
--    - Ubah role -> major, organization -> institution, highlights -> achievements
--    - Tambah gpa & pastikan start_date / end_date bertipe DATE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'role') THEN
        ALTER TABLE educations RENAME COLUMN role TO major;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'organization') THEN
        ALTER TABLE educations RENAME COLUMN organization TO institution;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'highlights') THEN
        ALTER TABLE educations RENAME COLUMN highlights TO achievements;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'location') THEN
        ALTER TABLE educations DROP COLUMN location;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'educations' AND column_name = 'organization_url') THEN
        ALTER TABLE educations DROP COLUMN organization_url;
    END IF;
END $$;

ALTER TABLE educations ADD COLUMN IF NOT EXISTS gpa VARCHAR(50);
ALTER TABLE educations ADD COLUMN IF NOT EXISTS program VARCHAR(100);
ALTER TABLE educations ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}';

ALTER TABLE educations 
    ALTER COLUMN start_date TYPE DATE 
    USING (
        CASE 
            WHEN start_date::text ~ '^\d{4}-\d{2}-\d{2}' THEN start_date::DATE
            WHEN start_date::text ~ '^\d{4}' THEN (start_date || '-01-01')::DATE
            ELSE NOW()::DATE
        END
    );

ALTER TABLE educations 
    ALTER COLUMN end_date DROP NOT NULL,
    ALTER COLUMN end_date TYPE DATE 
    USING (
        CASE 
            WHEN end_date IS NULL OR end_date::text = '' OR end_date::text ILIKE '%present%' THEN NULL
            WHEN end_date::text ~ '^\d{4}-\d{2}-\d{2}' THEN end_date::DATE
            WHEN end_date::text ~ '^\d{4}' THEN (end_date || '-01-01')::DATE
            ELSE NULL
        END
    );
*/
