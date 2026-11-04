// app/admin/projects/categories/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { ProjectActionState } from '@/types/projects';

export async function upsertProjectCategoryAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();

  if (!name || !slug) {
    return { error: 'Nama kategori dan slug wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase
      .from('project_categories')
      .update({ name, slug })
      .eq('id', id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from('project_categories')
      .insert({ name, slug });

    if (error) return { error: error.message };
  }

  revalidatePath('/admin/projects/categories');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true, message: 'Kategori proyek berhasil disimpan.' };
}

export async function deleteProjectCategoryAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('project_categories').delete().eq('id', id);

  revalidatePath('/admin/projects/categories');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
}
