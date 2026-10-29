import React from 'react';
import {
  Globe,
  Database,
  Smartphone,
  CreditCard,
  Layers,
  ArrowRight,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectPreviewProps {
  type: string;
  title: string;
  category?: string;
  technologies?: string[];
  className?: string;
}

export function ProjectPreview({
  type,
  title,
  category,
  technologies = [],
  className,
}: ProjectPreviewProps) {
  // 1. Brava : Full-Stack Web & CMS Architecture
  if (type === 'brava-preview' || type === 'brava') {
    return <BravaSchematic className={className} />;
  }

  // 1b. Brava CMS : Headless Platform Architecture
  if (type === 'brava-cms-preview' || type === 'brava-cms') {
    return <BravaCmsSchematic className={className} />;
  }

  // 2. SM Sport Center : Court Booking & Payment Engine
  if (type === 'sports-booking-preview' || type === 'sm-sport-center') {
    return <SportsBookingSchematic className={className} />;
  }

  // 3. Donelock : Mobile Productivity App Architecture
  if (type === 'mobile-app-preview' || type === 'donelock') {
    return <MobileAppSchematic className={className} />;
  }

  // Generic fallback architectural preview
  return (
    <div
      className={cn(
        'w-full aspect-video rounded-xl bg-surface border border-border flex flex-col justify-between p-6 text-left shadow-xs',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          System Overview · {category || 'Software Project'}
        </span>
        <span className="font-mono text-[10px] text-accent font-semibold">
          Architecture
        </span>
      </div>

      <div className="py-4 space-y-2">
        <p className="text-lg font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted max-w-md">
          Modular full-stack implementation with decoupled frontend interfaces and reliable backend services.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
        {technologies.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised border border-border text-foreground/80"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. Brava: Web & CMS Architecture Schematic
// ----------------------------------------------------
function BravaSchematic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full aspect-video rounded-xl bg-surface border border-border flex flex-col justify-between p-5 sm:p-6 text-left shadow-xs',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] font-bold text-foreground">
            BRAVA INDUSTRIAL
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          System Architecture
        </span>
      </div>

      {/* Center: System Flow Diagram */}
      <div className="py-2 sm:py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          {/* Node 1 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Web Client</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Next.js · TypeScript</p>
            <p className="text-[9px] text-muted/80 mt-1">SEO & Corporate Profile</p>
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-accent/40 relative">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">API & CMS Engine</p>
            </div>
            <p className="text-[10px] font-mono text-accent font-semibold">Laravel REST API</p>
            <p className="text-[9px] text-muted/80 mt-1">Content Management</p>
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Data Layer</p>
            </div>
            <p className="text-[10px] font-mono text-muted">MySQL · Storage</p>
            <p className="text-[9px] text-muted/80 mt-1">Articles & Media</p>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-[10px] font-mono text-muted">
        <span>Corporate Website + Decoupled CMS</span>
        <span className="text-foreground font-semibold">REST API Flow</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1b. Brava CMS: Headless Platform Architecture Schematic
// ----------------------------------------------------
function BravaCmsSchematic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full aspect-video rounded-xl bg-surface border border-border flex flex-col justify-between p-5 sm:p-6 text-left shadow-xs',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] font-bold text-foreground">
            BRAVA HEADLESS CMS
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          Backend Architecture
        </span>
      </div>

      {/* Center: System Flow Diagram */}
      <div className="py-2 sm:py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          {/* Node 1 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Admin Portal</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Blade · Tailwind v4</p>
            <p className="text-[9px] text-muted/80 mt-1">GA4 Analytics & Editor</p>
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-accent/40 relative">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">API Core</p>
            </div>
            <p className="text-[10px] font-mono text-accent font-semibold">Laravel 13 REST</p>
            <p className="text-[9px] text-muted/80 mt-1">ClearsApiCache Purge</p>
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Data & Media</p>
            </div>
            <p className="text-[10px] font-mono text-muted">MySQL · Intervention</p>
            <p className="text-[9px] text-muted/80 mt-1">Media Resizing Pipeline</p>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-[10px] font-mono text-muted">
        <span>Headless REST API + Media Engine</span>
        <span className="text-foreground font-semibold">Laravel 13 Architecture</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. SM Sport Center: Booking & Payment Engine Schematic
// ----------------------------------------------------
function SportsBookingSchematic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full aspect-video rounded-xl bg-surface border border-border flex flex-col justify-between p-5 sm:p-6 text-left shadow-xs',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] font-bold text-foreground">
            SM SPORT CENTER
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          Transaction Flow
        </span>
      </div>

      {/* Center: System Flow Diagram */}
      <div className="py-2 sm:py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          {/* Node 1 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Booking Portal</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Court Reservation</p>
            <p className="text-[9px] text-muted/80 mt-1">Vinyl & Interlock Courts</p>
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-accent/40">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Booking Engine</p>
            </div>
            <p className="text-[10px] font-mono text-accent font-semibold">Laravel · MySQL</p>
            <p className="text-[9px] text-muted/80 mt-1">Schedule & Availability</p>
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Payment Gateway</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Midtrans Snap</p>
            <p className="text-[9px] text-muted/80 mt-1">Instant Verification</p>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-[10px] font-mono text-muted">
        <span>Futsal Court Booking Engine</span>
        <span className="text-foreground font-semibold">Midtrans Integrated</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Donelock: Mobile Productivity App Schematic
// ----------------------------------------------------
function MobileAppSchematic({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full aspect-video rounded-xl bg-surface border border-border flex flex-col justify-between p-5 sm:p-6 text-left shadow-xs',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px] font-bold text-foreground">
            DONELOCK APP
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
          App Architecture
        </span>
      </div>

      {/* Center: System Flow Diagram */}
      <div className="py-2 sm:py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
          {/* Node 1 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Client UI</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Flutter · Dart</p>
            <p className="text-[9px] text-muted/80 mt-1">Mobile Interface</p>
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-accent/40">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">State Store</p>
            </div>
            <p className="text-[10px] font-mono text-accent font-semibold">Riverpod</p>
            <p className="text-[9px] text-muted/80 mt-1">Reactive State Flow</p>
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-lg bg-surface-raised border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-bold text-foreground">Cloud Sync</p>
            </div>
            <p className="text-[10px] font-mono text-muted">Firebase Cloud</p>
            <p className="text-[9px] text-muted/80 mt-1">Auth & Cloud Store</p>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle text-[10px] font-mono text-muted">
        <span>Cross-platform Productivity Tool</span>
        <span className="text-foreground font-semibold">Flutter + Firebase</span>
      </div>
    </div>
  );
}
