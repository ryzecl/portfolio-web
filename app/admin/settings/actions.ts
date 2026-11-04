// app/admin/settings/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function updateSocialSettingsAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const email = (formData.get('email') as string)?.trim();
  const github = (formData.get('github') as string)?.trim();
  const linkedin = (formData.get('linkedin') as string)?.trim();
  const whatsapp = (formData.get('whatsapp') as string)?.trim() || '';
  const instagram = (formData.get('instagram') as string)?.trim() || '';
  const spotify = (formData.get('spotify') as string)?.trim() || '';

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
