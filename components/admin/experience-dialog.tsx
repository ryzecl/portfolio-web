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

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceItem | null;
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
}: ExperienceDialogProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    upsertExperienceAction,
    null
  );

  const [isCurrent, setIsCurrent] = useState(experience?.is_current ?? (!experience?.end_date));
  const [startDate, setStartDate] = useState<Date | undefined>(
    experience?.start_date ? new Date(experience.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    experience?.end_date ? new Date(experience.end_date) : undefined
  );

  // Sync state saat modal dibuka untuk record berbeda
  useEffect(() => {
    const current = experience?.is_current ?? (!experience?.end_date);
    setIsCurrent(current);
    setStartDate(experience?.start_date ? new Date(experience.start_date) : undefined);
    setEndDate(experience?.end_date ? new Date(experience.end_date) : undefined);
  }, [experience, open]);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground text-lg">
            {experience ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs">
            Form data karir profesional sesuai tata letak kartu linimasa portofolio.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5 pt-2">
          {experience?.id && <input type="hidden" name="id" value={experience.id} />}

          {state?.error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Posisi / Jabatan (Role) */}
          <div className="space-y-1.5">
            <Label htmlFor="exp-role" className="text-xs font-mono text-muted">
              Posisi / Jabatan (Position) *
            </Label>
            <Input
              id="exp-role"
              name="role"
              defaultValue={experience?.role || ''}
              placeholder="e.g. Co-founder · Full-Stack Developer"
              required
              className="bg-surface-raised border-border text-sm font-semibold"
            />
          </div>

          {/* 2. Perusahaan & Sektor Industri */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exp-org" className="text-xs font-mono text-muted">
                Perusahaan / Agensi (Organization) *
              </Label>
              <Input
                id="exp-org"
                name="organization"
                defaultValue={experience?.organization || ''}
                placeholder="e.g. JDNirwana"
                required
                className="bg-surface-raised border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp-industry" className="text-xs font-mono text-muted">
                Sektor Industri (Industry / Sector)
              </Label>
              <Input
                id="exp-industry"
                name="industry"
                defaultValue={experience?.industry || experience?.location || ''}
                placeholder="e.g. Software Developer Agency"
                className="bg-surface-raised border-border text-xs"
              />
            </div>
          </div>

          {/* 3. Website Perusahaan & Prioritas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exp-url" className="text-xs font-mono text-muted">
                Website Perusahaan (Opsional)
              </Label>
              <Input
                id="exp-url"
                name="organization_url"
                type="url"
                defaultValue={experience?.organization_url || ''}
                placeholder="https://nirwana.biz.id"
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp-priority" className="text-xs font-mono text-muted">
                Urutan Prioritas (Priority)
              </Label>
              <Input
                id="exp-priority"
                name="priority"
                type="number"
                defaultValue={experience?.priority ?? 1}
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
                <Label htmlFor="exp-start" className="text-xs font-mono text-muted">
                  Bulan & Tahun Mulai (Start Date) *
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
                <Label htmlFor="exp-end" className="text-xs font-mono text-muted">
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
                />
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
              defaultValue={experience?.description || ''}
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
                'Simpan Pengalaman'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
