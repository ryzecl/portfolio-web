// app/admin/tech-stack/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { ActionState } from '@/types/tech-stack';

// ==============================================================================
// 1. KATEGORI TECH STACK MUTATIONS
// ==============================================================================

export async function upsertCategoryAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const description = (formData.get('description') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  if (!title || !slug) {
    return { error: 'Judul dan slug kategori wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    // Mode Update
    const { error } = await supabase
      .from('tech_categories')
      .update({ title, slug, description, priority })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Mode Insert
    const { error } = await supabase
      .from('tech_categories')
      .insert({ title, slug, description, priority });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/admin/tech-stack/categories');
  revalidatePath('/');
  return { success: true, message: 'Kategori berhasil disimpan.' };
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
  if (!id) return { error: 'ID kategori tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('tech_categories').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/admin/tech-stack/categories');
  revalidatePath('/');
  return { success: true, message: 'Kategori berhasil dihapus.' };
}

// ==============================================================================
// 2. TEKNOLOGI MUTATIONS
// ==============================================================================

export async function upsertTechnologyAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const category_id = formData.get('category_id') as string;
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const icon_key = (formData.get('icon_key') as string)?.trim().toLowerCase();

  if (!name || !slug || !category_id || !icon_key) {
    return { error: 'Semua kolom bertanda bintang wajib diisi.' };
  }

  const supabase = await createClient();

  if (id) {
    // Mode Update
    const { error } = await supabase
      .from('technologies')
      .update({
        category_id,
        name,
        slug,
        icon_key,
      })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Mode Insert
    const { error } = await supabase
      .from('technologies')
      .insert({
        category_id,
        name,
        slug,
        icon_key,
      });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Teknologi berhasil disimpan.' };
}

export async function deleteTechnologyAction(id: string): Promise<ActionState> {
  if (!id) return { error: 'ID teknologi tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('technologies').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/tech-stack');
  revalidatePath('/');
  return { success: true, message: 'Teknologi berhasil dihapus.' };
}
