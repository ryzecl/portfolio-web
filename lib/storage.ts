// lib/storage.ts
import { createClient } from '@/lib/server';

const BUCKET_NAME = 'portfolio-assets';
const PUBLIC_URL_MARKER = `/storage/v1/object/public/${BUCKET_NAME}/`;

/**
 * Mengekstrak path internal bucket dari URL publik Supabase Storage.
 * Mengembalikan null jika URL adalah path lokal (/images/...) atau domain eksternal lain.
 */
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const markerIndex = url.indexOf(PUBLIC_URL_MARKER);
  if (markerIndex === -1) return null;

  const rawPath = url.slice(markerIndex + PUBLIC_URL_MARKER.length).split('?')[0];
  return rawPath ? decodeURIComponent(rawPath) : null;
}

/**
 * Menghapus satu atau beberapa file gambar dari bucket Supabase Storage
 * berdasarkan URL publiknya. Aman dipanggil untuk URL lokal (akan diabaikan).
 */
export async function deleteImagesFromStorage(
  urls: (string | null | undefined)[]
): Promise<void> {
  const paths = Array.from(
    new Set(
      urls
        .map((url) => extractStoragePath(url))
        .filter((p): p is string => Boolean(p))
    )
  );

  if (paths.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) {
    console.error('[Supabase Storage Delete Error]:', error);
  }
}

/**
 * Mengunggah berkas gambar ke bucket Supabase Storage dan mengembalikan URL publiknya
 */
export async function uploadImageToStorage(
  file: File,
  folder: string = 'projects'
): Promise<string> {
  const supabase = await createClient();

  // Bersihkan nama file dari spasi dan karakter aneh
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const fileName = `${folder}/${cleanBaseName}-${Date.now()}.${fileExt}`;

  // Konversi Web File ke Buffer biner agar 100% kompatibel di runtime Next.js Server Actions / Node.js
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error('[Supabase Storage Upload Error]:', uploadError);
    throw new Error(`Upload storage gagal: ${uploadError.message}`);
  }

  // Dapatkan URL publik permanen
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

  return publicUrl;
}
