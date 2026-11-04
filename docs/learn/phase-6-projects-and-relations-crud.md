# Fase 6: Modul Proyek, Relasi Many-to-Many Tags & Upload Storage

Dokumen ini adalah panduan implementasi langkah-demi-langkah yang **100% lengkap dengan kode produksi**, penjelasan baris demi baris, arsitektur relasi database **Many-to-Many (Pivot Table)**, sinkronisasi tag teknologi (ala `$project->technologies()->sync()`), integrasi **Supabase Storage Bucket** untuk upload aset gambar, serta **tautan prioritas ke dokumentasi resmi Next.js**.

---

## 📑 Daftar Isi
1. [Prinsip Desain & Alasan Arsitektur (The "Why")](#1-prinsip-desain--alasan-arsitektur-the-why)
2. [Analogi Laravel vs Next.js App Router (Pivot Sync & File Storage)](#2-analogi-laravel-vs-nextjs-app-router-pivot-sync--file-storage)
3. [Server Component vs Client Component di Modul Proyek](#3-server-component-vs-client-component-di-modul-proyek)
4. [Langkah 1: Setup Bucket Storage `portfolio-assets` di Supabase](#langkah-1-setup-bucket-storage-portfolio-assets-di-supabase)
5. [Langkah 2: Definisi Tipe Data TypeScript (`types/projects.ts`)](#langkah-2-definisi-tipe-data-typescript-typesprojectsts)
6. [Langkah 3: Helper Upload Supabase Storage (`lib/storage.ts`)](#langkah-3-helper-upload-supabase-storage-libstoragets)
7. [Langkah 4: Server Actions Lengkap & Sinkronisasi Pivot (`app/admin/projects/actions.ts`)](#langkah-4-server-actions-lengkap--sinkronisasi-pivot-appadminprojectsactionsts)
8. [Langkah 5: Komponen Form Interaktif Proyek (`components/admin/project-form.tsx`)](#langkah-5-komponen-form-interaktif-proyek-componentsadminproject-formtsx)
9. [Langkah 6: Halaman Daftar Proyek / Index (`app/admin/projects/page.tsx`)](#langkah-6-halaman-daftar-proyek--index-appadminprojectspagetsx)
10. [Langkah 7: Halaman Tambah Proyek Baru (`app/admin/projects/new/page.tsx`)](#langkah-7-halaman-tambah-proyek-baru-appadminprojectsnewpagetsx)
11. [Langkah 8: Halaman Edit Proyek (`app/admin/projects/[id]/edit/page.tsx`)](#langkah-8-halaman-edit-proyek-appadminprojectsideditpagetsx)
12. [Bedah Kode Kritis: Sinkronisasi Pivot Atomik & Array Native Postgres](#12-bedah-kode-kritis-sinkronisasi-pivot-atomik--array-native-postgres)
13. [Daftar Referensi Dokumentasi Resmi](#13-daftar-referensi-dokumentasi-resmi)
14. [Checklist Pengujian Mandiri & Panduan `/pantau`](#14-checklist-pengujian-mandiri--panduan-pantau)

---

## 1. Prinsip Desain & Alasan Arsitektur (The "Why")

Modul **Projects** adalah inti dari portofolio seorang software engineer. Tidak seperti tabel master sederhana, sebuah entitas proyek memiliki struktur data berlapis:

1. **Relasi Many-to-One (`belongsTo`)**: Setiap proyek memiliki satu kategori utama via `category_id` (misal: *Web Application*, *Mobile App*, *Company Profile*).
2. **Relasi Many-to-Many (`belongsToMany`)**: Satu proyek dapat menggunakan banyak teknologi (Next.js, TypeScript, Tailwind, PostgreSQL), dan satu teknologi dapat dipakai di banyak proyek. Hubungan ini dijembatani oleh **tabel pivot `project_technologies`**.
3. **Kolom Array Native PostgreSQL (`TEXT[]`)**: Fitur unik Postgres untuk menyimpan daftar `highlights` dan `architecture` tanpa perlu membuat tabel relasi terpisah yang berlebihan.
4. **Aset Gambar Asli (Supabase Storage)**: Cover proyek diunggah langsung ke bucket publik Supabase (`portfolio-assets`), menghasilkan URL CDN permanen yang cepat.

---

## 2. Analogi Laravel vs Next.js App Router (Pivot Sync & File Storage)

| Fitur di Laravel | Padanan di Next.js + Supabase SSR | Penjelasan |
| :--- | :--- | :--- |
| **`$project->technologies()->sync($ids)`** | **Hapus pivot lama (`delete().eq('project_id', id)`) lalu Batch Insert pivot baru** | Memastikan tag teknologi yang dipilih di form tersinkronisasi secara akurat tanpa ada data relasi ganda (*duplicate key*). |
| **`Storage::disk('public')->putFile('covers', $file)`** | **`supabase.storage.from('portfolio-assets').upload(path, file)`** | Mengunggah buffer file `FormData` langsung ke bucket cloud Supabase Storage. |
| **`Project::with(['category', 'technologies'])->get()`** | **Supabase Joined Query: `.select('*, category:project_categories(*), technologies(*)')`** | Mengambil data proyek beserta relasi kategori dan tags teknologinya dalam 1 roundtrip query cepat. |
| **`Route::resource('projects', ProjectController::class)`** | **Next.js File-system Routing: `page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`** | Standar navigasi halaman admin yang bersih, intuitif, dan *bookmarkable*. |
| **`revalidatePath('/projects/' . $project->slug)`** | **Next.js On-Demand ISR Revalidation** | Halaman detail proyek publik (`/projects/[slug]`) langsung membaca perubahan tanpa perlu rebuild aplikasi. |

---

## 3. Server Component vs Client Component di Modul Proyek

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)  
> - [Next.js Parallel Data Fetching with Promise.all](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#parallel-data-fetching)

```text
[app/admin/projects/new/page.tsx] (Server Component)
│  ├── Mengambil master kategori & teknologi secara paralel (Promise.all)
│  └── Mengirimkan data referensi ke client form tanpa loading spinner
│
└── [components/admin/project-form.tsx] (Client Component - 'use client')
   ├── State pilihan multi-select teknologi (Tag selector toggle)
   ├── State input array dinamis (Key Highlights & Architecture Bullet Points)
   ├── Preview instan file cover gambar sebelum di-submit
   └── Terhubung ke Server Action 'createProjectAction' / 'updateProjectAction'
```

---

## 4. Langkah 1: Setup Bucket Storage `portfolio-assets` di Supabase

> 📖 **Dokumentasi Resmi Supabase**:  
> [Supabase Storage: Buckets & Access Control](https://supabase.com/docs/guides/storage/buckets)

Pastikan bucket `portfolio-assets` sudah aktif dan berstatus publik di dashboard Supabase Anda:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → Pilih project Anda.
2. Di menu kiri, klik ikon ember 🪣 (**Storage**).
3. Jika bucket `portfolio-assets` belum ada, klik **"New bucket"**:
   - **Name**: `portfolio-assets`
   - **Public bucket**: **Centang ON** (agar gambar cover dapat diakses oleh pengunjung publik tanpa token rahasia).
4. Klik **Save**.
5. *(Opsional)* Jika Anda sudah mengeksekusi file [`docs/learn/schema.sql`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/docs/learn/schema.sql), bucket dan kebijakan RLS storage publik otomatis sudah terkonfigurasi.

---

## 5. Langkah 2: Definisi Tipe Data TypeScript (`types/projects.ts`)

Buat berkas baru di `types/projects.ts`:

```typescript
// types/projects.ts
import { Technology } from '@/types/tech-stack';

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  priority: number;
  created_at: string;
}

export interface Project {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  problem: string | null;
  solution: string | null;
  contribution: string | null;
  role: string | null;
  year: string | null;
  status: 'Completed' | 'In Progress' | 'Archived';
  featured: boolean;
  cover_image: string | null;
  preview_images: string[];
  demo_url: string | null;
  repo_url: string | null;
  highlights: string[];
  architecture: string[];
  priority: number;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory;
  technologies?: Technology[];
}

export interface ProjectActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
```

---

## 6. Langkah 3: Helper Upload Supabase Storage (`lib/storage.ts`)

> 📖 **Dokumentasi Resmi Supabase**:  
> [Supabase JavaScript Client: Storage Upload](https://supabase.com/docs/reference/javascript/storage-from-upload)

Buat berkas helper di `lib/storage.ts` untuk menangani sanitasi nama berkas dan proses upload:

```typescript
// lib/storage.ts
import { createClient } from '@/lib/server';

/**
 * Mengunggah berkas gambar ke bucket Supabase Storage dan mengembalikan URL publiknya
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = 'projects'
): Promise<string> {
  const supabase = await createClient();

  // Bersihkan nama file dari spasi dan karakter aneh
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const fileName = `${folder}/${cleanBaseName}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload storage gagal: ${uploadError.message}`);
  }

  // Dapatkan URL publik permanen
  const {
    data: { publicUrl },
  } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);

  return publicUrl;
}
```

---

## 7. Langkah 4: Server Actions Lengkap & Sinkronisasi Pivot (`app/admin/projects/actions.ts`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Server Actions with FormData](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#formdata)  
> - [Next.js revalidatePath & redirect](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

Buat berkas baru di `app/admin/projects/actions.ts`:

```typescript
// app/admin/projects/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import { uploadImageToStorage } from '@/lib/storage';
import { ProjectActionState } from '@/types/projects';

/**
 * Helper untuk menyinkronkan tabel pivot project_technologies (Many-to-Many Sync)
 */
async function syncProjectTechnologies(
  supabase: any,
  projectId: string,
  technologyIds: string[]
) {
  // 1. Hapus seluruh relasi pivot lama proyek ini
  await supabase
    .from('project_technologies')
    .delete()
    .eq('project_id', projectId);

  // 2. Masukkan relasi pivot baru jika ada teknologi yang dipilih
  if (technologyIds.length > 0) {
    const pivotRows = technologyIds.map((techId) => ({
      project_id: projectId,
      technology_id: techId,
    }));

    const { error: insertPivotError } = await supabase
      .from('project_technologies')
      .insert(pivotRows);

    if (insertPivotError) {
      throw new Error(`Gagal menyinkronkan teknologi: ${insertPivotError.message}`);
    }
  }
}

/**
 * Server Action: Tambah Proyek Baru
 */
export async function createProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  // Parsing array dari teks (dipisah baris baru)
  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const architectureRaw = (formData.get('architecture') as string) || '';
  const architecture = architectureRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // Ambil daftar ID teknologi dari input tersembunyi / multi-select
  const techIdsRaw = (formData.get('technology_ids') as string) || '';
  const technologyIds = techIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !slug || !summary) {
    return { error: 'Judul, slug, dan ringkasan proyek wajib diisi.' };
  }

  // Penanganan Upload Cover Image
  let cover_image: string | null = null;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      cover_image = await uploadImageToStorage(coverFile, 'projects');
    } catch (uploadErr: any) {
      return { error: uploadErr.message };
    }
  }

  // 1. Simpan baris proyek ke tabel projects
  const { data: newProject, error: insertError } = await supabase
    .from('projects')
    .insert({
      title,
      slug,
      category_id,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      featured,
      cover_image,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
    })
    .select('id, slug')
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  // 2. Sinkronisasikan tabel pivot Many-to-Many
  try {
    await syncProjectTechnologies(supabase, newProject.id, technologyIds);
  } catch (syncErr: any) {
    return { error: syncErr.message };
  }

  // 3. Bersihkan cache rute admin dan rute publik
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath(`/projects/${newProject.slug}`);
  revalidatePath('/');

  redirect('/admin/projects');
}

/**
 * Server Action: Update Proyek
 */
export async function updateProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);
  const existingCover = (formData.get('existing_cover_image') as string) || null;

  if (!id || !title || !slug || !summary) {
    return { error: 'ID, judul, slug, dan ringkasan wajib diisi.' };
  }

  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const architectureRaw = (formData.get('architecture') as string) || '';
  const architecture = architectureRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const techIdsRaw = (formData.get('technology_ids') as string) || '';
  const technologyIds = techIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Jika user mengunggah file baru, gantikan cover_image
  let cover_image = existingCover;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      cover_image = await uploadImageToStorage(coverFile, 'projects');
    } catch (uploadErr: any) {
      return { error: uploadErr.message };
    }
  }

  // 1. Update baris proyek
  const { error: updateError } = await supabase
    .from('projects')
    .update({
      title,
      slug,
      category_id,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      featured,
      cover_image,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    return { error: updateError.message };
  }

  // 2. Sinkronisasikan tabel pivot Many-to-Many
  try {
    await syncProjectTechnologies(supabase, id, technologyIds);
  } catch (syncErr: any) {
    return { error: syncErr.message };
  }

  // 3. Bersihkan cache
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/');

  redirect('/admin/projects');
}

/**
 * Server Action: Hapus Proyek
 */
export async function deleteProjectAction(id: string): Promise<ProjectActionState> {
  if (!id) return { error: 'ID proyek tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true, message: 'Proyek berhasil dihapus.' };
}
```

---

## 8. Langkah 5: Komponen Form Interaktif Proyek (`components/admin/project-form.tsx`)

Buat berkas baru di `components/admin/project-form.tsx`:

```tsx
// components/admin/project-form.tsx
'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { Project, ProjectCategory, ProjectActionState } from '@/types/projects';
import { Technology } from '@/types/tech-stack';
import {
  createProjectAction,
  updateProjectAction,
} from '@/app/admin/projects/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  Plus,
} from 'lucide-react';

interface ProjectFormProps {
  project?: Project | null;
  categories: ProjectCategory[];
  technologies: Technology[];
}

export function ProjectForm({
  project,
  categories,
  technologies,
}: ProjectFormProps) {
  const isEditing = Boolean(project?.id);
  const actionToUse = isEditing ? updateProjectAction : createProjectAction;

  const [state, formAction, isPending] = useActionState<ProjectActionState | null, FormData>(
    actionToUse,
    null
  );

  // State untuk Many-to-Many Tags Teknologi
  const initialTechIds = project?.technologies?.map((t) => t.id) || [];
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(initialTechIds);

  // State Preview Gambar Cover
  const [previewCover, setPreviewCover] = useState<string | null>(
    project?.cover_image || null
  );

  const toggleTechnology = (techId: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      {project?.cover_image && (
        <input
          type="hidden"
          name="existing_cover_image"
          value={project.cover_image}
        />
      )}
      {/* Hidden input untuk melempar array ID teknologi terpilih ke Server Action */}
      <input
        type="hidden"
        name="technology_ids"
        value={selectedTechIds.join(',')}
      />

      {state?.error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Bagian 1: Informasi Dasar */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          1. Informasi Utama
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-mono text-muted">
              Judul Proyek *
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={project?.title || ''}
              placeholder="e.g. Brava — Luxury Living"
              required
              className="bg-surface-raised border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs font-mono text-muted">
              Slug URL * (e.g. brava-luxury-living)
            </Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={project?.slug || ''}
              placeholder="brava"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="category_id" className="text-xs font-mono text-muted">
              Kategori Proyek
            </Label>
            <Select
              name="category_id"
              defaultValue={project?.category_id || categories[0]?.id || ''}
            >
              <SelectTrigger className="bg-surface-raised border-border">
                <SelectValue placeholder="Pilih Kategori..." />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="year" className="text-xs font-mono text-muted">
              Tahun Pengerjaan
            </Label>
            <Input
              id="year"
              name="year"
              defaultValue={project?.year || '2025'}
              placeholder="e.g. 2025"
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-mono text-muted">
              Peran Anda (Role)
            </Label>
            <Input
              id="role"
              name="role"
              defaultValue={project?.role || 'Full-Stack Developer'}
              placeholder="e.g. Full-Stack Developer"
              className="bg-surface-raised border-border text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary" className="text-xs font-mono text-muted">
            Ringkasan Singkat (Summary) *
          </Label>
          <Textarea
            id="summary"
            name="summary"
            defaultValue={project?.summary || ''}
            placeholder="Ringkasan 1-2 kalimat untuk kartu depan portofolio..."
            required
            rows={2}
            className="bg-surface-raised border-border text-xs"
          />
        </div>
      </div>

      {/* Bagian 2: Gambar Cover & Upload Storage */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          2. Cover Image (Supabase Storage)
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 items-center">
          <div className="space-y-3">
            <Label htmlFor="cover_file" className="text-xs font-mono text-muted">
              Pilih File Gambar Cover (PNG, JPG, WebP)
            </Label>
            <Input
              id="cover_file"
              name="cover_file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-surface-raised border-border text-xs cursor-pointer"
            />
            <p className="text-[11px] text-muted">
              Gambar akan otomatis diunggah ke bucket <code>portfolio-assets/projects/</code>.
            </p>
          </div>

          {/* Box Preview */}
          <div className="relative aspect-video rounded-xl border border-dashed border-border bg-surface-raised overflow-hidden flex items-center justify-center">
            {previewCover ? (
              <img
                src={previewCover}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted text-xs font-mono">
                <ImageIcon className="w-6 h-6" />
                <span>Belum ada cover</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bagian 3: Relasi Many-to-Many Tags Teknologi */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
            3. Teknologi yang Digunakan ({selectedTechIds.length} Terpilih)
          </h2>
          <span className="text-[11px] text-muted font-mono">
            Tersinkron ke tabel pivot project_technologies
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {technologies.map((tech) => {
            const isSelected = selectedTechIds.includes(tech.id);
            return (
              <button
                type="button"
                key={tech.id}
                onClick={() => toggleTechnology(tech.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent/15 border-accent text-accent font-semibold shadow-xs'
                    : 'bg-surface-raised border-border text-muted hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5 opacity-40" />
                )}
                <span>{tech.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagian 4: Studi Kasus Mendalam (Problem, Solution, Highlights) */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          4. Studi Kasus & Arsitektur
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-mono text-muted">
            Deskripsi Naratif Panjang
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={project?.description || ''}
            placeholder="Latar belakang lengkap tentang proyek..."
            rows={3}
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="problem" className="text-xs font-mono text-muted">
              Tantangan Masalah (Problem Statement)
            </Label>
            <Textarea
              id="problem"
              name="problem"
              defaultValue={project?.problem || ''}
              placeholder="Masalah utama yang dihadapi klien..."
              rows={3}
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="solution" className="text-xs font-mono text-muted">
              Solusi Rekayasa (Engineered Solution)
            </Label>
            <Textarea
              id="solution"
              name="solution"
              defaultValue={project?.solution || ''}
              placeholder="Solusi arsitektur software yang Anda buat..."
              rows={3}
              className="bg-surface-raised border-border text-xs"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="highlights" className="text-xs font-mono text-muted">
              Key Highlights (Tulis 1 baris per poin)
            </Label>
            <Textarea
              id="highlights"
              name="highlights"
              defaultValue={project?.highlights?.join('\n') || ''}
              placeholder="Next.js 16 App Router dengan Partial Prerendering&#10;Stripe Payment Gateway Integration&#10;Sub-second search response"
              rows={4}
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="architecture" className="text-xs font-mono text-muted">
              Architecture Highlights (Tulis 1 baris per poin)
            </Label>
            <Textarea
              id="architecture"
              name="architecture"
              defaultValue={project?.architecture?.join('\n') || ''}
              placeholder="Multi-tenant PostgreSQL schema&#10;Edge Network reverse proxy caching&#10;Supabase Auth dengan RLS"
              rows={4}
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Bagian 5: Tautan Eksternal & Visibilitas */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          5. Tautan & Pengaturan
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="demo_url" className="text-xs font-mono text-muted">
              Live Demo URL
            </Label>
            <Input
              id="demo_url"
              name="demo_url"
              type="url"
              defaultValue={project?.demo_url || ''}
              placeholder="https://brava.example.com"
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repo_url" className="text-xs font-mono text-muted">
              Source Code Repository URL
            </Label>
            <Input
              id="repo_url"
              name="repo_url"
              type="url"
              defaultValue={project?.repo_url || ''}
              placeholder="https://github.com/ryzecl/brava"
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-raised">
          <div className="space-y-0.5">
            <Label htmlFor="featured" className="text-xs font-semibold cursor-pointer">
              Tampilkan di Featured Portfolio (Homepage Bento)
            </Label>
            <p className="text-[11px] text-muted">
              Proyek ini akan mendapatkan kartu sorotan besar pada grid halaman depan.
            </p>
          </div>
          <Switch
            id="featured"
            name="featured"
            defaultChecked={project?.featured || false}
          />
        </div>
      </div>

      {/* Tombol Aksi Form */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Batal dan kembali</span>
        </Link>

        <Button type="submit" disabled={isPending} className="px-6 font-mono text-xs">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Menyimpan Proyek...</span>
            </>
          ) : isEditing ? (
            <span>Perbarui Proyek</span>
          ) : (
            <span>Terbitkan Proyek</span>
          )}
        </Button>
      </div>
    </form>
  );
}
```

---

## 9. Langkah 6: Halaman Daftar Proyek / Index (`app/admin/projects/page.tsx`)

Buat berkas baru di `app/admin/projects/page.tsx`:

```tsx
// app/admin/projects/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/server';
import { Project } from '@/types/projects';
import { deleteProjectAction } from '@/app/admin/projects/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FolderKanban,
  Plus,
  ExternalLink,
  Edit2,
  Sparkles,
  Trash2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects Management · Admin CMS',
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Query seluruh proyek beserta kategori dan tag teknologi
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      slug,
      summary,
      year,
      status,
      featured,
      cover_image,
      priority,
      category:project_categories(id, name),
      technologies(id, name, slug)
    `)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Projects Portfolio Master
            </h1>
          </div>
          <p className="text-xs text-muted">
            Kelola karya unggulan, studi kasus arsitektur, dan tautan demo langsung.
          </p>
        </div>

        <Button asChild size="sm" className="font-mono text-xs">
          <Link href="/admin/projects/new">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tambah Proyek
          </Link>
        </Button>
      </div>

      {/* Tabel Proyek */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Proyek</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Tech Stack (Many-to-Many)</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Status</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!projects || projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada proyek yang dibuat. Klik tombol "Tambah Proyek" di atas.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj: any) => (
                <TableRow key={proj.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {proj.cover_image ? (
                        <img
                          src={proj.cover_image}
                          alt={proj.title}
                          className="w-12 h-8 rounded-md object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-surface-raised border border-border flex items-center justify-center text-muted text-[10px] font-mono">
                          NO IMG
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <span>{proj.title}</span>
                          {proj.featured && (
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-muted">
                          /{proj.slug} · {proj.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {proj.category?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.technologies && proj.technologies.length > 0 ? (
                        proj.technologies.map((t: any) => (
                          <span
                            key={t.id}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-raised border border-border text-foreground"
                          >
                            {t.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted text-[11px] font-mono">-</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-mono text-emerald-400">
                      {proj.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link href={`/admin/projects/${proj.id}/edit`}>
                          <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Link>
                      </Button>

                      <form
                        action={async () => {
                          'use server';
                          await deleteProjectAction(proj.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="h-8 w-8 p-0 text-muted hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

---

## 10. Langkah 7: Halaman Tambah Proyek Baru (`app/admin/projects/new/page.tsx`)

Buat berkas baru di `app/admin/projects/new/page.tsx`:

```tsx
// app/admin/projects/new/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { ProjectForm } from '@/components/admin/project-form';

export const metadata: Metadata = {
  title: 'New Project · Admin CMS',
};

export default async function NewProjectPage() {
  const supabase = await createClient();

  // Ambil data kategori dan teknologi secara paralel
  const [categoriesRes, technologiesRes] = await Promise.all([
    supabase.from('project_categories').select('*').order('priority', { ascending: true }),
    supabase.from('technologies').select('*').order('name', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Tambah Proyek Baru
        </h1>
        <p className="text-xs text-muted">
          Lengkapi detail proyek, upload cover gambar, dan pilih tag teknologi yang digunakan.
        </p>
      </div>

      <ProjectForm
        categories={categoriesRes.data || []}
        technologies={technologiesRes.data || []}
      />
    </div>
  );
}
```

---

## 11. Langkah 8: Halaman Edit Proyek (`app/admin/projects/[id]/edit/page.tsx`)

Buat berkas baru di `app/admin/projects/[id]/edit/page.tsx`:

```tsx
// app/admin/projects/[id]/edit/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/server';
import { ProjectForm } from '@/components/admin/project-form';

export const metadata: Metadata = {
  title: 'Edit Project · Admin CMS',
};

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Ambil data proyek beserta kategori dan technologies secara paralel
  const [projectRes, categoriesRes, technologiesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, technologies(id, name, slug)')
      .eq('id', id)
      .single(),
    supabase.from('project_categories').select('*').order('priority', { ascending: true }),
    supabase.from('technologies').select('*').order('name', { ascending: true }),
  ]);

  if (projectRes.error || !projectRes.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          Edit Proyek: {projectRes.data.title}
        </h1>
        <p className="text-xs text-muted">
          Perbarui teks, gambar cover, atau sinkronisasikan ulang teknologi yang digunakan.
        </p>
      </div>

      <ProjectForm
        project={projectRes.data}
        categories={categoriesRes.data || []}
        technologies={technologiesRes.data || []}
      />
    </div>
  );
}
```

---

## 12. Bedah Kode Kritis: Sinkronisasi Pivot Atomik & Array Native Postgres

### 1. Pola Sinkronisasi Pivot Table (`syncProjectTechnologies`)
Di Laravel, Anda cukup menulis `$project->technologies()->sync($ids)`. Di Next.js + Supabase, kita menjalankan pola dua langkah:
1. `delete().eq('project_id', projectId)`: Menghapus relasi lama yang mungkin sudah tidak dipilih lagi oleh pengguna di form.
2. `insert(pivotRows)`: Memasukkan relasi yang saat ini aktif dicentang.
Langkah ini sangat bersih dan menjamin integritas data referensi tanpa duplikasi baris.

### 2. Kolom Array Native Postgres (`TEXT[]`)
Kolom `highlights` dan `architecture` di database PostgreSQL bertipe `TEXT[]`.
- Saat membaca: Postgres otomatis mengembalikan array JavaScript murni `['Poin 1', 'Poin 2']`.
- Saat menulis dari `FormData`: Kita cukup memisahkan baris teks dengan `.split('\n').filter(Boolean)`. Next.js dan Supabase client akan langsung mengonversinya menjadi format array native Postgres tanpa perlu `JSON.stringify()`!

---

## 13. Daftar Referensi Dokumentasi Resmi

1. **Next.js Dynamic Routing & Data Fetching**:
   - [Next.js Dynamic Routes (`[id]`)](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
   - [Next.js Server Actions with FormData](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#formdata)
   - [Next.js Parallel Data Fetching (`Promise.all`)](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#parallel-data-fetching)
2. **Supabase Storage & Queries**:
   - [Supabase JavaScript Client: Storage Upload](https://supabase.com/docs/reference/javascript/storage-from-upload)
   - [Supabase JavaScript Client: Querying Joined Tables](https://supabase.com/docs/reference/javascript/select#query-foreign-tables)
3. **Shadcn UI Form Controls**:
   - [Shadcn Textarea](https://ui.shadcn.com/docs/components/textarea)
   - [Shadcn Select](https://ui.shadcn.com/docs/components/select)
   - [Shadcn Switch](https://ui.shadcn.com/docs/components/switch)

---

## 14. Checklist Pengujian Mandiri & Panduan `/pantau`

- [ ] Pastikan bucket `portfolio-assets` sudah aktif dan berstatus Public di Supabase Storage.
- [ ] Buat file tipe di `types/projects.ts`.
- [ ] Buat helper storage di `lib/storage.ts`.
- [ ] Buat Server Actions di `app/admin/projects/actions.ts`.
- [ ] Buat komponen form di `components/admin/project-form.tsx`.
- [ ] Buka browser di `http://localhost:3000/admin/projects/new`.
- [ ] Uji coba membuat proyek baru lengkap dengan memilih tag teknologi dan mengunggah gambar cover.
- [ ] Pastikan proyek tersimpan dan muncul di tabel index `/admin/projects`.
- [ ] Coba edit proyek dan ubah pilihan teknologinya, pastikan tabel pivot `project_technologies` tersinkronisasi dengan benar.
- [ ] Ketik `/pantau` di chat untuk berdiskusi dengan mentor AI mengenai implementasi kode Anda!
