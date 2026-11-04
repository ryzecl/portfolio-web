// app/admin/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';

export interface ActionResponse {
  error?: string;
  errors?: Record<string, string>;
  success?: boolean;
}

/**
 * Server Action untuk autentikasi login admin
 */
export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = ((formData.get('email') as string) || '').trim();
  const password = (formData.get('password') as string) || '';
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  const errors: Record<string, string> = {};
  if (!email) {
    errors.email = 'Alamat email wajib diisi.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Format alamat email tidak valid.';
  }

  if (!password) {
    errors.password = 'Password wajib diisi.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Mohon periksa kembali email dan password Anda.',
      errors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Email atau password yang Anda masukkan salah.'
          : error.message,
    };
  }

  // Bersihkan cache layout admin agar data user baru langsung dimuat
  revalidatePath('/admin', 'layout');

  // PENTING: Panggil redirect di luar blok penanganan error (lihat Gotcha 1)
  redirect(redirectTo);
}

/**
 * Server Action untuk proses logout admin
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/admin/login');
}
