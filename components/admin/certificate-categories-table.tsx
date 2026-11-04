// components/admin/certificate-categories-table.tsx
'use client';

import React, { useState } from 'react';
import { CertificateCategory } from '@/types/credentials';
import { deleteCertificateCategoryAction } from '@/app/admin/certificates/categories/actions';
import { CertificateCategoryDialog } from '@/components/admin/certificate-category-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
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
import { Plus, Edit2, Award, Terminal, Copy, Check } from 'lucide-react';

interface CertificateCategoriesTableProps {
  categories: CertificateCategory[];
  tableMissing?: boolean;
}

export function CertificateCategoriesTable({
  categories,
  tableMissing = false,
}: CertificateCategoriesTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CertificateCategory | null>(null);
  const [copied, setCopied] = useState(false);

  const sqlCommand = `CREATE TABLE IF NOT EXISTS certificate_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE certificate_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read certificate_categories" ON certificate_categories FOR SELECT USING (true);
CREATE POLICY "Admin All certificate_categories" ON certificate_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCertificateCategoryAction(id);
      toast.success('Category deleted', {
        description: `Certificate category "${name}" was deleted successfully.`,
      });
    } catch (err: any) {
      toast.error('Failed to delete category', {
        description: err.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* If table is not yet created in Supabase */}
      {tableMissing && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
              <Terminal className="w-4 h-4" />
              <span>Table "certificate_categories" not yet created in Supabase</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySql}
              className="h-7 text-[11px] font-mono border-amber-500/40 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" /> Copy SQL Script
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Run the following SQL snippet in the <strong className="text-foreground">Supabase SQL Editor</strong> to enable certificate categories:
          </p>
          <pre className="p-3 rounded-lg bg-surface border border-border text-[11px] font-mono text-foreground/90 overflow-x-auto">
            {sqlCommand}
          </pre>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {categories.length} certificate {categories.length === 1 ? 'category' : 'categories'} registered
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
          disabled={tableMissing}
          className="font-mono text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Category Name</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Slug Identifier</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted text-xs font-mono">
                  No certificate categories found. Click &ldquo;Add Category&rdquo; to create one.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell className="font-semibold text-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-surface-raised border border-border flex items-center justify-center text-accent">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-muted">
                      {cat.slug}
                    </code>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(cat);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 cursor-pointer"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <DeleteConfirmDialog
                        title="Delete Category?"
                        description={`Do you want to permanently delete category "${cat.name}"?`}
                        onConfirm={() => handleDelete(cat.id, cat.name)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CertificateCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />
    </div>
  );
}
