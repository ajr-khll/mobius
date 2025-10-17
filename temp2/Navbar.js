import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [elevated, setElevated] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();

    if (latest > 120 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    setElevated(latest > 24);
  });

  return (
    <motion.div
      initial={false}
      animate={{
        y: hidden ? -160 : 0,
      }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pb-4 pt-6 sm:px-6"
    >
      <motion.nav
        aria-label="Primary"
        animate={{
          boxShadow: elevated ? '0 12px 40px rgba(15, 23, 42, 0.12)' : '0 0 0 rgba(0,0,0,0)',
          borderColor: elevated ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: elevated ? 'rgba(248, 251, 255, 0.72)' : 'rgba(252, 255, 255, 0.6)',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-5xl items-center justify-between rounded-full border px-6 py-3 text-sm backdrop-blur-2xl sm:px-8"
      >
        <Link href="/" className="font-display text-lg tracking-tight text-brand-slate">
          Mobius
        </Link>
        <div className="hidden items-center gap-8 text-brand-slate/70 sm:flex">
          <Link className="transition hover:text-brand-slate" href="/workspace">
            Workspace
          </Link>
          <a className="transition hover:text-brand-slate" href="#features">
            Features
          </a>
          <a className="transition hover:text-brand-slate" href="#gallery">
            Gallery
          </a>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-brand-slate/10 bg-white/80 px-4 py-2 text-brand-slate shadow-glass-soft transition hover:-translate-y-0.5 hover:shadow-glass-lg"
        >
          Launch
        </Link>
      </motion.nav>
    </motion.div>
  );
}
