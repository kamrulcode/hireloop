<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop-client

Single Next.js 16 App Router app — not a monorepo. Use **npm** (`package-lock.json`); yarn/pnpm/bun are not set up.

## Commands

- `npm run dev` — dev server (Turbopack). Also writes `next-env.d.ts` and `.next/dev/types/`.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), whole repo. Focused: `npm run lint -- src/app/page.tsx` (args pass through after `--`).
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script.
- `npm run build` — production build. ~3 min warm; a cold cache is slower — don't kill it early assuming it hung.
- `npm start` — serve the production build.

Verification order before finishing a change: `npm run lint` → `npx tsc --noEmit`.

## Gotchas

- **No tests, no test runner, no CI, no pre-commit hooks.** Don't invent `npm test` or look for a CI check — lint + typecheck are the whole safety net.
- **Typecheck needs generated route types.** `next-env.d.ts` is gitignored (as is `tsconfig.tsbuildinfo`) and imports `.next/dev/types/*` or `.next/types/*`; `src/app/layout.tsx` uses the generated global `LayoutProps<"/">`. On a fresh clone or after deleting `.next/`, `npx tsc --noEmit` fails until `npm run dev` or `npm run build` runs once. Never hand-edit `next-env.d.ts` (regenerated; ESLint ignores it).
- `README.md` is untouched create-next-app boilerplate and **wrong** in places (says `app/page.tsx`, suggests yarn/pnpm/bun). Trust this file over it.

## Structure & conventions

- Routes: `/`, `/login`, `/signup`, `/dashboard`, and the role-specific dashboard pages `/jobs`, `/saved-jobs`, `/applications`, `/billing`, `/manage-jobs`, `/users`, `/companies`, `/payments`, `/settings`, plus the catch-all `/api/auth/[...all]`. Shared paths dispatch by role (`/jobs` → seeker or admin, `/applications` → seeker or recruiter, `/settings` → all three), so a new page usually belongs in `src/components/dashboard/<role>-<page>.tsx` plus a thin `src/app/<path>/page.tsx` guarded by `src/lib/session.ts`.
- Landing sections in `src/components/landing/` (server components; interactive ones are `*-client.tsx`), auth UI in `src/components/auth/`, per-role dashboards in `src/components/dashboard/`. `shell.tsx` is the shared chrome (sidebar, topbar, `Avatar`, `Fab`); `layouts.tsx` wraps it per role with the nav array + topbar icons (`SeekerLayout`, `RecruiterLayout`, `AdminLayout`); `ui.tsx` holds the dashboard table/stat/badge primitives. Path alias `@/*` → `./src/*`.
- **shadcn/ui v4 on Base UI, not Radix** (`components.json` style `base-nova`, components in `src/components/ui/`). Don't re-run `shadcn init`. Base UI uses a `render` prop instead of Radix's `asChild`: `<Button render={<Link href="/login" />}>`. Import `cn` directly from the `"cn"` package like existing components do; `src/lib/utils.ts` is only the shadcn alias shim.
- `lucide-react@1` has **no brand icons** (Facebook/GitHub/Google were removed) — inline the SVG, as `auth-form.tsx` does.
- **Auth is better-auth + MongoDB** (`src/lib/auth.ts`, db `hireloop`; client `src/lib/auth-client.ts`). Only email+password is enabled — the "Continue with Google" button is a no-op placeholder. There is no `middleware.ts`; gate routes in server code.
- **Roles** (`seeker` | `recruiter` | `admin`, default `seeker`) are better-auth `user.additionalFields`, set from the signup form — which lets anyone pick `admin`; nothing server-side restricts it. Declare new user fields once in `auth.ts`; the `inferAdditionalFields<typeof auth>()` plugin in `auth-client.ts` derives the client types from it (drop that plugin and `signUp.email` loses them). `session.user.role` is typed via inference, so the `(user as { role?: string })` casts in `navbar.tsx`/`dashboard/page.tsx` are redundant.
- **Reading the session makes a route dynamic.** `auth.api.getSession({ headers: await headers() })` in `navbar.tsx` / `dashboard/page.tsx` keeps `/` and `/dashboard` server-rendered (`ƒ`); `/login` and `/signup` stay static. `/dashboard` redirects unauthenticated users to `/login` and renders `{seeker,recruiter,admin}.tsx` by role.
- **`.env` (gitignored) must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`.** Build/lint/typecheck don't need a live MongoDB (the client connects lazily), but auth requests fail at runtime unless `MONGODB_URL` is reachable. `BETTER_AUTH_URL` has no `NEXT_PUBLIC_` prefix, so it is `undefined` in client components — `auth-client.ts` falls back to same-origin, and `.env` edits won't change client behavior.
- Tailwind **v4, CSS-first**: there is deliberately no `tailwind.config.*` or `postcss.config.*` — don't create them. `src/app/globals.css` imports `"tailwindcss"`, `"tw-animate-css"`, `"shadcn/tailwind.css"` and defines tokens in `@theme inline`; the app is permanently dark (`class="dark"` on `<html>`, palette in the `.dark` block). CSS is wired through the `@tailwindcss/turbopack` rule in `next.config.ts`.
- React Compiler is enabled (`reactCompiler: true` + `babel-plugin-react-compiler`) — components are auto-memoized, so don't add `memo`/`useMemo`.
- Event handlers can't live in server components — anything stateful (forms with `onSubmit`, dropdowns, toggles) must be `"use client"`.

## Next.js docs

Version-matched docs live locally at `node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`, ...). Prefer them over training-data knowledge for any Next API — this Next version has breaking changes. The `BEGIN:nextjs-agent-rules` block at the top is auto-written by `next dev`; leave it intact.
