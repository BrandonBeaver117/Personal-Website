import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Image from 'next/image';
import Link from 'next/link';

import ProjectNav, { ProjectNavProvider } from './projects/projectnav';
import { SECTIONS } from './projects/projects';

const inter = Inter({ subsets: ['latin'] });

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
      </head>
      <body className={inter.className}>
        <div className="fixed top-0 left-0 -z-10 min-h-[100vw] min-w-[150vw] bg-fixed">
          <Image src="/background-aurora.png" alt="" fill={true}></Image>
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
