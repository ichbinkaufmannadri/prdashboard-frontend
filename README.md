# PR Dashboard — Frontend

Vite + React + TypeScript frontend for the unified PR/MR dashboard.
Talks to the Spring Boot backend in `../prdashboard`.

## Stack

- Vite 5, React 18, TypeScript 5
- React Router 6
- TanStack Query 5 (server state)
- Zustand (auth store, persisted)
- Tailwind CSS 3 (custom theme)
- react-diff-view (split + unified diff)
- Axios (with JWT refresh interceptor)
- Zod, React Hook Form (available for forms)
- lucide-react (icons), date-fns (relative time)

## Design system

Dark, warm-tinted. Amber accent, not the standard cool-blue tech palette.

- **Fonts** — Space Grotesk (UI), JetBrains Mono (code, IDs, branch names, terminal-style copy)
- **Signature** — `[github]` / `[gitlab]` section labels in mono brackets, repo/PR identity shown as `owner/repo#42` in mono throughout, empty states rendered as `$ waiting for pull requests...` with a blinking cursor.

Tokens live in `tailwind.config.ts` (colors) and `src/index.css` (base + diff view theme).

## Quick start

```bash
npm install
npm run dev
```

Runs at http://localhost:5173. The dev server proxies `/api` → `http://localhost:8080`
(the backend), so no CORS setup needed for local dev.

Start the backend first (see the backend README), then this.

## Structure

```
src/
├── api/            axios client + per-domain API modules
├── components/
│   ├── ui/         primitives (Button, Input, Card, Modal, Badge, Toast, ...)
│   ├── layout/     AppLayout (sidebar), AuthLayout (centered)
│   └── ...         shared bits (ProviderIcon, StatusBadge, RelativeTime)
├── features/
│   ├── dashboard/  PRCard, RepoGroup, ProviderSection, ConnectProviderModal
│   └── pullRequest/PRHeader, PRConversation, PRDiffView, PRActionBar
├── pages/          route-level pages
├── stores/         zustand stores (auth)
├── types/          shared TS types (matches backend DTOs)
├── lib/            tiny utilities (cn)
├── App.tsx
├── main.tsx
├── router.tsx
└── index.css       Tailwind + diff view theming
```

## Routes

| Path | Component | Access |
|---|---|---|
| `/login` | LoginPage | public only |
| `/register` | RegisterPage | public only |
| `/dashboard` | DashboardPage | protected |
| `/providers` | ProvidersPage | protected |
| `/pr/:id` | PullRequestDetailPage | protected |

`:id` is the composite id `{providerAccountId}:{repoFullName}:{prNumber}` produced
by the backend.

## Auth flow

- Login/register call `authApi` → get access + refresh tokens → store in Zustand (localStorage-persisted).
- Every request attaches the access token via an axios interceptor.
- On 401, a single-flight refresh call is issued; on success, the original request retries.
- On refresh failure, the store clears and the user is redirected to `/login`.

## Provider connection

Modal-based flow at `/providers`. Fields:

- Provider (GitHub / GitLab)
- Host (Cloud / Self-hosted) — self-hosted reveals an instance URL field
- Access token (PAT)

Tokens are verified against the provider on submit (backend hits `/user`), then
encrypted at rest server-side.

## PR detail page

Two-column layout above `lg`, stacked below.

- **Left:** tabs for Conversation (comments + reviews timeline) and Diff (per-file blocks with unified/split toggle powered by react-diff-view, themed to match the palette in `index.css`).
- **Right:** sticky action bar — approve, request changes (hidden on GitLab, which has no native state for it), comment-only, and a merge dropdown that only shows strategies the provider supports (`MERGE` / `SQUASH` / `REBASE` for GitHub; `MERGE` / `SQUASH` for GitLab).

## Build

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve the built dist/
```

## What's not (yet) built

Deliberate omissions to keep the portfolio scope tight:

- Inline (diff-anchored) comment UI — backend supports it (`POST /pull-requests/{id}/diff-comments`), but the frontend currently only lists them. Adding a click-to-comment gutter is the next natural step; react-diff-view exposes `widgets` and `renderGutter` hooks for exactly this.
- OAuth device / redirect flow for provider connection (currently PAT-only).
- Audit log page (backend has the endpoint at `/api/audit-logs/list`).
- Threading in the conversation view (currently flat chronological).
