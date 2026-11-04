# Panduan Komprehensif PostgreSQL & Supabase untuk Developer Laravel / MySQL

Dokumen ini adalah referensi teknis mendalam mengenai arsitektur basis data **PostgreSQL** pada **Supabase**, membedah seluruh baris query skema portofolio, membandingkan secara tajam perbedaannya dengan **MySQL**, serta mengupas tuntas fitur unggulan seperti **JSONB**, **Native Arrays**, dan **Row Level Security (RLS)**.

---

## 📑 Daftar Isi
1. [Perbedaan Mendasar: PostgreSQL vs MySQL](#1-perbedaan-mendasar-postgresql-vs-mysql)
2. [Bedah Mendalam: JSONB (The Superpower of Postgres)](#2-bedah-mendalam-jsonb-the-superpower-of-postgres)
3. [Tipe Data Unik PostgreSQL yang Tidak Ada di MySQL](#3-tipe-data-unik-postgresql-yang-tidak-ada-di-mysql)
4. [Anatomi & Bedah Query `schema.sql`](#4-anatomi--bedah-query-schemasql)
5. [Row Level Security (RLS): Kenapa Ini Revolusioner?](#5-row-level-security-rls-kenapa-ini-revolusioner)
6. [Kamus Istilah & Perintah Esensial Postgres](#6-kamus-istilah--perintah-esensial-postgres)

---

## 1. Perbedaan Mendasar: PostgreSQL vs MySQL

Banyak pengembang yang terbiasa dengan MySQL/MariaDB mengira PostgreSQL hanyalah "database SQL lainnya". Padahal, filosofi dan engine internal keduanya sangat berbeda:

| Aspek | MySQL (InnoDB) | PostgreSQL | Dampak untuk Developer |
| :--- | :--- | :--- | :--- |
| **Kategori Sistem** | Pure Relational (RDBMS) | **Object-Relational (ORDBMS)** | Postgres bisa menyimpan array, tipe data komposit kustom, dan inheritance antar tabel. |
| **Tipe Data Boolean** | Pseudo (`TINYINT(1)`, `0` atau `1`) | **True Boolean** (`true` / `false`) | Di Postgres tidak ada nilai aneh seperti `2` pada kolom boolean. |
| **`VARCHAR` vs `TEXT`** | Berbeda performa. `VARCHAR` di-buffer di memori row, `TEXT` disimpan off-page (LOB). | **Performa identik**. `VARCHAR(N)` hanya memberi constraint panjang karakter. | Di Postgres, tidak perlu overthinking memilih `VARCHAR` vs `TEXT`. Gunakan `TEXT` untuk konten dinamis tanpa penalti performa. |
| **Data Array** | ❌ Tidak ada (harus dipisah koma atau string JSON). | ✅ **Native Array** (`TEXT[]`, `INT[]`). | Mengambil list tags atau highlights bisa dalam 1 kolom tanpa tabel pivot kecil. |
| **JSON Engine** | Disimpan sebagai teks yang divalidasi. Query parse saat runtime. | **`JSONB` (Decomposed Binary Format)** terkompresi & terindeks. | Pencarian key/value JSON di Postgres setara kecepatannya dengan kolom SQL biasa! |
| **Keamanan Data (RLS)** | ❌ Tidak ada di level database (harus di-coding manual di Laravel Policy/Query Scope). | ✅ **Row Level Security (RLS)** bawaan engine kernel database. | Database menolak akses unauthorized meskipun dipanggil langsung dari browser/client. |
| **Pengembalian Data** | Butuh query terpisah: `SELECT LAST_INSERT_ID()`. | Mendukung klausa **`RETURNING *`**. | Sekali `INSERT`, Postgres langsung mengembalikan baris data yang baru dibuat beserta UUID-nya. |

---

## 2. Bedah Mendalam: JSONB (The Superpower of Postgres)

### Apa itu JSONB?
PostgreSQL menyediakan dua tipe: `JSON` biasa dan `JSONB` (*Binary JSON*).
- **`JSON` biasa**: Menyimpan persis teks JSON apa adanya (termasuk spasi dan urutan key). Setiap kali Anda melakukan query, database harus mem-parsing ulang teks tersebut. Lambat.
- **`JSONB`**: Database mem-parsing JSON sekali di awal saat insert, menghapus spasi yang tidak perlu, mengurutkan key, dan menyimpannya dalam format biner yang sangat terkompresi.

### Kapan Menggunakan JSONB vs Tabel Relasional?

> **Aturan Emas Industri**:
> - Gunakan **Tabel Relasional Terpisah** jika data tersebut: Sering difilter, memiliki foreign key, berelasi banyak-ke-banyak, atau perlu integritas ketat (seperti `projects` dan `technologies`).
> - Gunakan **`JSONB`** jika data tersebut: Struktur skemanya sangat fleksibel, key-nya sering bertambah, atau berbentuk konfigurasi semi-terstruktur (seperti `site_settings`).

### Contoh di Tabel `site_settings`:
Di portofolio Anda, kita membuat tabel:
```sql
CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Data yang disimpan di baris `key = 'identity'`:
```json
{
  "name": "Ferry Noer Hendriawan",
  "domain": "ferryhendriawan.my.id",
  "location": "Indonesia",
  "socials": {
    "github": "https://github.com/ryzecl",
    "linkedin": "https://linkedin.com/in/ferry"
  }
}
```

### Cara Query JSONB di PostgreSQL (Cheat Sheet Operator):

| Operator | Fungsi | Contoh Query | Hasil |
| :--- | :--- | :--- | :--- |
| **`->`** | Mengambil objek/elemen turunan **dalam format JSON** | `SELECT value->'socials' FROM site_settings;` | `{"github": "..."}` |
| **`->>`** | Mengambil nilai sebagai **teks polos (Plain String)** | `SELECT value->'socials'->>'github' FROM site_settings;` | `https://github.com/...` |
| **`@>`** | Memeriksa apakah JSON mengandung sub-objek (*Contains*) | `SELECT * FROM site_settings WHERE value @> '{"location": "Indonesia"}';` | Baris yang cocok |
| **`?`** | Memeriksa apakah suatu key ada di dalam JSON | `SELECT * FROM site_settings WHERE value ? 'domain';` | `true` / `false` |

### Indeks GIN (Generalized Inverted Index) pada JSONB
Di MySQL, Anda tidak bisa dengan mudah mengindeks seluruh isi JSON secara otomatis. Di PostgreSQL, Anda cukup menjalankan:
```sql
CREATE INDEX idx_site_settings_value ON site_settings USING GIN (value);
```
Dengan indeks GIN ini, query pencarian apa pun di dalam kedalaman JSONB akan dieksekusi secara instan!

---

## 3. Tipe Data Unik PostgreSQL yang Tidak Ada di MySQL

### A. Native Array (`TEXT[]`)
Pada tabel `projects`:
```sql
highlights TEXT[] DEFAULT '{}',
preview_images TEXT[] DEFAULT '{}'
```
- **Di MySQL**: Anda terpaksa membuat tabel anak `project_highlights (id, project_id, text)` hanya untuk menampung 3-4 butir teks pelengkap.
- **Di Postgres**: Gunakan `TEXT[]`. Cukup kirim array JavaScript `['Next.js 16', 'Tailwind v4']`, Postgres menyimpannya secara elegan sebagai satu unit array native.
- **Cara Query di SQL**:
  ```sql
  -- Mencari project yang highlights-nya mengandung kata tertentu
  SELECT * FROM projects WHERE 'Next.js 16' = ANY(highlights);
  ```

### B. `UUID` Native & `gen_random_uuid()`
- **Di MySQL**: Tipe UUID biasanya diakali menggunakan `VARCHAR(36)` atau `BINARY(16)`.
- **Di Postgres**: `UUID` adalah tipe data native 128-bit asli yang sangat hemat memori (hanya memakan 16 byte fisik). Fungsi `gen_random_uuid()` di-generate langsung oleh kernel kriptografi Postgres tanpa perlu library eksternal.

### C. `TIMESTAMPTZ` (Time Zone Aware)
- **`TIMESTAMP` biasa**: Menyimpan waktu lokal server tanpa info offset zona waktu (bisa rancu jika server di US tapi pengunjung di WIB).
- **`TIMESTAMPTZ`**: Selalu mengonversi dan menyimpan waktu ke format **UTC**, lalu otomatis menampilkan waktu sesuai zona waktu klien yang meminta.

---

## 4. Anatomi & Bedah Query `schema.sql`

Berikut telaah mendalam dari file [`docs/learn/schema.sql`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/docs/learn/schema.sql):

### 1. Ekstensi Kriptografi
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```
*Mengapa ini ada?*  
PostgreSQL memiliki arsitektur modular. Perintah ini mengaktifkan fungsi hashing dan generator UUID acak generasi ke-4 (`gen_random_uuid()`).

---

### 2. Relasi `ON DELETE CASCADE` vs `ON DELETE SET NULL`

Perhatikan perbedaan strategi pada foreign key:

#### Kasus A: `technologies` ke `tech_categories`
```sql
category_id UUID NOT NULL REFERENCES tech_categories(id) ON DELETE CASCADE
```
- Jika kategori "Mobile" dihapus, teknologi di dalamnya (Flutter, Dart) akan ikut terhapus. Ini logis karena teknologi tersebut tidak punya induk kategori.

#### Kasus B: `projects` ke `project_categories`
```sql
category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL
```
- Perhatikan bahwa kolom ini **tidak ada `NOT NULL`** dan menggunakan **`ON DELETE SET NULL`**.
- *Alasannya*: Proyek adalah karya portofolio Anda yang sangat berharga. Jika Anda menghapus kategori "Web Application", data proyek Anda **tidak boleh hilang!** Nilai kategorinya hanya diubah menjadi `NULL` (uncategorized).

---

### 3. Tabel Pivot Many-to-Many (`project_technologies`)
```sql
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);
```
- Ini adalah teknik standar industri untuk relasi Many-to-Many.
- Baris `PRIMARY KEY (project_id, technology_id)` disebut **Composite Primary Key**. Efeknya: Postgres secara fisik melarang kombinasi pasangan ganda. Satu proyek tidak mungkin memiliki tag teknologi "Next.js" dua kali.

---

### 4. Indexing Strategis
```sql
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
```
- Saat pengguna membuka tautan `/projects/brava`, Next.js akan memanggil query:
  `SELECT * FROM projects WHERE slug = 'brava'`
- Karena kolom `slug` diindeks dengan struktur data **B-Tree**, PostgreSQL melompati jutaan byte data dan langsung menemukan baris dalam hitungan 0.1 milidetik.

---

## 5. Row Level Security (RLS): Kenapa Ini Revolusioner?

Di arsitektur klasik (seperti Laravel + MySQL):
- Aplikasi terhubung ke database menggunakan akun superuser (`root` atau user dengan hak akses penuh).
- Jika ada celah di API endpoint Anda di mana Anda lupa memeriksa `$request->user()->can('update', $project)`, maka penyerang bisa mengubah data orang lain. Database MySQL tidak peduli karena koneksinya dianggap sah.

Di Supabase + PostgreSQL:
- Supabase membagi pengguna menjadi dua peran:
  1. **`anon`**: Pengunjung publik tanpa token login (menggunakan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `ANON_KEY`).
  2. **`authenticated`**: Pengguna yang berhasil login (membawa token JWT Supabase Auth).

### Bagaimana RLS Melindungi Anda?
Ketika perintah ini dijalankan:
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```
PostgreSQL menutup pintu serapat-rapatnya (*Default Deny*). Tidak ada siapa pun yang bisa membaca atau menulis data sampai Anda membuat **Policy (Kebijakan)**.

#### Kebijakan Publik (Hanya Baca):
```sql
CREATE POLICY "Allow public read on projects" 
ON projects FOR SELECT 
USING (true);
```
- `FOR SELECT`: Hanya operasi baca data yang diizinkan.
- `USING (true)`: Syaratnya selalu benar, artinya semua pengunjung boleh melihat proyek.
- Jika ada orang iseng mencoba melakukan `DELETE` atau `INSERT` menggunakan Anon Key dari console browser, PostgreSQL akan langsung melempar error: **`Permission Denied (403)`**.

#### Kebijakan Admin (Akses Penuh):
```sql
CREATE POLICY "Allow admin full access on projects" 
ON projects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
```
- `TO authenticated`: Hanya berlaku jika request membawa token login admin yang sah.
- `USING (true)`: Boleh melihat dan memilih baris apa saja.
- `WITH CHECK (true)`: Boleh memasukkan (`INSERT`) atau memperbarui (`UPDATE`) data apa saja.

---

## 6. Kamus Istilah & Perintah Esensial Postgres

| Perintah / Konsep | Deskripsi Singkat |
| :--- | :--- |
| **`UPSERT` (`ON CONFLICT`)** | Perintah *Insert or Update*. Jika ID sudah ada, lakukan pembaruan alih-alih melempar error duplikasi (`ON CONFLICT (id) DO UPDATE...`). |
| **`COALESCE(val1, val2)`** | Mengembalikan nilai pertama yang tidak bernilai `NULL`. Mirip operator null coalescing PHP `??`. |
| **`ILIKE`** | Pencarian string case-insensitive (`WHERE name ILIKE '%next%'`). Di MySQL operator `LIKE` default-nya sudah case-insensitive, tapi di Postgres `LIKE` itu peka huruf kapital, sehingga harus pakai `ILIKE`. |
| **`RETURNING *`** | Klausa ajaib di akhir query `INSERT` atau `UPDATE` agar data yang baru disimpan langsung dikembalikan sebagai respons tanpa query `SELECT` kedua. |

---

> 💡 **Langkah Selanjutnya**:  
> Salin seluruh isi berkas [`docs/learn/schema.sql`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/docs/learn/schema.sql) ke **SQL Editor** Supabase Anda, lalu klik **Run**.  
> Setelah sukses, Anda bisa memulai koding integrasi Next.js tahap demi tahap!
