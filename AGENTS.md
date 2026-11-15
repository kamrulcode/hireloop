<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop-client

Next.js 16 App Router client for HireLoop — one app, not a monorepo. **npm** only (`package-lock.json`).

Job/user data comes from the sibling repo `../hireloop-server`: a single `index.js` (Express 5, run with `node index.js`, port 5000) exposing `GET /jobs`, `GET /users`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`. There is no one-job read endpoint. Both apps use the same Mongo db `hireloop`, so better-auth writes `user` documents directly while job data goes through Express.

## Commands

- `npm run dev` — Turbopack dev server; regenerates `next-env.d.ts` and `.next/dev/types/`.
- `npm run lint` — ESLint 9 flat config, whole repo. Focused: `npm run lint -- src/app/jobs/page.tsx`.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script.
- `npm run build` — production build; takes minutes, not seconds — don't kill it assuming it hung. `npm start` serves that build.
- Verify with `npm run lint` → `npx tsc --noEmit`. That is the whole safety net: **no tests, no test runner, no CI, no git hooks.** Don't invent `npm test`.

## Gotchas

- **Typecheck needs generated route types.** `next-env.d.ts` is gitignored (as is `*.tsbuildinfo`) and imports `.next/dev/types/*` (or `.next/types/*` after a build); `layout.tsx` consumes the generated global `LayoutProps<"/">`. On a fresh clone or after deleting `.next/`, `npx tsc --noEmit` fails until `npm run dev` or `npm run build` runs once. Never hand-edit `next-env.d.ts` (regenerated; ESLint ignores it).
- **Malformed env line.** `.env` reads `NEXT_PUBLIC_API_BASE_URL:http://localhost:5000` (colon, not `=`). Next only accepts `KEY=value`, so the variable is `undefined` in both server and client. It looks harmless because both `src/lib/actions/*` modules fall back to `http://localhost:5000` — which means pointing the client at a different API silently does nothing until the line is fixed.
- `/manage-jobs` renders `RecruiterManageJobs` from `src/components/dashboard/recruiter-manage-jobs.tsx`, which is an **async server component despite living under `src/components/dashboard`** (no `"use client"`) and `await`s `getJobsData()`. That page throws if the Express API isn't running on `:5000`.
- `README.md` is untouched create-next-app boilerplate and **wrong** (`app/page.tsx`, yarn/pnpm/bun). Trust this file over it.

## Structure

- Every route is a thin server wrapper in `src/app/<path>/page.tsx` that gates on `requireUser()` / `requireRole(...)` from `src/lib/session.ts` (no `middleware.ts`), then renders the real UI from `src/components/dashboard/`. `requireRole` redirects a signed-in wrong role to `/dashboard`; a missing session goes to `/login`. Matrix: `/saved-jobs` + `/billing` seeker; `/add-new-job` + `/manage-jobs`(+`[jobId]`) recruiter; `/users` + `/companies` + `/payments` admin; `/applications` seeker+recruiter; `/settings` any; `/jobs` all three but redirects recruiters to `/manage-jobs`. The exception is **/browser-jobs (public)**: it gates nothing, fetches `getJobsData()` server-side, maps `toRecruiterJob`, and hands the list to the `"use client"` `src/components/landing/browse-jobs-client.tsx`, which does search / single-select Job Type + Work Mode + Category filtering (faceted counts, one value per group) / sort / pagination entirely in memory (the API has no query support). Its filter options and counts are computed from the fetched jobs, and the nav bar's "Browse Jobs" link points there.
- `src/app/dashboard/page.tsx` skips `session.ts` and reads `auth.api.getSession` itself to pick `SeekerDashboard` / `RecruiterDashboard` / `AdminDashboard` — role changes may need edits in both places.
- `src/components/dashboard/`: `shell.tsx` = shared chrome (`DashboardShell`, `Avatar`, `Fab`, `DashboardUser`, `NavItem`); `layouts.tsx` = per-role nav array + topbar (`SeekerLayout`, `RecruiterLayout`, `AdminLayout`); `ui.tsx` = style-string + primitive exports (`card`, `th`, `td`, `btnIndigo`, `inputClass`, `StatusBadge`, `PageHeader`, `Breadcrumb`, `StatCard`, `SelectBox`). Nearly every file here is `"use client"`; `src/app/*/page.tsx` pass a `DashboardUser` (`email`/`image` optional).
- Landing sections in `src/components/landing/` are server components with `navbar-client.tsx` / `search-form.tsx` as the client bits; auth UI in `src/components/auth/`. Path alias `@/*` → `./src/*`.
- **Recruiter job data comes from the API, not a seed list.** `recruiter-jobs-data.ts` holds the `JobType` / `RecruiterJob` types plus `toRecruiterJob()`, which converts one `JobDocument` from `getjobs.ts` into the UI shape (every field has a fallback). `getjobs.ts` owns the `JobDocument` type; `recruiter-jobs-data.ts` imports it (`import type`, so nothing server-side leaks into client bundles). The manage list renders `(await getJobsData()).map(toRecruiterJob)`; its row actions are `<Link href="/manage-jobs/{id}?mode=edit">`, `DeleteJob`, and `ViewDropdown` (view/edit links). `/manage-jobs/[jobId]` is a single route that branches on `?mode=view` → `RecruiterViewJob` (read-only detail page), otherwise `RecruiterUpdateJob`; both use `getJobById()` and `notFound()` unknown ids. There is no `GET /jobs/:id`, so `getJobById` downloads the list and matches `_id`. `JobForm` creates via `POST /jobs` and updates via `PUT /jobs/:id` (that route exists in `../hireloop-server/index.js`, which strips `_id` before `$set`), then `router.push("/manage-jobs")` + `refresh()`.
- `src/lib/actions/*` are plain `async` helpers (no `"use server"`, no auth header) that throw `ApiError` (with `.status`) or `Error` with readable messages instead of returning status objects. `getjobs.ts` runs from server components; `jobs.ts` runs from the client `JobForm` and `DeleteJob`.
- **Toasts:** `@/components/ui/toast` is shadcn-on-Base-UI (`toast.add(...)` or the `notify.success/error/warning/info/loading(title, description?)` shortcuts; `notify.loading` returns an id, and `toast.update(id, { type, title, timeout })` morphs that same toast into success/error — the `notify` helpers use success 4s, error 6s, warning 5s, loading never auto-closes). Type tones (`success`/`error`/`warning`/`info`/`loading`, `danger` aliases `error`) live in `toastTones` and are applied by `ToastList`, since Base UI's toast root exposes no `data-type`. `<Toaster />` is mounted once in `src/app/layout.tsx`; never add a second one. `DeleteJob` (`recruiter-delete-job.tsx`) is the reference call site: it closes its own dialog *before* awaiting the request (Base UI's `AlertDialogAction` is just a `Button`, it does not auto-close) and reports progress through one toast.
- `src/app/api/auth/[...all]/route.ts` is the only API route and is better-auth's handler — add no app logic there.

## Auth & roles

- better-auth + MongoDB: `src/lib/auth.ts` (`MongoClient(process.env.MONGODB_URL)`, db `hireloop`), client in `src/lib/auth-client.ts`. Email+password only — "Continue with Google" is a no-op placeholder with an inline SVG icon.
- Roles (`seeker` | `recruiter` | `admin`, default `seeker`) are better-auth `user.additionalFields`; the signup form lets anyone pick `admin` and nothing server-side restricts it. Declare new user fields once in `auth.ts`; the `inferAdditionalFields<typeof auth>()` plugin in `auth-client.ts` propagates them to `signUp.email` / session types (remove the plugin and they vanish). `session.user.role` is already typed, so the `(user as { role?: string })` casts in `navbar.tsx`, `dashboard/page.tsx`, `session.ts` are redundant.
- `.env` (gitignored) must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`. Lint/build/typecheck don't need a live MongoDB (the client connects lazily); auth requests fail at runtime without a reachable `MONGODB_URL`. `BETTER_AUTH_URL` lacks a `NEXT_PUBLIC_` prefix, so it is `undefined` in client components — `auth-client.ts` falls back to same-origin and `.env` edits won't change browser behavior.

## UI conventions

- **shadcn/ui v4 on Base UI, not Radix** (`components.json` style `base-nova`, components in `src/components/ui/`). Don't re-run `shadcn init`. Base UI swaps Radix's `asChild` for a `render` prop: `<Button render={<Link href="/login" />}>` — no component uses it yet, so don't go looking for examples.
- Import `cn` from the `"cn"` package (`import { cn } from "cn"`), as all dashboard components do; `src/lib/utils.ts` is only a one-line re-export for shadcn's alias.
- `lucide-react@1` has **no brand icons** (Facebook/GitHub/Google were removed) — inline the SVG, as `auth-form.tsx` does.
- Tailwind **v4, CSS-first**: deliberately no `tailwind.config.*` or `postcss.config.*` — don't create them. `src/app/globals.css` imports `"tailwindcss"`, `"tw-animate-css"`, `"shadcn/tailwind.css"`, defines tokens in `@theme inline`, and the app is permanently dark (`dark` class on `<html>`, palette in the `.dark` block). CSS flows through the `@tailwindcss/turbopack` rule in `next.config.ts`.
- React Compiler is on (`reactCompiler: true` + `babel-plugin-react-compiler`) — components are auto-memoized, so don't add `memo`/`useMemo`.
- Anything stateful (forms with `onSubmit`, dropdowns, toggles) must be `"use client"`; handlers can't live in server components.

## Next.js docs

Version-matched docs live at `node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`, ...). Prefer them over training-data knowledge — this Next version has breaking changes.
