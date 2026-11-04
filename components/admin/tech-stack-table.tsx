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
