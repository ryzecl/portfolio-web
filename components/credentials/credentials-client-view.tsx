'use client';

import React, { useState, useMemo } from 'react';
import { CertificateItem, SkillGroup, SiteData } from '@/lib/types';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { DotBackground } from '@/components/ui/dot-background';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CertificateCard } from '@/components/credentials/certificate-card';
import { TechStackCatalog } from '@/components/credentials/tech-stack-catalog';
import { CredentialDialog } from '@/components/credentials/credential-dialog';
import { ContactCta } from '@/components/sections/contact-cta';
import {
  Award,
  Layers,
  Search,
  Filter,
  Cpu,
} from 'lucide-react';

interface CredentialsClientViewProps {
  site: SiteData;
  allCertificates: CertificateItem[];
  allSkillGroups: SkillGroup[];
  certCategories: string[];
}

export function CredentialsClientView({
  site,
  allCertificates,
  allSkillGroups,
  certCategories,
}: CredentialsClientViewProps) {
  const totalTechCount = useMemo(() => {
    return allSkillGroups.reduce((acc, g) => acc + g.technologies.length, 0);
  }, [allSkillGroups]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleOpenCertificate = (cert: CertificateItem) => {
    setSelectedCert(cert);
  };

  const handleCloseDialog = () => {
    setSelectedCert(null);
  };

  // Filtered Tech Stack Groups based on Search Query
  const filteredSkillGroups = useMemo(() => {
    if (!searchQuery.trim()) return allSkillGroups;
    const q = searchQuery.toLowerCase().trim();
    return allSkillGroups
      .map((group) => {
        const matchesTitle = group.title.toLowerCase().includes(q);
        const matchesDesc = group.description?.toLowerCase().includes(q);
        const filteredTechs = group.technologies.filter((tech) =>
          tech.toLowerCase().includes(q)
        );
        if (matchesTitle || matchesDesc) return group;
        if (filteredTechs.length > 0) {
          return { ...group, technologies: filteredTechs };
        }
        return null;
      })
      .filter(Boolean) as SkillGroup[];
  }, [allSkillGroups, searchQuery]);

  // Filtered Certificates based on Category and Search Query
  const filteredCertificates = useMemo(() => {
    return allCertificates.filter((cert) => {
      const matchesCategory =
        selectedCategory === 'All' || cert.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [allCertificates, selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen pt-32 sm:pt-40 pb-12 sm:pb-16 bg-background text-foreground overflow-hidden">
      <DotBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Page Header */}
        <div className="mb-12 space-y-4">
          <SectionHeading
            breadcrumb={[
              { label: 'Home', href: '/' },
              { label: 'Credentials' },
            ]}
            title="Verified Licenses & Technical Tooling"
            description="A curated catalog of verified technical certifications, competitive cohorts, and engineering competencies achieved by Ferry Noer Hendriawan."
            className="mb-4"
          />

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono">
            <Badge variant="outline" className="border-border bg-surface text-foreground font-mono">
              {allCertificates.length} Certifications
            </Badge>
            <Badge variant="outline" className="border-border bg-surface text-foreground font-mono">
              {totalTechCount} Technologies
            </Badge>
            <span>• Single Source of Truth</span>
          </div>
        </div>

        {/* Main Tabs Layout */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          {/* Controls Bar: Tabs on Left, Search on Right */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <TabsList className="bg-surface border border-border p-1 rounded-xl h-auto shrink-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-surface-raised data-[state=active]:text-foreground text-xs font-mono py-1.5 px-3 rounded-lg transition-all"
                >
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-accent" />
                  All Assets
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="data-[state=active]:bg-surface-raised data-[state=active]:text-foreground text-xs font-mono py-1.5 px-3 rounded-lg transition-all"
                >
                  <Award className="w-3.5 h-3.5 mr-1.5 text-accent" />
                  Certificates
                  <span className="font-mono text-[10px] opacity-70 ml-0.5">
                    ({allCertificates.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="technologies"
                  className="data-[state=active]:bg-surface-raised data-[state=active]:text-foreground text-xs font-mono py-1.5 px-3 rounded-lg transition-all"
                >
                  <Cpu className="w-3.5 h-3.5 mr-1.5 text-accent" />
                  Technologies
                  <span className="font-mono text-[10px] opacity-70 ml-0.5">
                    ({totalTechCount})
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skill, issuer, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-hidden focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Category Pills (Active on 'all' or 'certificates' tab) */}
          {(activeTab === 'all' || activeTab === 'certificates') && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-muted font-mono flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" />
                Cert Category:
              </span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`text-xs px-3 py-1 rounded-full font-mono transition-all shrink-0 border ${
                  selectedCategory === 'All'
                    ? 'bg-surface-raised text-accent border-accent/40 font-semibold shadow-2xs'
                    : 'bg-surface text-muted border-border hover:text-foreground'
                }`}
              >
                All ({allCertificates.length})
              </button>
              {certCategories.map((cat) => {
                const count = allCertificates.filter((c) => c.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-full font-mono transition-all shrink-0 border ${
                      selectedCategory === cat
                        ? 'bg-surface-raised text-accent border-accent/40 font-semibold shadow-2xs'
                        : 'bg-surface text-muted border-border hover:text-foreground'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 1: All Items */}
          <TabsContent value="all" className="space-y-12">
            {/* Certificates Sub-block */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  Certificates & Accreditations
                </h3>
                <span className="text-xs text-muted font-mono">
                  Showing {filteredCertificates.length} items
                </span>
              </div>

              {filteredCertificates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-surface border border-border text-muted text-sm">
                  No certificates match your search query.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredCertificates.map((cert) => (
                    <CertificateCard
                      key={cert.id}
                      certificate={cert}
                      onSelect={handleOpenCertificate}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack Sub-block */}
            <div className="space-y-4 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent" />
                  Technical Competencies & Tooling
                </h3>
                <span className="text-xs text-muted font-mono">
                  {totalTechCount} Tools across {allSkillGroups.length} Disciplines
                </span>
              </div>

              <TechStackCatalog
                groups={filteredSkillGroups}
                searchQuery={searchQuery}
              />
            </div>
          </TabsContent>

          {/* Tab 2: Certificates Only */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-mono">
                Showing {filteredCertificates.length} of {allCertificates.length} Certificates
              </span>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="p-16 text-center rounded-2xl bg-surface border border-border text-muted text-sm">
                No certificates found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCertificates.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    certificate={cert}
                    onSelect={handleOpenCertificate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Technologies Only */}
          <TabsContent value="technologies" className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-mono">
                {filteredSkillGroups.reduce((acc, g) => acc + g.technologies.length, 0)} Technologies Active
              </span>
            </div>

            <TechStackCatalog
              groups={filteredSkillGroups}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>

        {/* Global Footer CTA */}
        <div className="mt-20 pt-10 border-t border-border">
          <ContactCta contact={site.contact} identity={site.identity} />
        </div>
      </div>

      {/* Detail Dialog Popup */}
      <CredentialDialog
        item={selectedCert}
        type="certificate"
        isOpen={Boolean(selectedCert)}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
