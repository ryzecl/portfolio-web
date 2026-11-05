// components/admin/experience-client-wrapper.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ExperienceItem } from '@/types/credentials';
import { deleteExperienceAction } from '@/app/admin/experience/actions';
import { ExperienceDialog } from '@/components/admin/experience-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { toast } from 'sonner';
import { formatExperienceDate } from '@/lib/utils';
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
import { Plus, Edit2, Eye } from 'lucide-react';

interface ExperienceClientWrapperProps {
  experiences: ExperienceItem[];
}

export function ExperienceClientWrapper({
  experiences,
}: ExperienceClientWrapperProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);

  // All entries in experiences table are work history
  const workExperiences = experiences;

  const handleDelete = async (id: string, role: string) => {
    try {
      await deleteExperienceAction(id);
      toast.success('Experience deleted', {
        description: `"${role}" has been removed.`,
      });
    } catch (err: any) {
      toast.error('Failed to delete experience', {
        description: err.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Total Count & Add Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {workExperiences.length} work {workExperiences.length === 1 ? 'experience' : 'experiences'} registered (sorted by Priority)
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingExp(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Experience
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted w-20">Priority</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Role &amp; Company</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Period</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workExperiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada riwayat pengalaman kerja. Klik &quot;Add Experience&quot; di atas untuk menambahkan.
                </TableCell>
              </TableRow>
            ) : (
              workExperiences.map((exp) => (
                <TableRow key={exp.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <span className="font-mono text-xs text-muted font-medium">
                      #{exp.priority ?? 1}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground text-sm">
                        <Link
                          href={`/admin/experience/${exp.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {exp.role}
                        </Link>
                      </div>
                      <div className="text-[11px] font-mono text-muted flex items-center gap-1.5">
                        <span className="text-foreground/80">{exp.organization}</span>
                        {(exp.industry || exp.location) && (
                          <>
                            <span className="text-border">·</span>
                            <span>{exp.industry || exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-mono text-foreground flex items-center gap-1.5 whitespace-nowrap">
                      <span>{formatExperienceDate(exp.start_date)}</span>
                      <span>–</span>
                      {exp.is_current || !exp.end_date ? (
                        <span className="text-emerald-400 font-medium">Present</span>
                      ) : (
                        <span className="text-muted">{formatExperienceDate(exp.end_date)}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Details"
                      >
                        <Link href={`/admin/experience/${exp.id}`}>
                          <Eye className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExp(exp);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 cursor-pointer"
                        title="Edit Experience"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <DeleteConfirmDialog
                        title="Delete Experience?"
                        description={`Do you want to permanently delete "${exp.role}" at ${exp.organization || 'this company'}?`}
                        onConfirm={() => handleDelete(exp.id, exp.role)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={editingExp}
      />
    </div>
  );
}
