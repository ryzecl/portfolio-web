// components/admin/certificate-detail-actions.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Certificate } from '@/types/credentials';
import { CertificateItem } from '@/lib/types';
import { deleteCertificateAction } from '@/app/admin/certificates/actions';
import { CertificateDialog } from '@/components/admin/certificate-dialog';
import { CredentialDialog } from '@/components/credentials/credential-dialog';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Eye } from 'lucide-react';

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
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteCertificateAction(certificate.id);
      toast.success('Certificate deleted', {
        description: `"${certificate.title}" has been permanently removed.`,
      });
      router.push('/admin/certificates');
    } catch (err: any) {
      toast.error('Failed to delete certificate', {
        description: err.message,
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
          className="font-mono text-xs cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5 text-accent" />
          Preview Modal
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="font-mono text-xs cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit Details
        </Button>

        <DeleteConfirmDialog
          title="Delete Certificate?"
          description={`Do you want to permanently delete "${certificate.title}"?`}
          onConfirm={handleDelete}
          variant="outline"
          showLabel
          label="Delete"
        />
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
