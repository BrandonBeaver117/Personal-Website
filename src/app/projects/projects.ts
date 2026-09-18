import type { Project } from '../components/projectcard';

// A named group of related projects, e.g. 'Controls', 'Hardware', 'AI'
export type ProjectSection = {
  title: string;
  slug: string;
  blurb?: string;
  projects: Project[];
};

// Placeholder entries — replace these with your real projects
const PLACEHOLDER_CONTROLS: Project = {
  title: 'Controls Project',
  subtitle: 'Replace this placeholder with a real project',
  bullets: [
    'What the project does and why it exists',
    'The interesting technical problem you solved',
    'How it turned out, or what you learned from it',
  ],
  tags: [
    { category: 'Role', values: ['Developer'] },
    { category: 'Language', values: ['Python'] },
    { category: 'Skills', values: ['Control theory', 'Simulation'] },
  ],
};

const PLACEHOLDER_HARDWARE: Project = {
  title: 'Hardware Project',
  subtitle: 'Replace this placeholder with a real project',
  bullets: [
    'What the project does and why it exists',
    'The interesting technical problem you solved',
    'How it turned out, or what you learned from it',
  ],
  tags: [
    { category: 'Role', values: ['Designer', 'Builder'] },
    { category: 'Language', values: ['C++'] },
    { category: 'Skills', values: ['CAD', 'Embedded'] },
  ],
  // Swap this for your own file in public/projects/, e.g. '/projects/robot.mp4' or '/projects/build.gif'
  media: {
    src: '/background-aurora.png',
    alt: 'Placeholder standing in for a photo, gif, or clip of this build',
  },
};

const PLACEHOLDER_AI: Project = {
  title: 'AI Project',
  subtitle: 'Replace this placeholder with a real project',
  bullets: [
    'What the project does and why it exists',
    'The interesting technical problem you solved',
    'How it turned out, or what you learned from it',
  ],
  tags: [
    { category: 'Role', values: ['Developer'] },
    { category: 'Language', values: ['Python'] },
    { category: 'Skills', values: ['PyTorch', 'Data pipelines'] },
  ],
};

// The order of this list is the order of the page
// Putting a section first, or a project first inside a section, is just moving a line
export const SECTIONS: ProjectSection[] = [
  {
    title: 'Controls',
    slug: 'controls',
    blurb: 'Control systems, autonomy, and the software that drives them.',
    projects: [PLACEHOLDER_CONTROLS],
  },
  {
    title: 'Hardware',
    slug: 'hardware',
    blurb: 'Physical builds, boards, and things that move.',
    projects: [PLACEHOLDER_HARDWARE],
  },
  {
    title: 'AI',
    slug: 'ai',
    blurb: 'Models, experiments, and applied machine learning.',
    projects: [PLACEHOLDER_AI],
  },
];
