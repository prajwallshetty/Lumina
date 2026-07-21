# Lumina — Enterprise Interior Design Platform

A production-grade marketing website **and** headless Admin CMS for an interior
design company. Built server-first with Next.js 15 (App Router), React 19,
TypeScript, Prisma/PostgreSQL, Better Auth, TailwindCSS v4, and shadcn UI.

> **Media by design is empty.** Every image/video field is a responsive empty
> container to be populated later through the CMS + Cloudinary. There are no
> stock photos, placeholder images, or dummy assets anywhere in this codebase.

---

## Architecture

```
prisma/                     Prisma schema, migrations, seed
src/
├─ app/
│  ├─ (website)/            Public marketing site (isolated route group)
│  ├─ (admin)/              Admin CMS (isolated route group)
│  └─ api/                  Route handlers (auth, webhooks, uploads)
├─ components/
│  ├─ ui/                   shadcn primitives (design-system layer)
│  ├─ website/              Public site feature components
│  ├─ admin/                Admin feature components
│  └─ shared/               Cross-surface components (media containers, etc.)
├─ actions/                 Server Actions (mutations), feature-grouped
├─ services/                Data-access layer (Prisma queries), feature-grouped
├─ lib/                     Auth, db client, cloudinary, rate-limit, seo, utils
├─ hooks/                   Reusable client hooks
├─ providers/              App-wide client providers (theme, query, toast)
├─ config/                  Static config: nav, site, roles, service catalog
├─ types/                   Shared TypeScript types
└─ utils/                   Pure helpers (format, slug, cn)
```

**Isolation:** `(website)` and `(admin)` are separate route groups with their
own root layout, providers, and navigation. They share only the design system
and data layer.

**Data flow:** Server Components → `services/*` (read) and Client forms →
`actions/*` (write) → Prisma → PostgreSQL. Nothing is hardcoded; all content is
CMS-driven.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    → set DATABASE_URL, BETTER_AUTH_SECRET, Cloudinary keys

# 3. Create the database schema
npm run db:migrate       # or: npm run db:push for a quick prototype
npm run db:seed          # seeds roles, super admin, default settings

# 4. Run
npm run dev              # http://localhost:3000  (site)
                         # http://localhost:3000/admin (CMS)
```

## Scripts

| Script                | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Start dev server (Turbopack)              |
| `npm run build`       | `prisma generate` + production build      |
| `npm run typecheck`   | Strict TypeScript check, no emit          |
| `npm run lint`        | ESLint (next/core-web-vitals)             |
| `npm run db:migrate`  | Create & apply a dev migration            |
| `npm run db:studio`   | Open Prisma Studio                        |
| `npm run db:seed`     | Seed roles / admin / settings             |

---

## Tech stack

Next.js 15 · React 19 · TypeScript · TailwindCSS v4 · shadcn UI ·
Framer Motion · GSAP · React Hook Form · Zod · Prisma · PostgreSQL ·
Cloudinary · Better Auth · TanStack Query · Vercel.

## Status

This repository currently contains the **full architecture skeleton**: complete
folder structure, database schema, design system, route groups, auth/RBAC
scaffolding, and stubbed pages/modules ready to be filled in feature-by-feature.
See `IMPLEMENTATION.md` for the build roadmap and what is wired vs. stubbed.
