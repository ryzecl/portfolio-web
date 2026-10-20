'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Layers,
  Smartphone,
  Globe,
  Database,
  ShieldCheck,
  CreditCard,
  Sliders,
  CheckSquare,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectPreviewProps {
  type: string;
  title: string;
  className?: string;
  compact?: boolean;
}

export function ProjectPreview({
  type,
  title,
  className,
  compact = false,
}: ProjectPreviewProps) {
  // 1. Brava — Company Profile & CMS Preview
  if (type === 'brava-preview' || type === 'brava') {
    return <BravaPreview compact={compact} className={className} />;
  }

  // 2. SM Sport Center — Booking & Payment Preview
  if (type === 'sports-booking-preview' || type === 'sm-sport-center') {
    return <SportsBookingPreview compact={compact} className={className} />;
  }

  // 3. Donelock — Productivity App Preview
  if (type === 'mobile-app-preview' || type === 'donelock') {
    return <MobileAppPreview compact={compact} className={className} />;
  }

  // Generic fallback preview
  return (
    <div
      className={cn(
        'w-full h-full min-h-[260px] bg-surface-raised border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center',
        className
      )}
    >
      <Layers className="w-10 h-10 text-accent mb-3 opacity-80" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs font-mono text-muted mt-1">
        Interactive system architecture & UI component
      </p>
    </div>
  );
}

// ----------------------------------------------------
// 1. Brava: Company Profile + Laravel CMS Preview
// ----------------------------------------------------
function BravaPreview({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<'public' | 'cms'>('public');

  return (
    <div
      className={cn(
        'w-full bg-[#0b0d11] border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface border-b border-border text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-[11px] text-muted-dark hidden sm:inline">
            brava.company · Next.js + Laravel API
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#08090b] p-0.5 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1',
              activeTab === 'public'
                ? 'bg-surface-raised text-accent font-semibold shadow-sm'
                : 'text-muted hover:text-foreground'
            )}
          >
            <Globe className="w-3 h-3" />
            <span>Public Site</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1',
              activeTab === 'cms'
                ? 'bg-surface-raised text-accent font-semibold shadow-sm'
                : 'text-muted hover:text-foreground'
            )}
          >
            <Sliders className="w-3 h-3" />
            <span>CMS Panel</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5">
        {activeTab === 'public' ? (
          <div className="space-y-4">
            {/* Header simulation */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-[10px] text-accent">
                  B
                </span>
                <span className="text-xs font-bold tracking-wider text-foreground">
                  BRAVA INDUSTRIAL
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="text-foreground">Products</span>
                <span>Solutions</span>
                <span>About</span>
                <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-accent font-mono text-[10px]">
                  EN / ID
                </span>
              </div>
            </div>

            {/* Hero Banner Simulation */}
            <div className="rounded-lg bg-gradient-to-r from-surface to-surface-raised border border-border p-4 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="max-w-md space-y-1.5">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                  Corporate Profile
                </span>
                <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                  Precision Engineering & Quality Manufacturing Solutions
                </p>
                <p className="text-[11px] text-muted line-clamp-2">
                  Delivering sustainable industrial equipment and technical services across Southeast Asia.
                </p>
              </div>
            </div>

            {/* Grid preview cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['Heavy Machinery', 'Automation', 'Spare Parts'].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-surface border border-border/70 hover:border-accent/40 transition-colors"
                >
                  <div className="w-full h-10 rounded bg-[#161a22] mb-2 flex items-center justify-center text-muted-dark">
                    <Layers className="w-4 h-4 text-accent/60" />
                  </div>
                  <p className="text-[11px] font-medium text-foreground truncate">
                    {item}
                  </p>
                  <p className="text-[9px] font-mono text-muted">Catalog #{idx + 101}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* CMS Admin View */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-foreground font-semibold">
                  Laravel Filament CMS
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                REST API Live
              </span>
            </div>

            {/* Simulated CMS Tables */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-muted flex items-center justify-between">
                <span>Recent Content Updates</span>
                <span className="text-[10px] text-accent">Auto-synced</span>
              </div>

              {[
                {
                  title: 'Industrial Generator Series 400',
                  type: 'Product',
                  lang: 'EN, ID',
                  status: 'Published',
                },
                {
                  title: 'Annual Sustainability Report 2024',
                  type: 'Article',
                  lang: 'EN',
                  status: 'Draft',
                },
                {
                  title: 'Hero Banner Q3 Update',
                  type: 'Media',
                  lang: 'Global',
                  status: 'Active',
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-surface border border-border/60 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-[11px] text-foreground font-medium truncate">
                      {row.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-muted hidden sm:inline">
                      {row.type}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-mono px-1.5 py-0.5 rounded',
                        row.status === 'Published' || row.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      )}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="px-3.5 py-2 bg-surface/60 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted">
        <span>Architectural simulation: Next.js + Laravel API + MySQL</span>
        <span className="text-accent">Illustrative preview</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. SM Sport Center: Futsal Court Booking & Midtrans
// ----------------------------------------------------
function SportsBookingPreview({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [selectedCourt, setSelectedCourt] = useState<'A' | 'B'>('A');
  const [selectedSlot, setSelectedSlot] = useState<string>('18:00');

  const slots = [
    { time: '16:00', status: 'Booked' },
    { time: '17:00', status: 'Booked' },
    { time: '18:00', status: 'Available' },
    { time: '19:00', status: 'Available' },
    { time: '20:00', status: 'Available' },
    { time: '21:00', status: 'Available' },
  ];

  return (
    <div
      className={cn(
        'w-full bg-[#0b0d11] border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface border-b border-border text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-[11px] text-muted-dark hidden sm:inline">
            smsportcenter.id · Court Booking & Payment Engine
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Midtrans Ready
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Court selection tabs */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-muted text-[11px] uppercase tracking-wider">
              1. Select Court
            </span>
            <span className="text-[11px] text-muted-dark">Vinyl & Interlock Available</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourt('A')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all',
                selectedCourt === 'A'
                  ? 'bg-surface-raised border-accent text-foreground shadow-sm'
                  : 'bg-surface border-border/80 text-muted hover:border-muted'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">
                  Court 01 — Vinyl
                </span>
                <span className="text-[10px] font-mono text-accent">IDR 150K/hr</span>
              </div>
              <p className="text-[10px] text-muted">International standard flooring</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourt('B')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all',
                selectedCourt === 'B'
                  ? 'bg-surface-raised border-accent text-foreground shadow-sm'
                  : 'bg-surface border-border/80 text-muted hover:border-muted'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">
                  Court 02 — Interlock
                </span>
                <span className="text-[10px] font-mono text-accent">IDR 130K/hr</span>
              </div>
              <p className="text-[10px] text-muted">High grip durable tiles</p>
            </button>
          </div>
        </div>

        {/* Schedule grid */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-muted text-[11px] uppercase tracking-wider">
              2. Available Schedule (Today)
            </span>
            <span className="text-[10px] font-mono text-muted">
              Select 1 hr session
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {slots.map((slot) => {
              const isSelected = selectedSlot === slot.time;
              const isBooked = slot.status === 'Booked';

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={cn(
                    'p-2 rounded border text-center transition-all text-xs font-mono',
                    isBooked &&
                      'bg-surface/40 border-border/40 text-muted-dark cursor-not-allowed opacity-60 line-through',
                    !isBooked &&
                      !isSelected &&
                      'bg-surface border-border text-foreground hover:border-accent/60',
                    isSelected &&
                      'bg-accent text-background font-bold border-accent shadow-md shadow-accent/20'
                  )}
                >
                  <div>{slot.time}</div>
                  <div className="text-[9px] mt-0.5 opacity-80">
                    {slot.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checkout pill preview */}
        <div className="p-3 rounded-lg bg-surface border border-border/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">
                Court {selectedCourt === 'A' ? '01 (Vinyl)' : '02 (Interlock)'}
              </span>
              <span className="text-xs font-mono text-accent">
                {selectedSlot} - {parseInt(selectedSlot) + 1}:00
              </span>
            </div>
            <p className="text-[10px] text-muted font-mono">
              Total: {selectedCourt === 'A' ? 'IDR 150.000' : 'IDR 130.000'} · Midtrans Snap API
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-mono font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2 bg-surface/60 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted">
        <span>Full-stack workflow: Laravel + MySQL + Midtrans Payment Gateway</span>
        <span className="text-accent">Illustrative preview</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Donelock: Mobile Productivity App
// ----------------------------------------------------
function MobileAppPreview({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review database indexing strategy', done: true, tag: 'Engineering' },
    { id: 2, text: 'Implement Flutter Riverpod provider', done: true, tag: 'App' },
    { id: 3, text: 'Design offline sync queue mechanism', done: false, tag: 'Architecture' },
    { id: 4, text: 'Draft portfolio project documentation', done: false, tag: 'Documentation' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div
      className={cn(
        'w-full bg-[#0b0d11] border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6 transition-all',
        className
      )}
    >
      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm rounded-[2rem] bg-[#0d0f14] border-2 border-border p-3.5 shadow-2xl relative">
        {/* Camera notch */}
        <div className="w-24 h-4 bg-[#171a20] rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-black/60" />
        </div>

        {/* Mobile App Header */}
        <div className="flex items-center justify-between px-2 pb-3 border-b border-border/60">
          <div>
            <p className="text-[10px] font-mono text-muted uppercase">Today's Focus</p>
            <p className="text-sm font-bold text-foreground">Donelock Workspace</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-mono">
            Flutter + Firebase
          </span>
        </div>

        {/* Calendar Strip preview */}
        <div className="grid grid-cols-5 gap-1.5 my-3 px-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div
              key={day}
              className={cn(
                'p-1.5 rounded-lg text-center text-[10px] font-mono border',
                i === 2
                  ? 'bg-accent text-background font-bold border-accent shadow-sm'
                  : 'bg-surface border-border text-muted'
              )}
            >
              <div>{day}</div>
              <div className="text-xs font-bold mt-0.5">{20 + i}</div>
            </div>
          ))}
        </div>

        {/* Task list preview */}
        <div className="space-y-2 mt-2 px-1">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className={cn(
                'w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors',
                task.done
                  ? 'bg-surface/50 border-border/50 text-muted line-through opacity-75'
                  : 'bg-surface border-border text-foreground hover:border-accent/40'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    task.done ? 'text-accent' : 'text-muted-dark'
                  )}
                />
                <span className="text-xs truncate">{task.text}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border text-muted shrink-0">
                {task.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Home indicator */}
        <div className="w-20 h-1 bg-border rounded-full mx-auto mt-4" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-mono text-muted">
          Flutter · Riverpod State Management · Firebase Integration
        </p>
        <span className="text-[10px] font-mono text-accent">
          Illustrative Mobile UI Preview
        </span>
      </div>
    </div>
  );
}
