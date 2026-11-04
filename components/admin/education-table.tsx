// components/admin/education-table.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { EducationItem } from '@/types/credentials';
import { deleteEducationAction } from '@/app/admin/education/actions';
import { EducationDialog } from '@/components/admin/education-dialog';
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
import { Plus, Edit2, Trash2, Calendar, GraduationCap, Eye } from 'lucide-react';

interface EducationTableProps {
  educations: EducationItem[];
}

export function EducationTable({ educations }: EducationTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);

  const handleDelete = async (id: string, major: string) => {
    try {
      await deleteEducationAction(id);
      toast.success('Education record deleted', {
        description: `"${major}" has been removed.`,
      });
    } catch (err: any) {
      toast.error('Failed to delete education record', {
        description: err.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {educations.length} academic education {educations.length === 1 ? 'record' : 'records'} (sorted by Priority)
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingEdu(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Education
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12 font-mono text-xs uppercase text-muted">#</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Jurusan &amp; Jenjang</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Institusi</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">GPA</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Periode</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Ringkasan</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada riwayat pendidikan. Klik tombol &quot;Tambah Pendidikan&quot; di atas.
                </TableCell>
              </TableRow>
            ) : (
              educations.map((edu) => {
                const majorName = edu.major || edu.role || 'Program Studi';
                const instName = edu.institution || edu.organization || 'Institusi';

                return (
                  <TableRow key={edu.id} className="border-border hover:bg-surface-raised/50">
                    <TableCell>
                      <span className="font-mono text-xs text-muted font-bold">
                        #{edu.priority ?? 1}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-accent shrink-0" />
                        <span>{majorName}</span>
                      </div>
                      {edu.program && (
                        <span className="text-[11px] font-mono text-muted pl-6 block">
                          {edu.program}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-foreground font-medium">
                        {instName}
                      </div>
                    </TableCell>

                    <TableCell>
                      {edu.gpa ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-accent/10 border border-accent/25 text-accent font-semibold">
                          {edu.gpa}
                        </span>
                      ) : (
                        <span className="text-xs text-muted font-mono">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-mono text-foreground flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{formatExperienceDate(edu.start_date)}</span>
                        <span>–</span>
                        {edu.is_current || !edu.end_date ? (
                          <span className="text-emerald-400 font-semibold">Present</span>
                        ) : (
                          <span>{formatExperienceDate(edu.end_date)}</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {edu.description ? (
                        <p
                          className="text-xs text-muted leading-relaxed max-w-sm line-clamp-2"
                          title={edu.description}
                        >
                          {edu.description.length > 80
                            ? `${edu.description.slice(0, 80)}...`
                            : edu.description}
                        </p>
                      ) : (
                        <span className="text-xs text-muted/60 font-mono">-</span>
                      )}
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
                          <Link href={`/admin/education/${edu.id}`}>
                            <Eye className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEdu(edu);
                            setDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0 cursor-pointer"
                          title="Edit Education"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                        </Button>

                        <DeleteConfirmDialog
                          title="Delete Education?"
                          description={`Do you want to permanently delete "${majorName}" at ${instName}?`}
                          onConfirm={() => handleDelete(edu.id, majorName)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={editingEdu}
      />
    </div>
  );
}
