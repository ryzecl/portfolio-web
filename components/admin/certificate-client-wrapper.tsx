// components/admin/certificate-client-wrapper.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Certificate } from '@/types/credentials';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
import { CertificateDialog } from '@/components/admin/certificate-dialog';
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
  ExternalLink,
} from 'lucide-react';

interface CertificateClientWrapperProps {
  certificates: Certificate[];
  availableCategories?: string[];
}

export function CertificateClientWrapper({
  certificates,
  availableCategories,
}: CertificateClientWrapperProps) {
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isPending, startTransition] = useTransition();

  const categoriesList = availableCategories?.length
    ? availableCategories
    : Array.from(
        new Set(
          [
            ...certificates.map((c) => c.category),
            'Frontend Development',
            'Backend Architecture',
            'Cloud & DevOps',
            'Mobile Development',
          ].filter(Boolean)
        )
      );

  const filteredCerts = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus sertifikat "${title}"?`)) {
      startTransition(async () => {
        await deleteCertificateAction(id);
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
            placeholder="Search certificates..."
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs uppercase text-muted">Sertifikat</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Kategori</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Verifikasi</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted">Featured</TableHead>
              <TableHead className="font-mono text-xs uppercase text-muted text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted text-xs font-mono">
                  Belum ada sertifikat yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredCerts.map((cert) => (
                <TableRow key={cert.id} className="border-border hover:bg-surface-raised/50">
                  <TableCell>
                    <div>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <span>{cert.title}</span>
                        {cert.featured && (
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-muted">
                        {cert.issuer} · {cert.issue_date}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {cert.category}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {cert.credential_url ? (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline"
                      >
                        <span>{cert.credential_id || 'Verify URL'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-muted">
                        {cert.credential_id || '-'}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    {cert.featured ? (
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
                          setEditingCert(cert);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted hover:text-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(cert.id, cert.title)}
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

      <CertificateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certificate={editingCert}
        availableCategories={categoriesList}
      />
    </div>
  );
}
