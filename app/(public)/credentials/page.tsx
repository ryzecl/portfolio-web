'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllCertificates,
  getCertificateCategories,
  getAllSkillGroups,
  getSiteData,
} from '@/lib/data';
import { CertificateItem, SkillGroup } from '@/lib/types';
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

export default function CredentialsPage() {
  const site = useMemo(() => getSiteData(), []);
  const allCertificates = useMemo(() => getAllCertificates(), []);
  const allSkillGroups = useMemo(() => getAllSkillGroups(), []);
  const certCategories = useMemo(() => getCertificateCategories(), []);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          {/* Scrollable Container for Tabs to prevent mobile overflow */}
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0 -mb-1 sm:mb-0">
            <TabsList className="inline-flex w-max min-w-full sm:min-w-0 sm:w-auto bg-surface border border-border p-1 rounded-xl">
              <TabsTrigger
                value="all"
                className="gap-1.5 text-xs shrink-0 px-3 sm:px-3.5 flex-1 sm:flex-initial"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Archive</span>
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="gap-1.5 text-xs shrink-0 px-3 sm:px-3.5 flex-1 sm:flex-initial"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Certifications</span>
                <span className="sm:hidden">Certs</span>
                <span className="font-mono text-[10px] opacity-70 ml-0.5">
                  ({filteredCertificates.length})
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="tech-stack"
                className="gap-1.5 text-xs shrink-0 px-3 sm:px-3.5 flex-1 sm:flex-initial"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Tech Stack</span>
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

        {/* Tab 2: Certifications Only */}
        <TabsContent value="certificates">
          {filteredCertificates.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-surface border border-border text-muted text-sm">
              No certificates found matching criteria.
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
        </TabsContent>

        {/* Tab 3: Tech Stack Only */}
        <TabsContent value="tech-stack" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                Technical Competencies & Tooling
              </h3>
              <p className="text-xs text-muted mt-1">
                A structured inventory of production languages, mobile & web frameworks, backend architectures, and developer tooling.
              </p>
            </div>
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
      </div>

      {/* CTA Section */}
      <div className="relative z-10">
        <ContactCta
          contact={site.contact}
          identity={site.identity}
          badgeNumber={null}
          badgeLabel="Collaboration & Opportunities"
          title="Interested in working together?"
          description="Whether you have an upcoming project, an engineering opening, or want to discuss technical architectures, my inbox is always open."
          primaryButtonText="Get in touch"
          primaryButtonHref="/contact"
          secondaryButtonText="Explore all projects"
          secondaryButtonHref="/projects"
        />
      </div>

      {/* Modal Dialog */}
      <CredentialDialog
        item={selectedCert}
        isOpen={Boolean(selectedCert)}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
