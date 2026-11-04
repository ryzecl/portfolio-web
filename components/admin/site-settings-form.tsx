// components/admin/site-settings-form.tsx
'use client';

import React, { useActionState } from 'react';
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

interface SiteSettingsFormProps {
  socials: SiteSocialSettings;
}

export function SiteSettingsForm({ socials }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState<GenericActionState | null, FormData>(
    updateSocialSettingsAction,
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
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
            <Label htmlFor="email" className="text-xs font-mono text-muted flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-accent" /> Email Kontak *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={socials.email}
              required
              className="bg-surface-raised border-border font-mono text-xs"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="github" className="text-xs font-mono text-muted flex items-center gap-2">
                <GithubIcon className="w-3.5 h-3.5 text-accent" /> GitHub URL *
              </Label>
              <Input
                id="github"
                name="github"
                type="url"
                defaultValue={socials.github}
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedin" className="text-xs font-mono text-muted flex items-center gap-2">
                <LinkedinIcon className="w-3.5 h-3.5 text-accent" /> LinkedIn URL *
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                defaultValue={socials.linkedin}
                required
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-xs font-mono text-muted flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent" /> WhatsApp Link / No.
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                defaultValue={socials.whatsapp || ''}
                placeholder="https://wa.me/628..."
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instagram" className="text-xs font-mono text-muted flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-accent" /> Instagram URL
              </Label>
              <Input
                id="instagram"
                name="instagram"
                defaultValue={socials.instagram || ''}
                placeholder="https://instagram.com/..."
                className="bg-surface-raised border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spotify" className="text-xs font-mono text-muted flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-accent" /> Spotify Profile
            </Label>
            <Input
              id="spotify"
              name="spotify"
              defaultValue={socials.spotify || ''}
              placeholder="https://open.spotify.com/user/..."
              className="bg-surface-raised border-border font-mono text-xs"
            />
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
