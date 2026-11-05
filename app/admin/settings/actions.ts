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
    errors.email = 'Contact email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email address format.';
  }

  if (!github) {
    errors.github = 'GitHub URL is required.';
  } else if (!isValidHttpUrl(github)) {
    errors.github = 'Invalid GitHub URL format (must start with http:// or https://).';
  }

  if (!linkedin) {
    errors.linkedin = 'LinkedIn URL is required.';
  } else if (!isValidHttpUrl(linkedin)) {
    errors.linkedin = 'Invalid LinkedIn URL format (must start with http:// or https://).';
  }

  if (whatsapp && !isValidHttpUrl(whatsapp) && !/^\+?[0-9\s-]{8,20}$/.test(whatsapp)) {
    errors.whatsapp = 'Enter a valid https://wa.me/... link or phone number.';
  }

  if (instagram && !isValidHttpUrl(instagram)) {
    errors.instagram = 'Invalid Instagram URL format (must start with http:// or https://).';
  }

  if (spotify && !isValidHttpUrl(spotify)) {
    errors.spotify = 'Invalid Spotify URL format (must start with http:// or https://).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Please review and fix the highlighted fields.',
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
  revalidatePath('/', 'layout');
  return { success: true, message: 'Site settings and social links updated successfully.' };
}
