// app/admin/experience/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertExperienceAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const role = (formData.get('role') as string)?.trim();
  const organization = (formData.get('organization') as string)?.trim();
  const organization_url = (formData.get('organization_url') as string)?.trim() || null;
  const industry = (formData.get('industry') as string)?.trim() || (formData.get('location') as string)?.trim() || null;
  const start_date = (formData.get('start_date') as string)?.trim();
  const end_date_raw = (formData.get('end_date') as string)?.trim() || null;
  const is_current = formData.get('is_current') === 'on' || formData.get('is_current') === 'true';
  // Jika is_current aktif atau end_date dikosongkan, simpan end_date sebagai NULL
  const end_date = is_current || !end_date_raw ? null : end_date_raw;
  const final_is_current = is_current || !end_date;

  const description = (formData.get('description') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '1', 10);

  // Parsing array poin tanggung jawab (highlights)
  const highlightsRaw = (formData.get('highlights') as string) || '';
  const highlights = highlightsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // Parsing array teknologi yang digunakan (technologies)
  const technologiesRaw = (formData.get('technologies') as string) || '';
  const technologies = technologiesRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const errors: Record<string, string> = {};
  if (!role) {
    errors.role = 'Posisi / Jabatan wajib diisi.';
  } else if (role.length < 2) {
    errors.role = 'Posisi / Jabatan minimal 2 karakter.';
  }

  if (!organization) {
    errors.organization = 'Perusahaan / Organisasi wajib diisi.';
  } else if (organization.length < 2) {
    errors.organization = 'Nama perusahaan / organisasi minimal 2 karakter.';
  }

  if (!start_date) {
    errors.start_date = 'Bulan & tahun mulai wajib dipilih.';
  }

  if (end_date && start_date && new Date(end_date) < new Date(start_date)) {
    errors.end_date = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
  }

  if (organization_url) {
    try {
      const parsed = new URL(organization_url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.organization_url = 'Format URL tidak valid (harus diawali http:// atau https://).';
      }
    } catch {
      errors.organization_url = 'Format URL tidak valid (harus diawali http:// atau https://).';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: 'Mohon periksa kolom yang ditandai merah di bawah.',
      errors,
    };
  }

  const supabase = await createClient();

  const payload: Record<string, any> = {
    role,
    organization,
    organization_url,
    industry,
    start_date,
    end_date,
    is_current: final_is_current,
    description,
    highlights,
    technologies,
    priority,
    updated_at: new Date().toISOString(),
  };

  // Upaya simpan dengan fallback kolom jika skema di Supabase belum selesai di-alter
  async function executeSave(dataToSave: Record<string, any>) {
    if (id) {
      return await supabase.from('experiences').update(dataToSave).eq('id', id);
    } else {
      return await supabase.from('experiences').insert(dataToSave);
    }
  }

  let result = await executeSave(payload);

  // Fallback 1: Jika Supabase belum memiliki kolom industry (masih location)
  if (result.error && (result.error.code === 'PGRST204' || result.error.message.includes('industry'))) {
    const fallbackPayload = { ...payload };
    delete fallbackPayload.industry;
    fallbackPayload.location = industry;
    result = await executeSave(fallbackPayload);
  }

  // Fallback 2: Jika Supabase belum memiliki kolom technologies
  if (result.error && (result.error.code === 'PGRST204' || result.error.message.includes('technologies'))) {
    const fallbackPayload = { ...payload };
    delete fallbackPayload.technologies;
    if ('industry' in fallbackPayload) delete fallbackPayload.industry;
    fallbackPayload.location = industry;
    result = await executeSave(fallbackPayload);
  }

  if (result.error) {
    return { error: result.error.message };
  }

  revalidatePath('/admin/experience');
  revalidatePath('/admin/education');
  revalidatePath('/credentials');
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true, message: 'Data pengalaman kerja berhasil disimpan.' };
}

export async function deleteExperienceAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('experiences').delete().eq('id', id);

  revalidatePath('/admin/experience');
  revalidatePath('/admin/education');
  revalidatePath('/credentials');
  revalidatePath('/');
}
