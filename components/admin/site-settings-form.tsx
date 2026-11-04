// components/admin/site-settings-form.tsx
'use client';

import React, { useActionState, useState } from 'react';
import { GenericActionState } from '@/types/credentials';
import { SiteSocialSettings } from '@/types/settings';
import { updateSocialSettingsAction } from '@/app/admin/settings/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Music,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface SiteSettingsFormProps {
  socials: SiteSocialSettings;
}

export function SiteSettingsForm({ socials }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    updateSocialSettingsAction,
    null
  );

  // Controlled states agar isian tidak pernah hilang saat validasi gagal
  const [email, setEmail] = useState(socials.email || '');
  const [github, setGithub] = useState(socials.github || '');
  const [linkedin, setLinkedin] = useState(socials.linkedin || '');
  const [whatsapp, setWhatsapp] = useState(socials.whatsapp || '');
  const [instagram, setInstagram] = useState(socials.instagram || '');
  const [spotify, setSpotify] = useState(socials.spotify || '');

  return (
    <form action={formAction} noValidate className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl border border-border bg-surface space-y-5">
        <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">
          Social Links & Kontak Publik
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className={cn(
                'text-xs font-mono text-muted flex items-center gap-2',
                state?.errors?.email && 'text-destructive font-semibold'
              )}
            >
              <Mail className="w-3.5 h-3.5 text-accent" /> Email Kontak *
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.email && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.email && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.email}</span>
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="github"
                className={cn(
                  'text-xs font-mono text-muted flex items-center gap-2',
                  state?.errors?.github && 'text-destructive font-semibold'
                )}
              >
                <GithubIcon className="w-3.5 h-3.5 text-accent" /> GitHub URL *
              </Label>
              <Input
                id="github"
                name="github"
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={cn(
                  'bg-surface-raised border-border font-mono text-xs',
                  state?.errors?.github && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {state?.errors?.github && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.github}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="linkedin"
                className={cn(
                  'text-xs font-mono text-muted flex items-center gap-2',
                  state?.errors?.linkedin && 'text-destructive font-semibold'
                )}
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-accent" /> LinkedIn URL *
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={cn(
                  'bg-surface-raised border-border font-mono text-xs',
                  state?.errors?.linkedin && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {state?.errors?.linkedin && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.linkedin}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="whatsapp"
                className={cn(
                  'text-xs font-mono text-muted flex items-center gap-2',
                  state?.errors?.whatsapp && 'text-destructive font-semibold'
                )}
              >
                <Phone className="w-3.5 h-3.5 text-accent" /> WhatsApp Link / No.
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="https://wa.me/628..."
                className={cn(
                  'bg-surface-raised border-border font-mono text-xs',
                  state?.errors?.whatsapp && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {state?.errors?.whatsapp && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.whatsapp}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="instagram"
                className={cn(
                  'text-xs font-mono text-muted flex items-center gap-2',
                  state?.errors?.instagram && 'text-destructive font-semibold'
                )}
              >
                <InstagramIcon className="w-3.5 h-3.5 text-accent" /> Instagram URL
              </Label>
              <Input
                id="instagram"
                name="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className={cn(
                  'bg-surface-raised border-border font-mono text-xs',
                  state?.errors?.instagram && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {state?.errors?.instagram && (
                <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{state.errors.instagram}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="spotify"
              className={cn(
                'text-xs font-mono text-muted flex items-center gap-2',
                state?.errors?.spotify && 'text-destructive font-semibold'
              )}
            >
              <Music className="w-3.5 h-3.5 text-accent" /> Spotify Profile
            </Label>
            <Input
              id="spotify"
              name="spotify"
              value={spotify}
              onChange={(e) => setSpotify(e.target.value)}
              placeholder="https://open.spotify.com/user/..."
              className={cn(
                'bg-surface-raised border-border font-mono text-xs',
                state?.errors?.spotify && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {state?.errors?.spotify && (
              <p className="text-[11px] text-destructive font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{state.errors.spotify}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="font-mono text-xs">
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              <span>Menyimpan Pengaturan...</span>
            </>
          ) : (
            <span>Simpan Perubahan</span>
          )}
        </Button>
      </div>
    </form>
  );
}
