# Mobius Apple-Inspired Landing Page

This folder contains a standalone Next.js site that reproduces the `/apple` marketing experience from the main Mobius project.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 to view the page. The call-to-action links point back to `/` by default; update them to match your target application routes as needed.

## Contents

- `pages/index.js` – Hero, nav, and use-case sections.
- `components/UseCases.js` + `components/Reveal.js` – Animated cards and scroll reveals with framer-motion.
- `public/assets/logo.webp` – Mobius glyph used for navigation.
- Tailwind configuration (`tailwind.config.js`, `postcss.config.js`) and global styles (`styles/globals.css`).

## Dependencies

- Next.js 14
- React 18
- Tailwind CSS 3.4
- Framer Motion 11

Feel free to adjust the Tailwind theme or copy the components into your own setup if you prefer a different build tool.
