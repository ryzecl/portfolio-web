// app/admin/projects/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import { uploadImageToStorage, deleteImagesFromStorage } from '@/lib/storage';
import { ProjectActionState } from '@/types/projects';

function isValidHttpUrl(val: string): boolean {
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

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
  try {
    const supabase = await createClient();

  const title = (formData.get('title') as string)?.trim() || '';
  const slug = (formData.get('slug') as string)?.trim().toLowerCase() || '';
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);

  // Validasi field-field spesifik
  const errors: Record<string, string> = {};
  if (!title) {
    errors.title = 'Judul proyek wajib diisi.';
  } else if (title.length < 3) {
    errors.title = 'Judul proyek minimal 3 karakter.';
  }

  if (!slug) {
    errors.slug = 'Slug URL wajib diisi.';
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip (-).';
  }

  if (!category_id || category_id === 'none') {
    errors.category_id = 'Kategori proyek wajib dipilih.';
  }

  if (!role) {
    errors.role = 'Peran Anda (Role) wajib diisi.';
  }

  if (!year) {
    errors.year = 'Tahun proyek wajib diisi.';
  } else if (!/^\d{4}$/.test(year)) {
    errors.year = 'Format tahun harus 4 digit angka (contoh: 2026).';
  }

  if (!summary) {
    errors.summary = 'Ringkasan singkat (summary) proyek wajib diisi.';
  } else if (summary.length < 10) {
    errors.summary = 'Ringkasan singkat minimal 10 karakter.';
  }

  if (demo_url && !isValidHttpUrl(demo_url)) {
    errors.demo_url = 'Format Live Demo URL tidak valid (harus diawali http:// atau https://).';
  }

  if (repo_url && !isValidHttpUrl(repo_url)) {
    errors.repo_url = 'Format Repository URL tidak valid (harus diawali http:// atau https://).';
  }

  if (isNaN(priority) || priority < 0) {
    errors.priority = 'Prioritas harus berupa angka 0 atau lebih.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Terdapat beberapa isian yang belum valid. Mohon periksa kembali kolom bertanda merah.',
      errors,
    };
  }

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

  // Ambil daftar ID teknologi dari input tersembunyi
  const techIdsRaw = (formData.get('technology_ids') as string) || '';
  const technologyIds = techIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Penanganan Cover Image: Mendukung URL/Path langsung dan file upload
  let cover_image: string | null = (formData.get('cover_image_url') as string)?.trim() || null;
  let uploadedCoverUrl: string | null = null;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0 && typeof coverFile.name === 'string') {
    try {
      uploadedCoverUrl = await uploadImageToStorage(coverFile, 'projects');
      cover_image = uploadedCoverUrl;
    } catch (uploadErr: any) {
      return {
        error: `Gagal upload cover ke Supabase Storage: ${uploadErr.message}. Anda dapat menggunakan opsi 'URL / Path Gambar' di bawah bila RLS Storage belum dikonfigurasi.`,
        errors: { cover_file: uploadErr.message },
      };
    }
  }

  // Penanganan Upload Preview / Detail Images (Multi images)
  const existingPreviewsRaw = (formData.get('existing_preview_images') as string) || '';
  let existingPreviews: string[] = [];
  if (existingPreviewsRaw) {
    try {
      existingPreviews = JSON.parse(existingPreviewsRaw);
    } catch {
      existingPreviews = existingPreviewsRaw.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }

  const uploadedPreviews: string[] = [];
  const previewFiles = formData.getAll('preview_files') as File[];
  for (const file of previewFiles) {
    if (file && file.size > 0 && typeof file.name === 'string') {
      try {
        const url = await uploadImageToStorage(file, 'projects');
        uploadedPreviews.push(url);
      } catch (uploadErr: any) {
        await deleteImagesFromStorage([uploadedCoverUrl, ...uploadedPreviews]);
        return {
          error: `Gagal upload gambar detail: ${uploadErr.message}`,
          errors: { preview_files: uploadErr.message },
        };
      }
    }
  }
  const preview_images = [...existingPreviews, ...uploadedPreviews];

  // 1. Simpan baris proyek ke tabel projects
  const { data: newProject, error: insertError } = await supabase
    .from('projects')
    .insert({
      title,
      slug,
      category_id: category_id && category_id !== 'none' ? category_id : null,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      cover_image,
      preview_images,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
    })
    .select('id, slug')
    .single();

    if (insertError || !newProject) {
      console.error('[Supabase Insert Error]:', insertError);
      // Rollback gambar yang baru ter-upload ke storage jika insert database gagal
      await deleteImagesFromStorage([uploadedCoverUrl, ...uploadedPreviews]);
      return {
        error: `Gagal menyimpan proyek ke database: ${insertError?.message || 'Data proyek gagal disimpan.'}`,
      };
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
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('[createProjectAction Fatal Error]:', err);
    return {
      error: `Terjadi kendala pada server: ${err.message || 'Silakan periksa kembali data Anda.'}`,
    };
  }
}

/**
 * Server Action: Update Proyek
 */
export async function updateProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  try {
    const supabase = await createClient();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim() || '';
  const slug = (formData.get('slug') as string)?.trim().toLowerCase() || '';
  const category_id = (formData.get('category_id') as string) || null;
  const summary = (formData.get('summary') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || null;
  const problem = (formData.get('problem') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const contribution = (formData.get('contribution') as string)?.trim() || null;
  const role = (formData.get('role') as string)?.trim() || null;
  const year = (formData.get('year') as string)?.trim() || null;
  const status = (formData.get('status') as string) || 'Completed';
  const demo_url = (formData.get('demo_url') as string)?.trim() || null;
  const repo_url = (formData.get('repo_url') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '0', 10);
  const existingCover = (formData.get('existing_cover_image') as string) || null;
  const removeCover = formData.get('remove_cover') === 'true';

  // Validasi field-field spesifik
  const errors: Record<string, string> = {};
  if (!id) errors.id = 'ID proyek tidak ditemukan.';
  if (!title) {
    errors.title = 'Judul proyek wajib diisi.';
  } else if (title.length < 3) {
    errors.title = 'Judul proyek minimal 3 karakter.';
  }

  if (!slug) {
    errors.slug = 'Slug URL wajib diisi.';
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan strip (-).';
  }

  if (!category_id || category_id === 'none') {
    errors.category_id = 'Kategori proyek wajib dipilih.';
  }

  if (!role) {
    errors.role = 'Peran Anda (Role) wajib diisi.';
  }

  if (!year) {
    errors.year = 'Tahun proyek wajib diisi.';
  } else if (!/^\d{4}$/.test(year)) {
    errors.year = 'Format tahun harus 4 digit angka (contoh: 2026).';
  }

  if (!summary) {
    errors.summary = 'Ringkasan singkat (summary) proyek wajib diisi.';
  } else if (summary.length < 10) {
    errors.summary = 'Ringkasan singkat minimal 10 karakter.';
  }

  if (demo_url && !isValidHttpUrl(demo_url)) {
    errors.demo_url = 'Format Live Demo URL tidak valid (harus diawali http:// atau https://).';
  }

  if (repo_url && !isValidHttpUrl(repo_url)) {
    errors.repo_url = 'Format Repository URL tidak valid (harus diawali http:// atau https://).';
  }

  if (isNaN(priority) || priority < 0) {
    errors.priority = 'Prioritas harus berupa angka 0 atau lebih.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Terdapat beberapa isian yang belum valid. Mohon periksa kembali kolom bertanda merah.',
      errors,
    };
  }

  // Ambil data gambar lama dari database untuk mendeteksi file yang dihapus/diganti
  const { data: oldProject } = await supabase
    .from('projects')
    .select('cover_image, preview_images')
    .eq('id', id)
    .single();

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

  // Penanganan Cover Image
  const inputCoverUrl = (formData.get('cover_image_url') as string)?.trim();
  let cover_image: string | null = removeCover ? (inputCoverUrl || null) : (inputCoverUrl || existingCover);
  let uploadedCoverUrl: string | null = null;
  const coverFile = formData.get('cover_file') as File | null;
  if (coverFile && coverFile.size > 0 && typeof coverFile.name === 'string') {
    try {
      uploadedCoverUrl = await uploadImageToStorage(coverFile, 'projects');
      cover_image = uploadedCoverUrl;
    } catch (uploadErr: any) {
      return {
        error: `Gagal upload cover ke Supabase Storage: ${uploadErr.message}`,
        errors: { cover_file: uploadErr.message },
      };
    }
  }

  // Penanganan Preview / Detail Images (Multi images)
  const existingPreviewsRaw = (formData.get('existing_preview_images') as string) || '';
  let existingPreviews: string[] = [];
  if (existingPreviewsRaw) {
    try {
      existingPreviews = JSON.parse(existingPreviewsRaw);
    } catch {
      existingPreviews = existingPreviewsRaw.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }

  const newUploadedPreviews: string[] = [];
  const previewFiles = formData.getAll('preview_files') as File[];
  for (const file of previewFiles) {
    if (file && file.size > 0 && typeof file.name === 'string') {
      try {
        const url = await uploadImageToStorage(file, 'projects');
        newUploadedPreviews.push(url);
      } catch (uploadErr: any) {
        await deleteImagesFromStorage([uploadedCoverUrl, ...newUploadedPreviews]);
        return {
          error: `Gagal upload gambar detail: ${uploadErr.message}`,
          errors: { preview_files: uploadErr.message },
        };
      }
    }
  }
  const preview_images = [...existingPreviews, ...newUploadedPreviews];

  // 1. Update baris proyek
  const { error: updateError } = await supabase
    .from('projects')
    .update({
      title,
      slug,
      category_id: category_id && category_id !== 'none' ? category_id : null,
      summary,
      description,
      problem,
      solution,
      contribution,
      role,
      year,
      status,
      cover_image,
      preview_images,
      demo_url,
      repo_url,
      highlights,
      architecture,
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    await deleteImagesFromStorage([uploadedCoverUrl, ...newUploadedPreviews]);
    return { error: `Gagal memperbarui proyek: ${updateError.message}` };
  }

  // Hapus file cover lama dan preview_images lama yang sudah dihapus/diganti dari Supabase Storage
  const urlsToDelete: (string | null | undefined)[] = [];
  if (oldProject?.cover_image && oldProject.cover_image !== cover_image) {
    urlsToDelete.push(oldProject.cover_image);
  }
  if (Array.isArray(oldProject?.preview_images)) {
    for (const oldPreviewUrl of oldProject.preview_images) {
      if (oldPreviewUrl && !preview_images.includes(oldPreviewUrl)) {
        urlsToDelete.push(oldPreviewUrl);
      }
    }
  }
  if (urlsToDelete.length > 0) {
    await deleteImagesFromStorage(urlsToDelete);
  }

  // 2. Sinkronisasikan tabel pivot Many-to-Many
  try {
    await syncProjectTechnologies(supabase, id, technologyIds);
  } catch (syncErr: any) {
    return { error: syncErr.message };
  }

  // 3. Bersihkan cache
    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/projects');
    revalidatePath(`/projects/${slug}`);
    revalidatePath('/');

    redirect('/admin/projects');
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT' || err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('[updateProjectAction Fatal Error]:', err);
    return {
      error: `Terjadi kendala pada server: ${err.message || 'Silakan periksa kembali data Anda.'}`,
    };
  }
}

/**
 * Server Action: Hapus Proyek
 */
export async function deleteProjectAction(id: string): Promise<ProjectActionState> {
  if (!id) return { error: 'ID proyek tidak valid.' };

  const supabase = await createClient();

  // Ambil URL cover_image dan preview_images sebelum baris proyek dihapus
  const { data: projectToDelete } = await supabase
    .from('projects')
    .select('cover_image, preview_images')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  // Hapus seluruh file gambar proyek terkait dari bucket Supabase Storage
  if (projectToDelete) {
    const urlsToDelete: (string | null | undefined)[] = [
      projectToDelete.cover_image,
      ...(Array.isArray(projectToDelete.preview_images)
        ? projectToDelete.preview_images
        : []),
    ];
    await deleteImagesFromStorage(urlsToDelete);
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true, message: 'Proyek berhasil dihapus.' };
}
