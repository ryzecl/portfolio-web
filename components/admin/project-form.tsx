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
import { DynamicPointList } from '@/components/ui/dynamic-point-list';

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

        <div className="space-y-6">
          <DynamicPointList
            label="Key Highlights Proyek"
            name="highlights"
            initialItems={project?.highlights}
            placeholderKey="Tag / Metrik (opsional)"
            placeholderValue="Poin keunggulan, fitur utama, atau metrik performa..."
            description="Tambahkan sorotan utama keberhasilan proyek secara dinamis."
          />

          <DynamicPointList
            label="Architecture & Engineering Highlights"
            name="architecture"
            initialItems={project?.architecture}
            placeholderKey="Komponen (opsional, misal: Database, Edge, Auth)"
            placeholderValue="Rincian rekayasa sistem, pattern arsitektur, integrasi..."
            description="Spesifikasi teknis, desain arsitektur database, dan implementasi infrastruktur."
          />
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
