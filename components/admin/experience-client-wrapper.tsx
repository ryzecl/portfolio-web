// components/admin/experience-client-wrapper.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ExperienceItem } from '@/types/credentials';
import { deleteExperienceAction } from '@/app/admin/experience/actions';
import { ExperienceDialog } from '@/components/admin/experience-dialog';
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
import { Plus, Edit2, Trash2, Calendar, Briefcase, ExternalLink, Eye } from 'lucide-react';

interface ExperienceClientWrapperProps {
  experiences: ExperienceItem[];
}

export function ExperienceClientWrapper({
  experiences,
}: ExperienceClientWrapperProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Semua data di tabel experiences adalah pengalaman kerja
  const workExperiences = experiences;

  const handleDelete = (id: string, role: string) => {
    if (confirm(`Hapus pengalaman kerja "${role}"?`)) {
      startTransition(async () => {
        await deleteExperienceAction(id);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Total Count & Tambah Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-mono">
          Total: {workExperiences.length} pengalaman kerja terdaftar (diurutkan berdasarkan Prioritas)
        </p>

        <Button
          size="sm"
          onClick={() => {
            setEditingExp(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Pengalaman
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted w-20">Prioritas</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Posisi &amp; Perusahaan</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Periode</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Ringkasan</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workExperiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada riwayat pengalaman kerja. Klik &quot;Tambah Pengalaman&quot; untuk menambahkan.
                </TableCell>
              </TableRow>
            ) : (
              workExperiences.map((exp) => (
                <TableRow key={exp.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      #{exp.priority ?? 1}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{exp.role}</span>
                      </div>
                      <div className="text-[11px] font-mono text-muted flex flex-wrap items-center gap-1.5">
                        <span className="text-foreground/80 font-medium">{exp.organization}</span>
                        {(exp.industry || exp.location) && (
                          <>
                            <span className="text-border">·</span>
                            <span className="text-muted/80">{exp.industry || exp.location}</span>
                          </>
                        )}
                        {exp.organization_url && (
                          <a
                            href={exp.organization_url.startsWith('http') ? exp.organization_url : `https://${exp.organization_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-accent hover:underline ml-1"
                            title="Buka Website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-mono text-foreground flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>{formatExperienceDate(exp.start_date)}</span>
                      <span>–</span>
                      {exp.is_current || !exp.end_date ? (
                        <span className="text-emerald-400 font-semibold">Present</span>
                      ) : (
                        <span>{formatExperienceDate(exp.end_date)}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {exp.description ? (
                      <p
                        className="text-xs text-muted leading-relaxed max-w-sm line-clamp-2"
                        title={exp.description}
                      >
                        {exp.description.length > 80
                          ? `${exp.description.slice(0, 80)}...`
                          : exp.description}
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
                        title="Lihat Detail Pengalaman"
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
                        className="h-8 w-8 p-0"
                        title="Edit Pengalaman"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(exp.id, exp.role)}
                        className="h-8 w-8 p-0 text-muted hover:text-destructive"
                        title="Hapus Pengalaman"
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

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={editingExp}
      />
    </div>
  );
}
