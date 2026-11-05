// components/ui/dynamic-point-list.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface DynamicPointItem {
  id: string;
  key: string;
  value: string;
}

interface DynamicPointListProps {
  label: string;
  name: string;
  initialItems?: string[];
  placeholderKey?: string;
  placeholderValue?: string;
  description?: string;
  allowKey?: boolean;
}

function parseInitialItems(items?: string[]): DynamicPointItem[] {
  if (!items || items.length === 0) {
    return [{ id: 'item-0', key: '', value: '' }];
  }

  return items.map((raw, index) => {
    const trimmed = raw.trim();
    // Cek format "Key: Value" atau "Key : Value"
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0 && colonIndex < 35) {
      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      return {
        id: `item-${index}-${Date.now()}`,
        key,
        value,
      };
    }
    return {
      id: `item-${index}-${Date.now()}`,
      key: '',
      value: trimmed,
    };
  });
}

export function DynamicPointList({
  label,
  name,
  initialItems = [],
  placeholderKey = 'Key / Topic (optional)',
  placeholderValue = 'Point description, metric, or specification...',
  description,
  allowKey = true,
}: DynamicPointListProps) {
  const [items, setItems] = useState<DynamicPointItem[]>(() =>
    parseInitialItems(initialItems)
  );

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, key: '', value: '' },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Jangan biarkan list kosong sama sekali, sisakan minimal 1 row kosong
      return updated.length > 0
        ? updated
        : [{ id: `item-${Date.now()}`, key: '', value: '' }];
    });
  };

  const updateItem = (index: number, field: 'key' | 'value', val: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  // Serialisasi nilai ke dalam format string newline untuk hidden input
  const serializedValue = items
    .filter((item) => item.value.trim().length > 0 || item.key.trim().length > 0)
    .map((item) => {
      const k = item.key.trim();
      const v = item.value.trim();
      if (k && v) return `${k}: ${v}`;
      return v || k;
    })
    .join('\n');

  return (
    <div className="space-y-2">
      {/* Label & Description */}
      <div className="flex items-center justify-between">
        <Label className="text-xs font-mono text-muted">
          {label}
        </Label>
        <span className="text-[11px] font-mono text-muted/70">
          {items.filter((i) => i.value.trim() || i.key.trim()).length} points
        </span>
      </div>
      {description && (
        <p className="text-[11px] text-muted/80">{description}</p>
      )}

      {/* Hidden input to be read by Server Action via FormData */}
      <input type="hidden" name={name} value={serializedValue} />

      {/* Rows Container */}
      <div className="space-y-2 rounded-xl border border-border/80 bg-surface-raised/40 p-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="group flex items-center gap-2 rounded-lg bg-surface border border-border/60 p-1.5 transition-colors focus-within:border-accent/40"
          >
            <span className="text-muted/40 font-mono text-[11px] w-5 text-center shrink-0 select-none">
              {idx + 1}.
            </span>

            {allowKey && (
              <Input
                value={item.key}
                onChange={(e) => updateItem(idx, 'key', e.target.value)}
                placeholder={placeholderKey}
                className="w-1/3 sm:w-1/4 h-8 bg-surface-raised border-border text-xs font-mono font-medium focus-visible:ring-accent/30"
              />
            )}

            <Input
              value={item.value}
              onChange={(e) => updateItem(idx, 'value', e.target.value)}
              placeholder={placeholderValue}
              className="flex-1 h-8 bg-surface-raised border-border text-xs focus-visible:ring-accent/30"
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(idx)}
              disabled={items.length === 1 && !item.key && !item.value}
              className="h-8 w-8 p-0 text-muted hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
              title="Remove row"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}

        {/* Add Row Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full h-8 text-xs font-mono text-muted hover:text-foreground border-dashed border-border hover:border-accent/50 bg-transparent mt-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-accent" />
          Add Point
        </Button>
      </div>
    </div>
  );
}

export function FormattedPoint({ text, className = '' }: { text: string; className?: string }) {
  const colonIndex = text.indexOf(':');
  if (colonIndex > 0 && colonIndex < 35) {
    const key = text.slice(0, colonIndex).trim();
    const value = text.slice(colonIndex + 1).trim();
    return (
      <span className={className}>
        <strong className="font-semibold text-foreground">{key}:</strong>{' '}
        <span>{value}</span>
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}

