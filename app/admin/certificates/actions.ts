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
  const title = (formData.get('title') as string)?.trim() || '';
  const issuer = (formData.get('issuer') as string)?.trim() || '';
  const issue_date = (formData.get('issue_date') as string)?.trim() || '';
  const category = (formData.get('category') as string)?.trim() || '';
  const credential_id = (formData.get('credential_id') as string)?.trim() || '';
  const credential_url = (formData.get('credential_url') as string)?.trim() || '';
  const summary = (formData.get('summary') as string)?.trim() || '';
  const priorityRaw = (formData.get('priority') as string) || '0';
  const priority = parseInt(priorityRaw, 10);

  // Pisahkan skills berdasarkan baris baru atau koma
  const skillsRaw = (formData.get('skills') as string) || '';
  const lines = skillsRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const skills: string[] = [];
  lines.forEach((line) => {
    if (line.includes(',')) {
      skills.push(...line.split(',').map((s) => s.trim()).filter(Boolean));
    } else {
      skills.push(line);
    }
  });

  const errors: Record<string, string> = {};

  if (!title) {
    errors.title = 'Nama sertifikat / lisensi wajib diisi.';
  }
  if (!issuer) {
    errors.issuer = 'Penerbit (issuer) wajib diisi.';
  }
  if (!issue_date) {
    errors.issue_date = 'Tanggal terbit wajib dipilih.';
  }
  if (!category) {
    errors.category = 'Kategori sertifikat wajib dipilih.';
  }
  if (credential_url) {
    try {
      new URL(credential_url);
    } catch {
      errors.credential_url = 'Format link tidak valid (harus diawali http:// atau https://).';
    }
  }

  const values = {
    title,
    issuer,
    issue_date,
    category,
    credential_id,
    credential_url,
    summary,
    priority: isNaN(priority) ? 0 : priority,
    skills,
  };

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values,
      error: 'Mohon periksa kolom yang ditandai merah di bawah.',
    };
  }

  const supabase = await createClient();

  // Payload disesuaikan 100% dengan kolom tabel Supabase certificates:
  // title, issuer, issue_date, category, credential_id, credential_url, summary, skills, priority
  const payload: Record<string, any> = {
    title,
    issuer,
    issue_date,
    category,
    credential_id: credential_id || null,
    credential_url: credential_url || null,
    summary: summary || null,
    skills,
    priority: isNaN(priority) ? 0 : priority,
  };

  if (id) {
    let { error } = await supabase.from('certificates').update(payload).eq('id', id);
    if (error && error.message.includes('priority')) {
      delete payload.priority;
      const retry = await supabase.from('certificates').update(payload).eq('id', id);
      error = retry.error;
    }
    if (error) {
      console.error('Supabase update certificate error:', error);
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message.includes('relation "certificates" does not exist')
      ) {
        return {
          error:
            'Tabel certificates belum dibuat di Supabase. Silakan jalankan script SQL migrasi yang disediakan di panduan.',
          values,
        };
      }
      return { error: error.message, values };
    }
  } else {
    let { error } = await supabase.from('certificates').insert(payload);
    if (error && error.message.includes('priority')) {
      delete payload.priority;
      const retry = await supabase.from('certificates').insert(payload);
      error = retry.error;
    }
    if (error) {
      console.error('Supabase insert certificate error:', error);
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message.includes('relation "certificates" does not exist')
      ) {
        return {
          error:
            'Tabel certificates belum dibuat di Supabase. Silakan jalankan script SQL migrasi yang disediakan di panduan.',
          values,
        };
      }
      return { error: error.message, values };
    }
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
