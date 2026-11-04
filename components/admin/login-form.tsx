// components/admin/login-form.tsx
'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { loginAction, ActionResponse } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormProps extends React.ComponentProps<'div'> {
  redirectTo?: string;
}

export function LoginForm({ className, redirectTo = '/admin', ...props }: LoginFormProps) {
  // useActionState mengikat Server Action dengan status pending dan feedback error
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
          Admin Panel
        </h1>
        <p className="text-sm text-muted">
          Enter your administrator credentials to access the portfolio CMS.
        </p>
      </div>

      <form action={formAction} className="grid gap-5">
        {/* Hidden input untuk melestarikan tujuan redirect setelah login */}
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* Pesan Error Reaktif */}
        {state?.error && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Input Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs font-mono text-muted uppercase tracking-wider">
            Email
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ferry@example.com"
              required
              autoComplete="email"
              disabled={isPending}
              className="pl-9 bg-surface-raised border-border text-foreground placeholder:text-muted/60 focus-visible:ring-accent"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-mono text-muted uppercase tracking-wider">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              disabled={isPending}
              className="pl-9 bg-surface-raised border-border text-foreground placeholder:text-muted/60 focus-visible:ring-accent font-mono"
            />
          </div>
        </div>

        {/* Tombol Submit dengan indikator loading */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-10 mt-1 cursor-pointer transition-all shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <span>Authenticate & Enter</span>
          )}
        </Button>
      </form>

      {/* Navigasi balik ke portofolio publik */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to live portfolio</span>
        </Link>
      </div>
    </div>
  );
}
