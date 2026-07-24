# IVP Africa — Talent Placement Platform (Frontend)

Next.js 15 (App Router) + TypeScript + Tailwind CSS.

## Status (Week 3 — Design Finalization & Backend Setup)

- Dev environment scaffolded (Next.js, TS, Tailwind, ESLint, Prettier)
- Route structure mirrors the approved sitemap (public / candidate / employer / admin)
- Mock API layer in place so UI work isn't blocked on real endpoints
- CI pipeline (lint + typecheck + build) wired via GitHub Actions
- Waiting on: finalized high-fidelity mockups, locked API docs from backend

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in once real values exist
npm run dev
```

## Folder structure

```
src/
  app/
    (public)/       # Home, About, Jobs, Employers, Contact, FAQs, Login, Register
    (candidate)/    # Candidate dashboard, profile, applications, saved jobs
    (employer)/     # Employer dashboard, company profile, billing, job mgmt
    (admin)/        # Admin dashboard, user mgmt, verification, reports
  components/
    layout/         # NavBar, footer, shells
    ui/              # Buttons, inputs, cards - design-system primitives
    candidate/, employer/, admin/   # Portal-specific components
  lib/
    api/            # api/client.ts - swap mock -> real fetch here later
    api/mock/       # Fixture data used until backend endpoints exist
    types/          # Shared domain types (Candidate, Employer, Job, ...)
```

## Swapping mock data for real APIs

All data access goes through `src/lib/api/client.ts`. Each function
currently returns fixture data from `src/lib/api/mock/fixtures.ts`. Once
the backend publishes its API docs, replace each function body with a
`fetch()` call to the real endpoint - keep the same function name and
return type so components don't need to change.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Conventions

- Route groups `(public)`, `(candidate)`, `(employer)`, `(admin)` keep the
  sitemap organized without affecting URLs.
- Styling: Tailwind utility classes only for now - promote repeated
  patterns into `components/ui` rather than duplicating class strings.
- Formatting: Prettier (`prettier-plugin-tailwindcss` auto-sorts classes).
