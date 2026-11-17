<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop-client

Next.js 16 App Router client for HireLoop — one app, not a monorepo. **npm** only (`package-lock.json`).

Jobs/users come from the sibling repo `../hireloop-server`: one Express 5 `index.js` (`node index.js`, port 5000) exposing `GET /jobs`, `GET /jobs/:id`, `GET /users`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`. Both apps use Mongo db `hireloop`; better-auth writes `user` directly, job data goes through Express. `GET /jobs/:id` returns 400 for a malformed ObjectId, 404 when no document exists.

## Commands

- `npm run dev` — Turbopack dev server; regenerates `next-env.d.ts` and `.next/dev/types/`.
- `npm run lint` — ESLint 9 flat config, whole repo (slow). Focused: `npm run lint -- src/app/jobs/page.tsx`.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script.
- `npm run build` / `npm start` — production build takes ~5 min compile + ~90 s TypeScript; don't kill it assuming it hung.
- Verify with `npm run lint` → `npx tsc --noEmit`. That is the whole safety net: **no tests, no test runner, no CI, no git hooks.** Don't invent `npm test`.

## Gotchas

- **Typecheck needs generated route types.** `next-env.d.ts` is gitignored (as is `*.tsbuildinfo`) and imports `.next/dev/types/*` (or `.next/types/*` after a build); `layout.tsx` uses the generated global `LayoutProps<"/">`. On a fresh clone or after deleting `.next/`, `npx tsc --noEmit` fails until `npm run dev` or `npm run build` runs once. Never hand-edit `next-env.d.ts`.
- **Malformed env line.** `.env` reads `NEXT_PUBLIC_API_BASE_URL:http://localhost:5000` (colon, not `=`), so the variable is `undefined`; both `src/lib/actions/*` modules fall back to `http://localhost:5000`, which means pointing the client at another API silently does nothing until the line is fixed.
- **The Express API must be running** for anything that calls `getJobsData()` (`/manage-jobs`, `/manage-jobs/[jobId]`, `/browser-jobs`, `/browser-jobs/[jobid]`); otherwise those pages throw "Could not reach the job API…". `GET /jobs` filters server-side via `search`, `type`, `remote`, and `category` query params (see `../hireloop-server/index.js`), which `/browser-jobs` drives from the URL. Sorting and pagination stay client-side.
- `README.md` is untouched create-next-app boilerplate and **wrong** (`app/page.tsx`, yarn/pnpm/bun). Trust this file over it.

## Structure

- Protected routes are thin `src/app/<path>/page.tsx` wrappers that gate with `requireUser()` / `requireRole(...)` from `src/lib/session.ts` (no `middleware.ts`), then render the real UI from `src/components/dashboard/`. Missing session → `/login`; wrong role → `/dashboard`. **`/browser-jobs` and `/browser-jobs/[jobid]` are public** and not gated.
- Role matrix: `/saved-jobs` + `/billing` seeker; `/add-new-job` + `/manage-jobs`(+`[jobId]`) recruiter; `/users` + `/companies` + `/payments` admin; `/applications` seeker+recruiter; `/settings` any; `/jobs` all three but redirects recruiters.
- `src/app/dashboard/page.tsx` skips `session.ts` and reads `auth.api.getSession` itself; role changes may need edits in both places.
- `src/components/dashboard/`: `shell.tsx` (chrome, `DashboardUser`), `layouts.tsx` (per-role nav + topbar), `ui.tsx` (style strings + `StatusBadge`, `PageHeader`, `Breadcrumb`, `StatCard`, `SelectBox`). Almost all are `"use client"`; pages pass a `DashboardUser` (`name`, optional `email`/`image`). `recruiter-manage-jobs.tsx` is the exception — an async **server** component.
- `src/components/landing/` holds server-rendered landing sections plus client bits (`navbar-client.tsx`, `search-form.tsx`, `browse-jobs-client.tsx`); auth UI is in `src/components/auth/`. Alias `@/*` → `./src/*`. `src/app/api/auth/[...all]/route.ts` is better-auth's handler — the only API route; add no app logic there.

### Job data pipeline

- `src/lib/actions/getjobs.ts` owns `JobDocument`, `getJobsData()` (`cache: "no-store"`, so those routes are dynamic) and `getJobById()` — the latter hits `GET /jobs/:id` and maps 400/404 to `null`, so callers only need a `notFound()` check.
- `src/components/dashboard/recruiter-jobs-data.ts` holds `JobType` / `RecruiterJob` plus the shared `JOB_TYPES` / `JOB_CATEGORIES` option lists (used by both the job form and browse filters) and `toRecruiterJob(job, index)`, which fills every missing field and normalises API quirks (`full-time` → `Full-time` through `jobTypeAliases`; add new spellings there or filters/badges misreport). It imports `JobDocument` with `import type`, so nothing server-side leaks into client bundles.
- `/manage-jobs` renders `(await getJobsData()).map(toRecruiterJob)`; row actions are the update link, `DeleteJob`, and `ViewDropdown`. `/manage-jobs/[jobId]` branches on `?mode=view` → `RecruiterViewJob` (read-only), otherwise `RecruiterUpdateJob`; unknown ids `notFound()`.
- `JobForm` (client) creates/updates through `src/lib/actions/jobs.ts` (`createJob`/`updateJob`/`deleteJob`, which throw `ApiError` with `.status`), then `router.push("/manage-jobs")` + `refresh()`. The Express PUT strips `_id` before `$set`.
- `src/lib/actions/*` are plain async helpers (no `"use server"`, no auth header) that throw readable errors instead of returning status objects.
- `/browser-jobs` is URL-driven: the page turns `searchParams` into `/jobs?search=&type=&remote=&category=` (backend filtering), and `src/components/landing/browse-jobs-client.tsx` reads the same params with `useSearchParams()` and pushes changes with `router.push`. Only sort and pagination (5/page) are computed in memory from the returned list. The Express server is plain `node index.js` (no watch), so restart it after route changes.
- `/browser-jobs/[jobid]` is a server page that resolves the id through `getJobById()` (`GET /jobs/:id`; `null` → `notFound()`) and renders `src/components/landing/browse-job-detail.tsx` (client, for bookmark/apply toasts). The DB has no description/benefits/experience/company size, so the detail component derives them from `responsibilities`, `qualifications`, and `category` — don't "fix" them by expecting new API fields.

## Toasts

- `@/components/ui/toast`: `notify.success/error/warning/info/loading(title, description?)`; `notify.loading` returns an id, which `toast.update(id, { ... })` morphs into success/error (success 4 s, error 6 s, warning 5 s, loading never auto-closes). Tones live in `toastTones` and are applied by `ToastList`, since Base UI's toast root exposes no `data-type`. `<Toaster />` is mounted once in `src/app/layout.tsx` — never add a second one.
- `recruiter-delete-job.tsx` is the reference call site: it closes its dialog *before* awaiting (Base UI's `AlertDialogAction` is just a `Button`, it does not auto-close), then reports through one loading→success/error toast.

## Auth & roles

- better-auth + MongoDB: `src/lib/auth.ts` (`MongoClient(process.env.MONGODB_URL)`, db `hireloop`), client in `src/lib/auth-client.ts`. Email+password only — "Continue with Google" is a dead placeholder with an inline SVG icon.
- Roles (`seeker` | `recruiter` | `admin`, default `seeker`) are better-auth `user.additionalFields`. Declare new user fields once in `auth.ts`; the `inferAdditionalFields<typeof auth>()` plugin in `auth-client.ts` propagates them to sign-up/session types. The signup form lets anyone pick `admin` and nothing server-side restricts it.
- `.env` (gitignored) must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`. Lint/typecheck don't need Mongo or the API (the Mongo client connects lazily); auth and API-backed pages fail at runtime without them. `BETTER_AUTH_URL` lacks a `NEXT_PUBLIC_` prefix, so it is `undefined` in client components and `auth-client.ts` falls back to same-origin.

## UI conventions

- **shadcn/ui v4 on Base UI, not Radix** (`components.json` style `base-nova`, components in `src/components/ui/`). Don't re-run `shadcn init`. Radix's `asChild` is replaced by `render`: see `ViewDropdown.tsx` (`render={<Link …/>}` on menu items) and `alert-dialog.tsx`.
- Import `cn` from the `"cn"` package (`import { cn } from "cn"`); `src/lib/utils.ts` only re-exports it for shadcn aliases.
- `lucide-react@1` has **no brand icons** (Facebook/GitHub/Google were removed) — inline the SVG, as `auth-form.tsx` does.
- Tailwind **v4, CSS-first**: deliberately no `tailwind.config.*` or `postcss.config.*` — don't create them. `src/app/globals.css` imports `"tailwindcss"`, `"tw-animate-css"`, `"shadcn/tailwind.css"`, defines tokens in `@theme inline`, and the app is permanently dark (`dark` class on `<html>`, palette in `.dark`). CSS flows through the `@tailwindcss/turbopack` rule in `next.config.ts`.
- React Compiler is on (`reactCompiler: true` + `babel-plugin-react-compiler`) — components are auto-memoized, so don't add `memo`/`useMemo`.
- Anything stateful (forms with `onSubmit`, dropdowns, toggles) must be `"use client"`; handlers can't live in server components.

## Next.js docs

Version-matched docs live at `node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`, ...). Prefer them over training-data knowledge — this Next version has breaking changes.
