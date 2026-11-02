'use client';

import React, { useMemo, useState } from 'react';
import { ProjectItem } from '@/lib/types';
import { ProjectCard } from './project-card';
import { Search, FolderGit2, Layers, Sparkles, Filter, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectFiltersProps {
  initialProjects: ProjectItem[];
  categories: string[];
}

export function ProjectFilters({
  initialProjects,
  categories,
}: ProjectFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const featuredCount = useMemo(() => {
    return initialProjects.filter((p) => p.featured).length;
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return initialProjects.filter((project) => {
      // Tab filter: 'all' or 'featured'
      if (activeTab === 'featured' && !project.featured) {
        return false;
      }

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      // Query filter
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query)) ||
        project.role.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [initialProjects, activeTab, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 relative z-10">
      {/* Filtering and Search Toolbar (matching /credentials layout) */}
      <div className="space-y-4">
        {/* Top Row: Tabs Switcher on the left, Search input on the right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0 -mb-1 sm:mb-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="inline-flex w-max min-w-full sm:min-w-0 sm:w-auto bg-surface border border-border p-1 rounded-xl">
                <TabsTrigger value="all" className="gap-1.5 text-xs shrink-0 px-3 sm:px-3.5 flex-1 sm:flex-initial">
                  <Layers className="w-3.5 h-3.5" />
                  All Works ({initialProjects.length})
                </TabsTrigger>
                <TabsTrigger value="featured" className="gap-1.5 text-xs shrink-0 px-3 sm:px-3.5 flex-1 sm:flex-initial">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured ({featuredCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project, stack, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-hidden focus:border-accent transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Category Pills with Count */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-muted font-mono flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            Category:
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-3 py-1 rounded-full font-mono transition-all shrink-0 border cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-surface-raised text-accent border-accent/40 font-semibold shadow-2xs'
                : 'bg-surface text-muted border-border hover:text-foreground'
            }`}
          >
            All ({initialProjects.length})
          </button>

          {categories.map((cat) => {
            const count = initialProjects.filter(
              (p) => p.category.toLowerCase() === cat.toLowerCase()
            ).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-mono transition-all shrink-0 border cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-surface-raised text-accent border-accent/40 font-semibold shadow-2xs'
                    : 'bg-surface text-muted border-border hover:text-foreground'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted px-1">
        <span>
          Showing {filteredProjects.length} of {initialProjects.length} projects
        </span>
        <div className="flex items-center gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 text-[11px] bg-accent/10 border border-accent/20 text-accent px-2.5 py-0.5 rounded-full">
              <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:text-foreground cursor-pointer font-bold leading-none"
                aria-label="Clear search query"
              >
                &times;
              </button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="text-foreground font-semibold">
              Filtered by: {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={idx}
              featuredLayout={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl p-8 space-y-3">
          <FolderGit2 className="w-10 h-10 text-muted mx-auto stroke-1" />
          <h3 className="text-base font-semibold text-foreground">
            No projects matched your criteria
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search query or selecting &quot;All&quot; to view the complete catalog.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="mt-2 text-xs font-mono text-accent font-semibold hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
