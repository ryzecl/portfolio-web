import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface SectionHeadingProps {
  eyebrow?: string;
  number?: string;
  breadcrumb?: BreadcrumbStep[];
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  number,
  breadcrumb,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-3 mb-10 md:mb-14',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl',
        className
      )}
    >
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb
          className={cn(
            'font-mono text-xs tracking-wider uppercase',
            align === 'center' && 'flex justify-center'
          )}
        >
          <BreadcrumbList className="gap-1.5 text-xs text-muted font-medium">
            {breadcrumb.map((step, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              return (
                <React.Fragment key={step.label}>
                  <BreadcrumbItem>
                    {step.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={step.href}
                          className="text-muted hover:text-accent transition-colors"
                        >
                          {step.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-accent font-bold">
                        {step.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-border">
                      /
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div
          className={cn(
            'inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-muted font-medium',
            align === 'center' && 'justify-center'
          )}
        >
          {number && (
            <span className="text-accent font-bold">{number}</span>
          )}
          {number && eyebrow && <span className="text-border">/</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground text-balance">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-muted font-normal leading-relaxed text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
