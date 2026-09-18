import Image from 'next/image';
import Link from 'next/link';

// A single tag on a project card, e.g. { category: 'Language', values: ['TypeScript', 'Rust'] }
export type ProjectTag = {
  category: string;
  values: string[];
};

// A link to a project's repo, deployment, or write up
export type ProjectLink = {
  label: string;
  href: string;
};

// The photo, gif, or clip shown at the top of a card
// Videos play silently on a loop, so a clip behaves like a gif
export type ProjectMedia = {
  src: string;
  alt: string;
  kind?: 'image' | 'video';
  poster?: string;
};

// Everything the card needs in order to showcase one project
export type Project = {
  title: string;
  subtitle?: string;
  bullets: string[];
  tags?: ProjectTag[];
  links?: ProjectLink[];
  media?: ProjectMedia;
};

export type ProjectCardProps = Project;

// Links to other websites open in a new tab, internal ones use client side routing
const isExternal = (href: string) => /^(https?:)?\/\//i.test(href);

const linkClassName =
  'flex items-center justify-center rounded-full bg-slate-100 px-4 py-1 text-sm text-slate-900 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-sky-200';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v'];

// Videos are picked out by their extension, unless 'kind' says otherwise
const isVideo = (media: ProjectMedia) =>
  media.kind
    ? media.kind === 'video'
    : VIDEO_EXTENSIONS.some((extension) => media.src.toLowerCase().endsWith(extension));

// Animated gifs skip the image optimizer so they keep moving
const isAnimatedImage = (src: string) => src.toLowerCase().endsWith('.gif');

// The banner at the top of a card, padded out to a 16:9 box so cards line up
const ProjectMediaSlot: React.FC<{ media: ProjectMedia }> = ({ media }) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
      {isVideo(media) ? (
        <video
          src={media.src}
          poster={media.poster}
          aria-label={media.alt}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized={isAnimatedImage(media.src)}
          className="object-cover"
        />
      )}
    </div>
  );
};

// A card that showcases a single project with media, bullet points, tags, and links
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  bullets,
  tags,
  links,
  media,
}) => {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-lg shadow-black/40 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
      {media && <ProjectMediaSlot media={media} />}

      <div className="flex grow flex-col gap-4 p-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </header>

        <ul className="flex flex-col gap-2 text-sm text-gray-800">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span aria-hidden className="text-sky-600">
                ▸
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {tags && tags.length > 0 && (
          <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t border-gray-200 pt-4">
            {tags.map((tag) => (
              <div key={tag.category} className="flex flex-col gap-1">
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {tag.category}
                </dt>
                <dd className="flex flex-wrap gap-1">
                  {tag.values.map((value) => (
                    <span
                      key={value}
                      className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-900"
                    >
                      {value}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link) =>
              isExternal(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClassName}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
