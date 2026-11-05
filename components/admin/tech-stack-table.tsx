// components/admin/tech-stack-table.tsx
'use client';

import React, { useState } from 'react';
import { TechCategory, Technology } from '@/types/tech-stack';
import { deleteTechnologyAction } from '@/app/admin/tech-stack/actions';
import { TechnologyDialog } from '@/components/admin/technology-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { TechIcon } from '@/components/ui/tech-icon';
import { toast } from 'sonner';
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
import { Plus, Search, Edit2 } from 'lucide-react';

interface TechStackTableProps {
  categories: TechCategory[];
}

export function TechStackTable({ categories }: TechStackTableProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // State Dialog Technology
  const [techDialogOpen, setTechDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);

  // Filter Items
  const allTechnologies: (Technology & { categoryTitle: string })[] = categories.flatMap(
    (cat) =>
      (cat.technologies || []).map((tech) => ({
        ...tech,
        categoryTitle: cat.title,
      }))
  );

  const filteredTechnologies = allTechnologies.filter((tech) => {
    const matchCategory =
      selectedCategory === 'all' || tech.category_id === selectedCategory;
    const query = search.toLowerCase();
    const matchSearch =
      (tech.name || '').toLowerCase().includes(query) ||
      (tech.slug || '').toLowerCase().includes(query) ||
      (tech.icon_key || '').toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  const handleDeleteTech = async (id: string, name: string) => {
    const res = await deleteTechnologyAction(id);
    if (res?.error) {
      toast.error('Failed to delete technology', {
        description: res.error,
      });
    } else {
      toast.success('Technology deleted', {
        description: `"${name}" was deleted successfully.`,
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
            className="px-3 py-2 text-xs rounded-lg bg-surface-raised border border-border text-foreground font-mono cursor-pointer"
          >
            <option value="all">All Categories ({allTechnologies.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title} ({cat.technologies?.length || 0})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setEditingTech(null);
              setTechDialogOpen(true);
            }}
            className="text-xs font-mono cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Technology
          </Button>
        </div>
      </div>

      {/* Technology Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Technology</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Category</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Icon Key</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnologies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted text-xs font-mono">
                  No technologies match your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnologies.map((tech) => (
                <TableRow key={tech.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                        <TechIcon name={tech.icon_key || tech.name} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{tech.name}</div>
                        <div className="text-[11px] font-mono text-muted">/{tech.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-muted">
                      {tech.categoryTitle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-raised border border-border text-accent">
                      {tech.icon_key}
                    </code>
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
                        className="h-8 w-8 p-0 cursor-pointer"
                        title="Edit technology"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <DeleteConfirmDialog
                        title="Delete Technology?"
                        description={`Do you want to permanently delete "${tech.name}" from your tech stack?`}
                        onConfirm={() => handleDeleteTech(tech.id, tech.name)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Modals */}
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
