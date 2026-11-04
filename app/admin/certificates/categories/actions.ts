// app/admin/certificates/categories/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertCertificateCategoryAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const description = (formData.get('description') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  if (!name || !slug) {
    return { error: 'Nama kategori dan slug wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from('certificate_categories')
      .update({ name, slug, description, priority })
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('certificate_categories')) {
        return {
          error:
            'Tabel certificate_categories belum dibuat di Supabase. Silakan jalankan script SQL migrasi yang disediakan di panduan.',
        };
      }
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from('certificate_categories')
      .insert({ name, slug, description, priority });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('certificate_categories')) {
        return {
          error:
            'Tabel certificate_categories belum dibuat di Supabase. Silakan jalankan script SQL migrasi yang disediakan di panduan.',
        };
      }
      return { error: error.message };
    }
  }

  revalidatePath('/admin/certificates/categories');
  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
  return { success: true, message: 'Kategori sertifikat berhasil disimpan.' };
}

export async function deleteCertificateCategoryAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('certificate_categories').delete().eq('id', id);

  revalidatePath('/admin/certificates/categories');
  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
}
