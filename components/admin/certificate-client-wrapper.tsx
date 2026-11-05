// components/admin/certificate-client-wrapper.tsx
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Certificate } from '@/types/credentials';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
import { CertificateDialog } from '@/components/admin/certificate-dialog';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';

interface CertificateClientWrapperProps {
  certificates: Certificate[];
  availableCategories?: string[];
}

function formatDateDisplay(dateStr?: string) {
  if (!dateStr) return '';
  if (/^\d{4}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

export function CertificateClientWrapper({
  certificates,
  availableCategories,
}: CertificateClientWrapperProps) {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isPending, startTransition] = useTransition();

  const categoriesList = availableCategories || [];

  const filteredCerts = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteCertificateAction(id);
      toast.success('Certificate deleted', {
        description: `"${title}" has been removed.`,
      });
    } catch (err: any) {
      toast.error('Failed to delete certificate', {
        description: err.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari sertifikat atau penerbit..."
            className="pl-9 bg-surface-raised border-border text-xs"
          />
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingCert(null);
            setDialogOpen(true);
          }}
          className="font-mono text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Tambah Sertifikat
        </Button>
      </div>

      {/* Simplified Concise Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Certificate &amp; Issuer</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Category</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Priority</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada sertifikat di database Supabase. Klik tombol &ldquo;Tambah Sertifikat&rdquo; di atas.
                </TableCell>
              </TableRow>
            ) : (
              filteredCerts.map((cert) => (
                <TableRow key={cert.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground text-sm flex items-center gap-2">
                        <Link
                          href={`/admin/certificates/${cert.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {cert.title}
                        </Link>
                        {cert.priority === 1 && (
                          <Badge className="bg-accent/15 border-accent/30 text-accent font-mono text-[10px] py-0 px-1.5 h-4">
                            Spotlight
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-muted">
                        {cert.issuer} · {formatDateDisplay(cert.issue_date)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-muted">
                      {cert.category}
                    </span>
                  </TableCell>

                  <TableCell>
                    {cert.priority === 1 ? (
                      <span className="text-[11px] font-mono text-accent font-semibold">
                        #1 Spotlight
                      </span>
                    ) : cert.priority && cert.priority > 1 ? (
                      <span className="text-[11px] font-mono text-foreground/80">
                        #{cert.priority} Featured
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-muted">Archive</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Detail Page */}
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        title="View Details"
                        className="h-8 w-8 p-0 text-muted hover:text-foreground"
                      >
                        <Link href={`/admin/certificates/${cert.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </Button>

                      {/* Edit Modal */}
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit Sertifikat"
                        onClick={() => {
                          setEditingCert(cert);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-muted hover:text-foreground"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>

                      {/* Delete */}
                      <DeleteConfirmDialog
                        title="Delete Certificate?"
                        description={`Do you want to permanently delete "${cert.title}"?`}
                        onConfirm={() => handleDelete(cert.id, cert.title)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Create Form Dialog */}
      <CertificateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certificate={editingCert}
        availableCategories={categoriesList}
      />
    </div>
  );
}
