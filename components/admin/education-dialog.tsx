// components/admin/education-dialog.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { EducationItem, GenericActionState } from '@/types/credentials';
import { upsertEducationAction } from '@/app/admin/education/actions';
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

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationItem | null;
}

function EducationFormContent({
  education,
  onClose,
}: {
  education?: EducationItem | null;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertEducationAction,
    null
  );

  // Controlled states agar input tidak pernah hilang saat validasi / server error
  const [major, setMajor] = useState(education?.major || education?.role || '');
  const [program, setProgram] = useState(education?.program || '');
  const [institution, setInstitution] = useState(
    education?.institution || education?.organization || ''
  );
  const [gpa, setGpa] = useState(education?.gpa || '');
  const [priority, setPriority] = useState<number>(education?.priority ?? 1);
  const [description, setDescription] = useState(education?.description || '');
  const [isCurrent, setIsCurrent] = useState(
    education?.is_current ?? (!education?.end_date)
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    education?.start_date ? new Date(education.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    education?.end_date ? new Date(education.end_date) : undefined
  );

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-mono text-foreground">
          {education ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan'}
        </DialogTitle>
        <DialogDescription className="text-muted text-xs">
          Kelola data institusi, jurusan/program, IPK, dan prestasi akademik (Honors &amp; Distinctions).
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} noValidate className="space-y-4 pt-2">
        {education?.id && <input type="hidden" name="id" value={education.id} />}

        {state?.error && !state?.errors && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* 1. Jurusan (Major), Program / Jenjang */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="edu-major"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.major && 'text-destructive font-semibold'
              )}
            >
              Jurusan / Bidang Studi (Major) *
            </Label>
            <Input
              id="edu-major"
              name="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Information Systems"
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.major && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.major && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.major}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edu-program" className="text-xs font-mono text-muted">
              Jenjang / Program (Degree / Program)
            </Label>
            <Input
              id="edu-program"
              name="program"
              list="program-options"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. Bachelor's Degree, Senior High School, S1"
              className="bg-surface-raised border-border text-xs"
            />
            <datalist id="program-options">
              <option value="Bachelor's Degree (S1)" />
              <option value="Senior High School" />
              <option value="Vocational High School (SMK)" />
              <option value="Associate Degree / Diploma (D3)" />
              <option value="Master's Degree (S2)" />
            </datalist>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1 space-y-1.5">
            <Label
              htmlFor="edu-inst"
              className={cn(
                'text-xs font-mono text-muted',
                state?.errors?.institution && 'text-destructive font-semibold'
              )}
            >
              Institusi / Sekolah *
            </Label>
            <Input
              id="edu-inst"
              name="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Horizon University Indonesia"
              className={cn(
                'bg-surface-raised border-border text-xs',
                state?.errors?.institution && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.institution && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.institution}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edu-gpa" className="text-xs font-mono text-muted">
              Nilai / IPK (GPA)
            </Label>
            <Input
              id="edu-gpa"
              name="gpa"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="e.g. 3.96 / 4.00"
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edu-priority" className="text-xs font-mono text-muted">
              Urutan (Priority)
            </Label>
            <Input
              id="edu-priority"
              name="priority"
              type="number"
              min={1}
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value || '1', 10))}
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>
        </div>

        {/* 3. Periode Studi (Start Date & End Date DatePicker) */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-raised/40 space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.start_date && 'text-destructive font-semibold'
                )}
              >
                Bulan &amp; Tahun Masuk (Start Date) *
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
                className={cn(
                  'text-xs font-mono text-muted',
                  state?.errors?.end_date && 'text-destructive font-semibold'
                )}
              >
                Bulan &amp; Tahun Lulus (End Date)
              </Label>
              <DatePicker
                name="end_date"
                value={endDate}
                onChange={setEndDate}
                disabled={isCurrent}
                disabledPlaceholder="Present (Sedang Kuliah)"
                placeholder="Pilih tanggal lulus"
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
              <Label htmlFor="edu-current" className="text-xs font-medium cursor-pointer">
                Sedang Ditempuh Saat Ini (Present)
              </Label>
              <p className="text-[11px] text-muted">
                Jika aktif atau tanggal lulus kosong (null), status otomatis ditampilkan sebagai &quot;Present&quot;.
              </p>
            </div>
            <Switch
              id="edu-current"
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

        {/* 4. Deskripsi Ringkasan Program Studi */}
        <div className="space-y-1.5">
          <Label htmlFor="edu-desc" className="text-xs font-mono text-muted">
            Fokus Studi / Ringkasan Akademik (Description)
          </Label>
          <Textarea
            id="edu-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Undergraduate degree focusing on software engineering, database systems, and business process modeling."
            rows={2}
            className="bg-surface-raised border-border text-xs"
          />
        </div>

        {/* 5. Key Distinctions & Honors (Achievements) */}
        <DynamicPointList
          label="Key Distinctions & Honors (Prestasi & Penghargaan)"
          name="achievements"
          allowKey={false}
          initialItems={education?.achievements || education?.highlights}
          placeholderValue="e.g. Best Student GPA for Information Systems (2025 & 2026)"
          description="Tambahkan poin pencapaian atau distingsi akademik secara dinamis (opsional tambah/kurang nilai satuan)."
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
              'Simpan Pendidikan'
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
}: EducationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {open && (
          <EducationFormContent
            key={education?.id || 'new'}
            education={education}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
