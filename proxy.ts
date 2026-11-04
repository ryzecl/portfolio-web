// proxy.ts (Next.js 16+ convention replacing middleware.ts)
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy pada semua rute KECUALI:
     * - _next/static (file build JS & CSS)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico, sitemap.xml, robots.txt
     * - File statis dengan ekstensi gambar (svg, png, jpg, webp, dll.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
