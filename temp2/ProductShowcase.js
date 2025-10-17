import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from './Reveal';

const featureHighlights = [
  {
    title: 'Human prompts, technical brilliance',
    description:
      'Describe a mood, a curve, or a cinematic scenario. Mobius interprets and renders glass-smooth geometry with physical lighting and depth-aware shading.',
    metric: '10x',
    metricCaption: 'faster from idea to visualization',
  },
  {
    title: 'Cross-section intelligence',
    description:
      'Slice through any structure with haptic-like precision. Each cut inherits the scene’s lighting, materials, and physics for instant presentation readiness.',
    metric: 'Zero',
    metricCaption: 'manual tweaking required',
  },
  {
    title: 'Premium sharing',
    description:
      'Export cinematic clips or interactive embeds with preserved motion states, annotations, and brand treatments in a single tap.',
    metric: '4K',
    metricCaption: 'ceremonial-ready output',
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], ['-12%', '8%']);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(166,200,255,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,1)_0%,rgba(238,244,255,1)_45%,rgba(248,251,255,1)_100%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-32 sm:px-10 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex-1 space-y-10">
          <Reveal className="space-y-6">
            <span className="text-xs uppercase tracking-[0.28em] text-brand-slate/40">
              PRINCIPLES
            </span>
            <h2 className="font-display text-4xl tracking-tight text-brand-slate sm:text-5xl">
              Glasslike motion, engineered to stay invisible.
            </h2>
            <p className="max-w-xl text-base leading-7 text-brand-slate/60 sm:text-lg">
              Mobius orchestrates high-frame-rate transitions, parallax, and adaptive lighting so
              every interaction feels intuitive. Drop in your story, and the stage responds.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {featureHighlights.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={index * 0.08}
                className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glass-soft backdrop-blur-xl"
              >
                <p className="font-display text-lg text-brand-slate">{feature.title}</p>
                <p className="mt-3 text-sm leading-6 text-brand-slate/60">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <p className="text-3xl font-semibold text-brand-slate">{feature.metric}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-slate/40">
                    {feature.metricCaption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <motion.div
          style={{ y: translateY }}
          className="relative flex flex-1 items-center justify-center"
        >
          <div className="relative w-full max-w-xl rounded-[3rem] border border-white/60 bg-white/80 p-6 shadow-glass-lg backdrop-blur-2xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-white/90 to-white/60">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, amount: 0.5 }}
                className="relative aspect-[4/5] w-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(166,200,255,0.35),transparent_65%)]" />
                <div className="absolute inset-8 rounded-[2rem] border border-white/40 bg-white/30 backdrop-blur-2xl" />
                <div className="relative flex h-full flex-col justify-end gap-4 p-12 text-brand-slate">
                  <span className="text-xs uppercase tracking-[0.25em] text-brand-slate/50">
                    REAL-TIME SHOWCASE
                  </span>
                  <h3 className="font-display text-2xl tracking-tight">
                    Dive through a refracted landscape.
                  </h3>
                  <p className="text-sm leading-6 text-brand-slate/60">
                    Glass materials animate with rolling parallax as your viewers scroll. The
                    physics are tuned for desks, tablets, and palms alike.
                  </p>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className="absolute -right-8 bottom-6 hidden w-40 rounded-2xl border border-white/60 bg-white/70 p-4 text-brand-slate shadow-glass-soft backdrop-blur-xl lg:block"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-brand-slate/40">
                Performance
              </p>
              <p className="mt-2 text-sm font-semibold">60fps motion pipeline</p>
              <p className="mt-1 text-xs text-brand-slate/50">
                Optimized for pro workflows and retina displays.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
