// app/admin/certificates/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/server';
import { GenericActionState } from '@/types/credentials';

export async function upsertCertificateAction(
  prevState: GenericActionState | null,
  formData: FormData
): Promise<GenericActionState> {
  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const issuer = (formData.get('issuer') as string)?.trim();
  const issue_date = (formData.get('issue_date') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'Software Engineering';
  const credential_id = (formData.get('credential_id') as string)?.trim() || null;
  const credential_url = (formData.get('credential_url') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';

  // Pisahkan skills berdasarkan koma atau baris baru
  const skillsRaw = (formData.get('skills') as string) || '';
  const skills = skillsRaw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !issuer || !issue_date) {
    return { error: 'Judul sertifikasi, penerbit, dan tanggal terbit wajib diisi.' };
  }

  const supabase = await createClient();

  const payload = {
    title,
    issuer,
    issue_date,
    category,
    credential_id,
    credential_url,
    summary,
    skills,
    featured,
  };

  if (id) {
    const { error } = await supabase.from('certificates').update(payload).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('certificates').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
  return { success: true, message: 'Sertifikat berhasil disimpan.' };
}

export async function deleteCertificateAction(id: string): Promise<void> {
  if (!id) return;

  const supabase = await createClient();
  await supabase.from('certificates').delete().eq('id', id);

  revalidatePath('/admin/certificates');
  revalidatePath('/credentials');
  revalidatePath('/');
}
