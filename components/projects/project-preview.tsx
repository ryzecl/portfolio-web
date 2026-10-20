'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Layers,
  Smartphone,
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
        'w-full h-full min-h-[260px] bg-white border border-zinc-200 rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-xs',
        className
      )}
    >
      <Layers className="w-10 h-10 text-zinc-900 mb-3 opacity-80" />
      <p className="text-sm font-bold text-zinc-900">{title}</p>
      <p className="text-xs font-mono text-zinc-500 mt-1">
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
        'w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-100/80 border-b border-zinc-200 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono text-[11px] text-zinc-500 hidden sm:inline">
            brava.company · Next.js + Laravel API
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 p-0.5 rounded-lg border border-zinc-300/60">
          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className={cn(
              'px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer',
              activeTab === 'public'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Globe className="w-3 h-3" />
            <span>Public Site</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={cn(
              'px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer',
              activeTab === 'cms'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <Sliders className="w-3 h-3" />
            <span>CMS Panel</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 bg-white">
        {activeTab === 'public' ? (
          <div className="space-y-4">
            {/* Header simulation */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px]">
                  B
                </span>
                <span className="text-xs font-bold tracking-wider text-zinc-900">
                  BRAVA INDUSTRIAL
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="text-zinc-900 font-medium">Products</span>
                <span>Solutions</span>
                <span>About</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px]">
                  EN / ID
                </span>
              </div>
            </div>

            {/* Hero Banner Simulation */}
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 relative overflow-hidden">
              <div className="max-w-md space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-medium">
                  Corporate Profile
                </span>
                <p className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                  Precision Engineering & Quality Manufacturing Solutions
                </p>
                <p className="text-[11px] text-zinc-600 line-clamp-2">
                  Delivering sustainable industrial equipment and technical services across Southeast Asia.
                </p>
              </div>
            </div>

            {/* Grid preview cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['Heavy Machinery', 'Automation', 'Spare Parts'].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors shadow-xs"
                >
                  <div className="w-full h-10 rounded bg-white border border-zinc-200/70 mb-2 flex items-center justify-center text-zinc-400">
                    <Layers className="w-4 h-4 text-zinc-900" />
                  </div>
                  <p className="text-[11px] font-bold text-zinc-900 truncate">
                    {item}
                  </p>
                  <p className="text-[9px] font-mono text-zinc-500">Catalog #{idx + 101}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* CMS Admin View */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-zinc-900 font-bold">
                  Laravel Filament CMS
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium">
                REST API Live
              </span>
            </div>

            {/* Simulated CMS Tables */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Recent Content Updates</span>
                <span className="text-[10px] text-emerald-600 font-medium">Auto-synced</span>
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
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                    <span className="text-[11px] text-zinc-900 font-medium truncate">
                      {row.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                      {row.type}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-mono px-1.5 py-0.5 rounded font-medium',
                        row.status === 'Published' || row.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
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
      <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>Architectural simulation: Next.js + Laravel API + MySQL</span>
        <span className="text-zinc-900 font-medium">Illustrative preview</span>
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
        'w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col text-left transition-all',
        className
      )}
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-100/80 border-b border-zinc-200 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono text-[11px] text-zinc-500 hidden sm:inline">
            smsportcenter.id · Court Booking & Payment Engine
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-medium">
          <CreditCard className="w-3 h-3" />
          Midtrans Ready
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 bg-white">
        {/* Court selection tabs */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-zinc-500 text-[11px] uppercase tracking-wider font-medium">
              1. Select Court
            </span>
            <span className="text-[11px] text-zinc-400">Vinyl & Interlock Available</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedCourt('A')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer shadow-xs',
                selectedCourt === 'A'
                  ? 'bg-zinc-50 border-zinc-900 text-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-zinc-900">
                  Court 01 (Vinyl)
                </span>
                <span className="text-[10px] font-mono text-zinc-900 font-semibold">IDR 150K/hr</span>
              </div>
              <p className="text-[10px] text-zinc-500">International standard flooring</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourt('B')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer shadow-xs',
                selectedCourt === 'B'
                  ? 'bg-zinc-50 border-zinc-900 text-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-zinc-900">
                  Court 02 (Interlock)
                </span>
                <span className="text-[10px] font-mono text-zinc-900 font-semibold">IDR 130K/hr</span>
              </div>
              <p className="text-[10px] text-zinc-500">High grip durable tiles</p>
            </button>
          </div>
        </div>

        {/* Schedule grid */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-zinc-500 text-[11px] uppercase tracking-wider font-medium">
              2. Available Schedule (Today)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
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
                      'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-60 line-through',
                    !isBooked &&
                      !isSelected &&
                      'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400 shadow-xs',
                    isSelected &&
                      'bg-zinc-900 text-white font-bold border-zinc-900 shadow-xs'
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
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900">
                Court {selectedCourt === 'A' ? '01 (Vinyl)' : '02 (Interlock)'}
              </span>
              <span className="text-xs font-mono font-semibold text-zinc-900">
                {selectedSlot} - {parseInt(selectedSlot) + 1}:00
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              Total: {selectedCourt === 'A' ? 'IDR 150.000' : 'IDR 130.000'} · Midtrans Snap API
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>Full-stack workflow: Laravel + MySQL + Midtrans Payment Gateway</span>
        <span className="text-zinc-900 font-medium">Illustrative preview</span>
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
        'w-full bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col items-center justify-center p-4 sm:p-6 transition-all',
        className
      )}
    >
      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm rounded-[2rem] bg-zinc-50 border-2 border-zinc-300 p-4 shadow-md relative">
        {/* Camera notch */}
        <div className="w-24 h-4 bg-zinc-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-zinc-400" />
        </div>

        {/* Mobile App Header */}
        <div className="flex items-center justify-between px-2 pb-3 border-b border-zinc-200">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase font-medium">Today&apos;s Focus</p>
            <p className="text-sm font-bold text-zinc-900">Donelock Workspace</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-mono font-medium">
            Flutter + Firebase
          </span>
        </div>

        {/* Calendar Strip preview */}
        <div className="grid grid-cols-5 gap-1.5 my-3 px-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div
              key={day}
              className={cn(
                'p-1.5 rounded-lg text-center text-[10px] font-mono border shadow-xs',
                i === 2
                  ? 'bg-zinc-900 text-white font-bold border-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-700'
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
                'w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer shadow-xs',
                task.done
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-400 line-through opacity-80'
                  : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    task.done ? 'text-zinc-900' : 'text-zinc-400'
                  )}
                />
                <span className="text-xs truncate font-medium">{task.text}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 shrink-0 font-medium">
                {task.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Home indicator */}
        <div className="w-20 h-1 bg-zinc-300 rounded-full mx-auto mt-4" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs font-mono text-zinc-600">
          Flutter · Riverpod State Management · Firebase Integration
        </p>
        <span className="text-[10px] font-mono text-zinc-400">
          Illustrative Mobile UI Preview
        </span>
      </div>
    </div>
  );
}
