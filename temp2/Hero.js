import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from './Reveal';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.65]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-brand-gradient" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(166,200,255,0.45),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.35)_45%,rgba(255,255,255,0.0)_100%)]" />

      <motion.div
        style={{ y: translateY, opacity }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center sm:px-10"
      >
        <Reveal delay={0.1} className="flex flex-col items-center gap-8">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-slate/50">
            NEXT-GEN COMPUTATIONAL CANVAS
          </span>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-brand-slate sm:text-5xl md:text-6xl">
            where intuition meets immersive mathematics.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-brand-slate/70 sm:text-lg">
            Turn equations into interactive visuals that help you feel and understand every concept,
            from simple graphs to complex 3D transformations.
          </p>
        </Reveal>

        <motion.div
          className="relative w-full max-w-4xl rounded-5xl border border-white/50 bg-brand-glass p-[1px] shadow-glass-lg"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative overflow-hidden rounded-5xl bg-brand-glass">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(166,200,255,0.55),transparent_60%)]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-white/40 backdrop-blur-3xl" />
            <motion.div
              className="relative grid h-[440px] place-items-center px-10 py-12 sm:h-[520px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-8 rounded-[2rem] border border-white/40 bg-white/20 backdrop-blur-2xl" />
              <div className="relative flex w-full max-w-3xl flex-col items-center justify-center gap-6 text-brand-slate">
                <span className="rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs tracking-[0.2em] text-brand-slate/70">
                  LIVE PREVIEW
                </span>
                <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                  plug a prompt. watch geometry breathe.
                </h2>
                <p className="max-w-xl text-sm leading-6 text-brand-slate/60 sm:text-base">
                  “Plot a cascading wave intersecting a glass parabola.” Mobius responds with a
                  photoreal, interactive structure ready for walkthroughs, cross-sections, and
                  elegant shareouts.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
