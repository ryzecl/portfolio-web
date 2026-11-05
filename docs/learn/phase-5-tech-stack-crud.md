# Fase 5: Modul Master Data — Tech Stack & Kategori CRUD

Dokumen ini adalah panduan implementasi langkah-demi-langkah yang **100% lengkap dengan kode produksi**, penjelasan baris demi baris, alasan arsitektur di balik pemisahan Server vs Client Components, integrasi **Supabase PostgreSQL Database**, serta **tautan prioritas ke dokumentasi resmi Next.js**.

---

## 📑 Daftar Isi
1. [Prinsip Desain & Alasan Arsitektur (The "Why")](#1-prinsip-desain--alasan-arsitektur-the-why)
2. [Analogi Laravel vs Next.js App Router](#2-analogi-laravel-vs-nextjs-app-router)
3. [Server Component vs Client Component pada Pola CRUD](#3-server-component-vs-client-component-pada-pola-crud)
4. [Langkah 1: Instalasi Komponen Shadcn UI via Bun](#langkah-1-instalasi-komponen-shadcn-ui-via-bun)
5. [Langkah 2: Definisi Tipe Data TypeScript (`types/tech-stack.ts`)](#langkah-2-definisi-tipe-data-typescript-typestech-stackts)
6. [Langkah 3: Server Actions Lengkap (`app/admin/tech-stack/actions.ts`)](#langkah-3-server-actions-lengkap-appadmintech-stackactionsts)
7. [Langkah 4: Komponen Dialog Kategori (`components/admin/tech-category-dialog.tsx`)](#langkah-4-komponen-dialog-kategori-componentsadmintech-category-dialogtsx)
8. [Langkah 5: Komponen Dialog Teknologi (`components/admin/technology-dialog.tsx`)](#langkah-5-komponen-dialog-teknologi-componentsadmintechnology-dialogtsx)
9. [Langkah 6: Komponen Tabel Interaktif (`components/admin/tech-stack-table.tsx`)](#langkah-6-komponen-tabel-interaktif-componentsadmintech-stack-tabletsx)
10. [Langkah 7: Halaman Server Component Index (`app/admin/tech-stack/page.tsx`)](#langkah-7-halaman-server-component-index-appadmintech-stackpagetsx)
11. [Bedah Kode Kritis: Revalidasi Cache & Row Level Security (RLS)](#11-bedah-kode-kritis-revalidasi-cache--row-level-security-rls)
12. [Daftar Referensi Dokumentasi Resmi](#12-daftar-referensi-dokumentasi-resmi)
13. [Checklist Pengujian Mandiri & Panduan `/pantau`](#13-checklist-pengujian-mandiri--panduan-pantau)

---

## 1. Prinsip Desain & Alasan Arsitektur (The "Why")

Modul **Tech Stack** adalah fondasi master data portofolio. Setiap teknologi (seperti *React, Next.js, PostgreSQL, Docker*) terhubung dengan kategori (*Frontend, Backend, Database, DevOps*) dan nantinya akan ditautkan ke proyek-proyek unggulan di Fase 6.

### Kenapa Modul Tech Stack Dikerjakan Sebelum Modul Proyek?
- **Relasi Foreign Key**: Tabel `projects` dan pivot `project_technologies` membutuhkan `technology_id` yang valid. Jika data teknologi belum ada di database, kita tidak bisa membuat selector relasi (*many-to-many*) saat menambahkan proyek baru.
- **Hierarki Data**:
  ```text
  tech_categories (Parent: "Frontend Development", "Backend Development")
         └── technologies (Child: "Next.js", "TypeScript", "Tailwind CSS")
                └── project_technologies (Pivot ke tabel projects)
  ```

---

## 2. Analogi Laravel vs Next.js App Router

Bagi Anda yang terbiasa dengan ekosistem Laravel MVC, berikut pemetaan konsepnya ke Next.js App Router:

| Fitur di Laravel | Padanan di Next.js App Router | Penjelasan |
| :--- | :--- | :--- |
| **`web.php` + `TechController@index`** | **`app/admin/tech-stack/page.tsx` (Server Component)** | Menjalankan query langsung ke database di server tanpa ekspos koneksi ke browser, lalu merender HTML. |
| **Blade View + Data Passing (`view('...', $data)`)** | **Server Component Props ke Client Component** | Data hasil query dikirimkan ke `<TechStackTable categories={categories} />` sebagai properti TypeScript statis. |
| **`TechController@store`, `@update`, `@destroy`** | **`actions.ts` (Server Actions `'use server'`)** | Fungsi server yang dipanggil oleh form modal/dialog tanpa perlu membuat file routing API (`api.php`) manual. |
| **`back()->with('success', '...')`** | **`revalidatePath('/admin/tech-stack')`** | Menghapus cache Server Component seketika sehingga tabel langsung menampilkan data terbaru tanpa *page reload* penuh. |
| **Laravel Form Request Validation** | **Validasi FormData di Server Action** | Memeriksa kelengkapan nama, slug, icon_key sebelum melakukan insert ke Supabase. |

---

## 3. Server Component vs Client Component pada Pola CRUD

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Composition Patterns: When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components)  
> - [Next.js Data Fetching on the Server](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server)

```text
[app/admin/tech-stack/page.tsx] (Server Component)
│  ├── Query database via createClient() langsung di server
│  ├── Tidak mengirim database credentials atau query logic ke browser (Aman)
│  └── 0kb JavaScript overhead untuk proses data retrieval
│
└── [components/admin/tech-stack-table.tsx] (Client Component - 'use client')
   ├── Filter pencarian instan (search filter)
   ├── Tab filter kategori
   ├── State buka-tutup modal Dialog Tambah / Edit
   └── Pemicu konfirmasi hapus data (Delete confirmation)
```

---

## 4. Langkah 1: Instalasi Komponen Shadcn UI via Bun

> 📖 **Dokumentasi Resmi Shadcn UI**:  
> - [Shadcn UI: Table Component](https://ui.shadcn.com/docs/components/table)  
> - [Shadcn UI: Select Component](https://ui.shadcn.com/docs/components/select)  
> - [Shadcn UI: Switch Component](https://ui.shadcn.com/docs/components/switch)

Jalankan perintah ini di terminal menggunakan **Bun**:

```bash
bun x --bun shadcn@latest add table select switch
```

Perintah di atas akan menambahkan 3 komponen UI baru:
- `components/ui/table.tsx`
- `components/ui/select.tsx`
- `components/ui/switch.tsx`

---

## 5. Langkah 2: Definisi Tipe Data TypeScript (`types/tech-stack.ts`)

Buat berkas baru di `types/tech-stack.ts` untuk menjamin konsistensi tipe antara database Supabase dan komponen React:

```typescript
// types/tech-stack.ts

export interface TechCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  priority: number;
  created_at: string;
  technologies?: Technology[];
}

export interface Technology {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  icon_key: string;
  is_featured: boolean;
  priority: number;
  created_at: string;
  category?: TechCategory;
}

export interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
```

---

## 6. Langkah 3: Server Actions Lengkap (`app/admin/tech-stack/actions.ts`)

> 📖 **Dokumentasi Resmi Next.js**:  
> - [Next.js Server Actions & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)  
> - [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

Buat berkas baru di `app/admin/tech-stack/actions.ts`:

```typescript
// app/admin/tech-stack/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { ActionState } from '@/types/tech-stack';

// ==============================================================================
// 1. KATEGORI TECH STACK MUTATIONS
// ==============================================================================

export async function upsertCategoryAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const description = (formData.get('description') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  if (!title || !slug) {
    return { error: 'Judul dan slug kategori wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    // Mode Update
    const { error } = await supabase
      .from('tech_categories')
      .update({ title, slug, description, priority })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Mode Insert
    const { error } = await supabase
      .from('tech_categories')
      .insert({ title, slug, description, priority });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Kategori berhasil disimpan.' };
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
  if (!id) return { error: 'ID kategori tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('tech_categories').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Kategori berhasil dihapus.' };
}

// ==============================================================================
// 2. TEKNOLOGI MUTATIONS
// ==============================================================================

export async function upsertTechnologyAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const category_id = formData.get('category_id') as string;
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const icon_key = (formData.get('icon_key') as string)?.trim().toLowerCase();
  const is_featured = formData.get('is_featured') === 'on' || formData.get('is_featured') === 'true';
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  if (!name || !slug || !category_id || !icon_key) {
    return { error: 'Semua kolom bertanda bintang wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    // Mode Update
    const { error } = await supabase
      .from('technologies')
      .update({
        category_id,
        name,
        slug,
        icon_key,
        is_featured,
        priority,
      })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Mode Insert
    const { error } = await supabase
      .from('technologies')
      .insert({
        category_id,
        name,
        slug,
        icon_key,
        is_featured,
        priority,
      });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Teknologi berhasil disimpan.' };
}

export async function deleteTechnologyAction(id: string): Promise<ActionState> {
  if (!id) return { error: 'ID teknologi tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('technologies').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Teknologi berhasil dihapus.' };
}
```

---

## 7. Langkah 4: Komponen Dialog Kategori (`components/admin/tech-category-dialog.tsx`)

Buat berkas baru di `components/admin/tech-category-dialog.tsx`:

```tsx
// components/admin/tech-category-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { TechCategory, ActionState } from '@/types/tech-stack';
import { upsertCategoryAction } from '@/app/admin/tech-stack/actions';
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
import { Loader2, AlertCircle } from 'lucide-react';

interface TechCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TechCategory | null;
}

export function TechCategoryDialog({
  open,
  onOpenChange,
  category,
}: TechCategoryDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertCategoryAction,
    null
  );

  // Tutup dialog otomatis jika mutasi sukses
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {category ? 'Edit Kategori Tech' : 'Tambah Kategori Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Kelompokkan teknologi ke dalam cluster (misal: Frontend, Backend, Database).
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {category?.id && <input type="hidden" name="id" value={category.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="cat-title" className="text-xs font-mono text-muted">
              Judul Kategori *
            </Label>
            <Input
              id="cat-title"
              name="title"
              defaultValue={category?.title || ''}
              placeholder="e.g. Frontend Development"
              required
              className="bg-surface-raised border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-slug" className="text-xs font-mono text-muted">
              Slug URL *
            </Label>
            <Input
              id="cat-slug"
              name="slug"
              defaultValue={category?.slug || ''}
              placeholder="e.g. frontend-development"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs font-mono text-muted">
              Deskripsi Singkat
            </Label>
            <Input
              id="cat-desc"
              name="description"
              defaultValue={category?.description || ''}
              placeholder="e.g. Modern UI libraries & frameworks"
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-prio" className="text-xs font-mono text-muted">
              Urutan Prioritas (Angka kecil tampil lebih awal)
            </Label>
            <Input
              id="cat-prio"
              name="priority"
              type="number"
              defaultValue={category?.priority ?? 0}
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
                'Simpan Kategori'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 8. Langkah 5: Komponen Dialog Teknologi (`components/admin/technology-dialog.tsx`)

Buat berkas baru di `components/admin/technology-dialog.tsx`:

```tsx
// components/admin/technology-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { Technology, TechCategory, ActionState } from '@/types/tech-stack';
import { upsertTechnologyAction } from '@/app/admin/tech-stack/actions';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';

interface TechnologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology?: Technology | null;
  categories: TechCategory[];
  defaultCategoryId?: string;
}

export function TechnologyDialog({
  open,
  onOpenChange,
  technology,
  categories,
  defaultCategoryId,
}: TechnologyDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    upsertTechnologyAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {technology ? 'Edit Teknologi' : 'Tambah Teknologi Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Tambahkan bahasa, framework, pustaka, atau tool ke master data.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {technology?.id && <input type="hidden" name="id" value={technology.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Kategori Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="category_id" className="text-xs font-mono text-muted">
              Pilih Kategori *
            </Label>
            <Select
              name="category_id"
              defaultValue={technology?.category_id || defaultCategoryId || categories[0]?.id}
              required
            >
              <SelectTrigger className="bg-surface-raised border-border">
                <SelectValue placeholder="Pilih Kategori..." />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nama Teknologi */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-name" className="text-xs font-mono text-muted">
              Nama Teknologi *
            </Label>
            <Input
              id="tech-name"
              name="name"
              defaultValue={technology?.name || ''}
              placeholder="e.g. Next.js"
              required
              className="bg-surface-raised border-border"
            />
          </div>

          {/* Slug URL */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-slug" className="text-xs font-mono text-muted">
              Slug Identifier *
            </Label>
            <Input
              id="tech-slug"
              name="slug"
              defaultValue={technology?.slug || ''}
              placeholder="e.g. nextdotjs"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          {/* Icon Key SimpleIcons */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-icon" className="text-xs font-mono text-muted">
              Icon Key (SimpleIcons / SVG key) *
            </Label>
            <Input
              id="tech-icon"
              name="icon_key"
              defaultValue={technology?.icon_key || ''}
              placeholder="e.g. nextdotjs, react, typescript"
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
            <p className="text-[11px] text-muted">
              Gunakan identifier ikon dari simpleicons.org
            </p>
          </div>

          {/* Toggle Featured Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-raised">
            <div className="space-y-0.5">
              <Label htmlFor="tech-featured" className="text-xs font-medium cursor-pointer">
                Tampilkan di Hero / Featured
              </Label>
              <p className="text-[11px] text-muted">
                Teknologi akan ditonjolkan pada marquee dan badge utama portofolio.
              </p>
            </div>
            <Switch
              id="tech-featured"
              name="is_featured"
              defaultChecked={technology?.is_featured || false}
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-prio" className="text-xs font-mono text-muted">
              Urutan Prioritas
            </Label>
            <Input
              id="tech-prio"
              name="priority"
              type="number"
              defaultValue={technology?.priority ?? 0}
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
                'Simpan Teknologi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 9. Langkah 6: Komponen Tabel Interaktif (`components/admin/tech-stack-table.tsx`)

Komponen ini membungkus data, pencarian (*client-side search filter*), pemilihan kategori, dan pemicu dialog.

Buat berkas baru di `components/admin/tech-stack-table.tsx`:

```tsx
// components/admin/tech-stack-table.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { TechCategory, Technology } from '@/types/tech-stack';
import {
  deleteCategoryAction,
  deleteTechnologyAction,
} from '@/app/admin/tech-stack/actions';
import { TechCategoryDialog } from '@/components/admin/tech-category-dialog';
import { TechnologyDialog } from '@/components/admin/technology-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  FolderPlus,
  Loader2,
} from 'lucide-react';

interface TechStackTableProps {
  categories: (TechCategory & { technologies: Technology[] })[];
}

export function TechStackTable({ categories }: TechStackTableProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  // State Dialog Kategori
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TechCategory | null>(null);

  // State Dialog Teknologi
  const [techDialogOpen, setTechDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);

  // Filter Items
  const allTechnologies = categories.flatMap((cat) =>
    (cat.technologies || []).map((tech) => ({ ...tech, categoryTitle: cat.title }))
  );

  const filteredTechnologies = allTechnologies.filter((tech) => {
    const matchCategory =
      selectedCategory === 'all' || tech.category_id === selectedCategory;
    const matchSearch =
      tech.name.toLowerCase().includes(search.toLowerCase()) ||
      tech.slug.toLowerCase().includes(search.toLowerCase()) ||
      tech.icon_key.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDeleteTech = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus teknologi "${name}"?`)) {
      startTransition(async () => {
        await deleteTechnologyAction(id);
      });
    }
  };

  const handleDeleteCategory = (id: string, title: string) => {
    if (
      confirm(
        `PERINGATAN: Menghapus kategori "${title}" akan menghapus semua teknologi di dalamnya! Lanjutkan?`
      )
    ) {
      startTransition(async () => {
        await deleteCategoryAction(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tech..."
              className="pl-9 bg-surface-raised border-border text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface-raised border border-border text-foreground font-mono"
          >
            <option value="all">Semua Kategori ({allTechnologies.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title} ({cat.technologies?.length || 0})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setCatDialogOpen(true);
            }}
            className="text-xs font-mono"
          >
            <FolderPlus className="w-3.5 h-3.5 mr-1.5" />
            Kategori Baru
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingTech(null);
              setTechDialogOpen(true);
            }}
            className="text-xs font-mono"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Teknologi Baru
          </Button>
        </div>
      </div>

      {/* Ringkasan Kategori Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono group"
          >
            <span className="font-semibold text-foreground">{cat.title}</span>
            <span className="text-[11px] text-muted">
              ({cat.technologies?.length || 0})
            </span>
            <button
              onClick={() => {
                setEditingCategory(cat);
                setCatDialogOpen(true);
              }}
              className="text-muted hover:text-accent ml-1 transition-colors"
              title="Edit Kategori"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDeleteCategory(cat.id, cat.title)}
              className="text-muted hover:text-destructive transition-colors"
              title="Hapus Kategori"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Tabel Master Teknologi */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Teknologi</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Icon Key</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Featured</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnologies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Tidak ada teknologi yang cocok dengan kriteria pencarian.
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnologies.map((tech) => (
                <TableRow key={tech.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{tech.name}</span>
                      <span className="text-[11px] font-mono text-muted">/{tech.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px] font-mono">
                      {tech.categoryTitle}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-raised border border-border text-accent">
                      {tech.icon_key}
                    </code>
                  </TableCell>
                  <TableCell>
                    {tech.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-muted">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTech(tech);
                          setTechDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDeleteTech(tech.id, tech.name)}
                        className="h-8 w-8 p-0 text-muted hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Modals */}
      <TechCategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={editingCategory}
      />

      <TechnologyDialog
        open={techDialogOpen}
        onOpenChange={setTechDialogOpen}
        technology={editingTech}
        categories={categories}
        defaultCategoryId={selectedCategory !== 'all' ? selectedCategory : undefined}
      />
    </div>
  );
}
```

---

## 10. Langkah 7: Halaman Server Component Index (`app/admin/tech-stack/page.tsx`)

> 📖 **Dokumentasi Resmi Next.js**:  
> [Next.js Server Component Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

Buat berkas baru di `app/admin/tech-stack/page.tsx`:

```tsx
// app/admin/tech-stack/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/server';
import { TechStackTable } from '@/components/admin/tech-stack-table';
import { Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tech Stack Management · Admin CMS',
};

export default async function TechStackAdminPage() {
  const supabase = await createClient();

  // Query categories beserta relasi teknologi diurutkan berdasarkan priority
  const { data: categories, error } = await supabase
    .from('tech_categories')
    .select(`
      id,
      title,
      slug,
      description,
      priority,
      created_at,
      technologies (
        id,
        category_id,
        name,
        slug,
        icon_key,
        is_featured,
        priority,
        created_at
      )
    `)
    .order('priority', { ascending: true });

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-mono">
        Failed to fetch tech stack: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Cpu className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
            Tech Stack Master
          </h1>
        </div>
        <p className="text-xs text-muted">
          Kelola klaster keahlian teknologi, icon SimpleIcons, dan status featured untuk portofolio.
        </p>
      </div>

      {/* Interactive Table Component */}
      <TechStackTable categories={categories || []} />
    </div>
  );
}
```

---

## 11. Bedah Kode Kritis: Revalidasi Cache & Row Level Security (RLS)

### 1. `revalidatePath('/admin/tech-stack')` dan `revalidatePath('/')`
Ketika Anda menambah, mengedit, atau menghapus teknologi:
- `revalidatePath('/admin/tech-stack')` membersihkan cache halaman admin sehingga tabel langsung menampilkan data terbaru.
- `revalidatePath('/')` memastikan bahwa halaman depan portofolio publik yang menampilkan badge tech stack juga langsung diperbarui tanpa Anda harus melakukan *rebuild* aplikasi secara manual.

### 2. Kebijakan RLS di Database Supabase
Pastikan Anda telah mengeksekusi skema dari [`docs/learn/schema.sql`](file:///C:/Users/ferry/Documents/coding/web-porto-profesional/docs/learn/schema.sql):
- **Pengunjung Publik**: Hanya diizinkan `SELECT` (baca data).
- **Admin Login (`auth.role() = 'authenticated'`)**: Memiliki izin penuh `ALL` (INSERT, UPDATE, DELETE).
Jika Anda lupa mengaktifkan policy ini atau lupa login, Server Action akan mengembalikan error RLS: *"new row violates row-level security policy"*.

---

## 12. Daftar Referensi Dokumentasi Resmi

1. **Next.js App Router**:
   - [Next.js Server Actions & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
   - [Next.js Server Components Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
   - [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
2. **React 19**:
   - [React useActionState Hook](https://react.dev/reference/react/useActionState)
   - [React useTransition Hook](https://react.dev/reference/react/useTransition)
3. **Shadcn UI**:
   - [Shadcn Table Component](https://ui.shadcn.com/docs/components/table)
   - [Shadcn Dialog Component](https://ui.shadcn.com/docs/components/dialog)
   - [Shadcn Select Component](https://ui.shadcn.com/docs/components/select)
   - [Shadcn Switch Component](https://ui.shadcn.com/docs/components/switch)
4. **Supabase Database**:
   - [Supabase JavaScript Client: Selecting Data with Joins](https://supabase.com/docs/reference/javascript/select)
   - [Supabase Row Level Security (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

## 13. Checklist Pengujian Mandiri & Panduan `/pantau`

- [ ] Jalankan perintah instalasi UI: `bun x --bun shadcn@latest add table select switch`.
- [ ] Buat file tipe di `types/tech-stack.ts`.
- [ ] Buat Server Actions di `app/admin/tech-stack/actions.ts`.
- [ ] Buat komponen Dialog dan Tabel di `components/admin/`.
- [ ] Buka browser di `http://localhost:3000/admin/tech-stack`.
- [ ] Uji coba menambah kategori baru (misal: "Frontend Development").
- [ ] Uji coba menambah teknologi baru (misal: "Next.js", icon: "nextdotjs", switch featured: ON).
- [ ] Coba lakukan pencarian dan filter kategori di tabel.
- [ ] Ketik `/pantau` di chat kapan saja untuk memvalidasi kodingan atau jika ada error saat eksekusi!
