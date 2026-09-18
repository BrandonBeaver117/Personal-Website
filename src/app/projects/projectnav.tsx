'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import type { ProjectSection } from './projects';

const pillBaseClassName =
  'rounded-full ring-2 transition duration-300 ease-in-out hover:-translate-y-1';

const pillInactiveClassName = 'bg-slate-100 text-slate-900 ring-transparent hover:bg-sky-200';

const pillActiveClassName = 'bg-sky-200 font-medium text-slate-900 ring-sky-600';

// The header pills and the 'See more' button share one style, only the state differs
export const getPillClassName = (isActive: boolean) =>
  `${pillBaseClassName} px-6 py-2 text-lg ${isActive ? pillActiveClassName : pillInactiveClassName}`;

// The focused section lives in the URL, so every view can be linked and bookmarked
// 'All' is just the plain page, with no hash on the end
export const getSectionHref = (slug: string | null) => (slug ? `#${slug}` : '/');

// Reads the section out of the URL, ignoring anything that is not a real section
const readFocusedSlug = (sections: ProjectSection[]) => {
  const slug = window.location.hash.replace(/^#/, '');

  return sections.some((section) => section.slug === slug) ? slug : null;
};

// Swaps sections in place: the URL still updates, but no history entry is created
export const handleSectionLinkClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  slug: string | null,
  focusSection: (slug: string | null) => void,
) => {
  // Let cmd/ctrl/shift clicks open a new tab the way a normal link would
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  focusSection(slug);
};

export type ProjectNavValue = {
  sections: ProjectSection[];
  focusedSlug: string | null;
  focusSection: (slug: string | null) => void;
  isExpanded: (slug: string) => boolean;
  toggleExpanded: (slug: string) => void;
};

export type ProjectNavProviderProps = {
  sections: ProjectSection[];
  children: React.ReactNode;
};

const ProjectNavContext = createContext<ProjectNavValue | null>(null);

// Reads the section and focus state the header pills and the board both need
export const useProjectNav = () => {
  const value = useContext(ProjectNavContext);

  if (!value) {
    throw new Error('useProjectNav must be used inside a ProjectNavProvider');
  }

  return value;
};

// Holds the shared state so the pills (header) and the sections (main) stay in sync
export const ProjectNavProvider: React.FC<ProjectNavProviderProps> = ({ sections, children }) => {
  // The slug of the focused section, or null to show every section
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);

  // Slugs of the sections the user expanded with 'See more'
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>([]);

  // The URL is the source of truth: read it on mount, then follow outside changes
  useEffect(() => {
    const syncFromUrl = () => setFocusedSlug(readFocusedSlug(sections));

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);

    return () => window.removeEventListener('hashchange', syncFromUrl);
  }, [sections]);

  // Replaces the history entry instead of pushing one, so back skips over the sections
  const focusSection = useCallback((slug: string | null) => {
    window.history.replaceState(null, '', slug ? `#${slug}` : window.location.pathname);
    setFocusedSlug(slug);
  }, []);

  const toggleExpanded = useCallback((slug: string) => {
    setExpandedSlugs((previous) =>
      previous.includes(slug) ? previous.filter((value) => value !== slug) : [...previous, slug],
    );
  }, []);

  const value = useMemo<ProjectNavValue>(
    () => ({
      sections,
      focusedSlug,
      focusSection,
      isExpanded: (slug: string) => expandedSlugs.includes(slug),
      toggleExpanded,
    }),
    [sections, focusedSlug, focusSection, expandedSlugs, toggleExpanded],
  );

  return <ProjectNavContext.Provider value={value}>{children}</ProjectNavContext.Provider>;
};

// The section pills that live in the site header
const ProjectNav: React.FC = () => {
  const { sections, focusedSlug, focusSection } = useProjectNav();
  const pathname = usePathname();

  // The pills only drive the project board, so they stay off of every other page
  if (pathname !== '/') return null;

  return (
    <nav aria-label="Project sections" className="flex flex-wrap items-center justify-end gap-2">
      <a
        href={getSectionHref(null)}
        aria-current={focusedSlug === null ? 'true' : undefined}
        onClick={(event) => handleSectionLinkClick(event, null, focusSection)}
        className={getPillClassName(focusedSlug === null)}
      >
        All
      </a>

      {sections.map((section) => (
        <a
          key={section.slug}
          href={getSectionHref(section.slug)}
          aria-current={focusedSlug === section.slug ? 'true' : undefined}
          onClick={(event) => handleSectionLinkClick(event, section.slug, focusSection)}
          className={getPillClassName(focusedSlug === section.slug)}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
};

export default ProjectNav;
