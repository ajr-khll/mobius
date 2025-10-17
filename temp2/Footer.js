import Link from 'next/link';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(166,200,255,0.2),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10">
        <Reveal className="flex flex-col gap-4 text-center">
          <h2 className="font-display text-3xl text-brand-slate">
            Ready to orchestrate your next reveal?
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-brand-slate/60 sm:text-base">
            Request early access and join studios, educators, and storytellers using Mobius to render
            impossible ideas—instantly.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-brand-slate/10 bg-brand-slate px-6 py-3 text-sm font-medium text-white shadow-glass-soft transition hover:-translate-y-0.5 hover:shadow-glass-lg"
            >
              Launch Mobius
            </Link>
            <a
              href="mailto:hello@mobius.app"
              className="inline-flex items-center rounded-full border border-brand-slate/10 bg-white/70 px-6 py-3 text-sm font-medium text-brand-slate shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-glass-soft"
            >
              Talk with us
            </a>
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="flex flex-col gap-6 border-t border-white/70 pt-10 text-xs text-brand-slate/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Mobius. Crafted for explorers of dimensional stories.
          </span>
          <div className="flex flex-wrap gap-5">
            <Link href="/workspace" className="transition hover:text-brand-slate">
              Workspace
            </Link>
            <a className="transition hover:text-brand-slate" href="#features">
              Features
            </a>
            <a className="transition hover:text-brand-slate" href="#gallery">
              Gallery
            </a>
            <a className="transition hover:text-brand-slate" href="mailto:hello@mobius.app">
              Contact
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
