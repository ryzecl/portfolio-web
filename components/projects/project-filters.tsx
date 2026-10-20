'use client';

import React from 'react';
import { ProjectItem } from '@/lib/types';
import { ProjectCard } from './project-card';
import { Search, FolderGit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFiltersProps {
  initialProjects: ProjectItem[];
  categories: string[];
}

export function ProjectFilters({
  initialProjects,
  categories,
}: ProjectFiltersProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filterOptions = ['All', ...categories];

  const filteredProjects = React.useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
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
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterOptions.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 select-none cursor-pointer',
                  isSelected
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            aria-label="Search projects by name or technology"
            className="w-full bg-white border border-zinc-200 rounded-full pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
        <span>
          Showing {filteredProjects.length} of {initialProjects.length} projects
        </span>
        {selectedCategory !== 'All' && (
          <span className="text-zinc-900 font-semibold">Filtered by: {selectedCategory}</span>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="text-center py-20 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-8 space-y-3">
          <FolderGit2 className="w-10 h-10 text-zinc-400 mx-auto stroke-1" />
          <h3 className="text-base font-semibold text-zinc-900">
            No projects matched your criteria
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting &quot;All&quot; to view the complete catalog.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-mono text-zinc-900 font-semibold hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
