# Design Library

A mobile-first design system playground — a tool for visually building and saving card/page layout presets that will be reused across other web apps.

## Stack

- **Vite** — build tool and dev server
- **React 19** (JavaScript, no TypeScript)
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin
- **Framer Motion** — for transitions, gestures, and native-feel animations
- **vite-plugin-pwa** — PWA support (installable, offline-capable)
- **localStorage** — persistence for presets and page layouts (no backend)

## Key principles

- **Mobile-first**: design for small screens first, then scale up with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Native feel**: use Framer Motion for page transitions, spring animations, and gesture-based interactions
- **No TypeScript**: plain JavaScript only — no `.ts`/`.tsx` extensions, no type annotations
- **Inline styles**: the existing components use inline `style={{}}` objects. Migrate to Tailwind gradually when touching a component, but don't refactor proactively

## Dev

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Structure

```
src/
  App.jsx       # all components (single file for now)
  index.css     # Tailwind import + global resets
  main.jsx      # React root
public/
  icons/        # PWA icons (192x192, 512x512)
```

## Storage

Presets and page layouts are saved to `localStorage` via the `storage` helper at the top of `App.jsx`. Keys: `"presets"`, `"pageLayouts"`.
