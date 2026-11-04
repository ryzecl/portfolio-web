// app/admin/settings/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

function isValidHttpUrl(val: string): boolean {
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function updateSocialSettingsAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const email = (formData.get('email') as string)?.trim() || '';
  const github = (formData.get('github') as string)?.trim() || '';
  const linkedin = (formData.get('linkedin') as string)?.trim() || '';
  const whatsapp = (formData.get('whatsapp') as string)?.trim() || '';
  const instagram = (formData.get('instagram') as string)?.trim() || '';
  const spotify = (formData.get('spotify') as string)?.trim() || '';

  const errors: Record<string, string> = {};
  if (!email) {
    errors.email = 'Email kontak wajib diisi.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Format alamat email tidak valid.';
  }

  if (!github) {
    errors.github = 'GitHub URL wajib diisi.';
  } else if (!isValidHttpUrl(github)) {
    errors.github = 'Format GitHub URL tidak valid (harus diawali http:// atau https://).';
  }

  if (!linkedin) {
    errors.linkedin = 'LinkedIn URL wajib diisi.';
  } else if (!isValidHttpUrl(linkedin)) {
    errors.linkedin = 'Format LinkedIn URL tidak valid (harus diawali http:// atau https://).';
  }

  if (whatsapp && !isValidHttpUrl(whatsapp) && !/^\+?[0-9\s-]{8,20}$/.test(whatsapp)) {
    errors.whatsapp = 'Masukkan link https://wa.me/... atau nomor telepon yang valid.';
  }

  if (instagram && !isValidHttpUrl(instagram)) {
    errors.instagram = 'Format Instagram URL tidak valid (harus diawali http:// atau https://).';
  }

  if (spotify && !isValidHttpUrl(spotify)) {
    errors.spotify = 'Format Spotify URL tidak valid (harus diawali http:// atau https://).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Mohon periksa kembali kolom yang ditandai merah.',
      errors,
    };
  }

  const supabase = await createClient();

  const socialData = {
    email,
    github,
    linkedin,
    whatsapp,
    instagram,
    spotify,
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'social_links',
      value: socialData,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout'); // Bersihkan seluruh layout publik (Navbar & Footer yang memakai link sosmed)
  return { success: true, message: 'Tautan sosial media berhasil diperbarui.' };
}
