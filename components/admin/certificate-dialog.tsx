// components/admin/certificate-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Certificate, GenericActionState } from '@/types/credentials';
import { upsertCertificateAction } from '@/app/admin/certificates/actions';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';
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
import { Loader2, AlertCircle } from 'lucide-react';
import { DynamicPointList } from '@/components/ui/dynamic-point-list';
import { cn } from '@/lib/utils';

interface CertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
  availableCategories?: string[];
}

function parseInitialDate(val?: string) {
  if (!val) return undefined;
  if (/^\d{4}$/.test(val)) return new Date(`${val}-01-01`);
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
}

function CertificateFormContent({
  certificate,
  availableCategories,
  onClose,
}: {
  certificate?: Certificate | null;
  availableCategories: string[];
  onClose: () => void;
}) {
  const [title, setTitle] = useState(certificate?.title || '');
  const [issuer, setIssuer] = useState(certificate?.issuer || '');
  const [issueDate, setIssueDate] = useState<Date | undefined>(() =>
    parseInitialDate(certificate?.issue_date)
  );
  const [category, setCategory] = useState<string>(
    certificate?.category || (availableCategories.length > 0 ? availableCategories[0] : '')
  );
  const [credentialId, setCredentialId] = useState(certificate?.credential_id || '');
  const [credentialUrl, setCredentialUrl] = useState(certificate?.credential_url || '');
  const [summary, setSummary] = useState(certificate?.summary || '');
  const [priority, setPriority] = useState<number>(certificate?.priority ?? 0);
  const [skills, setSkills] = useState<string[]>(certificate?.skills || []);

  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertCertificateAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(certificate ? 'Certificate updated' : 'Certificate created', {
        description: certificate
          ? `Changes saved for "${title}".`
          : `Certificate "${title}" added successfully.`,
      });
      onClose();
    } else if (state?.error && !state?.errors) {
      toast.error('Failed to save certificate', {
        description: state.error,
      });
    }
  }, [state, onClose, certificate, title]);

  const categoryOptions = React.useMemo(() => {
    const list = [...availableCategories];
    if (category && !list.includes(category)) {
      list.unshift(category);
    }
    return list.map((c) => ({
      value: c,
      label: c,
    }));
  }, [availableCategories, category]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground">
          {certificate ? 'Edit Certificate' : 'Add New Certificate'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Provide credential details, issuing organization, verification URL, and verified skills.
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4 pt-2">
        {certificate?.id && <input type="hidden" name="id" value={certificate.id} />}

        {state?.error && !state?.errors && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* 1. Title */}
        <div className="space-y-1.5">
          <Label
            htmlFor="title"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.title && 'text-destructive font-semibold'
            )}
          >
            Certificate / License Title *
          </Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Junior Web Programmer"
            className={cn(
              'bg-surface-raised border-border text-xs transition-colors',
              state?.errors?.title && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.title && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.title}</span>
            </p>
          )}
        </div>

        {/* 2. Issuer & Issue Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="issuer"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.issuer && 'text-destructive font-semibold'
              )}
            >
              Issuer / Organization *
            </Label>
            <Input
              id="issuer"
              name="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. BNSP · LSP Teknologi Digital"
              className={cn(
                'bg-surface-raised border-border text-xs transition-colors',
                state?.errors?.issuer && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.issuer && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.issuer}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="issue_date"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.issue_date && 'text-destructive font-semibold'
              )}
            >
              Issue Date *
            </Label>
            <DatePicker
              name="issue_date"
              value={issueDate}
              onChange={setIssueDate}
              placeholder="Select issue date"
              displayFormat="MMM yyyy"
              className={cn(state?.errors?.issue_date && 'border-destructive')}
            />
            {state?.errors?.issue_date && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.issue_date}</span>
              </p>
            )}
          </div>
        </div>

        {/* 3. Category & Credential ID */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.category && 'text-destructive font-semibold'
                )}
              >
                Category *
              </Label>
              {availableCategories.length === 0 && (
                <Link
                  href="/admin/certificates/categories"
                  className="text-[10px] font-mono text-accent hover:underline"
                  target="_blank"
                >
                  + Create Category
                </Link>
              )}
            </div>
            <input type="hidden" name="category" value={category} />
            <Combobox
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder={
                availableCategories.length === 0
                  ? 'No categories available...'
                  : 'Select category...'
              }
              searchPlaceholder="Search category..."
              emptyText={
                availableCategories.length === 0
                  ? 'No categories found. Please create one first.'
                  : 'Category not found.'
              }
              className="w-full"
              triggerClassName={cn(
                'w-full sm:w-full rounded-xl bg-surface-raised border-border text-xs h-9 justify-between transition-colors',
                state?.errors?.category && 'border-destructive ring-destructive'
              )}
            />
            {state?.errors?.category ? (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.category}</span>
              </p>
            ) : availableCategories.length === 0 ? (
              <p className="text-[11px] text-amber-400 font-mono mt-1">
                Category table is currently empty.{' '}
                <Link href="/admin/certificates/categories" className="underline font-semibold" target="_blank">
                  Create a category here
                </Link>.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credential_id" className="text-xs font-mono text-muted">
              Credential ID
            </Label>
            <Input
              id="credential_id"
              name="credential_id"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g. TIK 1565 66081 2026"
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>
        </div>

        {/* 4. Verification URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="credential_url"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.credential_url && 'text-destructive font-semibold'
            )}
          >
            Verification URL
          </Label>
          <Input
            id="credential_url"
            name="credential_url"
            type="text"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/... or official verification URL"
            className={cn(
              'bg-surface-raised border-border font-mono text-xs transition-colors',
              state?.errors?.credential_url && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.credential_url ? (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.credential_url}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted">
              This URL will open when clicking &ldquo;Verify Official Credential ↗&rdquo; in the credential modal.
            </p>
          )}
        </div>

        {/* 5. Summary */}
        <div className="space-y-1.5">
          <Label htmlFor="summary" className="text-xs font-mono text-muted">
            Summary / Credential Description
          </Label>
          <Textarea
            id="summary"
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="e.g. National Professional Certification of Competence issued under Indonesian National Work Competency Standards (SKKNI)..."
            className="bg-surface-raised border-border text-xs resize-none"
          />
        </div>

        {/* 6. Skills */}
        <DynamicPointList
          label="Verified Competencies &amp; Skills"
          name="skills"
          initialItems={skills}
          placeholderValue="e.g. Web Development, Clean Code Architecture..."
          description="List of verified competencies displayed as badges on the credential modal."
          allowKey={false}
        />

        {/* 7. Priority */}
        <div className="space-y-1.5 p-3 rounded-xl border border-border bg-surface-raised">
          <div className="flex items-center justify-between">
            <Label htmlFor="priority" className="text-xs font-mono text-muted">
              Priority Order (#1 = Spotlight Card on Landing Page)
            </Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              min="0"
              max="99"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
              className="w-20 bg-surface border-border font-mono text-xs text-center h-8"
            />
          </div>
          <p className="text-[11px] text-muted">
            Set to <strong className="text-foreground">1</strong> for your premier credential (e.g. BNSP) to showcase as the large spotlight card.
          </p>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer font-mono text-xs"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="cursor-pointer font-mono text-xs">
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Certificate'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function CertificateDialog({
  open,
  onOpenChange,
  certificate,
  availableCategories = [],
}: CertificateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {open && (
          <CertificateFormContent
            certificate={certificate}
            availableCategories={availableCategories}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
