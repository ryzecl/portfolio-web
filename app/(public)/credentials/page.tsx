import React from 'react';
import type { Metadata } from 'next';
import {
  getAllCertificates,
  getCertificateCategories,
  getAllSkillGroups,
  getSiteData,
} from '@/lib/data';
import { CertificateItem, SkillGroup } from '@/lib/types';
import { createClient } from '@/lib/server';
import { CredentialsClientView } from '@/components/credentials/credentials-client-view';

export const metadata: Metadata = {
  title: 'Licenses & Credentials · Ferry Noer Hendriawan',
  description:
    'A curated catalog of verified technical certifications, competitive cohorts, and engineering competencies achieved by Ferry Noer Hendriawan.',
};

export default async function CredentialsPage() {
  const site = getSiteData();
  const fallbackCertificates = getAllCertificates();
  const fallbackSkillGroups = getAllSkillGroups();

  let certificates: CertificateItem[] = fallbackCertificates;
  let skillGroups: SkillGroup[] = fallbackSkillGroups;

  try {
    const supabase = await createClient();

    // 1. Fetch All Certificates from Supabase
    const { data: dbCertificates } = await supabase
      .from('certificates')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (dbCertificates && dbCertificates.length > 0) {
      certificates = dbCertificates.map((item) => {
        let displayYear = item.issue_date || '';
        if (displayYear.includes('-') && displayYear.length >= 4) {
          try {
            const d = new Date(displayYear);
            if (!isNaN(d.getTime())) displayYear = d.getFullYear().toString();
          } catch {}
        }

        return {
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          issueDate: displayYear,
          category: item.category || 'General',
          credentialId: item.credential_id || '',
          credentialUrl: item.credential_url || '',
          imageUrl: '/images/certificates/placeholder-cert.png',
          skills: item.skills || [],
          featured: (item.priority ?? 0) > 0,
          summary: item.summary || '',
        };
      });
    }

    // 2. Fetch All Tech Categories & Technologies from Supabase
    const { data: dbTechCategories } = await supabase
      .from('tech_categories')
      .select('id, title, slug, priority, description, technologies(id, name, slug, icon_key)')
      .order('priority', { ascending: true });

    if (dbTechCategories && dbTechCategories.length > 0) {
      const groups: SkillGroup[] = [];

      for (const cat of dbTechCategories) {
        const techList = cat.technologies || [];
        if (techList.length > 0) {
          groups.push({
            title: cat.title,
            priority: cat.priority,
            description: cat.description || undefined,
            technologies: techList.map((t: any) => t.name),
          });
        }
      }

      if (groups.length > 0) {
        skillGroups = groups;
      }
    }
  } catch {
    // Graceful fallback to local JSON data if database is not reachable
  }

  // Derive unique categories from active certificates
  const certCategories = Array.from(
    new Set(certificates.map((c) => c.category))
  ).filter(Boolean);

  return (
    <CredentialsClientView
      site={site}
      allCertificates={certificates}
      allSkillGroups={skillGroups}
      certCategories={certCategories.length > 0 ? certCategories : getCertificateCategories()}
    />
  );
}
