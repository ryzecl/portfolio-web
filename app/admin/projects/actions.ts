// app/admin/projects/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import { uploadImageToStorage } from '@/lib/storage';
import { ProjectActionState } from '@/types/projects';

/**
 * Helper untuk menyinkronkan tabel pivot project_technologies (Many-to-Many Sync)
 */
async function syncProjectTechnologies(
  supabase: any,
  projectId: string,
  technologyIds: string[]
) {
  // 1. Hapus seluruh relasi pivot lama proyek ini
  await supabase
    .from('project_technologies')
    .delete()
    .eq('project_id', projectId);

  // 2. Masukkan relasi pivot baru jika ada teknologi yang dipilih
  if (technologyIds.length > 0) {
    const pivotRows = technologyIds.map((techId) => ({
      project_id: projectId,
      technology_id: techId,
    }));

    const { error: insertPivotError } = await supabase
      .from('project_technologies')
      .insert(pivotRows);

    if (insertPivotError) {
      throw new Error(`Gagal menyinkronkan teknologi: ${insertPivotError.message}`);
    }
  }
}

/**
 * Server Action: Tambah Proyek Baru
 */
export async function createProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  // Parsing array dari teks (dipisah baris baru)
  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const architectureRaw = (formData.get('architecture') as string) || '';
  const architecture = architectureRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // Ambil daftar ID teknologi dari input tersembunyi / multi-select
  const techIdsRaw = (formData.get('technology_ids') as string) || '';
  const technologyIds = techIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !slug || !summary) {
    return { error: 'Judul, slug, dan ringkasan proyek wajib diisi.' };
  }

  // Penanganan Upload Cover Image
  let cover_image: string | null = null;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      cover_image = await uploadImageToStorage(coverFile, 'projects');
    } catch (uploadErr: any) {
      return { error: uploadErr.message };
    }
  }

  // 1. Simpan baris proyek ke tabel projects
  const { data: newProject, error: insertError } = await supabase
    .from('projects')
    .insert({
      title,
      slug,
      category_id,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      featured,
      cover_image,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
    })
    .select('id, slug')
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  // 2. Sinkronisasikan tabel pivot Many-to-Many
  try {
    await syncProjectTechnologies(supabase, newProject.id, technologyIds);
  } catch (syncErr: any) {
    return { error: syncErr.message };
  }

  // 3. Bersihkan cache rute admin dan rute publik
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath(`/projects/${newProject.slug}`);
  revalidatePath('/');

  redirect('/admin/projects');
}

/**
 * Server Action: Update Proyek
 */
export async function updateProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const supabase = await createClient();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);
  const existingCover = (formData.get('existing_cover_image') as string) || null;

  if (!id || !title || !slug || !summary) {
    return { error: 'ID, judul, slug, dan ringkasan wajib diisi.' };
  }

  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const architectureRaw = (formData.get('architecture') as string) || '';
  const architecture = architectureRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const techIdsRaw = (formData.get('technology_ids') as string) || '';
  const technologyIds = techIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Jika user mengunggah file baru, gantikan cover_image
  let cover_image = existingCover;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      cover_image = await uploadImageToStorage(coverFile, 'projects');
    } catch (uploadErr: any) {
      return { error: uploadErr.message };
    }
  }

  // 1. Update baris proyek
  const { error: updateError } = await supabase
    .from('projects')
    .update({
      title,
      slug,
      category_id,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      featured,
      cover_image,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    return { error: updateError.message };
  }

  // 2. Sinkronisasikan tabel pivot Many-to-Many
  try {
    await syncProjectTechnologies(supabase, id, technologyIds);
  } catch (syncErr: any) {
    return { error: syncErr.message };
  }

  // 3. Bersihkan cache
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/');

  redirect('/admin/projects');
}

/**
 * Server Action: Hapus Proyek
 */
export async function deleteProjectAction(id: string): Promise<ProjectActionState> {
  if (!id) return { error: 'ID proyek tidak valid.' };

  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true, message: 'Proyek berhasil dihapus.' };
}
