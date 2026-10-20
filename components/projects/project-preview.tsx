'use client';

import React, { useState } from 'react';
import {
  Layers,
  Globe,
  Sliders,
  CheckSquare,
  FileText,
  CreditCard,
  ShieldCheck,
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
  // 1. Brava : Company Profile & CMS Preview
  if (type === 'brava-preview' || type === 'brava') {
    return <BravaPreview compact={compact} className={className} />;
  }

  // 2. SM Sport Center : Booking & Payment Preview
  if (type === 'sports-booking-preview' || type === 'sm-sport-center') {
    return <SportsBookingPreview compact={compact} className={className} />;
  }

  // 3. Donelock : Productivity App Preview
  if (type === 'mobile-app-preview' || type === 'donelock') {
    return <MobileAppPreview compact={compact} className={className} />;
  }

  // Generic fallback preview
  return (
    <div
      className={cn(
        'w-full h-full min-h-[260px] bg-surface border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-xs',
        className
      )}
    >
      <Layers className="w-10 h-10 text-muted mb-3" />
      <p className="text-sm font-bold text-foreground">{title}</p>
      <p className="text-xs font-mono text-muted mt-1">
        Architecture diagram & component schema
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
        'w-full bg-surface border border-border rounded-xl overflow-hidden shadow-xs flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Architecture Bar (No fake OS dots) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-raised border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
            BRAVA
          </span>
          <span className="text-border">/</span>
          <span className="font-mono text-[11px] text-muted hidden sm:inline">
            Next.js + Laravel REST API
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className={cn(
              'px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer',
              activeTab === 'public'
                ? 'bg-surface-raised text-foreground font-semibold border border-border'
                : 'text-muted hover:text-foreground'
            )}
          >
            <Globe className="w-3 h-3" />
            <span>Public Website</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={cn(
              'px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer',
              activeTab === 'cms'
                ? 'bg-surface-raised text-foreground font-semibold border border-border'
                : 'text-muted hover:text-foreground'
            )}
          >
            <Sliders className="w-3 h-3" />
            <span>CMS Admin</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 bg-surface">
        {activeTab === 'public' ? (
          <div className="space-y-4">
            {/* Header simulation */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
                  B
                </span>
                <span className="text-xs font-bold tracking-wider text-foreground">
                  BRAVA INDUSTRIAL
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="text-foreground font-medium">Products</span>
                <span>Solutions</span>
                <span>About</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-raised border border-border text-foreground font-mono text-[10px]">
                  EN / ID
                </span>
              </div>
            </div>

            {/* Hero Banner Simulation */}
            <div className="rounded-lg bg-surface-raised border border-border p-4 relative overflow-hidden">
              <div className="max-w-md space-y-1.5">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-medium">
                  Corporate Profile
                </span>
                <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
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
                  className="p-2.5 rounded-lg bg-surface-raised border border-border hover:border-accent/40 transition-colors"
                >
                  <div className="w-full h-10 rounded bg-surface border border-border mb-2 flex items-center justify-center text-muted">
                    <Layers className="w-4 h-4 text-foreground" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground truncate">
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
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-mono text-foreground font-bold">
                  Laravel CMS Management
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised text-foreground border border-border font-medium">
                REST API Live
              </span>
            </div>

            {/* Simulated CMS Tables */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-muted flex items-center justify-between">
                <span>Recent Content Updates</span>
                <span className="text-[10px] text-accent font-medium">Auto-synced</span>
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
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-raised border border-border text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-foreground shrink-0" />
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
                        'text-[9px] font-mono px-1.5 py-0.5 rounded font-medium',
                        row.status === 'Published' || row.status === 'Active'
                          ? 'bg-accent/10 text-accent border border-accent/30'
                          : 'bg-surface text-muted border border-border'
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
      <div className="px-3.5 py-2 bg-surface-raised border-t border-border flex items-center justify-between text-[10px] font-mono text-muted">
        <span>Architectural simulation: Next.js + Laravel API + MySQL</span>
        <span className="text-foreground font-medium">Domain wireframe</span>
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
        'w-full bg-surface border border-border rounded-xl overflow-hidden shadow-xs flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Architecture Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-raised border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-wider">
            SM SPORT CENTER
          </span>
          <span className="text-border">/</span>
          <span className="font-mono text-[11px] text-muted hidden sm:inline">
            Court Booking & Payment Engine
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-foreground border border-border flex items-center gap-1 font-medium">
          <CreditCard className="w-3 h-3 text-accent" />
          Midtrans Ready
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 bg-surface">
        {/* Court selection tabs */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-muted text-[11px] uppercase tracking-wider font-medium">
              1. Select Court
            </span>
            <span className="text-[11px] text-muted">Vinyl & Interlock Available</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourt('A')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
                selectedCourt === 'A'
                  ? 'bg-surface-raised border-accent text-foreground'
                  : 'bg-surface border-border text-muted hover:border-border-subtle'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">
                  Court 01 (Vinyl)
                </span>
                <span className="text-[10px] font-mono text-accent font-semibold">IDR 150K/hr</span>
              </div>
              <p className="text-[10px] text-muted">International standard flooring</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourt('B')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
                selectedCourt === 'B'
                  ? 'bg-surface-raised border-accent text-foreground'
                  : 'bg-surface border-border text-muted hover:border-border-subtle'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">
                  Court 02 (Interlock)
                </span>
                <span className="text-[10px] font-mono text-accent font-semibold">IDR 130K/hr</span>
              </div>
              <p className="text-[10px] text-muted">High grip durable tiles</p>
            </button>
          </div>
        </div>

        {/* Schedule grid */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-muted text-[11px] uppercase tracking-wider font-medium">
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
                    'p-2 rounded-lg border text-center transition-all text-xs font-mono cursor-pointer',
                    isBooked &&
                      'bg-surface-raised/40 border-border/40 text-muted/40 cursor-not-allowed line-through',
                    !isBooked &&
                      !isSelected &&
                      'bg-surface border-border text-foreground hover:border-border/80',
                    isSelected &&
                      'bg-accent text-background font-bold border-accent shadow-xs'
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

        {/* Checkout preview */}
        <div className="p-3.5 rounded-xl bg-surface-raised border border-border flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                Court {selectedCourt === 'A' ? '01 (Vinyl)' : '02 (Interlock)'}
              </span>
              <span className="text-xs font-mono font-semibold text-accent">
                {selectedSlot} - {parseInt(selectedSlot) + 1}:00
              </span>
            </div>
            <p className="text-[10px] text-muted font-mono">
              Total: {selectedCourt === 'A' ? 'IDR 150.000' : 'IDR 130.000'} · Midtrans Snap API
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-mono font-medium flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2 bg-surface-raised border-t border-border flex items-center justify-between text-[10px] font-mono text-muted">
        <span>Full-stack workflow: Laravel + MySQL + Midtrans Payment Gateway</span>
        <span className="text-foreground font-medium">Domain wireframe</span>
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
        'w-full bg-surface border border-border rounded-xl overflow-hidden shadow-xs flex flex-col items-center justify-center p-4 sm:p-6 transition-all',
        className
      )}
    >
      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm rounded-[2rem] bg-surface-raised border border-border p-4 shadow-md relative">
        {/* Camera bar */}
        <div className="w-20 h-3 bg-surface rounded-full mx-auto mb-3 border border-border" />

        {/* Mobile App Header */}
        <div className="flex items-center justify-between px-2 pb-3 border-b border-border">
          <div>
            <p className="text-[10px] font-mono text-muted uppercase font-medium">Daily Focus</p>
            <p className="text-sm font-bold text-foreground">Donelock Workspace</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-foreground text-[10px] font-mono font-medium">
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
                  ? 'bg-accent text-background font-bold border-accent'
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
                'w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer',
                task.done
                  ? 'bg-surface/50 border-border/50 text-muted line-through'
                  : 'bg-surface border-border text-foreground hover:border-accent/40'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    task.done ? 'text-accent' : 'text-muted'
                  )}
                />
                <span className="text-xs truncate font-medium">{task.text}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border text-muted shrink-0 font-medium">
                {task.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Home indicator */}
        <div className="w-16 h-1 bg-border rounded-full mx-auto mt-4" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-mono text-muted">
          Flutter · Riverpod State Management · Firebase Integration
        </p>
        <span className="text-[10px] font-mono text-muted/80">
          Domain wireframe
        </span>
      </div>
    </div>
  );
}
