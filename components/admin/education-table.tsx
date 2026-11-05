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
import { Plus, Edit2, Eye } from 'lucide-react';

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
              <TableHead className="w-16 font-mono text-xs uppercase text-muted">Priority</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Field &amp; Degree</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Institution</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Period &amp; GPA</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada riwayat pendidikan. Klik tombol &quot;Add Education&quot; di atas.
                </TableCell>
              </TableRow>
            ) : (
              educations.map((edu) => {
                const majorName = edu.major || edu.role || 'Program Studi';
                const instName = edu.institution || edu.organization || 'Institusi';

                return (
                  <TableRow key={edu.id} className="border-border hover:bg-surface-raised/50">
                    <TableCell>
                      <span className="font-mono text-xs text-muted font-medium">
                        #{edu.priority ?? 1}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground text-sm">
                          <Link
                            href={`/admin/education/${edu.id}`}
                            className="hover:text-accent transition-colors"
                          >
                            {majorName}
                          </Link>
                        </div>
                        {edu.program && (
                          <span className="text-[11px] font-mono text-muted block">
                            {edu.program}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-foreground font-medium">
                        {instName}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-mono text-foreground flex items-center gap-2 whitespace-nowrap">
                        <span>
                          {formatExperienceDate(edu.start_date)} –{' '}
                          {edu.is_current || !edu.end_date ? (
                            <span className="text-emerald-400 font-medium">Present</span>
                          ) : (
                            <span className="text-muted">{formatExperienceDate(edu.end_date)}</span>
                          )}
                        </span>
                        {edu.gpa && (
                          <span className="text-[11px] font-mono text-muted">
                            · GPA {edu.gpa}
                          </span>
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
