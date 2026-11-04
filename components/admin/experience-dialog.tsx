// components/admin/experience-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { ExperienceItem, GenericActionState } from '@/types/credentials';
import { upsertExperienceAction } from '@/app/admin/experience/actions';
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
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceItem | null;
}

function ExperienceFormContent({
  experience,
  onClose,
}: {
  experience?: ExperienceItem | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertExperienceAction,
    null
  );

  // Controlled states agar input tidak hilang saat form submission gagal
  const [role, setRole] = useState(experience?.role || '');
  const [organization, setOrganization] = useState(experience?.organization || '');
  const [industry, setIndustry] = useState(experience?.industry || experience?.location || '');
  const [organizationUrl, setOrganizationUrl] = useState(experience?.organization_url || '');
  const [priority, setPriority] = useState<number>(experience?.priority ?? 1);
  const [description, setDescription] = useState(experience?.description || '');
  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? (!experience?.end_date));
  const [startDate, setStartDate] = useState<Date | undefined>(
    experience?.start_date ? new Date(experience.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    experience?.end_date ? new Date(experience.end_date) : undefined
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground text-lg">
          {experience ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Form data karir profesional sesuai tata letak kartu linimasa portofolio.
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} noValidate className="space-y-5 pt-2">
        {experience?.id && <input type="hidden" name="id" value={experience.id} />}

        {state?.error && !state?.errors && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* 1. Posisi / Jabatan (Role) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="exp-role"
            className={cn(
              'text-xs font-mono text-muted',
              state?.errors?.role && 'text-destructive font-semibold'
            )}
          >
            Posisi / Jabatan (Position) *
          </Label>
          <Input
            id="exp-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Co-founder · Full-Stack Developer"
            className={cn(
              'bg-surface-raised border-border text-sm font-semibold',
              state?.errors?.role && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {state?.errors?.role && (
            <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{state.errors.role}</span>
            </p>
          )}
        </div>

        {/* 2. Perusahaan & Sektor Industri */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-org"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.organization && 'text-destructive font-semibold'
              )}
            >
              Perusahaan / Agensi (Organization) *
            </Label>
            <Input
              id="exp-org"
              name="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. JDNirwana"
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.organization && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.organization && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.organization}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-industry" className="text-xs font-mono text-muted">
              Sektor Industri (Industry / Sector)
            </Label>
            <Input
              id="exp-industry"
              name="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Software Developer Agency"
              className="bg-surface-raised border-border text-xs"
            />
          </div>
        </div>

        {/* 3. Website Perusahaan & Prioritas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-url"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.organization_url && 'text-destructive font-semibold'
              )}
            >
              Website Perusahaan (Opsional)
            </Label>
            <Input
              id="exp-url"
              name="organization_url"
              type="text"
              value={organizationUrl}
              onChange={(e) => setOrganizationUrl(e.target.value)}
              placeholder="https://nirwana.biz.id"
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.organization_url && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.organization_url && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.organization_url}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-priority" className="text-xs font-mono text-muted">
              Urutan Prioritas (Priority)
            </Label>
            <Input
              id="exp-priority"
              name="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value || '1', 10))}
              placeholder="1"
              className="bg-surface-raised border-border font-mono text-xs"
            />
            <p className="text-[10px] text-muted/70">
              Nomor 1 akan tampil teratas dan terbuka (expanded) di landing page.
            </p>
          </div>
        </div>

        {/* 4. Periode Kerja: Start Date, End Date (DatePicker Shadcn), & Present Toggle */}
        <div className="p-4 rounded-xl border border-border bg-surface-raised/40 space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="exp-start"
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.start_date && 'text-destructive font-semibold'
                )}
              >
                Bulan & Tahun Mulai (Start Date) *
              </Label>
              <DatePicker
                name="start_date"
                value={startDate}
                onChange={setStartDate}
                placeholder="Pilih tanggal mulai"
                displayFormat="MMM yyyy"
                className={cn(state?.errors?.start_date && 'border-destructive')}
              />
              {state?.errors?.start_date && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.start_date}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="exp-end"
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.end_date && 'text-destructive font-semibold'
                )}
              >
                Bulan & Tahun Selesai (End Date)
              </Label>
              <DatePicker
                name="end_date"
                value={endDate}
                onChange={setEndDate}
                disabled={isCurrent}
                disabledPlaceholder="Present (Saat ini)"
                placeholder="Pilih tanggal selesai"
                displayFormat="MMM yyyy"
                allowClear
                className={cn(state?.errors?.end_date && 'border-destructive')}
              />
              {state?.errors?.end_date && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.end_date}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <Label htmlFor="exp-current" className="text-xs font-medium cursor-pointer">
                Masih Aktif Bekerja (Present / Current)
              </Label>
              <p className="text-[11px] text-muted">
                Jika aktif atau tanggal selesai kosong (null), status otomatis ditampilkan sebagai &quot;Present&quot;.
              </p>
            </div>
            <Switch
              id="exp-current"
              name="is_current"
              checked={isCurrent}
              onCheckedChange={(checked) => {
                setIsCurrent(checked);
                if (checked) {
                  setEndDate(undefined);
                }
              }}
            />
          </div>
        </div>

        {/* 5. Ringkasan Peran (Description) */}
        <div className="space-y-1.5">
          <Label htmlFor="exp-desc" className="text-xs font-mono text-muted">
            Ringkasan Peran (Description / Summary)
          </Label>
          <Textarea
            id="exp-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Co-founding a digital agency initiative, leading full-stack web development and translating real-world client needs into practical, high-performance digital products."
            rows={3}
            className="bg-surface-raised border-border text-xs leading-relaxed"
          />
        </div>

        {/* 6. Key Focus & Responsibilities (Highlights - Dynamic Point List Tanpa Key) */}
        <DynamicPointList
          allowKey={false}
          label="Key Focus & Responsibilities"
          name="highlights"
          initialItems={experience?.highlights}
          placeholderValue="e.g. Architect and engineer end-to-end fullstack web applications using Next.js, TypeScript, and Laravel."
          description="Tambahkan poin tanggung jawab dan capaian dengan tombol + Tambah Poin. Baris dapat dihapus dengan ikon tong sampah."
        />

        {/* 7. Technologies Used (Tags Tech Stack) */}
        <DynamicPointList
          allowKey={false}
          label="Technologies Used (Tags Tech Stack)"
          name="technologies"
          initialItems={experience?.technologies}
          placeholderValue="e.g. Next.js / TypeScript / Laravel / MySQL / REST API"
          description="Daftar teknologi/alat yang digunakan (ditampilkan sebagai deretan badge di bagian bawah kartu)."
        />

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
              'Simpan Pengalaman'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
}: ExperienceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {open && (
          <ExperienceFormContent
            key={experience?.id || 'new'}
            experience={experience}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
