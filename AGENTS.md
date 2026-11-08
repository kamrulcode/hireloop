<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop-client

Single Next.js 16 App Router app — not a monorepo. Use **npm** (`package-lock.json` is the lockfile); yarn/pnpm/bun are not set up.

## Commands

- `npm run dev` — dev server (Turbopack). Also generates route types (see below).
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), whole repo, no args.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script.
- `npm run build` — production build. **Cold it can exceed 10 minutes** (Turbopack cache empty); warm ≈ 3 min — don't kill it early assuming it hung.

Verification order before finishing a change: `npm run lint` → `npx tsc --noEmit`.

Gotchas:

- **No tests, no test runner, no CI, no pre-commit hooks.** Don't invent `npm test` or look for a CI check — lint + typecheck are on you.
- **Typecheck needs generated route types.** `next-env.d.ts` imports generated files under `.next/` (`.next/types/*.d.ts` after a build, `.next/dev/types/*.d.ts` after `next dev`), and `src/app/layout.tsx` uses the generated global `LayoutProps<"/">`. On a fresh clone or after deleting `.next/`, `npx tsc --noEmit` fails until `npm run dev` or `npm run build` has run once. Never hand-edit `next-env.d.ts` (it is regenerated; ESLint ignores it).

## Structure & conventions

- App Router in `src/app/` (`layout.tsx`, `page.tsx`, `globals.css`). Path alias `@/*` → `./src/*` (from `tsconfig.json`). Landing sections live in `src/components/landing/`, auth UI in `src/components/auth/`.
- **shadcn/ui v4 is initialized** (`components.json`, components in `src/components/ui/`). Primitives are built on **Base UI**, not Radix; import `cn` from the `"cn"` package. To make a shadcn Button navigate: `<Button render={<Link href="/login" />}>`. Don't re-run `shadcn init`.
- `lucide-react@1` has **no brand icons** (Facebook/Github/etc. were removed) — use inline SVGs for those.
- **Auth is better-auth + MongoDB.** Server config `src/lib/auth.ts` (email+password, Mongo adapter, db `hireloop`), client `src/lib/auth-client.ts`, catch-all handler `src/app/api/auth/[...all]/route.ts` — every auth endpoint lives under `/api/auth/*`. Session state is read server-side via `auth.api.getSession({ headers: await headers() })` (see `navbar.tsx`, which is why `/` builds as dynamic `ƒ`, not static). There is no `middleware.ts`.
- **Roles** (`seeker` | `recruiter` | `admin`, default `seeker`) live in `user.additionalFields` in `src/lib/auth.ts` and are set by the signup form. `/dashboard` is a server page that reads the session and renders `src/components/dashboard/{seeker,recruiter,admin}.tsx` by role (no middleware; unauthenticated → redirect `/login`). Adding another user field requires declaring it in **both** `auth.ts` (server) and the `inferAdditionalFields` plugin in `auth-client.ts`, or `signUp.email` won't typecheck it.
- **`.env` (gitignored) must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`.** Build/lint/typecheck work without a running MongoDB (the client connects lazily), but sign-in/sign-up requests fail at runtime unless `MONGODB_URL` is reachable. Server-only vars are invisible to client components — `auth-client.ts`'s `baseURL: process.env.BETTER_AUTH_URL` is `undefined` in the browser and falls back to same-origin (fine locally; don't expect `.env` edits to change client behavior).
- Tailwind **v4, CSS-first**: there is deliberately no `tailwind.config.*` or `postcss.config.*` — don't create them. CSS goes through the `@tailwindcss/turbopack` loader rule in `next.config.ts`; global styles use `@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`. The site is fully dark (`class="dark"` on `<html>`); palette is the `.dark` block in `globals.css`.
- React Compiler is enabled (`reactCompiler: true` + `babel-plugin-react-compiler` in `next.config.ts`) — components are auto-memoized, so don't sprinkle manual `memo`/`useMemo` around.
- Event handlers can't live in server components — interactive bits (forms with `onSubmit`, stateful toggles) must be `"use client"` components.
- The `<!-- BEGIN:nextjs-agent-rules -->` block above is auto-written by `next dev`. Keep it intact (markers included) so the tree stays clean.

## Next.js docs

Version-matched docs live locally at `node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`, ...). Prefer them over training-data knowledge for any Next API — this Next version has breaking changes.
