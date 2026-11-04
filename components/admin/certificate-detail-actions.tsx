// components/admin/certificate-detail-actions.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Certificate } from '@/types/credentials';
import { CertificateItem } from '@/lib/types';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
import { CertificateDialog } from '@/components/admin/certificate-dialog';
import { CredentialDialog } from '@/components/credentials/credential-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye } from 'lucide-react';

interface CertificateDetailActionsProps {
  certificate: Certificate;
  availableCategories?: string[];
}

export function CertificateDetailActions({
  certificate,
  availableCategories = [],
}: CertificateDetailActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Hapus sertifikat "${certificate.title}"?`)) {
      startTransition(async () => {
        await deleteCertificateAction(certificate.id);
        router.push('/admin/certificates');
      });
    }
  };

  const previewItem: CertificateItem = {
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer,
    issueDate: certificate.issue_date,
    category: certificate.category,
    credentialId: certificate.credential_id || '',
    credentialUrl: certificate.credential_url || '',
    skills: certificate.skills || [],
    featured: certificate.priority > 0,
    summary: certificate.summary || '',
    imageUrl: '/images/certificates/placeholder-cert.png',
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="font-mono text-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5 text-accent" />
          Preview Modal
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="font-mono text-xs"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Data
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
          className="font-mono text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Hapus
        </Button>
      </div>

      <CertificateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certificate={certificate}
        availableCategories={availableCategories}
      />

      <CredentialDialog
        item={previewItem}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
