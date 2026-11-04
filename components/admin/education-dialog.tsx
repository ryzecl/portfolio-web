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

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationItem | null;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
}: EducationDialogProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertEducationAction,
    null
  );

  const [isCurrent, setIsCurrent] = useState(
    education?.is_current ?? (!education?.end_date)
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    education?.start_date ? new Date(education.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    education?.end_date ? new Date(education.end_date) : undefined
  );

  // Sync state saat modal dibuka atau data berganti
  useEffect(() => {
    const current = education?.is_current ?? (!education?.end_date);
    setIsCurrent(current);
    setStartDate(education?.start_date ? new Date(education.start_date) : undefined);
    setEndDate(education?.end_date ? new Date(education.end_date) : undefined);
  }, [education, open]);

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
            {education ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Kelola data institusi, jurusan/program, IPK, dan prestasi akademik (Honors &amp; Distinctions).
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          {education?.id && <input type="hidden" name="id" value={education.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Jurusan (Major), Program / Jenjang, & Universitas (Institution) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edu-major" className="text-xs font-mono text-muted">
                Jurusan / Bidang Studi (Major) *
              </Label>
              <Input
                id="edu-major"
                name="major"
                defaultValue={education?.major || education?.role || ''}
                placeholder="e.g. Information Systems"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu-program" className="text-xs font-mono text-muted">
                Jenjang / Program (Degree / Program)
              </Label>
              <Input
                id="edu-program"
                name="program"
                list="program-options"
                defaultValue={education?.program || ''}
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
              <Label htmlFor="edu-inst" className="text-xs font-mono text-muted">
                Institusi / Sekolah *
              </Label>
              <Input
                id="edu-inst"
                name="institution"
                defaultValue={education?.institution || education?.organization || ''}
                placeholder="e.g. Horizon University Indonesia"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu-gpa" className="text-xs font-mono text-muted">
                Nilai / IPK (GPA)
              </Label>
              <Input
                id="edu-gpa"
                name="gpa"
                defaultValue={education?.gpa || ''}
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
                defaultValue={education?.priority ?? 1}
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          {/* 3. Periode Studi (Start Date & End Date DatePicker) */}
          <div className="p-3.5 rounded-xl border border-border bg-surface-raised/40 space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono text-muted">
                  Bulan &amp; Tahun Masuk (Start Date) *
                </Label>
                <DatePicker
                  name="start_date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Pilih tanggal mulai"
                  displayFormat="MMM yyyy"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono text-muted">
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
                />
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
              defaultValue={education?.description || ''}
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
                'Simpan Pendidikan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
