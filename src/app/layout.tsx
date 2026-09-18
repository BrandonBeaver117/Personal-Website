import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Link from 'next/link';

import ProjectNav, { ProjectNavProvider } from './projects/projectnav';
import { SECTIONS } from './projects/projects';

const inter = Inter({ subsets: ['latin'] });

// The page background is the aurora artwork, preloaded so it paints as early as possible
export const metadata: Metadata = {
  title: 'Beaver Dam',
  description: 'A personal-ish website for Brandon Nguyen to showcase interesting projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Pull the background in as early as possible, before CSS and JS are parsed */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="/background-aurora.avif"
          fetchPriority="high"
        />
      </head>
      <body className={inter.className}>
        {/* Oversized on purpose: the aurora is stretched wide so its colour spreads across the page */}
        <div className="fixed top-0 left-0 -z-10 min-h-[100vw] min-w-[150vw]">
          <picture>
            {/* AVIF keeps the transparency and comes in ~4x smaller than the png */}
            <source srcSet="/background-aurora.avif" type="image/avif" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/background-aurora.png"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-fill"
            />
          </picture>
        </div>
        <ProjectNavProvider sections={SECTIONS}>
          <header className="flex min-h-[12.5vh] flex-wrap items-center justify-between gap-4 px-8">
            <Link href="/">
              <div className="title text-3xl font-semibold transition">The Beaver Dam</div>
            </Link>

            <ProjectNav />
          </header>

          <main className="flex min-h-[80vh] flex-col items-center justify-evenly">{children}</main>
        </ProjectNavProvider>

        <footer className="flex min-h-[7.5vh] items-center justify-center">
          <div>Brandon Nguyen's Personal Website</div>
        </footer>
      </body>
    </html>
  );
}
