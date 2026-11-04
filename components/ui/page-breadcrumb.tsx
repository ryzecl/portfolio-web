import React from 'react';
import Link from 'next/link';
import { House } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface BreadcrumbStep {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface PageBreadcrumbProps {
  items: BreadcrumbStep[];
  rightElement?: React.ReactNode;
  className?: string;
}

export function PageBreadcrumb({
  items,
  rightElement,
  className,
}: PageBreadcrumbProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 mb-8 sm:mb-12 border-b border-border/70',
        className
      )}
    >
      <Breadcrumb className="font-mono text-xs">
        <BreadcrumbList className="gap-1.5 sm:gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            const Icon = item.icon || (isFirst ? House : null);

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-foreground">
                      {Icon && <Icon className="w-3.5 h-3.5 text-accent shrink-0" />}
                      <span className="truncate max-w-[200px] sm:max-w-xs">{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 text-muted/70 shrink-0" />}
                        <span>{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="text-muted/40" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {rightElement && (
        <div className="shrink-0 flex items-center">{rightElement}</div>
      )}
    </div>
  );
}
