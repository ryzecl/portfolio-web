// app/admin/login/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';
import { DotBackground } from '@/components/ui/dot-background';
import { Terminal, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Terminal · Ferry Portfolio',
  robots: {
    index: false, // Melarang crawler mesin pencari mengindeks login admin
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  // Di Next.js 15+, searchParams adalah Promise
  const { redirectTo } = await searchParams;

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background text-foreground relative">
      {/* Kolom Kiri: Form Login Interaktif */}
      <div className="flex flex-col gap-4 p-6 md:p-10 relative z-10 justify-between">
        {/* Brand Header */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm tracking-widest font-bold text-foreground group"
          >
            {/*<div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <Terminal className="w-4 h-4" />
            </div>*/}
            <span>FNH.</span>
          </Link>
        </div>

        {/* Center Card */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Visual Cover Hero (Ciri Khas Shadcn Block login-02) */}
      <div className="relative hidden lg:block bg-surface border-l border-border overflow-hidden">
        <img
            src="/images/admin/login-cover.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
