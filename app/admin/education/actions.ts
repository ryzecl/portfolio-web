// app/admin/education/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertEducationAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const major = (formData.get('major') as string)?.trim() || (formData.get('role') as string)?.trim();
  const program = (formData.get('program') as string)?.trim() || null;
  const institution = (formData.get('institution') as string)?.trim() || (formData.get('organization') as string)?.trim();
  const gpa = (formData.get('gpa') as string)?.trim() || null;
  const start_date = (formData.get('start_date') as string)?.trim();
  const end_date_raw = (formData.get('end_date') as string)?.trim() || null;
  const is_current = formData.get('is_current') === 'on' || formData.get('is_current') === 'true';
  const end_date = is_current || !end_date_raw ? null : end_date_raw;
  const final_is_current = is_current || !end_date;

  const description = (formData.get('description') as string)?.trim() || null;
  const priority = parseInt((formData.get('priority') as string) || '1', 10);

  // Parsing array prestasi / distingsi (achievements)
  const achievementsRaw = (formData.get('achievements') as string) || (formData.get('highlights') as string) || '';
  const achievements = achievementsRaw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!major || !institution || !start_date) {
    return { error: 'Jurusan / Gelar, Institusi / Universitas, dan tanggal mulai wajib diisi.' };
  }

  const supabase = await createClient();

  const payload: Record<string, any> = {
    major,
    program,
    institution,
    gpa,
    start_date,
    end_date,
    is_current: final_is_current,
    description,
    achievements,
    priority,
    updated_at: new Date().toISOString(),
  };

  // Upaya 1: Simpan ke tabel mandiri 'educations' dengan skema mutakhir
  let result = id
    ? await supabase.from('educations').update(payload).eq('id', id)
    : await supabase.from('educations').insert(payload);

  // Fallback 1: Jika tabel educations di Supabase belum memiliki kolom 'program'
  if (result.error && (result.error.code === 'PGRST204' && result.error.message.includes('program'))) {
    const payloadNoProgram = { ...payload };
    delete payloadNoProgram.program;
    result = id
      ? await supabase.from('educations').update(payloadNoProgram).eq('id', id)
      : await supabase.from('educations').insert(payloadNoProgram);
  }

  // Fallback 1: Jika tabel educations di Supabase masih menggunakan nama kolom lama (role, organization, highlights)
  if (result.error && (result.error.code === 'PGRST204' || result.error.message.includes('major') || result.error.message.includes('institution'))) {
    const legacyPayload: Record<string, any> = {
      role: major,
      organization: institution,
      start_date,
      end_date,
      is_current: final_is_current,
      description,
      highlights: achievements,
      priority,
      updated_at: new Date().toISOString(),
    };
    result = id
      ? await supabase.from('educations').update(legacyPayload).eq('id', id)
      : await supabase.from('educations').insert(legacyPayload);
  }

  // Fallback 2: Jika tabel 'educations' belum dibuat di Supabase, fallback ke tabel 'experiences' dengan type='education'
  if (result.error && (result.error.code === 'PGRST205' || result.error.message.includes('educations'))) {
    const fallbackPayload = {
      role: major,
      organization: institution,
      start_date,
      end_date,
      is_current: final_is_current,
      description,
      highlights: achievements,
      priority,
      type: 'education',
    };
    result = id
      ? await supabase.from('experiences').update(fallbackPayload).eq('id', id)
      : await supabase.from('experiences').insert(fallbackPayload);
  }

  if (result.error) {
    return { error: result.error.message };
  }

  revalidatePath('/admin/education');
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true, message: 'Data riwayat pendidikan berhasil disimpan.' };
}

export async function deleteEducationAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();

  // Coba hapus dari educations
  const { error } = await supabase.from('educations').delete().eq('id', id);

  // Jika tabel educations belum ada, hapus dari experiences
  if (error && (error.code === 'PGRST205' || error.message.includes('educations'))) {
    await supabase.from('experiences').delete().eq('id', id);
  }

  revalidatePath('/admin/education');
  revalidatePath('/about');
  revalidatePath('/');
}
