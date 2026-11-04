# Roadmap Pembelajaran: Integrasi Next.js + Supabase + Shadcn Admin Dashboard

Dokumen ini adalah panduan komprehensif untuk mentransformasi portofolio personal dari **berkas data statis lokal (`data/*.json`)** menjadi **aplikasi dinamis berbasis cloud database** dengan **Admin Dashboard** pribadi yang diamankan.

---

## 🎯 Target Akhir Sistem

1. **Admin Dashboard Terproteksi (`/admin/*`)**:
   - Dilindungi autentikasi login (Supabase Auth + Next.js Middleware).
   - Dibuat menggunakan komponen UI modern dari **Shadcn UI** (Table, Dialog, Form, Badge, Combobox).
2. **Master Data Tech Stack Dinamis**:
   - Tech stack dikelompokkan berdasarkan kategori (Frontend, Backend, Mobile, DevOps, dll.).
   - Menambah 1 tech stack baru di admin dashboard langsung membuatnya muncul di landing page publik secara otomatis.
3. **Sistem Proyek Terhubung (Many-to-Many Tagging)**:
   - Saat membuat atau mengedit proyek, tech stack dapat dipilih secara dinamis dari database (seperti sistem tags).
   - Gambar sampul proyek diunggah langsung ke **Supabase Storage Bucket**.
4. **Modul Pengelolaan Lengkap**:
   - CRUD Kategori & Item Tech Stack
   - CRUD Proyek & Relasi Tagging
   - CRUD Sertifikasi & Lisensi
   - CRUD Pengalaman Kerja & Riwayat Pendidikan
   - CRUD Tautan Media Sosial & Status Bio
5. **On-Demand Cache Invalidation**:
   - Memanfaatkan Next.js `revalidatePath` agar halaman publik langsung terbarui tanpa perlu *re-deploy*.

---

## 🏗️ Arsitektur & Entity Relationship Diagram (ERD)

Kunci utama sistem dinamis ini terletak pada **Relasi Many-to-Many** antara tabel `projects` dan `technologies` melalui tabel perantara (*pivot table*) `project_technologies`.

```mermaid
erDiagram
    PROJECT_CATEGORIES ||--o{ PROJECTS : "mengklasifikasikan"
    TECH_CATEGORIES ||--o{ TECHNOLOGIES : "mengelompokkan"
    TECHNOLOGIES ||--o{ PROJECT_TECHNOLOGIES : "dipakai sebagai tag"
    PROJECTS ||--o{ PROJECT_TECHNOLOGIES : "menggunakan"

    PROJECT_CATEGORIES {
        uuid id PK
        string name
        string slug
        int priority
        timestamp created_at
    }
    PROJECTS {
        uuid id PK
        uuid category_id FK
        string title
        string slug
        text summary
        text problem
        text solution
        string cover_image
        string status
        int year
        string demo_url
        string repo_url
        boolean featured
        int priority
        timestamp created_at
    }
    TECH_CATEGORIES {
        uuid id PK
        string name
        string slug
        int priority
        timestamp created_at
    }
    TECHNOLOGIES {
        uuid id PK
        uuid category_id FK
        string name
        string slug
        string icon_key
        boolean is_featured
        int priority
        timestamp created_at
    }
    PROJECT_TECHNOLOGIES {
        uuid project_id FK
        uuid technology_id FK
    }
    CERTIFICATES {
        uuid id PK
        string title
        string issuer
        string issue_date
        string category
        string credential_id
        string credential_url
        text summary
        text_array skills
        boolean featured
        timestamp created_at
    }
    EXPERIENCES {
        uuid id PK
        string role
        string organization
        string location
        string start_date
        string end_date
        boolean is_current
        text description
        string type
        timestamp created_at
    }
    EDUCATIONS {
        uuid id PK
        string institution
        string degree
        string field_of_study
        string start_year
        string end_year
        text description
        timestamp created_at
    }
    SITE_SETTINGS {
        uuid id PK
        string key
        jsonb value
        timestamp updated_at
    }
```

---

## 🧠 Kamus Analogi: Laravel vs Supabase / Next.js

Bagi pengembang dengan latar belakang Laravel, konsep Supabase dan Next.js App Router dapat dipetakan secara langsung:

| Konsep di Supabase + Next.js | Padanan di Laravel | Penjelasan Mental Model |
| :--- | :--- | :--- |
| **Row Level Security (RLS)** | `Policy` / `Gate` di Database | Hak akses baris data ditentukan langsung oleh engine PostgreSQL, bukan cuma di aplikasi |
| **Server Action (`'use server'`)** | `Controller Method` + `FormRequest` | Fungsi server yang dipanggil langsung dari form/UI tanpa perlu membuat rute API manual |
| **`@supabase/ssr`** | `Session Guard` / Cookies | Menyimpan session JWT ke dalam HTTP-Only Cookie yang aman dan terbaca di Server Component |
| **Supabase Storage Bucket** | `Storage::disk('s3')` | Tempat penyimpanan file/gambar fisik di cloud dengan URL publik |
| **`revalidatePath('/')`** | `Cache::forget()` / Event Listener | Memerintahkan Next.js membuang cache halaman statis agar data terbaru langsung tampil |
| **Pivot Table (`project_technologies`)** | Relasi `belongsToMany()` | Tabel penghubung antara entity Project dan Technology |
| **Zod Schema** | `$request->validate([...])` | Skema validasi tipe data dan batasan input sebelum diproses |

---

## 🚀 8 Fase Pelaksanaan Belajar

### Fase 1: Setup Proyek Supabase & Skema PostgreSQL
- [ ] Buat akun dan proyek baru di [supabase.com](https://supabase.com).
- [ ] Eksekusi DDL SQL untuk membuat tabel-tabel utama:
  - `project_categories` (kategori proyek: Company Profile, Web App, Mobile App)
  - `projects` (berelasi ke `project_categories` via `category_id`)
  - `tech_categories` & `technologies` (master tech stack)
  - `project_technologies` (pivot many-to-many antara projects dan technologies)
  - `certificates`, `experiences`, `educations`, `site_settings`
- [ ] Aktifkan **Row Level Security (RLS)** di setiap tabel:
  - Role `anon` (pengunjung web): Hanya diizinkan `SELECT`.
  - Role `authenticated` (admin login): Diizinkan `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- [ ] Buat bucket storage publik bernama `portfolio-assets`.

### Fase 2: Integrasi Supabase SDK di Next.js App Router
- [x] Pasang pustaka dan generator helper resmi Supabase via Shadcn:  
  `bun x --bun shadcn@latest add @supabase/supabase-client-nextjs`
- [ ] Tambahkan konfigurasi kredensial di `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` *(pada UI lama Supabase disebut `anon key`)*
  - *(Opsional kompatibilitas: `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan nilai yang sama)*
- [x] Verifikasi berkas helper client yang ter-generate:
  - `lib/client.ts` untuk komponen browser (`'use client'`).
  - `lib/server.ts` untuk Server Components, Server Actions, dan Route Handlers.
  - `lib/middleware.ts` untuk helper sinkronisasi cookie auth di Next.js middleware.

### Fase 3: Autentikasi & Proteksi Rute Admin
- [ ] Buat halaman login: `app/admin/login/page.tsx` menggunakan komponen Card, Input, dan Button Shadcn.
- [ ] Buat Server Action untuk login via email & password (`supabase.auth.signInWithPassword`).
- [ ] Buat file `middleware.ts` di root project:
  - Proteksi rute `/admin/*` (kecuali `/admin/login`).
  - Refresh cookie session Supabase secara otomatis pada setiap request masuk.

### Fase 4: Shell Layout Dashboard Shadcn UI
- [ ] Buat layout admin: `app/admin/layout.tsx`.
- [ ] Pasang sidebar navigasi vertikal:
  - 📊 Overview (`/admin`)
  - 🛠️ Tech Stack (`/admin/tech-stack`)
  - 📁 Projects (`/admin/projects`)
  - 📜 Certificates (`/admin/certificates`)
  - 💼 Experiences (`/admin/experiences`)
  - 🎓 Educations (`/admin/educations`)
  - ⚙️ Settings / Bio (`/admin/settings`)
- [ ] Pasang tombol Logout yang memicu `supabase.auth.signOut()` dan redirect ke login.

### Fase 5: Modul Master Data — Tech Stack & Kategori CRUD
- [ ] Buat halaman index: `app/admin/tech-stack/page.tsx` dengan Table Shadcn.
- [ ] Buat form modal/drawer untuk menambah & mengedit kategori tech stack.
- [ ] Buat form modal/drawer untuk menambah & mengedit teknologi (nama, slug, pilih kategori via Select Shadcn, icon key, toggle featured).
- [ ] Implementasikan Server Action untuk mutasi database + `revalidatePath`.

### Fase 6: Modul Proyek & Kategori Proyek (Many-to-Many Tags)
- [ ] Buat CRUD `project_categories`: Mengelola kategori proyek (Company Profile, Web App, Mobile App, dll.) beserta prioritas urutan tampil pada tab filter.
- [ ] Buat halaman index proyek: `app/admin/projects/page.tsx`.
- [ ] Buat form proyek: `app/admin/projects/new/page.tsx` & `[id]/page.tsx`:
  - Dropdown Select untuk memilih `category_id` dari tabel `project_categories`.
  - Multi-Select Combobox / Tag Selector untuk memilih teknologi dari tabel `technologies`.
- [ ] Implementasikan upload gambar cover ke bucket `portfolio-assets`.
- [ ] Simpan proyek dan masukkan data relasi ke tabel `project_technologies`.
- [ ] Implementasikan sinkronisasi tags saat proyek diedit (*sync pivot table*).

### Fase 7: Modul Sertifikasi, Pengalaman, & Pendidikan
- [ ] CRUD `certificates`: input judul, penerbit, tanggal, kategori, credential ID, credential URL (link verifikasi eksternal), ringkasan deskripsi, dan tag skills.
- [ ] CRUD `experiences`: input jabatan, organisasi, periode, jenis (pekerjaan/magang), dan deskripsi.
- [ ] CRUD `educations`: input institusi, gelar, jurusan, periode, dan catatan aktivitas.
- [ ] CRUD `site_settings`: kelola tautan sosial media (GitHub, LinkedIn, Instagram, Spotify) dan bio profil.

### Fase 8: Migrasi Halaman Publik (Dari JSON ke Database)
- [ ] Ubah `lib/data.ts` atau buat `lib/queries/*.ts` untuk mengambil data langsung dari Supabase di Server Components:
  - `getAllProjects()` mengambil data dari tabel `projects` join `technologies`.
  - `getAllSkillGroups()` mengambil data dari tabel `tech_categories` join `technologies`.
  - `getAllCertificates()`, `getAllExperiences()`, dll.
- [ ] Lakukan verifikasi performa: data tetap ter-cache di Next.js dan hanya di-revalidate saat ada perubahan dari admin dashboard.

---

## 🛠️ Cara Menggunakan Asisten Belajar Mandiri

Dalam proses pengerjaan roadmap ini, Anda dapat memanfaatkan dua asisten personal di terminal CLI:

1. **Gunakan `/pantau`**:
   - Dipakai saat Anda sedang menulis kode sendiri dan ingin mereview logika:
     > *"Cek kodingan form tech stack gw dong, alurnya udah bener belum?"*
   - Asisten akan membaca `git diff`, memvalidasi logic data flow, memberi analogi Laravel, dan memberikan petunjuk langkah berikutnya tanpa langsung membocorkan jawaban instan.

2. **Gunakan `/jelasin`**:
   - Dipakai saat Anda ingin membedah secara mendalam sebuah konsep teknis, file yang baru saja dibuat, atau arsitektur kode secara komprehensif.
