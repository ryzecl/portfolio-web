'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ContactData, SiteIdentity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Mail, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LiquidEther = dynamic(
  () => import('@/components/ui/liquid-ether').then((mod) => mod.LiquidEther),
  { ssr: false }
);

interface ContactCtaProps {
  contact: ContactData;
  identity: SiteIdentity;
}

export function ContactCta({ contact, identity }: ContactCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 88%',
              invalidateOnRefresh: true,
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-transparent text-foreground" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={cardRef} className="relative rounded-3xl bg-surface border border-border p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row md:items-center justify-between gap-10 shadow-sm overflow-hidden">
          {/* Ambient LiquidEther Fluid Simulation Background */}
          <div className="absolute inset-0 pointer-events-none opacity-45 dark:opacity-60 transition-opacity duration-700">
            <LiquidEther
              lightMode={true}
              colors={['#1d4ed8', '#2563eb', '#60a5fa']}
              intensity={1.2}
              mouseForce={20}
              cursorSize={90}
              persistence={0.7}
              viscosity={0.25}
              resolution={0.5}
              autoDemo={true}
              autoSpeed={0.35}
              autoIntensity={1.8}
              backgroundColor="transparent"
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted font-medium">
              <span className="text-accent font-bold">04</span>
              <span className="text-border">/</span>
              <span>Collaboration & Opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              Let’s build something practical.
            </h2>

            <p className="text-base text-muted leading-relaxed font-normal">
              I am open to internship opportunities, full-stack or backend developer roles (especially Laravel, Next.js, and modern APIs), and collaborating on software projects.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Based in {identity.location} · {identity.statusLabel}</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button href="/contact" size="lg" variant="primary">
              <Mail className="w-4 h-4 mr-1" />
              <span>Get in touch</span>
            </Button>

            <Button href="/projects" size="lg" variant="secondary">
              <span>Review full catalog</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
