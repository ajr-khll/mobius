import { useEffect, useRef } from 'react';
import Reveal from './Reveal';

const useCases = [
  {
    title: 'interactive lessons',
    description:
      'Guide students through step-by-step explorations where every algebraic move updates a shared 3D canvas in real time.',
    accent: 'brand-orange',
  },
  {
    title: 'ai tutoring assistants',
    description:
      'Pair conversational explanations with live plots so learners can ask “what if?” and watch the function respond instantly.',
    accent: 'brand-blue',
  },
  {
    title: 'research prototyping',
    description:
      'Prototype models quickly, comparing surfaces, parameter sweeps, and cross-sections in a focused, presentation-ready view.',
    accent: 'brand-teal',
  },
];

export default function UseCases() {
  const glowRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    const handlePointerMove = (event) => {
      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      glow.style.setProperty('--glow-x', `${x}px`);
      glow.style.setProperty('--glow-y', `${y}px`);
      glow.style.opacity = '1';
    };

    const handlePointerLeave = () => {
      glow.style.opacity = '0';
    };

    section.addEventListener('pointermove', handlePointerMove);
    section.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center bg-black py-28 text-brand-white"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(280px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(232, 84, 14, 0.24), transparent 55%), radial-gradient(360px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(13, 91, 163, 0.18), transparent 70%), radial-gradient(440px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(40, 161, 187, 0.16), transparent 80%)',
          mixBlendMode: 'screen',
          filter: 'blur(90px)',
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-6 text-center sm:px-10">
        <Reveal className="space-y-4">
          <span className="text-xs uppercase tracking-[0.28em] text-brand-white/60">
            where mobius fits
          </span>
          <h2 className="font-display text-4xl tracking-[0.08em] text-brand-white sm:text-5xl">
            built for modern mathematical storytelling.
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-6 text-brand-white/70 sm:text-base">
            Deploy Mobius anywhere intuitive visualization accelerates understanding—across
            classrooms, assistants, and exploratory research.
          </p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3">
          {useCases.map((useCase, index) => (
            <Reveal
              key={useCase.title}
              delay={index * 0.08}
              className={`group rounded-3xl border px-8 py-10 text-left shadow-lg transition-all duration-500 ease-apple backdrop-blur-xl hover:-translate-y-6 hover:scale-[1.04] hover:brightness-125 ${getAccentClasses(
                useCase.accent
              )}`}
            >
              <h3 className="font-display text-xl text-brand-white">{useCase.title}</h3>
              <p className="mt-4 text-sm leading-6 text-brand-white/70">{useCase.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function getAccentClasses(accent) {
  switch (accent) {
    case 'brand-orange':
      return 'border-brand-orange/80 bg-brand-orange/15 hover:bg-brand-orange/35 hover:shadow-[0_36px_120px_rgba(232,84,14,0.45)]';
    case 'brand-blue':
      return 'border-brand-blue/80 bg-brand-blue/15 hover:bg-brand-blue/35 hover:shadow-[0_36px_120px_rgba(13,91,163,0.45)]';
    case 'brand-teal':
      return 'border-brand-teal/80 bg-brand-teal/15 hover:bg-brand-teal/35 hover:shadow-[0_36px_120px_rgba(40,161,187,0.45)]';
    default:
      return 'border-white/30 bg-white/10 hover:bg-white/15';
  }
}
