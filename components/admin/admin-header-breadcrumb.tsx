// components/admin/admin-header-breadcrumb.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const segmentLabels: Record<string, string> = {
  admin: 'Admin',
  projects: 'Projects',
  categories: 'Categories',
  new: 'New',
  edit: 'Edit',
  experience: 'Experience',
  education: 'Education',
  certificates: 'Certificates',
  'tech-stack': 'Tech Stack',
  settings: 'Site Settings',
};

export function AdminHeaderBreadcrumb() {
  const pathname = usePathname();

  // Bersihkan dan pisahkan segmen path
  const segments = pathname.split('/').filter(Boolean);

  // Jika tepat di /admin
  if (segments.length <= 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono text-xs font-medium text-foreground">
              Overview
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Bangun breadcrumb items secara dinamis
  // Segmen pertama adalah 'admin'
  const items = segments.map((seg, idx) => {
    const url = '/' + segments.slice(0, idx + 1).join('/');
    const isLast = idx === segments.length - 1;

    // Cek apakah segmen adalah UUID atau ID dinamis (panjang > 20 karakter atau ada tanda - khas UUID)
    const isDynamicId =
      seg.length > 20 || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(seg);

    let label = segmentLabels[seg] || seg;
    if (isDynamicId) {
      label = 'Detail';
    }

    return {
      label,
      url,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="font-mono text-xs font-semibold text-accent">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.url}
                    className="font-mono text-xs text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
