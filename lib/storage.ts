// lib/storage.ts
import { createClient } from '@/lib/server';

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

  const { error: uploadError } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload storage gagal: ${uploadError.message}`);
  }

  // Dapatkan URL publik permanen
  const {
    data: { publicUrl },
  } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName);

  return publicUrl;
}
