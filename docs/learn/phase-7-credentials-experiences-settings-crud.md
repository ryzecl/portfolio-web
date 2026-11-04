# Fase 7: Modul Kredensial, Pengalaman, Pendidikan & Pengaturan Web (JSONB)

Dokumen ini adalah panduan implementasi langkah-demi-langkah yang **100% lengkap dengan kode produksi**, penjelasan baris demi baris, alasan arsitektur di balik pemanfaatan kolom **PostgreSQL Native Array (`skills TEXT[]`)**, pola **Single Table Inheritance (`type = 'work' | 'education'`)**, pengelolaan **Site Settings via PostgreSQL JSONB**, serta **tautan prioritas ke dokumentasi resmi Next.js**.

---

## 📑 Daftar Isi
1. [Prinsip Desain & Alasan Arsitektur (The "Why")](#1-prinsip-desain--alasan-arsitektur-the-why)
2. [Analogi Laravel vs Next.js App Router (Single Table & Key-Value JSONB)](#2-analogi-laravel-vs-nextjs-app-router-single-table--key-value-jsonb)
3. [Server Component vs Client Component di Modul Fase 7](#3-server-component-vs-client-component-di-modul-fase-7)
4. [Langkah 1: Definisi Tipe Data TypeScript (`types/credentials.ts` & `types/settings.ts`)](#langkah-1-definisi-tipe-data-typescript-typescredentialsts--typessettingsts)
5. [Langkah 2: Server Actions Sertifikasi (`app/admin/certificates/actions.ts`)](#langkah-2-server-actions-sertifikasi-appadmincertificatesactionsts)
6. [Langkah 3: Server Actions Pengalaman & Pendidikan (`app/admin/experience/actions.ts`)](#langkah-3-server-actions-pengalaman--pendidikan-appadminexperienceactionsts)
7. [Langkah 4: Server Actions Site Settings (`app/admin/settings/actions.ts`)](#langkah-4-server-actions-site-settings-appadminsettingsactionsts)
8. [Langkah 5: Komponen Dialog & Halaman Sertifikasi (`app/admin/certificates/`)](#langkah-5-komponen-dialog--halaman-sertifikasi-appadmincertificates)
9. [Langkah 6: Komponen Dialog & Halaman Pengalaman/Pendidikan (`app/admin/experience/`)](#langkah-6-komponen-dialog--halaman-pengalamanpendidikan-appadminexperience)
10. [Langkah 7: Form Pengaturan Web & Sosial Media (`app/admin/settings/`)](#langkah-7-form-pengaturan-web--sosial-media-appadminsettings)
11. [Bedah Kode Kritis: Keunggulan JSONB & Revalidasi Multi-Rute](#11-bedah-kode-kritis-keunggulan-jsonb--revalidasi-multi-rute)
12. [Daftar Referensi Dokumentasi Resmi](#12-daftar-referensi-dokumentasi-resmi)
13. [Checklist Pengujian Mandiri & Panduan `/pantau`](#13-checklist-pengujian-mandiri--panduan-pantau)

---

## 1. Prinsip Desain & Alasan Arsitektur (The "Why")

Pada Fase 7, kita melengkapi data profil profesional Ferry Noer Hendriawan yang meliputi:
1. **Sertifikasi (`certificates`)**: Lisensi dan bukti kredensial (Dicoding, freeCodeCamp, Sertifikasi BNSP, dsb.) lengkap dengan tautan verifikasi eksternal (`credential_url`) dan tag keahlian (`skills TEXT[]`).
2. **Pengalaman & Pendidikan (`experiences`)**: Linimasa karier (Software Engineer, Magang, Asisten Dosen) dan riwayat akademis (Universitas/Jurusan).
3. **Pengaturan Global (`site_settings`)**: Mengatur kontak (Email, WhatsApp, GitHub, LinkedIn), status bio, dan konfigurasi profil tanpa perlu menyentuh berkas kode secara manual.

---

## 2. Analogi Laravel vs Next.js App Router (Single Table & Key-Value JSONB)

| Fitur di Laravel | Padanan di Next.js + Supabase SSR | Penjelasan |
| :--- | :--- | :--- |
| **Single Table Inheritance / Enum Scope** (`Experience::where('type', 'education')`) | **Tabel `experiences` dengan filter `.eq('type', 'work')` atau `.eq('type', 'education')`** | Menghindari pembuatan tabel terpisah yang strukturnya 90% identik (role/gelar, organisasi/kampus, periode). |
| **Laravel Casts: `protected $casts = ['value' => 'array']`** | **PostgreSQL Native `JSONB`** | Menyimpan objek terstruktur (seperti konfigurasi sosmed atau hero greeting) dalam 1 kolom `JSONB` yang fleksibel dan dapat di-query. |
| **`Setting::updateOrCreate(['key' => $k], ['value' => $v])`** | **`supabase.from('site_settings').upsert({ key, value })`** | Menyimpan atau memperbarui pasangan key-value secara atomik tanpa duplikasi. |
| **`revalidatePath('/credentials')`** | **Next.js On-Demand ISR** | Menyegarkan halaman kredensial publik seketika begitu sertifikasi baru diterbitkan. |

---

## 3. Server Component vs Client Component di Modul Fase 7

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Composition Patterns: Server & Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

- **Halaman Admin Index (`page.tsx`)**: Menjadi **Server Component**. Mengambil data langsung dari Supabase via `createClient()` di sisi server. Cepat, aman, dan tanpa ekspos kunci credentials ke browser.
- **Komponen Form & Dialog (`*-dialog.tsx`, `*-form.tsx`)**: Menjadi **Client Component (`'use client'`)**. Menangani input teks interaktif, toggle switch (`is_current`, `featured`), status pending/loading (`useActionState`), dan penutupan otomatis jendela dialog setelah penyimpanan berhasil.

---

## 4. Langkah 1: Definisi Tipe Data TypeScript (`types/credentials.ts` & `types/settings.ts`)

### A. Buat `types/credentials.ts`
```typescript
// types/credentials.ts

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: string;
  credential_id: string | null;
  credential_url: string | null;
  summary: string | null;
  skills: string[];
  featured: boolean;
  created_at: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  organization_url: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  highlights: string[];
  type: 'work' | 'internship' | 'education' | 'organization';
  priority: number;
  created_at: string;
}

export interface GenericActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
```

### B. Buat `types/settings.ts`
```typescript
// types/settings.ts

export interface SiteSocialSettings {
  email: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
  instagram?: string;
  spotify?: string;
}

export interface SiteHeroSettings {
  greeting: string;
  headline: string;
  locationText: string;
  description: string;
}
```

---

## 5. Langkah 2: Server Actions Sertifikasi (`app/admin/certificates/actions.ts`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Server Actions & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)  
> - [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

Buat berkas di `app/admin/certificates/actions.ts`:

```typescript
// app/admin/certificates/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertCertificateAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const issuer = (formData.get('issuer') as string)?.trim();
  const issue_date = (formData.get('issue_date') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'Software Engineering';
  const credential_id = (formData.get('credential_id') as string)?.trim() || null;
  const credential_url = (formData.get('credential_url') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';

  // Pisahkan skills berdasarkan koma atau baris baru
  const skillsRaw = (formData.get('skills') as string) || '';
  const skills = skillsRaw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !issuer || !issue_date) {
    return { error: 'Judul sertifikasi, penerbit, dan tanggal terbit wajib diisi.' };
  }

  const supabase = await createClient();

  const payload = {
    title,
    issuer,
    issue_date,
    category,
    credential_id,
    credential_url,
    summary,
    skills,
    featured,
  };

  if (id) {
    const { error } = await supabase.from('certificates').update(payload).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('certificates').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
  return { success: true, message: 'Sertifikat berhasil disimpan.' };
}

export async function deleteCertificateAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('certificates').delete().eq('id', id);

  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
}
```

---

## 6. Langkah 3: Server Actions Pengalaman & Pendidikan (`app/admin/experience/actions.ts`)

Buat berkas di `app/admin/experience/actions.ts`:

```typescript
// app/admin/experience/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertExperienceAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const role = (formData.get('role') as string)?.trim();
  const organization = (formData.get('organization') as string)?.trim();
  const organization_url = (formData.get('organization_url') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || null;
  const start_date = (formData.get('start_date') as string)?.trim();
  const end_date = (formData.get('end_date') as string)?.trim() || null;
  const is_current = formData.get('is_current') === 'on' || formData.get('is_current') === 'true';
  const description = (formData.get('description') as string)?.trim() || null;
  const type = (formData.get('type') as string) || 'work';
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!role || !organization || !start_date) {
    return { error: 'Posisi/Gelar, Institusi/Organisasi, dan tanggal mulai wajib diisi.' };
  }

  const supabase = await createClient();

  const payload = {
    role,
    organization,
    organization_url,
    location,
    start_date,
    end_date: is_current ? null : end_date,
    is_current,
    description,
    highlights,
    type,
    priority,
  };

  if (id) {
    const { error } = await supabase.from('experiences').update(payload).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('experiences').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/experience');
  revalidatePath('/admin/education');
  revalidatePath('/credentials');
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true, message: 'Data linimasa berhasil disimpan.' };
}

export async function deleteExperienceAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('experiences').delete().eq('id', id);

  revalidatePath('/admin/experience');
  revalidatePath('/admin/education');
  revalidatePath('/credentials');
  revalidatePath('/');
}
```

---

## 7. Langkah 4: Server Actions Site Settings (`app/admin/settings/actions.ts`)

> 📖 **Dokumentasi Resmi Supabase**:  
> [Supabase JavaScript Client: Upsert Operations](https://supabase.com/docs/reference/javascript/upsert)

Buat berkas di `app/admin/settings/actions.ts`:

```typescript
// app/admin/settings/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function updateSocialSettingsAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const email = (formData.get('email') as string)?.trim();
  const github = (formData.get('github') as string)?.trim();
  const linkedin = (formData.get('linkedin') as string)?.trim();
  const whatsapp = (formData.get('whatsapp') as string)?.trim() || '';
  const instagram = (formData.get('instagram') as string)?.trim() || '';
  const spotify = (formData.get('spotify') as string)?.trim() || '';

  const supabase = await createClient();

  const socialData = {
    email,
    github,
    linkedin,
    whatsapp,
    instagram,
    spotify,
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'social_links',
      value: socialData,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout'); // Bersihkan seluruh layout publik (Navbar & Footer yang memakai link sosmed)
  return { success: true, message: 'Tautan sosial media berhasil diperbarui.' };
}
```

---

## 8. Langkah 5: Komponen Dialog & Halaman Sertifikasi (`app/admin/certificates/`)

### A. Buat `components/admin/certificate-dialog.tsx`
```tsx
// components/admin/certificate-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { Certificate, GenericActionState } from '@/types/credentials';
import { upsertCertificateAction } from '@/app/admin/certificates/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle } from 'lucide-react';

interface CertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
}

export function CertificateDialog({
  open,
  onOpenChange,
  certificate,
}: CertificateDialogProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertCertificateAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {certificate ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Masukkan bukti kredensial, issuer, tautan verifikasi, dan keahlian yang diuji.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {certificate?.id && <input type="hidden" name="id" value={certificate.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-mono text-muted">
              Nama Sertifikat / Lisensi *
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={certificate?.title || ''}
              placeholder="e.g. Belajar Fundamental Aplikasi Web dengan React"
              required
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="issuer" className="text-xs font-mono text-muted">
                Penerbit (Issuer) *
              </Label>
              <Input
                id="issuer"
                name="issuer"
                defaultValue={certificate?.issuer || ''}
                placeholder="e.g. Dicoding Indonesia"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue_date" className="text-xs font-mono text-muted">
                Tanggal Terbit *
              </Label>
              <Input
                id="issue_date"
                name="issue_date"
                defaultValue={certificate?.issue_date || ''}
                placeholder="e.g. Okt 2024"
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-mono text-muted">
                Kategori
              </Label>
              <Input
                id="category"
                name="category"
                defaultValue={certificate?.category || 'Frontend'}
                placeholder="e.g. Frontend / Backend / Cloud"
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="credential_id" className="text-xs font-mono text-muted">
                Credential ID
              </Label>
              <Input
                id="credential_id"
                name="credential_id"
                defaultValue={certificate?.credential_id || ''}
                placeholder="e.g. MRXMQ49... (opsional)"
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credential_url" className="text-xs font-mono text-muted">
              Verification URL (Tautan Verifikasi Asli)
            </Label>
            <Input
              id="credential_url"
              name="credential_url"
              type="url"
              defaultValue={certificate?.credential_url || ''}
              placeholder="https://dicoding.com/certificates/..."
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skills" className="text-xs font-mono text-muted">
              Skills / Topik (Pisahkan dengan tanda koma atau baris baru)
            </Label>
            <Textarea
              id="skills"
              name="skills"
              defaultValue={certificate?.skills?.join(', ') || ''}
              placeholder="React.js, RESTful API, State Management, Web Performance"
              rows={2}
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
            <div className="space-y-0.5">
              <Label htmlFor="cert-featured" className="text-xs font-medium cursor-pointer">
                Tampilkan di Sorotan Kredensial
              </Label>
              <p className="text-[11px] text-muted">
                Sertifikat akan mendapatkan badge khusus di halaman kredensial publik.
              </p>
            </div>
            <Switch
              id="cert-featured"
              name="featured"
              defaultChecked={certificate?.featured || false}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Sertifikat'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### B. Buat Halaman Index Sertifikasi (`app/admin/certificates/page.tsx`)
```tsx
// app/admin/certificates/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Certificate } from '@/types/credentials';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
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
import { Award, Plus, ExternalLink, Sparkles, Trash2 } from 'lucide-react';
import { CertificateClientWrapper } from '@/components/admin/certificate-client-wrapper';

export const metadata: Metadata = {
  title: 'Certificates Management · Admin CMS',
};

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <Award className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
              Certificates & Credentials
            </h1>
          </div>
          <p className="text-xs text-muted">
            Kelola arsip lisensi profesional, sertifikasi industri, dan link verifikasi eksternal.
          </p>
        </div>
      </div>

      {/* Client Table & Modal Handler */}
      <CertificateClientWrapper certificates={certificates || []} />
    </div>
  );
}
```

---

## 9. Langkah 6: Komponen Dialog & Halaman Pengalaman/Pendidikan (`app/admin/experience/`)

### A. Buat `components/admin/experience-dialog.tsx`
```tsx
// components/admin/experience-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { ExperienceItem, GenericActionState } from '@/types/credentials';
import { upsertExperienceAction } from '@/app/admin/experience/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle } from 'lucide-react';

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceItem | null;
  defaultType?: 'work' | 'education';
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  defaultType = 'work',
}: ExperienceDialogProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertExperienceAction,
    null
  );

  const [isCurrent, setIsCurrent] = React.useState(experience?.is_current || false);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {experience ? 'Edit Linimasa' : 'Tambah Linimasa Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Catat riwayat karier, pengalaman magang, organisasi, atau institusi pendidikan.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {experience?.id && <input type="hidden" name="id" value={experience.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-mono text-muted">
                Tipe Linimasa *
              </Label>
              <Select name="type" defaultValue={experience?.type || defaultType}>
                <SelectTrigger className="bg-surface-raised border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="work">Pekerjaan (Work)</SelectItem>
                  <SelectItem value="internship">Magang (Internship)</SelectItem>
                  <SelectItem value="education">Pendidikan (Education)</SelectItem>
                  <SelectItem value="organization">Organisasi (Organization)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-mono text-muted">
                Posisi / Gelar Jurusan *
              </Label>
              <Input
                id="role"
                name="role"
                defaultValue={experience?.role || ''}
                placeholder="e.g. Full-Stack Developer / S1 Sistem Informasi"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="organization" className="text-xs font-mono text-muted">
                Perusahaan / Kampus *
              </Label>
              <Input
                id="organization"
                name="organization"
                defaultValue={experience?.organization || ''}
                placeholder="e.g. PT Teknologi Digital / Univ. Dinamika"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-mono text-muted">
                Lokasi
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={experience?.location || 'Surabaya, Indonesia'}
                placeholder="e.g. Surabaya, Indonesia"
                className="bg-surface-raised border-border text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-center">
            <div className="space-y-1.5">
              <Label htmlFor="start_date" className="text-xs font-mono text-muted">
                Tanggal Mulai *
              </Label>
              <Input
                id="start_date"
                name="start_date"
                defaultValue={experience?.start_date || ''}
                placeholder="e.g. Agu 2023"
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end_date" className="text-xs font-mono text-muted">
                Tanggal Selesai
              </Label>
              <Input
                id="end_date"
                name="end_date"
                defaultValue={experience?.end_date || ''}
                disabled={isCurrent}
                placeholder={isCurrent ? 'Present (Saat ini)' : 'e.g. Des 2024'}
                className="bg-surface-raised border-border font-mono text-xs disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
            <Label htmlFor="is_current" className="text-xs font-medium cursor-pointer">
              Masih Berlangsung Saat Ini (Present)
            </Label>
            <Switch
              id="is_current"
              name="is_current"
              checked={isCurrent}
              onCheckedChange={setIsCurrent}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-mono text-muted">
              Deskripsi Tanggung Jawab
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={experience?.description || ''}
              placeholder="Jelaskan peran utama dan kontribusi..."
              rows={3}
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="highlights" className="text-xs font-mono text-muted">
              Key Achievements / Aktivitas (1 baris per poin)
            </Label>
            <Textarea
              id="highlights"
              name="highlights"
              defaultValue={experience?.highlights?.join('\n') || ''}
              placeholder="Memimpin arsitektur migrasi database&#10;Meraih IPK 3.85 / Predikat Cumlaude"
              rows={3}
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Linimasa'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### B. Buat Halaman Index Pengalaman (`app/admin/experience/page.tsx`)
```tsx
// app/admin/experience/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Briefcase } from 'lucide-react';
import { ExperienceClientWrapper } from '@/components/admin/experience-client-wrapper';

export const metadata: Metadata = {
  title: 'Work Experience · Admin CMS',
};

export default async function AdminExperiencePage() {
  const supabase = await createClient();

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('priority', { ascending: true })
    .order('start_date', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Briefcase className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Experience & Education Timeline
          </h1>
        </div>
        <p className="text-xs text-muted">
          Kelola riwayat pekerjaan, magang industri, dan jejak akademis pendidikan.
        </p>
      </div>

      <ExperienceClientWrapper experiences={experiences || []} />
    </div>
  );
}
```

---

## 10. Langkah 7: Form Pengaturan Web & Sosial Media (`app/admin/settings/`)

### A. Buat Komponen Form Settings (`components/admin/site-settings-form.tsx`)
```tsx
// components/admin/site-settings-form.tsx
'use client';

import React, { useActionState } from 'react';
import { GenericActionState } from '@/types/credentials';
import { SiteSocialSettings } from '@/types/settings';
import { updateSocialSettingsAction } from '@/app/admin/settings/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Github,
  Linkedin,
  Phone,
  Instagram,
  Music,
} from 'lucide-react';

interface SiteSettingsFormProps {
  socials: SiteSocialSettings;
}

export function SiteSettingsForm({ socials }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    updateSocialSettingsAction,
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          Social Links & Kontak Publik
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-mono text-muted flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-accent" /> Email Kontak *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={socials.email}
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="github" className="text-xs font-mono text-muted flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-accent" /> GitHub URL *
              </Label>
              <Input
                id="github"
                name="github"
                type="url"
                defaultValue={socials.github}
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedin" className="text-xs font-mono text-muted flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-accent" /> LinkedIn URL *
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                defaultValue={socials.linkedin}
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-xs font-mono text-muted flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent" /> WhatsApp Link / No.
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                defaultValue={socials.whatsapp || ''}
                placeholder="https://wa.me/628..."
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="spotify" className="text-xs font-mono text-muted flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-accent" /> Spotify Profile
              </Label>
              <Input
                id="spotify"
                name="spotify"
                defaultValue={socials.spotify || ''}
                placeholder="https://open.spotify.com/user/..."
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="font-mono text-xs">
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              <span>Menyimpan Pengaturan...</span>
            </>
          ) : (
            <span>Simpan Perubahan</span>
          )}
        </Button>
      </div>
    </form>
  );
}
```

### B. Buat Halaman Index Settings (`app/admin/settings/page.tsx`)
```tsx
// app/admin/settings/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { Settings } from 'lucide-react';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';
import site from '@/data/site.json';

export const metadata: Metadata = {
  title: 'Site Settings · Admin CMS',
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Query row site_settings untuk key social_links
  const { data: settingRow } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'social_links')
    .single();

  // Fallback ke data site.json jika di database belum ada
  const socials = settingRow?.value || {
    email: site.contact.email,
    github: site.contact.github,
    linkedin: site.contact.linkedin,
    whatsapp: (site.contact as any).whatsapp || '',
    spotify: (site.contact as any).spotify || '',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Site Settings & Metadata
          </h1>
        </div>
        <p className="text-xs text-muted">
          Konfigurasi tautan profil sosial, kontak email, dan parameter situs publik.
        </p>
      </div>

      <SiteSettingsForm socials={socials} />
    </div>
  );
}
```

---

## 11. Bedah Kode Kritis: Keunggulan JSONB & Revalidasi Multi-Rute

### 1. Mengapa Kolom JSONB Sangat Ideal untuk `site_settings`?
Daripada membuat tabel dengan 30 kolom yang berubah-ubah (*schema migration fatigue*), PostgreSQL `JSONB` menyimpan dokumen terstruktur dengan format biner yang sangat cepat dibaca dan mendukung pengindeksan GIN (*Generalized Inverted Index*). Ketika Anda menambahkan properti sosial baru (misal: `threads`, `bluesky`), Anda tidak perlu menjalankan `ALTER TABLE` lagi!

### 2. `revalidatePath('/', 'layout')`
Ketika tautan sosial media diubah di dashboard admin:
- Kita memanggil `revalidatePath('/', 'layout')`.
- Tanda `'layout'` memberi tahu Next.js untuk **menghapus cache layout publik di root**, sehingga `<SiteHeader />` dan `<SiteFooter />` di semua halaman pengunjung seketika merender tautan sosial terbaru.

---

## 12. Daftar Referensi Dokumentasi Resmi

1. **Next.js Server Actions & Cache Revalidation**:
   - [Next.js Server Actions Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
   - [Next.js revalidatePath API (Path vs Layout Type)](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
2. **PostgreSQL & Supabase**:
   - [PostgreSQL JSON Types & JSONB Functions](https://www.postgresql.org/docs/current/datatype-json.html)
   - [Supabase JavaScript Client: Upsert Operations](https://supabase.com/docs/reference/javascript/upsert)
3. **React 19 Hooks**:
   - [React useActionState Hook](https://react.dev/reference/react/useActionState)
4. **Shadcn UI Components**:
   - [Shadcn UI Dialog](https://ui.shadcn.com/docs/components/dialog)
   - [Shadcn UI Select](https://ui.shadcn.com/docs/components/select)
   - [Shadcn UI Switch](https://ui.shadcn.com/docs/components/switch)

---

## 13. Checklist Pengujian Mandiri & Panduan `/pantau`

- [ ] Buat file tipe di `types/credentials.ts` dan `types/settings.ts`.
- [ ] Buat Server Actions untuk sertifikat, pengalaman, dan site settings.
- [ ] Buat Dialog dan Page untuk sertifikat (`/admin/certificates`).
- [ ] Buat Dialog dan Page untuk linimasa pengalaman (`/admin/experience`).
- [ ] Buka `http://localhost:3000/admin/settings` dan uji coba update link sosial media.
- [ ] Ketik `/pantau` di chat untuk berdiskusi dengan mentor AI mengenai arsitektur kode dan progres Anda!
