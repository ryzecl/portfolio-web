// components/admin/project-form.tsx
'use client';

import React, { useState, useEffect, useActionState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
  ChevronsUpDown,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { TechIcon } from '@/components/ui/tech-icon';
import { DynamicPointList } from '@/components/ui/dynamic-point-list';
import { cn } from '@/lib/utils';

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
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<ProjectActionState | null, FormData>(
    actionToUse,
    null
  );

  // Controlled States untuk menjaga agar input tidak pernah hilang saat validasi / server error
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(project?.slug));
  const [categoryId, setCategoryId] = useState<string>(project?.category_id || '');
  const [role, setRole] = useState(project?.role || 'Full-Stack Developer');
  const [year, setYear] = useState(project?.year || '2026');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Archived'>(
    project?.status || 'Completed'
  );
  const [summary, setSummary] = useState(project?.summary || '');
  const [description, setDescription] = useState(project?.description || '');
  const [problem, setProblem] = useState(project?.problem || '');
  const [solution, setSolution] = useState(project?.solution || '');
  const [contribution, setContribution] = useState(project?.contribution || '');
  const [demoUrl, setDemoUrl] = useState(project?.demo_url || '');
  const [repoUrl, setRepoUrl] = useState(project?.repo_url || '');
  const [priority, setPriority] = useState<number>(project?.priority ?? 0);

  // State Cover Image (Mendukung URL/Path dan upload file)
  const [coverImageUrl, setCoverImageUrl] = useState(project?.cover_image || '');
  const [previewCover, setPreviewCover] = useState<string | null>(
    project?.cover_image || null
  );
  const [removeCover, setRemoveCover] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // State Preview Images / Galeri Interaktif
  const [existingPreviews, setExistingPreviews] = useState<string[]>(
    project?.preview_images || []
  );
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  // State untuk Many-to-Many Tags Teknologi
  const initialTechIds = project?.technologies?.map((t) => t.id) || [];
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(initialTechIds);
  const [techPopoverOpen, setTechPopoverOpen] = useState(false);

  // Kelompokkan teknologi berdasarkan kategori untuk tampilan CommandGroup
  const groupedTechnologies = React.useMemo(() => {
    const groups = new Map<string, { title: string; priority: number; items: Technology[] }>();
    for (const tech of technologies) {
      const catTitle = tech.category?.title || 'Other';
      const catPriority = tech.category?.priority ?? 999;
      if (!groups.has(catTitle)) {
        groups.set(catTitle, { title: catTitle, priority: catPriority, items: [] });
      }
      groups.get(catTitle)!.items.push(tech);
    }
    return Array.from(groups.values()).sort((a, b) => a.priority - b.priority);
  }, [technologies]);

  const selectedTechnologies = React.useMemo(
    () => technologies.filter((t) => selectedTechIds.includes(t.id)),
    [technologies, selectedTechIds]
  );

  // Handle Toast feedback on submit success or failure
  useEffect(() => {
    if (state?.success) {
      toast.success(isEditing ? 'Project updated successfully' : 'Project created successfully', {
        description: isEditing ? 'Your changes have been saved.' : 'New project published to your portfolio.',
      });
      router.push('/admin/projects');
      router.refresh();
    } else if (state?.error) {
      toast.error('Failed to save project', {
        description: state.error,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state, isEditing, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlug(val);
    setIsSlugManual(val.trim().length > 0);
  };

  const toggleTechnology = (techId: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    );
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileSizeError(null);
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileSizeError('Cover file size must not exceed 10 MB.');
        e.target.value = '';
        return;
      }
      setRemoveCover(false);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoverImageUrl(val);
    if (val.trim()) {
      setRemoveCover(false);
      setPreviewCover(val.trim());
    } else if (!coverFileInputRef.current?.files?.length) {
      setPreviewCover(null);
      setRemoveCover(true);
    }
  };

  const handleRemoveCover = () => {
    setPreviewCover(null);
    setCoverImageUrl('');
    setRemoveCover(true);
    setFileSizeError(null);
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = '';
    }
  };

  const handlePreviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setNewPreviewUrls(urls);
    } else {
      setNewPreviewUrls([]);
    }
  };

  const handleRemoveExistingPreview = (indexToRemove: number) => {
    setExistingPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <form action={formAction} noValidate encType="multipart/form-data" className="space-y-8 max-w-4xl">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      {project?.cover_image && (
        <input
          type="hidden"
          name="existing_cover_image"
          value={project.cover_image}
        />
      )}
      <input
        type="hidden"
        name="remove_cover"
        value={removeCover ? 'true' : 'false'}
      />
      {/* Hidden input untuk kategori dan status agar selalu terkirim */}
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="status" value={status} />
      {/* Hidden input untuk melempar preview_images yang dipertahankan */}
      <input
        type="hidden"
        name="existing_preview_images"
        value={JSON.stringify(existingPreviews)}
      />
      {/* Hidden input untuk melempar array ID teknologi terpilih ke Server Action */}
      <input
        type="hidden"
        name="technology_ids"
        value={selectedTechIds.join(',')}
      />

      {/* Banner error umum */}
      {state?.error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">{state.error}</span>
          </div>
        </div>
      )}

      {/* Bagian 1: Informasi Dasar */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          1. Core Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.title && 'text-destructive font-semibold'
              )}
            >
              Project Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Brava : Corporate Company Profile"
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.title && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.title && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.title}</span>
              </p>
            )}
          </div>

          {/* Slug URL */}
          <div className="space-y-1.5">
            <Label
              htmlFor="slug"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.slug && 'text-destructive font-semibold'
              )}
            >
              Slug URL (Auto-generated from Title) *
            </Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="brava"
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.slug && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.slug && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.slug}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Project Category */}
          <div className="space-y-1.5">
            <Label
              htmlFor="category_id"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.category_id && 'text-destructive font-semibold'
              )}
            >
              Project Category *
            </Label>
            <Select
              name="category_id"
              value={categoryId}
              onValueChange={(val) => setCategoryId(val)}
            >
              <SelectTrigger
                className={cn(
                  'bg-surface-raised border-border text-xs w-full',
                  state?.errors?.category_id && 'border-destructive focus-visible:ring-destructive'
                )}
              >
                <SelectValue placeholder="Select Category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="none" disabled className="text-xs text-muted">
                    No categories yet (add in Manage Categories)
                  </SelectItem>
                ) : (
                  categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {state?.errors?.category_id && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.category_id}</span>
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label
              htmlFor="role"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.role && 'text-destructive font-semibold'
              )}
            >
              Your Role *
            </Label>
            <Input
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Lead, Full-Stack"
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.role && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.role && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.role}</span>
              </p>
            )}
          </div>

          {/* Tahun & Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="year"
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.year && 'text-destructive font-semibold'
                )}
              >
                Year *
              </Label>
              <Input
                id="year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className={cn(
                  'bg-surface-raised border-border text-xs font-mono',
                  state?.errors?.year && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {state?.errors?.year && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.year}</span>
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-mono text-muted">
                Status
              </Label>
              <Select
                name="status"
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger className="bg-surface-raised border-border text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
                  <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
                  <SelectItem value="Archived" className="text-xs">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Short Summary */}
        <div className="space-y-1.5">
          <Label
            htmlFor="summary"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.summary && 'text-destructive font-semibold'
            )}
          >
            Short Summary *
          </Label>
          <Textarea
            id="summary"
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A concise 1-2 sentence overview for cards and SEO metadata..."
            rows={2}
            className={cn(
              'bg-surface-raised border-border text-xs',
              state?.errors?.summary && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.summary && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.summary}</span>
            </p>
          )}
        </div>
      </div>

      {/* Bagian 2: Gambar Proyek (Cover & Galeri Detail Interaktif) */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-6">
        <div className="space-y-1">
          <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
            2. Visual Assets (Cover & Interactive Gallery)
          </h2>
          <p className="text-xs text-muted">
            Unggah file langsung atau masukkan path gambar lokal/URL.
          </p>
        </div>

        {/* 2.1 Cover Image Utama */}
        <div className="p-4 rounded-xl border border-border bg-surface-raised space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-foreground">
              A. Cover Image Utama (Tampil di Landing Page & Card Grid) *
            </span>
            <span className="text-[11px] font-mono text-muted">Rasio 16:9 / 16:10</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 items-start">
            <div className="space-y-3">
              {/* Opsi 1: Upload File */}
              <div className="space-y-1.5">
                <Label htmlFor="cover_file" className="text-xs font-mono text-muted">
                  Opsi 1: Unggah Berkas Cover (PNG, JPG, WebP)
                </Label>
                <Input
                  ref={coverFileInputRef}
                  id="cover_file"
                  name="cover_file"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="bg-surface border-border text-xs cursor-pointer"
                />
                {(fileSizeError || state?.errors?.cover_file) && (
                  <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fileSizeError || state?.errors?.cover_file}</span>
                  </p>
                )}
              </div>

              {/* Opsi 2: Path / URL Langsung */}
              <div className="space-y-1.5">
                <Label htmlFor="cover_image_url" className="text-xs font-mono text-muted flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-accent" />
                  <span>Option 2: Or Enter Direct Image URL / Local Path</span>
                </Label>
                <Input
                  id="cover_image_url"
                  name="cover_image_url"
                  value={coverImageUrl}
                  onChange={handleCoverUrlChange}
                  placeholder="e.g. /images/projects/brava-compro/brava-compro.jpg"
                  className="bg-surface border-border text-xs font-mono"
                />
                <p className="text-[11px] text-muted">
                  Ideal for local assets in the public/ directory <code>public/</code> atau CDN eksternal.
                </p>
              </div>
            </div>

            {/* Box Preview Cover */}
            <div className="relative aspect-video rounded-xl border border-dashed border-border bg-surface overflow-hidden flex items-center justify-center group">
              {previewCover ? (
                <>
                  <img
                    src={previewCover}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="px-3 py-1.5 rounded bg-destructive text-destructive-foreground text-xs font-mono flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Cover</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted text-xs font-mono">
                  <ImageIcon className="w-6 h-6" />
                  <span>No cover selected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2.2 Galeri Detail Images (Opsional - Multi Images Interaktif) */}
        <div className="p-4 rounded-xl border border-border bg-surface-raised space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                B. Interactive Detail Gallery (Optional)
              </span>
              <p className="text-[11px] text-muted">
                These images form the interactive carousel gallery on the project case study page (<code>/projects/[slug]</code>) yang bisa digeser (slide/swipe).
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Total {existingPreviews.length + newPreviewUrls.length} Gambar Tambahan
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_files" className="text-xs font-mono text-muted flex items-center gap-2">
              <UploadCloud className="w-3.5 h-3.5 text-accent" />
              <span>Upload Gallery Images (Select one or multiple via Ctrl/Shift)</span>
            </Label>
            <Input
              id="preview_files"
              name="preview_files"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePreviewFilesChange}
              className="bg-surface border-border text-xs cursor-pointer"
            />
          </div>

          {/* List Existing Previews (jika sedang edit proyek) */}
          {existingPreviews.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/60">
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                Saved Gallery Images ({existingPreviews.length} Photos):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingPreviews.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg border border-border overflow-hidden group bg-surface"
                  >
                    <img
                      src={url}
                      alt={`Detail Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingPreview(idx)}
                        className="px-2.5 py-1 rounded bg-destructive text-destructive-foreground text-[10px] font-mono flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-background/80 text-[9px] font-mono text-muted">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List Preview Berkas New yang baru dipilih */}
          {newPreviewUrls.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/60">
              <span className="text-[11px] font-mono text-accent uppercase tracking-wider block font-semibold">
                Newly Selected Files ({newPreviewUrls.length} New Files):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {newPreviewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg border border-accent/40 overflow-hidden bg-surface"
                  >
                    <img
                      src={url}
                      alt={`New file ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-accent text-[9px] font-mono text-accent-foreground font-bold">
                      New #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bagian 3: Relasi Many-to-Many Tags Teknologi (Shadcn Multi-Select Command Combobox) */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
              3. Technologies Applied ({selectedTechIds.length} Terpilih)
            </h2>
            <p className="text-xs text-muted">
              Cari dan pilih beberapa teknologi sekaligus menggunakan pencarian cepat.
            </p>
          </div>
          {selectedTechIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTechIds([])}
              className="text-[11px] font-mono text-muted hover:text-destructive transition-colors cursor-pointer"
            >
              Reset Semua
            </button>
          )}
        </div>

        {/* Shadcn Popover + Command Multi-Select */}
        <Popover open={techPopoverOpen} onOpenChange={setTechPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={techPopoverOpen}
              className="w-full justify-between bg-surface-raised border-border hover:bg-surface-raised/80 hover:border-foreground/30 text-xs font-mono h-10 px-3.5 cursor-pointer"
            >
              <span className="truncate text-muted">
                {selectedTechIds.length > 0
                  ? `${selectedTechIds.length} teknologi dipilih — klik untuk cari / tambah lagi...`
                  : 'Cari dan pilih teknologi (misal: Next.js, Laravel, Tailwind)...'}
              </span>
              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted opacity-70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-(--radix-popover-trigger-width) p-0 rounded-xl border border-border bg-surface shadow-2xl"
          >
            <Command>
              <CommandInput placeholder="Ketik nama teknologi atau kategori..." />
              <CommandList className="max-h-72">
                <CommandEmpty>No technology found.</CommandEmpty>
                {groupedTechnologies.map((group, groupIdx) => (
                  <React.Fragment key={group.title}>
                    {groupIdx > 0 && <CommandSeparator />}
                    <CommandGroup heading={group.title}>
                      {group.items.map((tech) => {
                        const isSelected = selectedTechIds.includes(tech.id);
                        return (
                          <CommandItem
                            key={tech.id}
                            value={`${tech.name} ${tech.slug} ${group.title}`}
                            onSelect={() => toggleTechnology(tech.id)}
                            className="flex items-center justify-between gap-2 px-2.5 py-2 text-xs font-mono cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div
                                className={cn(
                                  'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                                  isSelected
                                    ? 'bg-accent border-accent text-accent-foreground'
                                    : 'border-border bg-surface-raised'
                                )}
                              >
                                <Check
                                  className={cn(
                                    'h-3 w-3 transition-opacity',
                                    isSelected ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </div>
                              <TechIcon
                                name={tech.icon_key || tech.name}
                                className="w-3.5 h-3.5 shrink-0"
                              />
                              <span
                                className={cn(
                                  'truncate',
                                  isSelected && 'font-semibold text-foreground'
                                )}
                              >
                                {tech.name}
                              </span>
                            </div>
                            {isSelected && (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono border-accent/40 text-accent bg-accent/10 px-1.5 py-0"
                              >
                                Terpilih
                              </Badge>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </React.Fragment>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Daftar Badge Teknologi yang Sudah Dipilih */}
        {selectedTechnologies.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedTechnologies.map((tech) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="pl-2.5 pr-1.5 py-1 gap-1.5 rounded-lg bg-accent/15 border border-accent/40 text-foreground font-mono text-xs flex items-center"
              >
                <TechIcon
                  name={tech.icon_key || tech.name}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>{tech.name}</span>
                <button
                  type="button"
                  onClick={() => toggleTechnology(tech.id)}
                  aria-label={`Remove ${tech.name}`}
                  className="ml-0.5 p-0.5 rounded hover:bg-accent/20 text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-[11px] font-mono text-muted">
            Belum ada teknologi yang dipilih.
          </p>
        )}
      </div>

      {/* Bagian 4: Studi Kasus Mendalam (Problem, Solution, Highlights) */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          4. Case Study & Architecture
        </h2>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-mono text-muted">
            Comprehensive Narrative Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full background and architectural context of the project..."
            rows={3}
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="problem" className="text-xs font-mono text-muted">
              Problem Statement & Challenges
            </Label>
            <Textarea
              id="problem"
              name="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Key problems and business bottlenecks that needed solving..."
              rows={3}
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="solution" className="text-xs font-mono text-muted">
              Engineered Solution
            </Label>
            <Textarea
              id="solution"
              name="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Architectural design, system patterns, and technical execution..."
              rows={3}
              className="bg-surface-raised border-border text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contribution" className="text-xs font-mono text-muted">
            Engineering Role & Ownership
          </Label>
          <Textarea
            id="contribution"
            name="contribution"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            placeholder="Your direct responsibilities across architecture, frontend, backend, etc..."
            rows={2}
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        <div className="space-y-6">
          <DynamicPointList
            label="Key Project Highlights"
            name="highlights"
            initialItems={project?.highlights}
            placeholderKey="Tag / Metric (optional)"
            placeholderValue="Key achievement, feature highlight, or performance metric..."
            description="Add dynamic bullet points highlighting key wins, metrics, or core capabilities."
          />

          <DynamicPointList
            label="Architecture & Engineering Highlights"
            name="architecture"
            initialItems={project?.architecture}
            placeholderKey="Component (optional, e.g. Edge, Database, Auth)"
            placeholderValue="System design details, design patterns, integration flows..."
            description="Technical specs, database architecture, and infrastructure implementation."
          />
        </div>
      </div>

      {/* Bagian 5: Tautan Eksternal & Visibilitas */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          5. Links & Visibility
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="demo_url"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.demo_url && 'text-destructive font-semibold'
              )}
            >
              Live Demo URL
            </Label>
            <Input
              id="demo_url"
              name="demo_url"
              type="text"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://brava.id"
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.demo_url && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.demo_url && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.demo_url}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="repo_url"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.repo_url && 'text-destructive font-semibold'
              )}
            >
              Source Code Repository URL
            </Label>
            <Input
              id="repo_url"
              name="repo_url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/ryzecl/brava"
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.repo_url && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.repo_url && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.repo_url}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-accent/5">
          <div className="space-y-0.5">
            <Label htmlFor="priority" className="text-xs font-semibold cursor-pointer text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Landing Page Grid Priority
            </Label>
            <p className="text-[11px] text-muted">
              Set 1 to 4 to feature this project on the Landing Page grid. Use 0 for standard ordering.
            </p>
          </div>
          <Input
            id="priority"
            name="priority"
            type="number"
            min="0"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value || '0', 10))}
            placeholder="1, 2, 3, 4"
            className="w-24 bg-surface-raised border-border font-mono text-xs text-center"
          />
        </div>
      </div>

      {/* Banner error bawah (dekat tombol submit) */}
      {state?.error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">{state.error}</span>
          </div>
        </div>
      )}

      {/* Tombol Aksi Form */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel and return</span>
        </Link>

        <Button type="submit" disabled={isPending} className="px-6 font-mono text-xs cursor-pointer">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Saving Project...</span>
            </>
          ) : isEditing ? (
            <span>Update Project</span>
          ) : (
            <span>Publish Project</span>
          )}
        </Button>
      </div>
    </form>
  );
}
