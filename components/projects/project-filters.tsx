'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectItem } from '@/lib/types';
import { ProjectCard } from './project-card';
import { Search, FolderGit2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface ProjectFiltersProps {
  initialProjects: ProjectItem[];
  categories: string[];
}

export function ProjectFilters({
  initialProjects,
  categories,
}: ProjectFiltersProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const filterOptions = useMemo(() => {
    return ['All', ...categories];
  }, [categories]);

  const comboboxOptions: ComboboxOption[] = useMemo(() => {
    return filterOptions.map((cat) => ({
      value: cat,
      label: cat === 'All' ? 'All Categories' : cat,
      count:
        cat === 'All'
          ? initialProjects.length
          : initialProjects.filter(
              (p) => p.category.toLowerCase() === cat.toLowerCase()
            ).length,
    }));
  }, [filterOptions, initialProjects]);

  const allPopularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProjects.forEach((p) => {
      p.technologies.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .slice(0, 6);
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query)) ||
        project.role.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 relative z-10">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface border border-border shadow-xs">
        {/* Mobile: 1-Line Combobox + Search Icon Button */}
        <div className="flex sm:hidden items-center gap-2 w-full">
          <div className="flex-1 min-w-0">
            <Combobox
              options={comboboxOptions}
              value={selectedCategory}
              onChange={(cat) => setSelectedCategory(cat)}
              placeholder="Select category..."
              searchPlaceholder="Filter category..."
              triggerClassName="w-full justify-between"
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Search projects"
            className={cn(
              'h-10 w-10 shrink-0 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer select-none',
              searchQuery
                ? 'border-accent bg-accent/15 text-accent shadow-xs'
                : 'border-border bg-surface-raised text-muted hover:text-foreground hover:border-foreground/30'
            )}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop: Category Pills */}
        <div className="hidden sm:flex flex-wrap items-center gap-1.5 overflow-x-auto pb-0">
          {filterOptions.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 select-none cursor-pointer',
                  isSelected
                    ? 'bg-accent text-background font-semibold shadow-xs'
                    : 'text-muted hover:text-foreground hover:bg-surface-raised'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Desktop: Search Input */}
        <div className="hidden sm:block relative min-w-60">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            aria-label="Search projects by name or technology"
            className="w-full bg-surface-raised border border-border rounded-full pl-9 pr-14 py-2 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-mono text-muted hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Status */}
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

      {/* Mobile Search Engine Modal (Command Dialog) */}
      <CommandDialog
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      >
        <CommandInput
          placeholder="Search projects by name, stack, or role..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          onClose={() => setIsSearchModalOpen(false)}
        />
        <CommandList className="max-h-[380px] p-2">
          <CommandEmpty className="py-8 text-center text-xs text-muted">
            No projects found matching &ldquo;{searchQuery}&rdquo;.
          </CommandEmpty>

          {searchQuery.trim() && (
            <CommandGroup heading="Actions">
              <CommandItem
                onSelect={() => setIsSearchModalOpen(false)}
                className="flex items-center justify-between text-xs py-2.5 font-medium text-accent"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 text-accent shrink-0" />
                  <span className="truncate">
                    Apply filter &ldquo;{searchQuery}&rdquo; to catalog
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
              </CommandItem>
            </CommandGroup>
          )}

          {/* Quick Filter Tags (when search is empty) */}
          {!searchQuery && allPopularTags.length > 0 && (
            <CommandGroup heading="Popular Technologies">
              <div className="flex flex-wrap gap-1.5 p-2">
                {allPopularTags.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tech);
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-raised hover:bg-accent hover:text-background text-muted border border-border transition-colors cursor-pointer"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </CommandGroup>
          )}

          {/* Matching Projects Group */}
          <CommandGroup heading={`Projects (${filteredProjects.length})`}>
            {filteredProjects.slice(0, 8).map((project) => (
              <CommandItem
                key={project.slug}
                value={`${project.title} ${project.category} ${project.technologies.join(' ')}`}
                onSelect={() => {
                  setIsSearchModalOpen(false);
                  router.push(`/projects/${project.slug}`);
                }}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <FolderGit2 className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-xs truncate">
                      {project.title}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {project.category} &middot; {project.role}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

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
