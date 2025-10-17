import { motion } from 'framer-motion';
import Reveal from './Reveal';

const galleryItems = [
  {
    id: 'concept',
    title: 'Concept to canvas',
    description:
      'Transition concepts into luminous surfaces with broadcast-ready polish. Our glass gradient palette adapts to your brand markers.',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
    alt: 'Abstract waves rendered in glass-like material',
  },
  {
    id: 'motion',
    title: 'Motion that feels inevitable',
    description:
      'Every transform eases into place with cinematic timings engineered for 60fps. No stutter, no jitter—just flow.',
    mediaType: 'video',
    src: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
    poster:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'collaborate',
    title: 'Collaborate in context',
    description:
      'Invite teams into a shared viewport, annotate cross-sections, and capture takeaways with one tap.',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1527443224154-9c910028d067?auto=format&fit=crop&w=1600&q=80',
    alt: 'Minimal workspace with luminous displays',
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-gradient-to-b from-white to-brand-ice"
    >
      <div className="absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(circle_at_top_right,rgba(166,200,255,0.25),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-6 py-28 sm:px-10">
        <Reveal className="flex flex-col gap-6 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-brand-slate/40">
            IMMERSIVE LIBRARY
          </span>
          <h2 className="font-display text-4xl tracking-tight text-brand-slate sm:text-5xl">
            A gallery that breathes with you.
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-brand-slate/60 sm:text-lg">
            Each section unlocks with a glassy fade, responsive to scroll velocity. Drop in your own
            product captures, and Mobius maintains the cinematic language across devices.
          </p>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 0.1}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-glass-soft backdrop-blur-2xl"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 1.04 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="absolute inset-0"
                >
                  {item.mediaType === 'image' ? (
                    <img
                      className="h-full w-full object-cover transition duration-700 ease-[0.22,1,0.36,1] group-hover:scale-[1.015]"
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                    />
                  ) : (
                    <video
                      className="h-full w-full object-cover"
                      src={item.src}
                      poster={item.poster}
                      preload="none"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                </motion.div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="flex flex-col gap-3 px-6 pb-8 pt-8 text-brand-slate">
                <h3 className="font-display text-xl tracking-tight">{item.title}</h3>
                <p className="text-sm leading-6 text-brand-slate/60">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
