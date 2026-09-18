'use client';

import { useEffect, useRef } from 'react';

import ProjectCard from '../components/projectcard';
import {
  getPillClassName,
  getSectionHref,
  handleSectionLinkClick,
  useProjectNav,
} from './projectnav';
import type { ProjectSection } from './projects';

// How many cards a section shows before it needs a 'See more'
export const PREVIEW_COUNT = 3;

// A section shows its first few projects until it is expanded or focused
const getVisibleProjects = (section: ProjectSection, isFocused: boolean, isExpanded: boolean) => {
  if (isFocused || isExpanded) {
    return section.projects;
  }

  return section.projects.slice(0, PREVIEW_COUNT);
};

// Renders every project section, driven by the pills up in the site header
const ProjectBoard: React.FC = () => {
  const {
    sections,
    focusedSlug,
    focusSection,
    isExpanded: isSectionExpanded,
    toggleExpanded,
  } = useProjectNav();

  const sectionHeadingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const hasRenderedOnce = useRef(false);

  // Move focus to the focused section's heading so screen readers announce the change
  useEffect(() => {
    if (!hasRenderedOnce.current) {
      hasRenderedOnce.current = true;
      return;
    }

    if (focusedSlug) {
      sectionHeadingRefs.current[focusedSlug]?.focus();
      return;
    }

    // Head back to the top once every section is shown again
    window.scrollTo({ top: 0 });
  }, [focusedSlug]);

  const visibleSections = focusedSlug
    ? sections.filter((section) => section.slug === focusedSlug)
    : sections;

  return (
    <div className="flex w-full flex-col">
      {visibleSections.map((section) => {
        const isFocused = focusedSlug === section.slug;
        const isExpanded = isSectionExpanded(section.slug);
        const projectListId = `projects-${section.slug}`;
        const headingId = `${projectListId}-heading`;
        const visibleProjects = getVisibleProjects(section, isFocused, isExpanded);
        const hiddenCount = section.projects.length - visibleProjects.length;

        // While focused every card is on screen, so the toggle makes way for a way back
        const showToggle = !isFocused && (isExpanded || hiddenCount > 0);

        return (
          <section key={section.slug} aria-labelledby={headingId} className="mb-10 last:mb-0">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2
                  id={headingId}
                  ref={(element) => {
                    sectionHeadingRefs.current[section.slug] = element;
                  }}
                  tabIndex={-1}
                  className="text-2xl font-semibold text-white outline-none"
                >
                  {section.title}
                  <span className="ml-2 text-sm font-normal text-white/60">
                    {section.projects.length}{' '}
                    {section.projects.length === 1 ? 'project' : 'projects'}
                  </span>
                </h2>

                {section.blurb && <p className="mt-1 text-sm text-white/70">{section.blurb}</p>}
              </div>

              {isFocused && (
                <a
                  href={getSectionHref(null)}
                  onClick={(event) => handleSectionLinkClick(event, null, focusSection)}
                  className={getPillClassName(false)}
                >
                  All projects
                </a>
              )}

              {showToggle && (
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={projectListId}
                  onClick={() => toggleExpanded(section.slug)}
                  className={getPillClassName(isExpanded)}
                >
                  {isExpanded ? 'See less' : `See more (${hiddenCount})`}
                </button>
              )}
            </header>

            <div
              key={`${section.slug}-${focusedSlug ?? 'all'}`}
              id={projectListId}
              className="card-enter grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {visibleProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProjectBoard;
