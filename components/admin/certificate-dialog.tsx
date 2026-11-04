// components/admin/certificate-dialog.tsx
'use client';

import React, { useActionState, useEffect } from 'react';
import { Certificate, GenericActionState } from '@/types/credentials';
import { upsertCertificateAction } from '@/app/admin/certificates/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle } from 'lucide-react';
import { DynamicPointList } from '@/components/ui/dynamic-point-list';

interface CertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
  availableCategories?: string[];
}

export function CertificateDialog({
  open,
  onOpenChange,
  certificate,
  availableCategories = [],
}: CertificateDialogProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertCertificateAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">
            {certificate ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Masukkan bukti kredensial, issuer, tautan verifikasi, dan keahlian yang diuji.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {certificate?.id && <input type="hidden" name="id" value={certificate.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-mono text-muted">
              Nama Sertifikat / Lisensi *
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={certificate?.title || ''}
              placeholder="e.g. Belajar Fundamental Aplikasi Web dengan React"
              required
              className="bg-surface-raised border-border text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="issuer" className="text-xs font-mono text-muted">
                Penerbit (Issuer) *
              </Label>
              <Input
                id="issuer"
                name="issuer"
                defaultValue={certificate?.issuer || ''}
                placeholder="e.g. Dicoding Indonesia"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue_date" className="text-xs font-mono text-muted">
                Tanggal Terbit *
              </Label>
              <Input
                id="issue_date"
                name="issue_date"
                defaultValue={certificate?.issue_date || ''}
                placeholder="e.g. Okt 2024"
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-mono text-muted">
                Kategori
              </Label>
              <Input
                id="category"
                name="category"
                defaultValue={certificate?.category || 'Frontend'}
                list="certificate-category-options"
                placeholder="Pilih atau ketik kategori..."
                className="bg-surface-raised border-border text-xs"
              />
              <datalist id="certificate-category-options">
                {availableCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="credential_id" className="text-xs font-mono text-muted">
                Credential ID
              </Label>
              <Input
                id="credential_id"
                name="credential_id"
                defaultValue={certificate?.credential_id || ''}
                placeholder="e.g. MRXMQ49... (opsional)"
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credential_url" className="text-xs font-mono text-muted">
              Verification URL (Tautan Verifikasi Asli)
            </Label>
            <Input
              id="credential_url"
              name="credential_url"
              type="url"
              defaultValue={certificate?.credential_url || ''}
              placeholder="https://dicoding.com/certificates/..."
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <DynamicPointList
            label="Keahlian & Topik (Skills)"
            name="skills"
            initialItems={certificate?.skills}
            placeholderKey="Domain (opsional)"
            placeholderValue="Nama skill / topik teknis..."
            description="Daftar keahlian atau topik yang diuji dalam sertifikat ini."
          />

          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
            <div className="space-y-0.5">
              <Label htmlFor="cert-featured" className="text-xs font-medium cursor-pointer">
                Tampilkan di Sorotan Kredensial
              </Label>
              <p className="text-[11px] text-muted">
                Sertifikat akan mendapatkan badge khusus di halaman kredensial publik.
              </p>
            </div>
            <Switch
              id="cert-featured"
              name="featured"
              defaultChecked={certificate?.featured || false}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Sertifikat'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
