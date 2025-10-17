import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import UseCases from '../components/apple/UseCases';
import logoAsset from '../assets/mobius_logo.webp';

export default function AppleInspiredPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.classList.add('apple-experience');
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.body.classList.remove('apple-experience');
    };
  }, []);

  return (
    <>
      <Head>
        <title>this is mobius — llm-powered math visualization</title>
        <meta
          name="description"
          content="Mobius lets anyone prompt a graph or 3D transformation and see it rendered instantly. Discover how our LLM-powered visualization engine transforms math education."
        />
      </Head>
      <main className="flex min-h-screen w-full flex-col bg-brand-black text-brand-white">
        <nav className="fixed left-6 top-6 z-50 flex items-center gap-8 text-sm font-display uppercase tracking-[0.28em] text-brand-white/80">
          <Link
            href="#hero"
            className="flex items-center gap-3 text-brand-white transition duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
          >
            <Image
              src={logoAsset}
              alt="Mobius logo"
              width={36}
              height={36}
              priority
              className="h-9 w-auto"
            />
            <span>mobius</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#hero"
              className="transition duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            >
              about
            </Link>
            <Link
              href="#use-cases"
              className="transition duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
            >
              use cases
            </Link>
          </div>
        </nav>
        <header
          id="hero"
          className="relative flex h-screen min-h-[640px] flex-col items-center justify-center overflow-hidden px-6 text-brand-white md:px-16 lg:px-24"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(232,84,14,0.26),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(13,91,163,0.28),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(40,161,187,0.22),transparent_65%)]" />
          <div className="relative max-w-5xl text-center">
            <h1 className="select-none font-display text-[min(5vw,56px)] tracking-[0.18em] text-brand-white">
              this is mobius
            </h1>
            <p className="mt-8 font-sans text-[min(1.6vw,24px)] leading-relaxed text-brand-white/78">
              Turn equations into interactive visuals that help you feel and understand every concept,
              from simple graphs to complex 3D transformations.
            </p>
            <div className="mt-16 flex justify-center text-sm tracking-[0.24em]">
              <Link
                href="/"
                className="inline-flex min-w-[160px] justify-center rounded-full border border-brand-orange px-8 py-3 font-display text-brand-orange transition-all duration-200 ease-apple hover:scale-[1.03] hover:bg-brand-orange hover:text-brand-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
              >
                open app
              </Link>
            </div>
          </div>
        </header>

        <UseCases />
      </main>
    </>
  );
}
