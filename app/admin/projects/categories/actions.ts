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
  const name = (formData.get('name') as string)?.trim() || '';
  const slug = (formData.get('slug') as string)?.trim().toLowerCase() || '';

  const errors: Record<string, string> = {};
  if (!name) {
    errors.name = 'Category name is required.';
  } else if (name.length < 2) {
    errors.name = 'Category name must be at least 2 characters.';
  }

  if (!slug) {
    errors.slug = 'Slug identifier is required.';
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens (-).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Please fix the highlighted fields before submitting.',
      errors,
    };
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
  return { success: true, message: 'Project category saved successfully.' };
}

export async function deleteProjectCategoryAction(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  if (!id) return { error: 'Invalid category ID.' };

  const supabase = await createClient();
  const { error } = await supabase.from('project_categories').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/projects/categories');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true };
}
