# CLAUDE.md

React frontend for the social_blog Go API (github.com/adocoder12/social_blog). Single-page app; the Go API is the only backend.

## Stack

React 19, TypeScript 7, Vite 8, TanStack Router (file-based), TanStack Query, Zustand, Tailwind CSS v4, Sass (CSS Modules), Oxlint, Prettier. Node 26 (`.nvmrc`).

## Commands

- `npm run dev`: dev server on :5173, proxies `/api` to `API_TARGET` (default `http://localhost:8080`)
- `npm run build`: type-check + production build
- `npm run lint`: Oxlint
- `npm run format`: Prettier on `src/`
- `make up` / `make down`: Docker (nginx on :3000, needs `API_NETWORK` and `DOCKER_API_TARGET` in `.env`; see `.env.example`)

Before calling a task done, run `npm run format`, `npm run lint` and `npm run build`. All must pass.

## Architecture

Data flow: `route → hook → api → Go API`.

- `src/routes/`: one file per page. The plugin generates `src/routeTree.gen.ts`; never edit it.
- `src/hooks/`: TanStack Query hooks. Routes and components call hooks, never `api/` directly.
- `src/api/`: plain fetch functions, no React. All requests go through `api/client.ts`.
- `src/store/`: Zustand, for screen-only state.
- `src/components/`: reusable UI. Keep route files small; move big parts here.
- `src/types/`: shared types mirroring the Go DTOs.
- `src/utils/`: helpers such as `cn`.

State rule: data from the API lives in TanStack Query. Never copy it into Zustand or `useState`. Zustand is only for UI state (filters, open menus, current user id).

## Conventions

- Imports use per-folder aliases: `@api/*`, `@hooks/*`, `@store/*`, `@utils/*`, `@components/*`, `@routes/*`, `@styles/*` (→ `src/css/`), `@app-types`. No `@/`.
- `verbatimModuleSyntax` is on: import types with `import type` or `type` in the braces.
- Query keys live in one `xxxKeys` object per resource (see `postKeys`). After a mutation, invalidate or update the cache; don't refetch manually.
- Links use TanStack Router's `<Link>` with typed `params`. Never use `<a>` for internal pages.
- Function components, named by file (`Footer.tsx` exports `Footer`). Props typed inline or with a `type`, not `interface`.

## Styling

- Tailwind v4. The theme is the `@theme` block in `src/css/index.css`. There is no `tailwind.config.js`; don't create one.
- Rule: SCSS modules for components, Tailwind for one-off tweaks.
- Each component has its own `ComponentName.module.scss` next to it, imported as `styles`. Wrap the whole file in `@layer components { ... }` so Tailwind utilities still override it.
- Tailwind one-offs go in the JSX or through a `className` prop, combined with `cn(styles.x, className)`.
- In SCSS, read the theme through its CSS variables (`var(--color-decorator)`, `var(--text-small)`, `var(--font-sans)`). `@theme static` keeps them all in the output. Breakpoints: `md` = `48rem`, `lg` = `64rem`.
- Use theme tokens, never raw hex in components: `bg-background`, `text-colorText`, `text-muted`, `text-decorator`, `border` (uses `--color-border`), `text-h1`…`text-h6`, `text-body`, `text-small`.
- Font: Nudica everywhere, self-hosted from `public/fonts/nudica` (`font-sans`, set on `body`, so components inherit it). Weights: 100, 200, 300, 400, 500, 700; italics for 400, 500, 700.
- Layout: `.app` and `.main-container` in `@layer components`. Header and footer content uses `max-w-300 px-5 md:px-13` to line up with it.
- Long text goes in `max-w-prose`.
- Use `cn` from `@utils/cn` only for conditional classes or a `className` prop, not for static strings. When adding a font size or weight to `@theme`, add its name to the list in `utils/cn.ts`.
- Keep text contrast at 4.5:1 or more on `bg-background`.

## Platform features

- For any UI, CSS, HTML or browser API work, use the modern-web-guidance skill and prefer native platform features (dialog, popover, container queries, view transitions) over custom JS.
- Target Baseline "Widely available". "Newly available" is fine with a fallback or if it degrades gracefully; say which one you used.

## Working rules

- Keep solutions simple. No new abstraction, library or pattern unless it solves a problem we have now.
- Ask before adding a dependency.
- Don't invent API endpoints. If a feature needs one that doesn't exist, say so and stop.
- Edit files directly. Don't give partial snippets for me to apply.
- Explain briefly what changed and why; skip explaining what's obvious from the code.
- Don't touch: `routeTree.gen.ts`, `package-lock.json` by hand, Docker and nginx files unless asked.

## Tooling notes

- `package.json` `overrides` lets TypeScript 7 satisfy typescript-eslint's peer range (pulled in by `@tanstack/eslint-plugin-query`, which Oxlint runs as a JS plugin). Remove it once typescript-eslint supports TS 7.
- `react/only-export-components` is off for `src/routes/**` in `.oxlintrc.json`: route files export `Route` plus local components, and the router plugin code-splits them.
