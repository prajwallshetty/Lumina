# Implementation status & roadmap

This repository is the **full architecture skeleton** for Lumina. The structure,
data model, design system, auth/RBAC, routing, and every page/module route are in
place and coherent. Below is what is fully wired versus scaffolded for the next
depth pass.

## ✅ Fully wired

- **Foundation** — Next.js 15 App Router, TS (strict), Tailwind v4 design system
  (tokens, motion, dark mode), shadcn UI primitives, providers.
- **Database** — complete normalized Prisma schema (auth/RBAC, media, CMS,
  portfolio, blog, testimonials, FAQs, careers, inquiries, bookings, SEO, audit,
  settings, pages) + seed (permissions matrix, singletons, super admin).
- **Auth & RBAC** — Better Auth (email+password), session helpers, role gating
  (`requireUser`/`requireRole`), editable permission matrix, edge middleware.
- **Isolation** — `(website)` and `(admin)` route groups with separate layouts,
  providers, and navigation. Admin split into `(protected)` and `(auth)`.
- **Website** — all pages render live CMS data through the `services/*` layer:
  home, about, services (+`[slug]`), portfolio (+filter, +`[slug]`),
  before/after (interactive slider), gallery, testimonials, blog (+`[slug]`),
  faqs, careers (+`[slug]`), contact, privacy, terms, 404.
- **Media** — every image/video is a `MediaContainer` empty slot; no stock assets.
- **Public write path** — contact + booking Server Actions with Zod validation,
  honeypot, rate limiting, and audit logging.
- **Admin** — dashboard (stats, trend chart, recent activity) + every CMS/system
  module route reading live data. **Settings** (company details + maintenance
  mode) is a fully functional read/write exemplar.
- **SEO/perf** — metadata builder, per-path override support, dynamic `sitemap`,
  `robots`, security headers, image optimization config.

## 🚧 Next depth pass (scaffolded routes ready to fill)

Each admin content module currently lists live records and has a "New/Edit"
affordance. The remaining depth work is the create/edit forms + their Server
Actions, following the `SettingsForm` + `settings.actions.ts` pattern:

1. **CRUD forms & actions** per module (portfolio, blog, services, testimonials,
   gallery, before/after, faqs, careers, homepage, about) — mirror
   `actions/settings.actions.ts` (`defineAction` + Zod + RBAC + audit + revalidate).
2. **Cloudinary uploader** — signed-upload widget wired to `lib/cloudinary.ts`
   `createUploadSignature`, persisting `Media` rows; drag-drop in Media Library.
3. **Inquiry/booking management** — status changes, assignment, notes (services
   already expose `listAssignableStaff`).
4. **Rich-text editor** for blog content + HTML sanitization on write.
5. **User management** — invite/role forms (Better Auth admin API), permission
   matrix editor UI on top of `RolePermission`.
6. **Email** — SMTP transactional notifications on new inquiry/booking.

## Conventions

- **Reads** → `services/*.service.ts` (cached, `server-only`).
- **Writes** → `actions/*.actions.ts` via `defineAction` (auth + RBAC + rate
  limit + validation + audit).
- **New admin module** → add a route under `(protected)`, a nav entry in
  `config/admin-nav.ts`, and permission keys in `prisma/seed.ts`.
